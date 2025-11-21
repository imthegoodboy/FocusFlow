from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


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
    plan_reason: Optional[str] = None
    sequence: Optional[int] = None
    is_today_plan: bool = False
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
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
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None


class PlanTaskItem(BaseModel):
    name: str
    duration: int
    priority: Literal["low", "medium", "high"] = "medium"


class PlanDayRequest(BaseModel):
    tasks: List[PlanTaskItem]


class PlannedTaskInput(BaseModel):
    name: str
    duration: int
    priority: Literal["low", "medium", "high"]
    scheduled_start: datetime
    scheduled_end: datetime
    plan_reason: Optional[str] = None
    sequence: Optional[int] = None

