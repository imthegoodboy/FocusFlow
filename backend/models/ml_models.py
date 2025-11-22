"""
ML Model Inference Module for FocusFlow
=======================================

This module loads and uses the trained ML models for predictions:
1. Study Time Prediction - Predicts best study hours
2. Productivity Prediction - Predicts productivity scores
3. Task Scheduling - Predicts optimal task scheduling times

All models are loaded from saved_models directory and used for real-time predictions.
"""

import os
import joblib
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, date

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_models')
STUDY_TIME_MODEL_PATH = os.path.join(MODEL_DIR, 'study_time_model.pkl')
PRODUCTIVITY_MODEL_PATH = os.path.join(MODEL_DIR, 'productivity_model.pkl')
SCHEDULING_MODEL_PATH = os.path.join(MODEL_DIR, 'task_scheduling_model.pkl')

# Load models (lazy loading)
_study_time_model = None
_productivity_model = None
_scheduling_model = None

def _load_models():
    """Lazy load models when first needed"""
    global _study_time_model, _productivity_model, _scheduling_model
    
    if _study_time_model is None and os.path.exists(STUDY_TIME_MODEL_PATH):
        _study_time_model = joblib.load(STUDY_TIME_MODEL_PATH)
    
    if _productivity_model is None and os.path.exists(PRODUCTIVITY_MODEL_PATH):
        _productivity_model = joblib.load(PRODUCTIVITY_MODEL_PATH)
    
    if _scheduling_model is None and os.path.exists(SCHEDULING_MODEL_PATH):
        _scheduling_model = joblib.load(SCHEDULING_MODEL_PATH)

# ============================================================================
# MODEL 1: STUDY TIME PREDICTION
# ============================================================================

def predict_best_study_hour(
    wakeup_hour: int,
    sleep_hour: int,
    study_hours_yesterday: float,
    productivity_yesterday: float,
    day_of_week: int,
    has_class_today: bool,
    screen_time: float,
    exercise_duration: float
) -> Dict[str, float]:
    """
    Predict the best study hour for a student based on their patterns.
    
    Args:
        wakeup_hour: Hour when student wakes up (0-23)
        sleep_hour: Hour when student sleeps (0-23)
        study_hours_yesterday: Hours studied yesterday
        productivity_yesterday: Productivity score yesterday (0-10)
        day_of_week: Day of week (0=Monday, 6=Sunday)
        has_class_today: Whether student has classes today
        screen_time: Hours of screen time
        exercise_duration: Minutes of exercise
    
    Returns:
        Dict with 'best_hour' (predicted hour) and 'confidence' (0-1)
    """
    _load_models()
    
    if _study_time_model is None:
        # Fallback to simple heuristic if model not available
        if wakeup_hour <= 7:
            best_hour = 9.0
        else:
            best_hour = 19.0
        return {'best_hour': best_hour, 'confidence': 0.5}
    
    # Prepare features
    features = np.array([[
        wakeup_hour,
        sleep_hour,
        study_hours_yesterday,
        productivity_yesterday,
        day_of_week,
        1 if has_class_today else 0,
        screen_time,
        exercise_duration
    ]])
    
    # Predict
    predicted_hour = _study_time_model.predict(features)[0]
    predicted_hour = max(6, min(23, round(predicted_hour)))  # Clamp and round
    
    # Calculate confidence (simplified)
    confidence = min(0.95, 0.6 + (productivity_yesterday / 10) * 0.35)
    
    return {
        'best_hour': float(predicted_hour),
        'confidence': confidence
    }

# ============================================================================
# MODEL 2: PRODUCTIVITY PREDICTION
# ============================================================================

def predict_productivity_score(
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
    Predict student productivity score based on various factors.
    
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
    _load_models()
    
    if _productivity_model is None:
        # Fallback calculation
        completion_rate = tasks_completed / tasks_total if tasks_total > 0 else 0
        score = 5.0
        if 7 <= sleep_hours <= 9:
            score += 2.0
        score += completion_rate * 2.0
        score = max(0, min(10, score))
        return {'productivity_score': score, 'confidence': 0.5}
    
    # Prepare features
    completion_rate = tasks_completed / tasks_total if tasks_total > 0 else 0
    
    features = np.array([[
        sleep_hours,
        study_hours,
        screen_time,
        exercise_duration,
        tasks_completed,
        tasks_total,
        completion_rate,
        streak_days,
        day_of_week,
        stress_level
    ]])
    
    # Predict
    predicted_score = _productivity_model.predict(features)[0]
    predicted_score = max(0, min(10, predicted_score))
    
    # Calculate confidence
    confidence = min(0.95, 0.7 + (completion_rate * 0.25))
    
    return {
        'productivity_score': float(predicted_score),
        'confidence': confidence
    }

# ============================================================================
# MODEL 3: TASK SCHEDULING
# ============================================================================

def predict_optimal_schedule_time(
    task_priority: str,  # 'low', 'medium', 'high'
    task_duration: int,  # minutes
    deadline_hours_away: float,
    current_hour: int,
    user_productivity_at_hour: float,
    has_class_at_time: bool,
    day_of_week: int,
    tasks_already_scheduled: int,
    user_energy_level: float
) -> Dict[str, float]:
    """
    Predict optimal scheduling time for a task.
    
    Args:
        task_priority: Task priority ('low', 'medium', 'high')
        task_duration: Task duration in minutes
        deadline_hours_away: Hours until deadline
        current_hour: Current hour (0-23)
        user_productivity_at_hour: User's productivity at current hour
        has_class_at_time: Whether user has class at this time
        day_of_week: Day of week (0=Monday, 6=Sunday)
        tasks_already_scheduled: Number of tasks already scheduled
        user_energy_level: User's energy level (0-10)
    
    Returns:
        Dict with 'optimal_hour' and 'confidence'
    """
    _load_models()
    
    if _scheduling_model is None:
        # Fallback logic
        priority_map = {'low': 0, 'medium': 1, 'high': 2}
        priority_num = priority_map.get(task_priority, 1)
        
        if priority_num == 2:  # High
            optimal_hour = current_hour + 1
        elif priority_num == 1:  # Medium
            optimal_hour = current_hour + 2
        else:  # Low
            optimal_hour = current_hour + 3
        
        optimal_hour = max(6, min(22, optimal_hour))
        return {'optimal_hour': float(optimal_hour), 'confidence': 0.5}
    
    # Convert priority to number
    priority_map = {'low': 0, 'medium': 1, 'high': 2}
    priority_num = priority_map.get(task_priority, 1)
    
    # Prepare features
    features = np.array([[
        priority_num,
        task_duration,
        deadline_hours_away,
        current_hour,
        user_productivity_at_hour,
        1 if has_class_at_time else 0,
        day_of_week,
        tasks_already_scheduled,
        user_energy_level
    ]])
    
    # Predict
    predicted_hour = _scheduling_model.predict(features)[0]
    predicted_hour = max(6, min(22, round(predicted_hour)))
    
    # Calculate confidence
    confidence = min(0.95, 0.65 + (user_productivity_at_hour / 10) * 0.3)
    
    return {
        'optimal_hour': float(predicted_hour),
        'confidence': confidence
    }

