from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_user_id
from services.support_service import answer_question


class SupportMessage(BaseModel):
    question: str


router = APIRouter(prefix="/api/support", tags=["support"])


@router.post("/chat")
async def support_chat(payload: SupportMessage, user_id: str = Depends(get_current_user_id)):
    return answer_question(user_id, payload.question)

