from datetime import datetime
from typing import Dict

from database import students_collection


RESPONSES = [
    ("focus", "Try a 25-minute deep-work block followed by a 5-minute walk. It refreshes your brain."),
    ("sleep", "Aim for at least 7 hours. Consistent sleep improves memory consolidation for exams."),
    ("break", "Short breaks every hour help you retain more. Stretch, hydrate, then resume."),
    ("exam", "Break the syllabus into daily micro-goals. Track progress inside FocusFlow to stay on pace."),
]


def answer_question(user_id: str, question: str) -> Dict[str, str]:
    text = (question or "").lower()
    reply = "I'm here with you! Try revisiting your schedule and adjust tasks to match your current energy."
    for keyword, message in RESPONSES:
        if keyword in text:
            reply = message
            break

    log_entry = {
        "question": question,
        "reply": reply,
        "timestamp": datetime.utcnow(),
    }
    students_collection.update_one(
        {"user_id": user_id},
        {"$push": {"support_chat": log_entry}},
        upsert=True,
    )

    return {"reply": reply}

