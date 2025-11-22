from fastapi import APIRouter, Depends
from services.achievement_service import get_user_achievements
from auth import get_current_user_id

router = APIRouter(prefix="/api/achievements", tags=["achievements"])

@router.get("")
async def get_achievements(user_id: str = Depends(get_current_user_id)):
    """Get user achievements"""
    achievements = get_user_achievements(user_id)
    return achievements

