from fastapi import APIRouter, HTTPException, Depends
from models.user import StudentProfile, SurveyResponse
from database import users_collection
from auth import get_current_user_id
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/user", tags=["user"])

@router.put("/profile")
async def update_profile(profile: StudentProfile, user_id: str = Depends(get_current_user_id)):
    """Update student profile"""
    update_data = profile.dict()
    update_data["updated_at"] = datetime.now()
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"profile": update_data, "updated_at": datetime.now()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Profile updated successfully", "profile": update_data}

@router.put("/survey")
async def update_survey(survey: SurveyResponse, user_id: str = Depends(get_current_user_id)):
    """Update survey responses"""
    survey_data = survey.dict()
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"survey": survey_data, "updated_at": datetime.now()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Survey updated successfully", "survey": survey_data}

@router.get("/profile")
async def get_profile(user_id: str = Depends(get_current_user_id)):
    """Get user profile and survey"""
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "profile": user.get("profile"),
        "survey": user.get("survey")
    }

