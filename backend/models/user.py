from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class StudentProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    goals: List[str] = []
    exam_dates: List[dict] = []  # [{date: "2024-12-15", subject: "Math"}]
    semester_plan: Optional[str] = None
    study_targets: dict = {}  # {daily_hours: 6, weekly_goals: []}
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class SurveyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    wakeup_time: str  # "07:00"
    sleep_time: str  # "23:00"
    study_hours: int  # hours per day
    screen_time: int  # hours per day
    exercise_hours: float  # hours per week
    break_duration: int  # minutes
    class_timings: List[dict] = []  # [{day: "Monday", start: "09:00", end: "10:30"}]
    preferred_study_times: List[str] = []  # ["morning", "afternoon", "evening"]
    energy_levels: dict = {}  # {morning: 8, afternoon: 6, evening: 7}


class User(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    password: str
    profile: Optional[StudentProfile] = None
    survey: Optional[SurveyResponse] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    profile: Optional[StudentProfile] = None
    survey: Optional[SurveyResponse] = None
    created_at: datetime
    is_active: bool

