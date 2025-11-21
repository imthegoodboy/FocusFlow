from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, ConfigDict


class Task(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: Optional[str] = Field(default=None, alias="_id")
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
    model_config = ConfigDict(from_attributes=True)

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

