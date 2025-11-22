# ML Models Module
"""
This module contains ML model training and inference code for FocusFlow.

Models:
1. Study Time Prediction - Predicts best study hours
2. Productivity Prediction - Predicts productivity scores  
3. Task Scheduling - Predicts optimal task scheduling times

To train models, run: python models/train_models.py
"""

from .ml_models import (
    predict_best_study_hour,
    predict_productivity_score,
    predict_optimal_schedule_time
)

__all__ = [
    'predict_best_study_hour',
    'predict_productivity_score',
    'predict_optimal_schedule_time'
]
