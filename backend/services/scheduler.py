from datetime import datetime, timedelta
from typing import Dict, List, Optional

from database import tasks_collection, students_collection

def check_conflicts(start: datetime, end: datetime, existing_tasks: List[dict]) -> bool:
    """Check if a time slot conflicts with existing tasks"""
    for task in existing_tasks:
        task_start = task.get("scheduled_start")
        task_end = task.get("scheduled_end")
        
        if not task_start or not task_end:
            continue
        
        if isinstance(task_start, str):
            task_start = datetime.fromisoformat(task_start)
        if isinstance(task_end, str):
            task_end = datetime.fromisoformat(task_end)
        
        # Check for overlap
        if not (end <= task_start or start >= task_end):
            return True
    
    return False

def _derive_focus_windows(user_id: str) -> List[Dict[str, int]]:
    student = students_collection.find_one({"user_id": user_id})
    survey = student.get("survey") if student else None
    windows = []
    if survey:
        wake = survey.get("wakeup_time")
        sleep = survey.get("sleep_time")
        if wake and sleep:
            try:
                wake_hour = int(wake.split(":")[0])
                sleep_hour = int(sleep.split(":")[0])
                windows.append({"start_hour": wake_hour + 1, "end_hour": min(wake_hour + 4, 23)})
                windows.append({"start_hour": max(sleep_hour - 4, 0), "end_hour": sleep_hour - 1})
            except ValueError:
                pass
    if not windows:
        windows = [
            {"start_hour": 9, "end_hour": 12},
            {"start_hour": 18, "end_hour": 21},
        ]
    return windows


def schedule_task(user_id: str, task_dict: dict) -> Optional[Dict[str, datetime]]:
    """Auto-schedule a task in the best available slot"""
    duration = task_dict.get("duration", 60)  # minutes
    deadline = task_dict.get("deadline")
    priority = task_dict.get("priority", "medium")
    
    if not deadline:
        return None
    
    if isinstance(deadline, str):
        deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
    
    focus_windows = _derive_focus_windows(user_id)
    
    # Get existing scheduled tasks
    existing_tasks = list(tasks_collection.find({
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "scheduled_start": {"$exists": True}
    }))
    
    # Try to schedule before deadline
    now = datetime.now()
    if deadline < now:
        return None
    
    # Try focus windows first
    for hour_range in focus_windows:
        start_hour = hour_range.get("start_hour", 9)
        end_hour = hour_range.get("end_hour", 17)
        
        # Try scheduling today or tomorrow in productive hours
        for day_offset in range(7):  # Try next 7 days
            candidate_date = (now + timedelta(days=day_offset)).replace(
                hour=start_hour, minute=0, second=0, microsecond=0
            )
            
            if candidate_date < now:
                continue
            
            candidate_end = candidate_date + timedelta(minutes=duration)
            
            if candidate_end > deadline:
                break
            
            if candidate_end.hour > end_hour:
                continue
            
            # Check conflicts
            if not check_conflicts(candidate_date, candidate_end, existing_tasks):
                return {
                    "start": candidate_date,
                    "end": candidate_end
                }
    
    # Fallback: find any available slot before deadline
    current = now.replace(minute=0, second=0, microsecond=0)
    while current + timedelta(minutes=duration) <= deadline:
        candidate_end = current + timedelta(minutes=duration)
        
        if not check_conflicts(current, candidate_end, existing_tasks):
            return {
                "start": current,
                "end": candidate_end
            }
        
        current += timedelta(hours=1)
    
    return None

def enforce_rest_periods(user_id: str, task_duration: int) -> int:
    """Enforce minimum rest periods between long tasks"""
    if task_duration > 120:  # 2 hours
        return 15  # 15 minute break
    elif task_duration > 60:  # 1 hour
        return 10  # 10 minute break
    return 5  # 5 minute break

def auto_reschedule_delayed_tasks(user_id: str):
    """Auto-reschedule tasks that are past their scheduled time"""
    now = datetime.now()
    
    delayed_tasks = list(tasks_collection.find({
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "scheduled_start": {"$lt": now}
    }))
    
    for task in delayed_tasks:
        # Try to reschedule
        scheduled = schedule_task(user_id, task)
        if scheduled:
            tasks_collection.update_one(
                {"_id": task["_id"]},
                {"$set": {
                    "scheduled_start": scheduled["start"],
                    "scheduled_end": scheduled["end"],
                    "updated_at": now
                }}
            )

