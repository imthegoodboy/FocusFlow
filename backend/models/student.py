from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class SurveyAnswers(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    wakeup_time: Optional[str] = None
    sleep_time: Optional[str] = None
    study_hours: Optional[float] = None
    screen_time: Optional[float] = None
    exercise_duration: Optional[float] = None
    preferred_break_length: Optional[int] = None
    class_schedule: List[dict] = Field(default_factory=list)


class StudentProfile(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    name: str
    age: int
    class_name: str
    school_name: str
    avatar_emoji: Optional[str] = None
    avatar_url: Optional[str] = None
    survey: Optional[SurveyAnswers] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()


class StudentProfileCreate(BaseModel):
    name: str
    age: int
    class_name: str
    school_name: str
    avatar_emoji: Optional[str] = None
    survey: Optional[SurveyAnswers] = None


class StudentProfileResponse(StudentProfile):
    pass

