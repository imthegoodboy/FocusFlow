from fastapi import APIRouter, Depends
from services.streak_service import get_streaks, update_streaks
from auth import get_current_user_id

router = APIRouter(prefix="/api/streaks", tags=["streaks"])

@router.get("")
async def get_user_streaks(user_id: str = Depends(get_current_user_id)):
    """Get streak data for the current user"""
    streaks = get_streaks(user_id)
    return streaks

@router.post("/update")
async def update_user_streaks(user_id: str = Depends(get_current_user_id)):
    """Update streak counters"""
    streaks = update_streaks(user_id)
    return streaks

