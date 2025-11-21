from datetime import datetime, date, timedelta
from typing import Dict, Optional
from database import routine_logs_collection, streaks_collection, tasks_collection

def update_streaks(user_id: str):
    """Update all streak counters for a user"""
    today = date.today()
    
    # Study streak (consecutive days with study hours > 0)
    study_streak = calculate_study_streak(user_id, today)
    
    # Task completion streak (consecutive days with completed tasks)
    task_streak = calculate_task_streak(user_id, today)
    
    # Routine logging streak (consecutive days with routine log)
    logging_streak = calculate_logging_streak(user_id, today)
    
    # Overall streak (any activity)
    overall_streak = max(study_streak, task_streak, logging_streak)
    
    streak_data = {
        "user_id": user_id,
        "study_streak": study_streak,
        "task_streak": task_streak,
        "logging_streak": logging_streak,
        "overall_streak": overall_streak,
        "last_updated": today.isoformat(),
        "updated_at": datetime.utcnow(),
    }
    
    streaks_collection.update_one(
        {"user_id": user_id},
        {"$set": streak_data},
        upsert=True
    )
    
    return streak_data

def calculate_study_streak(user_id: str, today: date) -> int:
    """Calculate consecutive days with study hours"""
    streak = 0
    current_date = today
    
    while True:
        log = routine_logs_collection.find_one({
            "user_id": user_id,
            "date": current_date.isoformat()
        })
        
        if log and log.get("study_hours", 0) > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
        
        # Limit to prevent infinite loop
        if streak > 365:
            break
    
    return streak

def calculate_task_streak(user_id: str, today: date) -> int:
    """Calculate consecutive days with completed tasks"""
    streak = 0
    current_date = today
    
    while True:
        start_of_day = datetime.combine(current_date, datetime.min.time())
        end_of_day = datetime.combine(current_date, datetime.max.time())
        
        completed_tasks = tasks_collection.count_documents({
            "user_id": user_id,
            "status": "completed",
            "completed_at": {
                "$gte": start_of_day,
                "$lte": end_of_day
            }
        })
        
        if completed_tasks > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
        
        if streak > 365:
            break
    
    return streak

def calculate_logging_streak(user_id: str, today: date) -> int:
    """Calculate consecutive days with routine logs"""
    streak = 0
    current_date = today
    
    while True:
        log = routine_logs_collection.find_one({
            "user_id": user_id,
            "date": current_date.isoformat()
        })
        
        if log:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
        
        if streak > 365:
            break
    
    return streak

def get_streaks(user_id: str) -> Dict:
    """Get current streak data for a user"""
    streak_data = streaks_collection.find_one({"user_id": user_id})
    
    if not streak_data:
        # Initialize streaks
        update_streaks(user_id)
        streak_data = streaks_collection.find_one({"user_id": user_id})
    
    return {
        "study_streak": streak_data.get("study_streak", 0),
        "task_streak": streak_data.get("task_streak", 0),
        "logging_streak": streak_data.get("logging_streak", 0),
        "overall_streak": streak_data.get("overall_streak", 0),
        "last_updated": streak_data.get("last_updated") or date.today().isoformat()
    }

