from datetime import datetime
from typing import List, Optional
try:
    from bson import ObjectId
except ImportError:
    from pymongo import ObjectId
from database import tasks_collection
from models.task import Task, TaskCreate, TaskUpdate
from services.scheduler import check_conflicts, schedule_task

def create_task(user_id: str, task_data: TaskCreate) -> dict:
    """Create a new task with conflict detection and auto-scheduling"""
    task_dict = task_data.dict()
    task_dict["user_id"] = user_id
    task_dict["status"] = "pending"
    task_dict["created_at"] = datetime.now()
    task_dict["updated_at"] = datetime.now()
    
    # Auto-schedule task if possible
    scheduled = schedule_task(user_id, task_dict)
    if scheduled:
        task_dict["scheduled_start"] = scheduled["start"]
        task_dict["scheduled_end"] = scheduled["end"]
    
    result = tasks_collection.insert_one(task_dict)
    task_dict["_id"] = result.inserted_id
    task_dict["id"] = str(result.inserted_id)
    return task_dict

def get_tasks(user_id: str, status: Optional[str] = None) -> List[dict]:
    """Get all tasks for a user, sorted by priority"""
    query = {"user_id": user_id}
    if status:
        query["status"] = status
    
    tasks = list(tasks_collection.find(query))
    
    # Sort by priority: high > medium > low, then by deadline
    priority_order = {"high": 3, "medium": 2, "low": 1}
    tasks.sort(key=lambda x: (
        -priority_order.get(x.get("priority", "low"), 1),
        x.get("deadline", datetime.max)
    ))
    
    for task in tasks:
        task["id"] = str(task["_id"])
        task["_id"] = str(task["_id"])
    
    return tasks

def get_task(task_id: str, user_id: str) -> Optional[dict]:
    """Get a specific task"""
    task = tasks_collection.find_one({"_id": ObjectId(task_id), "user_id": user_id})
    if task:
        task["id"] = str(task["_id"])
        task["_id"] = str(task["_id"])
    return task

def update_task(task_id: str, user_id: str, task_data: TaskUpdate) -> Optional[dict]:
    """Update a task"""
    update_data = {k: v for k, v in task_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.now()
    
    if task_data.status == "completed":
        update_data["completed_at"] = datetime.now()
    
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return get_task(task_id, user_id)
    return None

def delete_task(task_id: str, user_id: str) -> bool:
    """Delete a task"""
    result = tasks_collection.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    return result.deleted_count > 0

def check_task_conflicts(user_id: str, task_id: Optional[str], start: datetime, end: datetime) -> bool:
    """Check if a task conflicts with existing tasks"""
    query = {
        "user_id": user_id,
        "status": {"$in": ["pending", "in_progress"]},
        "scheduled_start": {"$exists": True},
        "scheduled_end": {"$exists": True}
    }
    
    if task_id:
        query["_id"] = {"$ne": ObjectId(task_id)}
    
    existing_tasks = list(tasks_collection.find(query))
    return check_conflicts(start, end, existing_tasks)

