import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import UploadFile

from database import students_collection
from models.student import StudentProfileCreate

AVATAR_DIR = Path("uploads/avatars")
AVATAR_DIR.mkdir(parents=True, exist_ok=True)


def _serialize(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    return {
        "id": str(doc.get("_id")),
        "name": doc.get("name", ""),
        "age": doc.get("age"),
        "class_name": doc.get("class_name", ""),
        "school_name": doc.get("school_name", ""),
        "avatar_emoji": doc.get("avatar_emoji"),
        "avatar_url": doc.get("avatar_url"),
        "survey": doc.get("survey", {}),
    }


def get_student_profile(user_id: str) -> Optional[dict]:
    doc = students_collection.find_one({"user_id": user_id})
    return _serialize(doc)


def upsert_student_profile(user_id: str, payload: StudentProfileCreate) -> dict:
    data = payload.dict()
    survey = data.pop("survey", None)
    if survey:
        data["survey"] = {k: v for k, v in survey.dict().items() if v is not None}
    data["updated_at"] = datetime.utcnow()
    update_doc = {"$set": data, "$setOnInsert": {"user_id": user_id, "created_at": datetime.utcnow()}}

    students_collection.update_one({"user_id": user_id}, update_doc, upsert=True)

    doc = students_collection.find_one({"user_id": user_id})
    return _serialize(doc)


async def upload_avatar(user_id: str, file: UploadFile) -> dict:
    contents = await file.read()
    ext = Path(file.filename or "").suffix or ".png"
    filename = f"{user_id}{ext}"
    filepath = AVATAR_DIR / filename
    with open(filepath, "wb") as buffer:
        buffer.write(contents)

    avatar_url = f"/uploads/avatars/{filename}"
    students_collection.update_one(
        {"user_id": user_id},
        {"$set": {"avatar_url": avatar_url, "updated_at": datetime.utcnow()}},
        upsert=True,
    )
    return {"avatar_url": avatar_url}

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from database import students_collection
from models.student import StudentProfileCreate

AVATAR_DIR = os.path.join(os.getcwd(), "uploads", "avatars")


def ensure_avatar_dir():
    os.makedirs(AVATAR_DIR, exist_ok=True)


def serialize_student(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    doc["id"] = str(doc.get("_id"))
    doc["_id"] = str(doc.get("_id"))
    return doc


def get_student_profile(user_id: str) -> Optional[dict]:
    doc = students_collection.find_one({"user_id": user_id})
    return serialize_student(doc)


def upsert_student_profile(user_id: str, payload: StudentProfileCreate) -> dict:
    data = payload.model_dump(exclude_none=True, by_alias=True)
    data["user_id"] = user_id
    data["updated_at"] = datetime.utcnow()
    if "survey" in data and data["survey"] is not None:
        survey = data["survey"]
        if (
            schedule := survey.get("class_schedule")
        ) and isinstance(schedule, list):
            survey["class_schedule"] = [
                {
                    "day": item.get("day"),
                    "start": item.get("start"),
                    "end": item.get("end"),
                    "subject": item.get("subject"),
                }
                for item in schedule
            ]
    existing = students_collection.find_one({"user_id": user_id})
    if existing:
        students_collection.update_one({"_id": existing["_id"]}, {"$set": data})
    else:
        data["created_at"] = datetime.utcnow()
        students_collection.insert_one(data)
    return get_student_profile(user_id)


async def upload_avatar(user_id: str, file: UploadFile) -> dict:
    if file.content_type not in {"image/png", "image/jpeg"}:
        raise HTTPException(status_code=400, detail="Only PNG or JPEG files are allowed.")
    ensure_avatar_dir()
    ext = ".png" if file.content_type == "image/png" else ".jpg"
    filename = f"{user_id}_{uuid4().hex}{ext}"
    path = os.path.join(AVATAR_DIR, filename)
    with open(path, "wb") as buffer:
        buffer.write(await file.read())
    relative_path = f"/uploads/avatars/{filename}"
    students_collection.update_one(
        {"user_id": user_id},
        {"$set": {"avatar_url": relative_path, "updated_at": datetime.utcnow()}},
        upsert=True,
    )
    return {"avatar_url": relative_path}

