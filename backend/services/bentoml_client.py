"""
BentoML Client for Productivity Model
=====================================

This service connects to the BentoML-hosted productivity prediction model.
The productivity model is hosted on BentoML due to its large size.
"""

import os
import requests
from typing import Dict, Optional
from config import settings

# BentoML endpoint - Update this with your actual BentoML service URL
BENTOML_ENDPOINT = os.getenv("BENTOML_ENDPOINT", getattr(settings, "BENTOML_ENDPOINT", "http://localhost:3000/predict"))
BENTOML_TIMEOUT = 10  # seconds

def predict_productivity_bentoml(
    sleep_hours: float,
    study_hours: float,
    screen_time: float,
    exercise_duration: float,
    tasks_completed: int,
    tasks_total: int,
    streak_days: int,
    day_of_week: int,
    stress_level: float = 5.0
) -> Dict[str, float]:
    """
    Predict productivity score using BentoML-hosted model.
    
    Args:
        sleep_hours: Hours of sleep
        study_hours: Hours of study
        screen_time: Hours of screen time
        exercise_duration: Minutes of exercise
        tasks_completed: Number of tasks completed
        tasks_total: Total number of tasks
        streak_days: Current streak in days
        day_of_week: Day of week (0=Monday, 6=Sunday)
        stress_level: Stress level (1-10, default 5)
    
    Returns:
        Dict with 'productivity_score' (0-10) and 'confidence' (0-1)
    """
    try:
        completion_rate = tasks_completed / tasks_total if tasks_total > 0 else 0
        
        # Prepare payload for BentoML
        payload = {
            "sleep_hours": float(sleep_hours),
            "study_hours": float(study_hours),
            "screen_time": float(screen_time),
            "exercise_duration": float(exercise_duration),
            "tasks_completed": int(tasks_completed),
            "tasks_total": int(tasks_total),
            "completion_rate": float(completion_rate),
            "streak_days": int(streak_days),
            "day_of_week": int(day_of_week),
            "stress_level": float(stress_level)
        }
        
        # Make request to BentoML service
        response = requests.post(
            BENTOML_ENDPOINT,
            json=payload,
            timeout=BENTOML_TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            # BentoML returns prediction, extract score
            if isinstance(result, dict):
                score = result.get("productivity_score", result.get("prediction", 5.0))
                confidence = result.get("confidence", 0.8)
            else:
                score = float(result) if isinstance(result, (int, float)) else 5.0
                confidence = 0.8
            
            score = max(0, min(10, score))
            return {
                'productivity_score': float(score),
                'confidence': float(confidence)
            }
        else:
            # Fallback on error
            return _fallback_productivity_prediction(
                sleep_hours, study_hours, tasks_completed, tasks_total
            )
    
    except (requests.RequestException, ValueError, KeyError) as e:
        # Fallback on any error
        print(f"BentoML prediction failed: {e}, using fallback")
        return _fallback_productivity_prediction(
            sleep_hours, study_hours, tasks_completed, tasks_total
        )

def _fallback_productivity_prediction(
    sleep_hours: float,
    study_hours: float,
    tasks_completed: int,
    tasks_total: int
) -> Dict[str, float]:
    """Fallback calculation if BentoML is unavailable"""
    completion_rate = tasks_completed / tasks_total if tasks_total > 0 else 0
    score = 5.0
    
    if 7 <= sleep_hours <= 9:
        score += 2.0
    elif sleep_hours < 6:
        score -= 1.5
    
    score += min(study_hours * 0.3, 2.0)
    score += completion_rate * 2.0
    score = max(0, min(10, score))
    
    return {
        'productivity_score': score,
        'confidence': 0.5
    }

