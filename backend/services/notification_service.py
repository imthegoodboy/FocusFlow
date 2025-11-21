from datetime import datetime, timedelta
from typing import List, Dict
from database import notifications_collection, tasks_collection, routine_logs_collection
from services.ai_recommendation import get_productive_hours

def create_notification(user_id: str, title: str, message: str, type: str = "info") -> dict:
    """Create a new notification"""
    notification = {
        "user_id": user_id,
        "title": title,
        "message": message,
        "type": type,  # info, warning, success, alert
        "read": False,
        "created_at": datetime.now()
    }
    
    result = notifications_collection.insert_one(notification)
    notification["_id"] = result.inserted_id
    notification["id"] = str(result.inserted_id)
    return notification

def check_and_create_notifications(user_id: str):
    """Check conditions and create notifications"""
    notifications = []
    
    # Check for high-priority task deadlines
    now = datetime.now()
    four_hours_later = now + timedelta(hours=4)
    
    urgent_tasks = list(tasks_collection.find({
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "priority": "high",
        "deadline": {
            "$gte": now,
            "$lte": four_hours_later
        }
    }))
    
    for task in urgent_tasks:
        deadline = task.get("deadline")
        if isinstance(deadline, str):
            deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
        
        hours_left = (deadline - now).total_seconds() / 3600
        if hours_left <= 4:
            notif = create_notification(
                user_id,
                "High-Priority Task Deadline",
                f"'{task.get('name')}' deadline in {int(hours_left)} hours.",
                "alert"
            )
            notifications.append(notif)
    
    # Check for free time slots
    free_slot_notif = check_free_time_slots(user_id)
    if free_slot_notif:
        notifications.append(free_slot_notif)
    
    # Check sleep patterns
    sleep_notif = check_sleep_patterns(user_id)
    if sleep_notif:
        notifications.append(sleep_notif)
    
    return notifications

def check_free_time_slots(user_id: str) -> Dict:
    """Check for free time slots and recommend study time"""
    now = datetime.now()
    today = now.date()
    
    # Get today's scheduled tasks
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())
    
    scheduled_tasks = list(tasks_collection.find({
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "scheduled_start": {
            "$gte": start_of_day,
            "$lte": end_of_day
        }
    }))
    
    # Find gaps
    productive_hours = get_productive_hours(user_id)
    if productive_hours:
        best_hour = productive_hours[0]["start_hour"]
        current_hour = now.hour
        
        # Check if current hour is in productive range and no task scheduled
        if best_hour <= current_hour < best_hour + 2:
            # Check if there's a free slot
            has_conflict = False
            for task in scheduled_tasks:
                task_start = task.get("scheduled_start")
                if isinstance(task_start, str):
                    task_start = datetime.fromisoformat(task_start)
                
                if task_start.hour == current_hour:
                    has_conflict = True
                    break
            
            if not has_conflict:
                return create_notification(
                    user_id,
                    "Free Study Time Available",
                    f"A free 1-hour slot available now — recommended study time.",
                    "info"
                )
    
    return None

def check_sleep_patterns(user_id: str) -> Dict:
    """Check sleep patterns and create notification if needed"""
    seven_days_ago = datetime.now() - timedelta(days=7)
    
    logs = list(routine_logs_collection.find({
        "user_id": user_id,
        "created_at": {"$gte": seven_days_ago},
        "wakeup_time": {"$exists": True},
        "sleep_time": {"$exists": True}
    }))
    
    if len(logs) < 3:
        return None
    
    low_sleep_count = 0
    for log in logs:
        wakeup = log.get("wakeup_time", "07:00")
        sleep = log.get("sleep_time", "23:00")
        
        wakeup_hour = int(wakeup.split(":")[0])
        sleep_hour = int(sleep.split(":")[0])
        
        if sleep_hour < wakeup_hour:
            sleep_hours = (24 - sleep_hour) + wakeup_hour
        else:
            sleep_hours = wakeup_hour - sleep_hour
        
        if sleep_hours < 6:
            low_sleep_count += 1
    
    if low_sleep_count >= len(logs) * 0.5:  # 50% of days
        return create_notification(
            user_id,
            "Low Sleep Detected",
            "Low sleep detected — avoid heavy tasks today.",
            "warning"
        )
    
    return None

def get_notifications(user_id: str, unread_only: bool = False) -> List[Dict]:
    """Get notifications for a user"""
    query = {"user_id": user_id}
    if unread_only:
        query["read"] = False
    
    notifications = list(notifications_collection.find(query).sort("created_at", -1).limit(50))
    
    for notif in notifications:
        notif["id"] = str(notif["_id"])
        notif["_id"] = str(notif["_id"])
    
    return notifications

def mark_notification_read(notification_id: str, user_id: str) -> bool:
    """Mark a notification as read"""
    from bson import ObjectId
    
    result = notifications_collection.update_one(
        {"_id": ObjectId(notification_id), "user_id": user_id},
        {"$set": {"read": True}}
    )
    
    return result.modified_count > 0

def mark_all_read(user_id: str) -> bool:
    """Mark all notifications as read for a user"""
    result = notifications_collection.update_many(
        {"user_id": user_id, "read": False},
        {"$set": {"read": True}}
    )
    
    return result.modified_count > 0

