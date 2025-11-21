from fastapi import APIRouter, Depends
from services.ai_recommendation import (
    get_productive_hours, get_study_recommendations,
    get_task_suggestions, get_break_recommendations
)
from auth import get_current_user_id

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.get("/productive-hours")
async def get_productive_hours_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get productive hours recommendation"""
    hours = get_productive_hours(user_id)
    return {"productive_hours": hours}

@router.get("/recommendations")
async def get_recommendations(user_id: str = Depends(get_current_user_id)):
    """Get AI recommendations"""
    recommendations = get_study_recommendations(user_id)
    return {"recommendations": recommendations}

@router.get("/task-suggestions")
async def get_task_suggestions_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get task scheduling suggestions"""
    suggestions = get_task_suggestions(user_id)
    return suggestions

@router.get("/break-recommendations")
async def get_break_recommendations_endpoint(user_id: str = Depends(get_current_user_id)):
    """Get break recommendations"""
    recommendations = get_break_recommendations(user_id)
    return {"recommendations": recommendations}

