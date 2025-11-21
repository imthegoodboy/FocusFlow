from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

from auth import get_current_user_id
from database import users_collection

try:
    from bson import ObjectId
except ImportError:
    from pymongo import ObjectId


router = APIRouter(prefix="/api/student", tags=["student"])


@router.get("/profile")
async def get_student_profile(user_id: str = Depends(get_current_user_id)):
    """
    Return a flattened student profile used by the dashboard.
    Combines basic profile fields and survey fields from the user document.
    """
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = user.get("profile") or {}
    survey = user.get("survey") or {}

    response_profile = {
        "id": str(user["_id"]),
        "name": profile.get("name") or "",
        "age": profile.get("age") or 0,
        "class_name": profile.get("class_name") or "",
        "school_name": profile.get("school_name") or "",
        "avatar_emoji": profile.get("avatar_emoji") or "🙂",
        "avatar_url": profile.get("avatar_url"),
        "survey": {
            "wakeup_time": survey.get("wakeup_time"),
            "sleep_time": survey.get("sleep_time"),
            "study_hours": survey.get("study_hours"),
            "screen_time": survey.get("screen_time"),
            "exercise_duration": survey.get("exercise_hours"),
            "preferred_break_length": survey.get("break_duration"),
            "class_schedule": survey.get("class_timings") or [],
        },
    }

    return {"profile": response_profile}

from fastapi import APIRouter, Depends, UploadFile, File

from auth import get_current_user_id
from models.student import StudentProfileCreate
from services.student_service import (
    get_student_profile,
    upsert_student_profile,
    upload_avatar,
)

router = APIRouter(prefix="/api/student", tags=["student"])


@router.get("/profile")
async def fetch_profile(user_id: str = Depends(get_current_user_id)):
    profile = get_student_profile(user_id)
    if not profile:
        return {"profile": None}
    return {"profile": profile}


@router.post("/profile")
async def save_profile(
    payload: StudentProfileCreate,
    user_id: str = Depends(get_current_user_id),
):
    profile = upsert_student_profile(user_id, payload)
    return {"profile": profile}


@router.post("/avatar")
async def save_avatar(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    result = await upload_avatar(user_id, file)
    return result

