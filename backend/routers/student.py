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

