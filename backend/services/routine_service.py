from datetime import datetime, date
from typing import List, Optional
try:
    from bson import ObjectId
except ImportError:
    from pymongo import ObjectId
from database import routine_logs_collection

def create_routine_log(user_id: str, log_data: dict) -> dict:
    """Create a new routine log entry"""
    log_dict = log_data.copy()
    log_dict["user_id"] = user_id
    log_dict["created_at"] = datetime.now()
    log_dict["updated_at"] = datetime.now()
    
    result = routine_logs_collection.insert_one(log_dict)
    log_dict["_id"] = result.inserted_id
    log_dict["id"] = str(result.inserted_id)
    return log_dict

def get_routine_logs(user_id: str, start_date: Optional[date] = None, end_date: Optional[date] = None) -> List[dict]:
    """Get routine logs for a user within date range"""
    query = {"user_id": user_id}
    
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date
        if end_date:
            date_query["$lte"] = end_date
        query["date"] = date_query
    
    logs = list(routine_logs_collection.find(query).sort("date", -1))
    
    for log in logs:
        log["id"] = str(log["_id"])
        log["_id"] = str(log["_id"])
    
    return logs

def get_routine_log(log_id: str, user_id: str) -> Optional[dict]:
    """Get a specific routine log"""
    log = routine_logs_collection.find_one({"_id": ObjectId(log_id), "user_id": user_id})
    if log:
        log["id"] = str(log["_id"])
        log["_id"] = str(log["_id"])
    return log

def update_routine_log(log_id: str, user_id: str, log_data: dict) -> Optional[dict]:
    """Update a routine log"""
    update_data = {k: v for k, v in log_data.items() if v is not None}
    update_data["updated_at"] = datetime.now()
    
    result = routine_logs_collection.update_one(
        {"_id": ObjectId(log_id), "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return get_routine_log(log_id, user_id)
    return None

def get_today_log(user_id: str) -> Optional[dict]:
    """Get today's routine log"""
    today = date.today()
    log = routine_logs_collection.find_one({"user_id": user_id, "date": today})
    if log:
        log["id"] = str(log["_id"])
        log["_id"] = str(log["_id"])
    return log

def detect_missing_entries(user_id: str, days: int = 7) -> List[date]:
    """Detect missing routine log entries in the last N days"""
    from datetime import timedelta
    
    today = date.today()
    start_date = today - timedelta(days=days)
    
    existing_dates = set()
    logs = routine_logs_collection.find({
        "user_id": user_id,
        "date": {"$gte": start_date, "$lte": today}
    })
    
    for log in logs:
        existing_dates.add(log["date"])
    
    missing_dates = []
    current = start_date
    while current <= today:
        if current not in existing_dates:
            missing_dates.append(current)
        current += timedelta(days=1)
    
    return missing_dates

