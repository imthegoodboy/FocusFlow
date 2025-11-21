from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from models.task import TaskCreate, TaskUpdate, TaskResponse
from services.task_service import (
    create_task, get_tasks, get_task, update_task, delete_task, check_task_conflicts
)
from services.scheduler import auto_reschedule_delayed_tasks
from auth import get_current_user_id
from datetime import datetime

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.post("", response_model=dict)
async def create_new_task(task_data: TaskCreate, user_id: str = Depends(get_current_user_id)):
    """Create a new task"""
    # Validate deadline
    if task_data.deadline < datetime.now():
        raise HTTPException(status_code=400, detail="Deadline must be in the future")
    
    task = create_task(user_id, task_data)
    return task

@router.get("", response_model=list)
async def get_user_tasks(
    status: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id)
):
    """Get all tasks for the current user"""
    tasks = get_tasks(user_id, status)
    return tasks

@router.get("/{task_id}", response_model=dict)
async def get_task_by_id(task_id: str, user_id: str = Depends(get_current_user_id)):
    """Get a specific task"""
    task = get_task(task_id, user_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=dict)
async def update_task_by_id(
    task_id: str,
    task_data: TaskUpdate,
    user_id: str = Depends(get_current_user_id)
):
    """Update a task"""
    task = update_task(task_id, user_id, task_data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}")
async def delete_task_by_id(task_id: str, user_id: str = Depends(get_current_user_id)):
    """Delete a task"""
    success = delete_task(task_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@router.post("/{task_id}/check-conflict")
async def check_conflict(
    task_id: str,
    start: datetime,
    end: datetime,
    user_id: str = Depends(get_current_user_id)
):
    """Check if a task time conflicts with existing tasks"""
    has_conflict = check_task_conflicts(user_id, task_id, start, end)
    return {"has_conflict": has_conflict}

@router.post("/reschedule-delayed")
async def reschedule_delayed(user_id: str = Depends(get_current_user_id)):
    """Auto-reschedule delayed tasks"""
    auto_reschedule_delayed_tasks(user_id)
    return {"message": "Delayed tasks rescheduled"}

