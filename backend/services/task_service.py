from datetime import date, datetime, time, timedelta, timezone
from typing import List, Optional

try:
    from bson import ObjectId
except ImportError:
    from pymongo import ObjectId

from fastapi import HTTPException

from database import students_collection, tasks_collection
from models.task import PlanDayRequest, PlanTaskItem, PlannedTaskInput, TaskCreate, TaskUpdate
from services.scheduler import check_conflicts, schedule_task
from services.streak_service import update_streaks

def _ensure_naive(dt: datetime) -> datetime:
    if dt.tzinfo:
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


def create_task(user_id: str, task_data: TaskCreate) -> dict:
    """Create a new task with conflict detection and auto-scheduling"""
    task_dict = task_data.dict()
    task_dict["user_id"] = user_id
    task_dict["status"] = "pending"
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()
    task_dict["deadline"] = _ensure_naive(task_dict["deadline"])

    scheduled = schedule_task(user_id, task_dict)
    if scheduled:
        task_dict["scheduled_start"] = scheduled["start"]
        task_dict["scheduled_end"] = scheduled["end"]

    result = tasks_collection.insert_one(task_dict)
    task_dict["_id"] = result.inserted_id
    task_dict["id"] = str(result.inserted_id)
    return task_dict

def get_tasks(user_id: str, status: Optional[str] = None, today: bool = False) -> List[dict]:
    """Get all tasks for a user, sorted by priority"""
    query = {"user_id": user_id}
    if status:
        query["status"] = status
    if today:
        start = datetime.combine(date.today(), time.min)
        end = start + timedelta(days=1)
        query["scheduled_start"] = {"$gte": start, "$lt": end}

    tasks = list(tasks_collection.find(query))

    priority_order = {"high": 3, "medium": 2, "low": 1}
    tasks.sort(
        key=lambda x: (
            -priority_order.get(x.get("priority", "low"), 1),
            x.get("scheduled_start") or x.get("deadline", datetime.max),
        )
    )

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
    if "deadline" in update_data and update_data["deadline"]:
        update_data["deadline"] = _ensure_naive(update_data["deadline"])
    if "scheduled_start" in update_data and update_data["scheduled_start"]:
        update_data["scheduled_start"] = _ensure_naive(update_data["scheduled_start"])
    if "scheduled_end" in update_data and update_data["scheduled_end"]:
        update_data["scheduled_end"] = _ensure_naive(update_data["scheduled_end"])

    update_data["updated_at"] = datetime.utcnow()

    if task_data.status == "completed":
        update_data["completed_at"] = datetime.utcnow()

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": update_data},
    )

    if result.modified_count:
        task = get_task(task_id, user_id)
        if task_data.status in {"completed", "cancelled"}:
            _log_task_history(user_id, task_id, task_data.status or "")
        return task
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


def _log_task_history(user_id: str, task_id: str, status: str) -> None:
    entry = {
        "task_id": task_id,
        "status": status,
        "timestamp": datetime.utcnow().isoformat(),
    }
    students_collection.update_one(
        {"user_id": user_id},
        {"$push": {"task_history": entry}},
        upsert=True,
    )


def preview_day_plan(user_id: str, payload: PlanDayRequest) -> List[dict]:
    if not payload.tasks:
        raise HTTPException(status_code=400, detail="Please provide at least one task.")
    if len(payload.tasks) > 6:
        raise HTTPException(status_code=400, detail="You can only plan up to 6 tasks.")

    return _build_plan(user_id, payload.tasks)


def save_day_plan(user_id: str, plan: List[PlannedTaskInput]) -> List[dict]:
    if not plan:
        raise HTTPException(status_code=400, detail="Plan is empty.")

    saved = []
    now = datetime.utcnow()
    for idx, item in enumerate(plan, start=1):
        start = _ensure_naive(item.scheduled_start)
        end = _ensure_naive(item.scheduled_end)
        doc = {
            "user_id": user_id,
            "name": item.name,
            "duration": item.duration,
            "deadline": end,
            "priority": item.priority,
            "category": "Study",
            "status": "pending",
            "scheduled_start": start,
            "scheduled_end": end,
            "plan_reason": item.plan_reason,
            "sequence": item.sequence or idx,
            "is_today_plan": True,
            "created_at": now,
            "updated_at": now,
        }
        result = tasks_collection.insert_one(doc)
        doc["id"] = str(result.inserted_id)
        doc["_id"] = str(result.inserted_id)
        saved.append(doc)

    update_streaks(user_id)
    return saved


def _build_plan(user_id: str, tasks: List[PlanTaskItem]) -> List[dict]:
    student = students_collection.find_one({"user_id": user_id})
    if not student:
        raise HTTPException(status_code=400, detail="Complete your onboarding before planning.")

    survey = student.get("survey") or {}
    wake = survey.get("wakeup_time") or "07:00"
    sleep = survey.get("sleep_time") or "22:00"
    class_schedule = survey.get("class_schedule", [])

    today = date.today()
    current = datetime.combine(today, _parse_time(wake))
    day_end = datetime.combine(today, _parse_time(sleep))
    if day_end <= current:
        day_end = datetime.combine(today, time(23, 0))

    blocked = _build_blocks(today, class_schedule)
    planned: List[dict] = []
    priority_order = {"high": 3, "medium": 2, "low": 1}
    tasks_sorted = sorted(tasks, key=lambda t: -priority_order.get(t.priority, 1))
    sequence = 1

    for item in tasks_sorted:
        duration = timedelta(minutes=item.duration)
        slot_start = _find_next_slot(current, duration, blocked, day_end)
        if slot_start is None:
            raise HTTPException(status_code=400, detail="Unable to schedule all tasks before bedtime.")

        slot_end = slot_start + duration
        reason = _build_reason(item, slot_start, class_schedule)

        planned.append(
            {
                "name": item.name,
                "duration": item.duration,
                "priority": item.priority,
                "scheduled_start": slot_start,
                "scheduled_end": slot_end,
                "plan_reason": reason,
                "sequence": sequence,
            }
        )

        blocked.append((slot_start, slot_end))
        blocked.sort(key=lambda b: b[0])
        current = slot_end + timedelta(minutes=5)
        sequence += 1

    return planned


def _parse_time(value: str) -> time:
    try:
        hours, minutes = value.split(":")
        return time(int(hours), int(minutes))
    except Exception:
        return time(7, 0)


def _build_blocks(today: date, schedule: List[dict]) -> List[tuple]:
    blocks = []
    weekday = today.strftime("%A").lower()
    for entry in schedule:
        if entry.get("day", "").lower() != weekday:
            continue
        start = datetime.combine(today, _parse_time(entry.get("start", "08:00")))
        end = datetime.combine(today, _parse_time(entry.get("end", "09:00")))
        if end > start:
            blocks.append((start, end))
    return sorted(blocks, key=lambda b: b[0])


def _find_next_slot(current: datetime, duration: timedelta, blocks: List[tuple], day_end: datetime) -> Optional[datetime]:
    candidate = current
    while candidate + duration <= day_end:
        overlap = False
        for start, end in blocks:
            if candidate < end and (candidate + duration) > start:
                candidate = end + timedelta(minutes=5)
                overlap = True
                break
        if not overlap:
            return candidate
    return None


def _build_reason(task: PlanTaskItem, start: datetime, schedule: List[dict]) -> str:
    reason = f"Prioritised as {task.priority.title()} priority at {start.strftime('%I:%M %p')}."
    if schedule:
        reason += " Adjusted to avoid classes."
    return reason

