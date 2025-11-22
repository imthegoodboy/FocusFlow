from datetime import datetime, timedelta, date
from typing import Dict, List, Optional
from database import routine_logs_collection, tasks_collection, streaks_collection

def get_daily_productivity(user_id: str, days: int = 7) -> List[Dict]:
    """Get daily productivity scores for the last N days"""
    start_date = date.today() - timedelta(days=days)
    logs = list(
        routine_logs_collection.find(
            {
                "user_id": user_id,
                "date": {"$gte": start_date.isoformat()},
            }
        ).sort("date", 1)
    )
    
    productivity_data = []
    for log in logs:
        productivity_data.append({
            "date": log["date"].isoformat() if isinstance(log["date"], date) else str(log["date"]),
            "productivity_score": log.get("productivity_score", 0),
            "study_hours": log.get("study_hours", 0),
            "sleep_hours": calculate_sleep_hours(log.get("wakeup_time"), log.get("sleep_time"))
        })
    
    return productivity_data

def get_weekly_productivity(user_id: str, weeks: int = 4) -> List[Dict]:
    """Get weekly productivity averages"""
    start_date = date.today() - timedelta(weeks=weeks)
    logs = list(
        routine_logs_collection.find(
            {
                "user_id": user_id,
                "date": {"$gte": start_date.isoformat()},
            }
        )
    )
    
    # Group by week
    weekly_data = {}
    for log in logs:
        log_date = log["date"]
        if isinstance(log_date, str):
            log_date = datetime.fromisoformat(log_date).date()
        
        week_start = log_date - timedelta(days=log_date.weekday())
        week_key = week_start.isoformat()
        
        if week_key not in weekly_data:
            weekly_data[week_key] = {
                "week_start": week_key,
                "scores": [],
                "study_hours": [],
                "sleep_hours": []
            }
        
        weekly_data[week_key]["scores"].append(log.get("productivity_score", 0))
        weekly_data[week_key]["study_hours"].append(log.get("study_hours", 0))
        weekly_data[week_key]["sleep_hours"].append(
            calculate_sleep_hours(log.get("wakeup_time"), log.get("sleep_time"))
        )
    
    result = []
    for week_key, data in weekly_data.items():
        result.append({
            "week_start": week_key,
            "avg_productivity": sum(data["scores"]) / len(data["scores"]) if data["scores"] else 0,
            "avg_study_hours": sum(data["study_hours"]) / len(data["study_hours"]) if data["study_hours"] else 0,
            "avg_sleep_hours": sum(data["sleep_hours"]) / len(data["sleep_hours"]) if data["sleep_hours"] else 0
        })
    
    return sorted(result, key=lambda x: x["week_start"])

def get_focus_hours(user_id: str) -> Dict:
    """Get high and low focus hours analysis"""
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago},
        "productivity_score": {"$exists": True}
    }))
    
    hour_scores = {}
    for hour in range(24):
        hour_scores[hour] = []
    
    for log in logs:
        score = log.get("productivity_score", 5)
        study_hours = log.get("study_hours", 0)
        
        # Distribute score across likely study hours
        if study_hours > 0:
            for hour in [9, 10, 11, 14, 15, 19, 20, 21]:
                hour_scores[hour].append(score)
    
    avg_scores = {}
    for hour, scores in hour_scores.items():
        avg_scores[hour] = sum(scores) / len(scores) if scores else 0
    
    high_focus = [h for h, s in avg_scores.items() if s >= 7]
    low_focus = [h for h, s in avg_scores.items() if 0 < s < 5]
    
    return {
        "high_focus_hours": high_focus if high_focus else [9, 10, 19, 20],
        "low_focus_hours": low_focus if low_focus else [14, 15],
        "hourly_scores": avg_scores
    }

def get_task_statistics(user_id: str) -> Dict:
    """Get task completion statistics"""
    tasks = list(tasks_collection.find({"user_id": user_id}))
    
    total = len(tasks)
    completed = len([t for t in tasks if t.get("status") == "completed"])
    pending = len([t for t in tasks if t.get("status") == "pending"])
    in_progress = len([t for t in tasks if t.get("status") == "in_progress"])
    cancelled = len([t for t in tasks if t.get("status") == "cancelled"])
    
    # By priority
    high_priority = len([t for t in tasks if t.get("priority") == "high"])
    medium_priority = len([t for t in tasks if t.get("priority") == "medium"])
    low_priority = len([t for t in tasks if t.get("priority") == "low"])
    
    # By category
    category_count = {}
    for task in tasks:
        cat = task.get("category", "Other")
        category_count[cat] = category_count.get(cat, 0) + 1
    
    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "in_progress": in_progress,
        "cancelled": cancelled,
        "completion_rate": (completed / total * 100) if total > 0 else 0,
        "by_priority": {
            "high": high_priority,
            "medium": medium_priority,
            "low": low_priority
        },
        "by_category": category_count
    }

def get_sleep_performance_correlation(user_id: str) -> List[Dict]:
    """Get sleep vs performance correlation data"""
    thirty_days_ago = date.today() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "date": {"$gte": thirty_days_ago.isoformat()},
        "wakeup_time": {"$exists": True},
        "sleep_time": {"$exists": True},
        "productivity_score": {"$exists": True}
    }))
    
    correlation_data = []
    for log in logs:
        sleep_hours = calculate_sleep_hours(log.get("wakeup_time"), log.get("sleep_time"))
        productivity = log.get("productivity_score", 0)
        
        correlation_data.append({
            "date": log["date"].isoformat() if isinstance(log["date"], date) else str(log["date"]),
            "sleep_hours": sleep_hours,
            "productivity_score": productivity
        })
    
    return correlation_data

def calculate_sleep_hours(wakeup_time: Optional[str], sleep_time: Optional[str]) -> float:
    """Calculate sleep hours from wakeup and sleep times"""
    if not wakeup_time or not sleep_time:
        return 0.0
    
    try:
        wakeup_hour = int(wakeup_time.split(":")[0])
        wakeup_min = int(wakeup_time.split(":")[1])
        sleep_hour = int(sleep_time.split(":")[0])
        sleep_min = int(sleep_time.split(":")[1])
        
        wakeup_total = wakeup_hour * 60 + wakeup_min
        sleep_total = sleep_hour * 60 + sleep_min
        
        if sleep_total < wakeup_total:
            # Sleep time is next day
            sleep_hours = (24 * 60 - sleep_total + wakeup_total) / 60
        else:
            sleep_hours = (wakeup_total - sleep_total) / 60
        
        return abs(sleep_hours)
    except:
        return 0.0

def get_monthly_progress(user_id: str) -> List[Dict]:
    """Get monthly progress data for the last 6 months"""
    today = date.today()
    result = []
    
    for i in range(6):
        month_date = date(today.year, today.month, 1) - timedelta(days=30 * i)
        month_start = date(month_date.year, month_date.month, 1)
        
        if month_date.month == 12:
            month_end = date(month_date.year + 1, 1, 1)
        else:
            month_end = date(month_date.year, month_date.month + 1, 1)
        
        logs = list(routine_logs_collection.find({
            "user_id": user_id,
            "date": {"$gte": month_start.isoformat(), "$lt": month_end.isoformat()}
        }))
        
        tasks = list(tasks_collection.find({
            "user_id": user_id,
            "created_at": {"$gte": datetime(month_start.year, month_start.month, 1), 
                          "$lt": datetime(month_end.year, month_end.month, 1)}
        }))
        
        total_study_hours = sum(log.get("study_hours", 0) for log in logs)
        avg_productivity = sum(log.get("productivity_score", 0) for log in logs) / len(logs) if logs else 0
        tasks_completed = len([t for t in tasks if t.get("status") == "completed"])
        total_tasks = len(tasks)
        
        result.append({
            "month": month_start.strftime("%b %Y"),
            "progress_score": round(avg_productivity, 1),
            "study_hours": round(total_study_hours, 1),
            "tasks_completed": tasks_completed,
            "total_tasks": total_tasks,
            "completion_rate": round((tasks_completed / total_tasks * 100) if total_tasks > 0 else 0, 1)
        })
    
    return list(reversed(result))

def get_task_comparison(user_id: str) -> Dict:
    """Get task comparison data (this week vs last week)"""
    today = date.today()
    this_week_start = today - timedelta(days=today.weekday())
    last_week_start = this_week_start - timedelta(days=7)
    last_week_end = this_week_start
    
    try:
        this_week_tasks = list(tasks_collection.find({
            "user_id": user_id,
            "created_at": {"$gte": datetime(this_week_start.year, this_week_start.month, this_week_start.day)}
        }))
        
        last_week_tasks = list(tasks_collection.find({
            "user_id": user_id,
            "created_at": {
                "$gte": datetime(last_week_start.year, last_week_start.month, last_week_start.day),
                "$lt": datetime(last_week_end.year, last_week_end.month, last_week_end.day)
            }
        }))
        
        this_week_completed = len([t for t in this_week_tasks if t.get("status") == "completed"])
        last_week_completed = len([t for t in last_week_tasks if t.get("status") == "completed"])
        
        return {
            "this_week": {
                "total": len(this_week_tasks),
                "completed": this_week_completed,
                "pending": len([t for t in this_week_tasks if t.get("status") == "pending"])
            },
            "last_week": {
                "total": len(last_week_tasks),
                "completed": last_week_completed,
                "pending": len([t for t in last_week_tasks if t.get("status") == "pending"])
            },
            "improvement": this_week_completed - last_week_completed
        }
    except Exception as e:
        # Return default values on error
        return {
            "this_week": {"total": 0, "completed": 0, "pending": 0},
            "last_week": {"total": 0, "completed": 0, "pending": 0},
            "improvement": 0
        }

def get_productivity_trends(user_id: str) -> List[Dict]:
    """Get productivity trends over time"""
    thirty_days_ago = date.today() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "date": {"$gte": thirty_days_ago.isoformat()}
    }).sort("date", 1))
    
    tasks = list(tasks_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": datetime(thirty_days_ago.year, thirty_days_ago.month, thirty_days_ago.day)}
    }))
    
    # Group by date
    daily_data = {}
    for log in logs:
        log_date = log.get("date")
        if isinstance(log_date, str):
            try:
                log_date = datetime.fromisoformat(log_date).date()
            except:
                continue
        elif not isinstance(log_date, date):
            continue
        date_key = log_date.isoformat()
        
        if date_key not in daily_data:
            daily_data[date_key] = {
                "date": date_key,
                "productivity": log.get("productivity_score", 0),
                "study_hours": log.get("study_hours", 0),
                "tasks_completed": 0
            }
    
    # Count tasks completed per day
    for task in tasks:
        if task.get("status") == "completed" and task.get("completed_at"):
            completed_at = task.get("completed_at")
            if isinstance(completed_at, str):
                try:
                    completed_at = datetime.fromisoformat(completed_at.replace("Z", "+00:00"))
                except:
                    continue
            elif not isinstance(completed_at, datetime):
                continue
            date_key = completed_at.date().isoformat()
            if date_key in daily_data:
                daily_data[date_key]["tasks_completed"] += 1
    
    return sorted([v for v in daily_data.values()], key=lambda x: x["date"])

