from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
try:
    from bson import ObjectId
except ImportError:
    from pymongo import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x) if x else None
            ),
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            if ObjectId.is_valid(v):
                return ObjectId(v)
            raise ValueError("Invalid ObjectId")
        raise ValueError("Invalid ObjectId")
    
    def __str__(self):
        return str(super())

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
    id: Optional[str] = None
    email: EmailStr
    password: str
    profile: Optional[StudentProfile] = None
    survey: Optional[SurveyResponse] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    is_active: bool = True

    class Config:
        arbitrary_types_allowed = True
        populate_by_name = True

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

