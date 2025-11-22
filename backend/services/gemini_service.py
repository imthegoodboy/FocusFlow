"""
Gemini API Service for NLP Tasks
=================================

This service uses Google's Gemini API for natural language processing tasks:
- Generating personalized task scheduling explanations
- Creating motivational messages
- Analyzing task descriptions
"""

import os
from typing import Optional, List, Dict
from config import settings

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Initialize Gemini
if GEMINI_AVAILABLE and settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
    except Exception:
        GEMINI_AVAILABLE = False
else:
    GEMINI_AVAILABLE = False

def generate_scheduling_reason(
    task_name: str,
    scheduled_time: str,
    priority: str,
    user_context: Optional[Dict] = None
) -> str:
    """
    Generate a personalized explanation for why a task is scheduled at a specific time.
    
    Args:
        task_name: Name of the task
        scheduled_time: Scheduled time (e.g., "9:00 AM")
        priority: Task priority ('low', 'medium', 'high')
        user_context: Optional user context (focus hours, productivity patterns)
    
    Returns:
        Personalized explanation string
    """
    if not GEMINI_AVAILABLE:
        # Fallback to template-based explanation
        if priority == 'high':
            return f"High priority task scheduled at {scheduled_time} to ensure completion."
        elif priority == 'medium':
            return f"Medium priority task scheduled at {scheduled_time} based on your routine."
        else:
            return f"Task scheduled at {scheduled_time} to fit your schedule."
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        context_str = ""
        if user_context:
            focus_hours = user_context.get('focus_hours', [])
            if focus_hours:
                context_str = f"Your peak focus hours are: {', '.join(map(str, focus_hours))}. "
        
        prompt = f"""Generate a brief, friendly explanation (1-2 sentences) for why the task "{task_name}" 
is scheduled at {scheduled_time}. The task priority is {priority}. {context_str}
Make it personal and motivating. Keep it under 100 characters."""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        # Fallback on error
        return f"Scheduled at {scheduled_time} based on your productivity patterns."

def generate_motivational_message(
    productivity_score: float,
    tasks_completed: int,
    tasks_total: int
) -> str:
    """
    Generate a motivational message based on user's progress.
    
    Args:
        productivity_score: Current productivity score (0-10)
        tasks_completed: Number of tasks completed
        tasks_total: Total number of tasks
    
    Returns:
        Motivational message string
    """
    if not GEMINI_AVAILABLE:
        # Fallback messages
        if productivity_score >= 9:
            return "Outstanding work! You're on fire today! 🔥"
        elif productivity_score >= 7:
            return "Great progress! Keep up the momentum! 💪"
        elif productivity_score >= 5:
            return "Good job! You're making steady progress. 👍"
        else:
            return "Every step counts! Keep pushing forward! 💪"
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        completion_rate = (tasks_completed / tasks_total * 100) if tasks_total > 0 else 0
        
        prompt = f"""Generate a short, encouraging motivational message (1 sentence) for a student who:
- Has a productivity score of {productivity_score:.1f}/10
- Completed {tasks_completed} out of {tasks_total} tasks ({completion_rate:.0f}% completion rate)

Make it positive, specific, and motivating. Include an emoji. Keep it under 80 characters."""

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        # Fallback on error
        if productivity_score >= 7:
            return "Great work! Keep it up! 💪"
        else:
            return "You're making progress! Keep going! 👍"

def analyze_task_description(task_description: str) -> Dict[str, any]:
    """
    Analyze a task description to extract insights.
    
    Args:
        task_description: Description of the task
    
    Returns:
        Dict with analysis results
    """
    if not GEMINI_AVAILABLE:
        return {
            'estimated_duration': 60,
            'suggested_priority': 'medium',
            'complexity': 'medium'
        }
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""Analyze this task description and provide:
1. Estimated duration in minutes (just the number)
2. Suggested priority: low, medium, or high
3. Complexity: low, medium, or high

Task: {task_description}

Respond in format: duration|priority|complexity"""

        response = model.generate_content(prompt)
        parts = response.text.strip().split('|')
        
        if len(parts) >= 3:
            return {
                'estimated_duration': int(parts[0]) if parts[0].isdigit() else 60,
                'suggested_priority': parts[1].strip().lower() if parts[1].strip().lower() in ['low', 'medium', 'high'] else 'medium',
                'complexity': parts[2].strip().lower() if parts[2].strip().lower() in ['low', 'medium', 'high'] else 'medium'
            }
    except Exception:
        pass
    
    # Fallback
    return {
        'estimated_duration': 60,
        'suggested_priority': 'medium',
        'complexity': 'medium'
    }

