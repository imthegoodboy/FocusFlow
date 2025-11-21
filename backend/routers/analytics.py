from fastapi import APIRouter, Depends, Query
from typing import Optional
from services.analytics_service import (
    get_daily_productivity, get_weekly_productivity,
    get_focus_hours, get_task_statistics,
    get_sleep_performance_correlation, get_monthly_progress
)
from auth import get_current_user_id

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/daily-productivity")
async def get_daily_productivity_endpoint(
    days: int = Query(7, ge=1, le=30),
    user_id: str = Depends(get_current_user_id)
):
    """Get daily productivity data"""
    data = get_daily_productivity(user_id, days)
    return {"data": data}

@router.get("/weekly-productivity")
async def get_weekly_productivity_endpoint(
    weeks: int = Query(4, ge=1, le=12),
    user_id: str = Depends(get_current_user_id)
):
    """Get weekly productivity data"""
    data = get_weekly_productivity(user_id, weeks)
    return {"data": data}

@router.get("/focus-hours")
async def get_focus_hours_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get high and low focus hours"""
    data = get_focus_hours(user_id)
    return data

@router.get("/task-statistics")
async def get_task_statistics_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get task completion statistics"""
    stats = get_task_statistics(user_id)
    return stats

@router.get("/sleep-performance")
async def get_sleep_performance_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get sleep vs performance correlation"""
    data = get_sleep_performance_correlation(user_id)
    return {"data": data}

@router.get("/monthly-progress")
async def get_monthly_progress_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get monthly progress summary"""
    progress = get_monthly_progress(user_id)
    return progress

