from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from bson import ObjectId

class Task(BaseModel):
    id: Optional[ObjectId] = None
    user_id: str
    name: str
    duration: int  # minutes
    deadline: datetime
    priority: Literal["low", "medium", "high"]
    category: Literal["Study", "Health", "Personal", "Work", "Other"]
    status: Literal["pending", "in_progress", "completed", "cancelled"] = "pending"
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    completed_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TaskCreate(BaseModel):
    name: str
    duration: int
    deadline: datetime
    priority: Literal["low", "medium", "high"]
    category: Literal["Study", "Health", "Personal", "Work", "Other"]

class TaskUpdate(BaseModel):
    name: Optional[str] = None
    duration: Optional[int] = None
    deadline: Optional[datetime] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    category: Optional[Literal["Study", "Health", "Personal", "Work", "Other"]] = None
    status: Optional[Literal["pending", "in_progress", "completed", "cancelled"]] = None

class TaskResponse(BaseModel):
    id: str
    user_id: str
    name: str
    duration: int
    deadline: datetime
    priority: str
    category: str
    status: str
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}

