"""
Achievement Service
===================

Tracks and calculates user achievements based on their activity.
"""

from datetime import date, timedelta
from typing import Dict
from database import tasks_collection, streaks_collection

def get_user_achievements(user_id: str) -> Dict:
    """
    Calculate user achievements based on their activity.
    
    Returns:
        Dict with achievement statuses
    """
    today = date.today()
    
    # Get today's tasks
    today_tasks = list(tasks_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": today.isoformat()}
    }))
    
    completed_today = len([t for t in today_tasks if t.get("status") == "completed"])
    total_today = len(today_tasks)
    
    # Get streak data
    streak_doc = streaks_collection.find_one({"user_id": user_id})
    streak = streak_doc.get("overall_streak", 0) if streak_doc else 0
    
    return {
        "perfect_day": total_today > 0 and completed_today == total_today,
        "week_streak": streak >= 7,
        "productivity_master": completed_today >= 5,
        "task_warrior": total_today >= 5,
    }

