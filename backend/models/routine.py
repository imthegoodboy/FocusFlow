from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from bson import ObjectId

class RoutineLog(BaseModel):
    id: Optional[ObjectId] = None
    user_id: str
    date: date
    wakeup_time: Optional[str] = None  # "07:00"
    sleep_time: Optional[str] = None  # "23:00"
    study_hours: float = 0.0
    screen_time: float = 0.0  # hours
    exercise_duration: float = 0.0  # minutes
    breaks: List[dict] = []  # [{start: "14:00", end: "14:15", type: "short"}]
    class_timings: List[dict] = []  # [{start: "09:00", end: "10:30", subject: "Math"}]
    productivity_score: Optional[float] = None  # 0-10
    notes: Optional[str] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class RoutineLogCreate(BaseModel):
    date: date
    wakeup_time: Optional[str] = None
    sleep_time: Optional[str] = None
    study_hours: float = 0.0
    screen_time: float = 0.0
    exercise_duration: float = 0.0
    breaks: List[dict] = []
    class_timings: List[dict] = []
    productivity_score: Optional[float] = None
    notes: Optional[str] = None

class RoutineLogResponse(BaseModel):
    id: str
    user_id: str
    date: date
    wakeup_time: Optional[str] = None
    sleep_time: Optional[str] = None
    study_hours: float
    screen_time: float
    exercise_duration: float
    breaks: List[dict]
    class_timings: List[dict]
    productivity_score: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {ObjectId: str}

