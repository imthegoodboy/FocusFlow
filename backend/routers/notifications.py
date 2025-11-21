from fastapi import APIRouter, Depends, Query
from typing import Optional
from services.notification_service import (
    get_notifications, mark_notification_read,
    mark_all_read, check_and_create_notifications
)
from auth import get_current_user_id

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("")
async def get_user_notifications(
    unread_only: bool = Query(False),
    user_id: str = Depends(get_current_user_id)
):
    """Get notifications for the current user"""
    notifications = get_notifications(user_id, unread_only)
    return {"notifications": notifications}

@router.post("/check")
async def check_notifications(user_id: str = Depends(get_current_user_id)):
    """Check and create new notifications"""
    notifications = check_and_create_notifications(user_id)
    return {"notifications_created": len(notifications), "notifications": notifications}

@router.put("/{notification_id}/read")
async def mark_read(notification_id: str, user_id: str = Depends(get_current_user_id)):
    """Mark a notification as read"""
    success = mark_notification_read(notification_id, user_id)
    if not success:
        return {"message": "Notification not found"}
    return {"message": "Notification marked as read"}

@router.put("/read-all")
async def mark_all_as_read(user_id: str = Depends(get_current_user_id)):
    """Mark all notifications as read"""
    mark_all_read(user_id)
    return {"message": "All notifications marked as read"}

