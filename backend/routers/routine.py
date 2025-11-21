from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from datetime import date
from models.routine import RoutineLogCreate, RoutineLogResponse
from services.routine_service import (
    create_routine_log, get_routine_logs, get_routine_log,
    update_routine_log, get_today_log, detect_missing_entries
)
from auth import get_current_user_id

router = APIRouter(prefix="/api/routine", tags=["routine"])

@router.post("", response_model=dict)
async def create_log(log_data: RoutineLogCreate, user_id: str = Depends(get_current_user_id)):
    """Create a new routine log entry"""
    log = create_routine_log(user_id, log_data.dict())
    return log

@router.get("", response_model=list)
async def get_logs(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    user_id: str = Depends(get_current_user_id)
):
    """Get routine logs within date range"""
    logs = get_routine_logs(user_id, start_date, end_date)
    return logs

@router.get("/today", response_model=dict)
async def get_today_routine_log(user_id: str = Depends(get_current_user_id)):
    """Get today's routine log"""
    log = get_today_log(user_id)
    if not log:
        return {"message": "No log found for today"}
    return log

@router.get("/{log_id}", response_model=dict)
async def get_log_by_id(log_id: str, user_id: str = Depends(get_current_user_id)):
    """Get a specific routine log"""
    log = get_routine_log(log_id, user_id)
    if not log:
        raise HTTPException(status_code=404, detail="Routine log not found")
    return log

@router.put("/{log_id}", response_model=dict)
async def update_log_by_id(
    log_id: str,
    log_data: RoutineLogCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Update a routine log"""
    log = update_routine_log(log_id, user_id, log_data.dict())
    if not log:
        raise HTTPException(status_code=404, detail="Routine log not found")
    return log

@router.get("/missing-entries/detect", response_model=dict)
async def get_missing_entries(
    days: int = Query(7, ge=1, le=30),
    user_id: str = Depends(get_current_user_id)
):
    """Detect missing routine log entries"""
    missing = detect_missing_entries(user_id, days)
    return {
        "missing_dates": [d.isoformat() for d in missing],
        "count": len(missing)
    }

