from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class StudentProfile(BaseModel):
    goals: List[str] = []
    exam_dates: List[dict] = []  # [{date: "2024-12-15", subject: "Math"}]
    semester_plan: Optional[str] = None
    study_targets: dict = {}  # {daily_hours: 6, weekly_goals: []}
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class SurveyResponse(BaseModel):
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
    id: Optional[PyObjectId] = None
    email: EmailStr
    password: str
    profile: Optional[StudentProfile] = None
    survey: Optional[SurveyResponse] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    is_active: bool = True

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    profile: Optional[StudentProfile] = None
    survey: Optional[SurveyResponse] = None
    created_at: datetime
    is_active: bool

    class Config:
        json_encoders = {ObjectId: str}

