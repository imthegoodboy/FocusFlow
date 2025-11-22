from datetime import datetime, timedelta
from typing import List, Dict, Optional
from database import routine_logs_collection, tasks_collection
from collections import defaultdict
from models.ml_models import predict_best_study_hour

def get_productive_hours(user_id: str) -> List[Dict[str, int]]:
    """
    Analyze past routine data to determine most productive hours.
    Returns list of {start_hour, end_hour, score} dicts.
    """
    # Get last 30 days of routine logs
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago}
    }))
    
    if not logs:
        # Default productive hours if no data
        return [
            {"start_hour": 9, "end_hour": 11, "score": 8},
            {"start_hour": 19, "end_hour": 21, "score": 7}
        ]
    
    # Analyze productivity by hour
    hour_productivity = defaultdict(list)
    
    for log in logs:
        score = log.get("productivity_score", 5.0)
        study_hours = log.get("study_hours", 0)
        
        # Estimate productive hours based on study patterns
        if study_hours > 0:
            # Assume study happened in morning (9-12) or evening (18-22)
            if score >= 7:
                hour_productivity[9].append(score)
                hour_productivity[10].append(score)
                hour_productivity[19].append(score)
                hour_productivity[20].append(score)
    
    # Calculate average productivity per hour
    hour_scores = {}
    for hour, scores in hour_productivity.items():
        hour_scores[hour] = sum(scores) / len(scores) if scores else 0
    
    # Find best time ranges
    productive_ranges = []
    
    # Morning peak (9-11)
    morning_avg = sum(hour_scores.get(h, 0) for h in range(9, 12)) / 3
    if morning_avg >= 6:
        productive_ranges.append({"start_hour": 9, "end_hour": 11, "score": morning_avg})
    
    # Evening peak (19-21)
    evening_avg = sum(hour_scores.get(h, 0) for h in range(19, 22)) / 3
    if evening_avg >= 6:
        productive_ranges.append({"start_hour": 19, "end_hour": 21, "score": evening_avg})
    
    # Afternoon (14-16) if productive
    afternoon_avg = sum(hour_scores.get(h, 0) for h in range(14, 17)) / 3
    if afternoon_avg >= 6:
        productive_ranges.append({"start_hour": 14, "end_hour": 16, "score": afternoon_avg})
    
    if not productive_ranges:
        return [
            {"start_hour": 9, "end_hour": 11, "score": 7},
            {"start_hour": 19, "end_hour": 21, "score": 6}
        ]
    
    return sorted(productive_ranges, key=lambda x: x["score"], reverse=True)

def get_study_recommendations(user_id: str) -> List[str]:
    """Generate study time recommendations"""
    recommendations = []
    productive_hours = get_productive_hours(user_id)
    
    if productive_hours:
        best_range = productive_hours[0]
        start = best_range["start_hour"]
        end = best_range["end_hour"]
        recommendations.append(
            f"Your focus is highest between {start}:00–{end}:00. Schedule important study sessions here."
        )
    
    # Check for low productivity periods
    low_productivity = detect_low_productivity_periods(user_id)
    if low_productivity:
        for period in low_productivity:
            recommendations.append(
                f"Avoid study between {period['start']}:00–{period['end']}:00 due to low productivity."
            )
    
    # Check sleep patterns
    sleep_advice = get_sleep_advice(user_id)
    if sleep_advice:
        recommendations.append(sleep_advice)
    
    return recommendations

def detect_low_productivity_periods(user_id: str) -> List[Dict[str, int]]:
    """Detect hours when user is least productive"""
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago},
        "productivity_score": {"$exists": True}
    }))
    
    if len(logs) < 5:
        return [{"start": 14, "end": 16, "reason": "typical_afternoon_slump"}]
    
    # Analyze productivity by hour
    hour_scores = defaultdict(list)
    
    for log in logs:
        score = log.get("productivity_score", 5)
        # Assume afternoon (14-16) is typically low
        hour_scores[14].append(score)
        hour_scores[15].append(score)
    
    low_periods = []
    for hour in [14, 15, 16]:
        if hour in hour_scores:
            avg_score = sum(hour_scores[hour]) / len(hour_scores[hour])
            if avg_score < 5:
                low_periods.append({"start": hour, "end": hour + 1})
    
    return low_periods if low_periods else [{"start": 14, "end": 16}]

def get_sleep_advice(user_id: str) -> Optional[str]:
    """Analyze sleep patterns and provide advice"""
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": thirty_days_ago},
        "wakeup_time": {"$exists": True},
        "sleep_time": {"$exists": True}
    }))
    
    if len(logs) < 5:
        return None
    
    low_sleep_days = 0
    for log in logs:
        wakeup = log.get("wakeup_time", "07:00")
        sleep = log.get("sleep_time", "23:00")
        
        # Calculate sleep hours (simplified)
        wakeup_hour = int(wakeup.split(":")[0])
        sleep_hour = int(sleep.split(":")[0])
        
        if sleep_hour < wakeup_hour:
            sleep_hours = (24 - sleep_hour) + wakeup_hour
        else:
            sleep_hours = wakeup_hour - sleep_hour
        
        if sleep_hours < 6:
            low_sleep_days += 1
    
    if low_sleep_days > len(logs) * 0.3:  # More than 30% of days
        return "Sleep earlier, performance drops on 6-hr sleep days."
    
    return None

def get_break_recommendations(user_id: str) -> List[str]:
    """Recommend when to take breaks"""
    recommendations = []
    
    # Get today's tasks
    today = datetime.now().date()
    tasks = list(tasks_collection.find({
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "scheduled_start": {"$exists": True}
    }))
    
    if len(tasks) > 3:
        recommendations.append("You have multiple tasks today. Take a 15-minute break every 2 hours.")
    
    long_tasks = [t for t in tasks if t.get("duration", 0) > 90]
    if long_tasks:
        recommendations.append("Schedule breaks between long study sessions to maintain focus.")
    
    return recommendations

def get_task_suggestions(user_id: str) -> Dict:
    """Get AI-powered task suggestions"""
    productive_hours = get_productive_hours(user_id)
    study_recommendations = get_study_recommendations(user_id)
    break_recommendations = get_break_recommendations(user_id)
    
    return {
        "productive_hours": productive_hours,
        "study_recommendations": study_recommendations,
        "break_recommendations": break_recommendations,
        "low_productivity_periods": detect_low_productivity_periods(user_id)
    }

