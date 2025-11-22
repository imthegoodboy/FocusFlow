"""
ML Model Training Script for FocusFlow
======================================

This script trains three ML models:
1. Study Time Prediction Model - Predicts best study hours based on past data
2. Productivity Prediction Model - Predicts student productivity score
3. Task Scheduling Model - Predicts optimal task scheduling times

Each model is trained on 10,000+ dummy data samples and saved for production use.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import os
from datetime import datetime, timedelta
import random

# Create models directory if it doesn't exist
os.makedirs('backend/models/saved_models', exist_ok=True)

print("=" * 60)
print("FocusFlow ML Model Training")
print("=" * 60)

# ============================================================================
# MODEL 1: STUDY TIME PREDICTION MODEL
# ============================================================================
print("\n[1/3] Training Study Time Prediction Model...")
print("-" * 60)

def generate_study_time_data(n_samples=12000):
    """Generate dummy dataset for study time prediction"""
    np.random.seed(42)
    data = []
    
    for i in range(n_samples):
        # Features
        wakeup_hour = np.random.randint(6, 9)  # 6-8 AM
        sleep_hour = np.random.randint(22, 24)  # 10-11 PM
        study_hours_yesterday = np.random.uniform(2, 8)
        productivity_yesterday = np.random.uniform(3, 10)
        day_of_week = np.random.randint(0, 7)  # 0=Monday, 6=Sunday
        has_class_today = np.random.choice([0, 1], p=[0.4, 0.6])
        screen_time = np.random.uniform(2, 10)
        exercise_duration = np.random.uniform(0, 60)
        
        # Calculate best study hour (target variable)
        # Morning person: 7-10 AM, Evening person: 7-10 PM
        is_morning_person = 1 if wakeup_hour <= 7 else 0
        
        if is_morning_person:
            best_hour = np.random.choice([7, 8, 9, 10], p=[0.1, 0.3, 0.4, 0.2])
        else:
            best_hour = np.random.choice([19, 20, 21, 22], p=[0.1, 0.2, 0.4, 0.3])
        
        # Adjust based on productivity
        if productivity_yesterday > 7:
            best_hour += np.random.choice([-1, 0, 1])
        elif productivity_yesterday < 5:
            best_hour += np.random.choice([-2, -1, 0])
        
        best_hour = max(6, min(23, best_hour))  # Clamp between 6-23
        
        data.append({
            'wakeup_hour': wakeup_hour,
            'sleep_hour': sleep_hour,
            'study_hours_yesterday': study_hours_yesterday,
            'productivity_yesterday': productivity_yesterday,
            'day_of_week': day_of_week,
            'has_class_today': has_class_today,
            'screen_time': screen_time,
            'exercise_duration': exercise_duration,
            'best_study_hour': best_hour
        })
    
    return pd.DataFrame(data)

# Generate and prepare data
study_df = generate_study_time_data(12000)
X_study = study_df.drop('best_study_hour', axis=1)
y_study = study_df['best_study_hour']

# Split data
X_train_study, X_test_study, y_train_study, y_test_study = train_test_split(
    X_study, y_study, test_size=0.2, random_state=42
)

# Train model
study_model = GradientBoostingRegressor(
    n_estimators=200,
    max_depth=8,
    learning_rate=0.1,
    random_state=42
)
study_model.fit(X_train_study, y_train_study)

# Evaluate
y_pred_study = study_model.predict(X_test_study)
mse_study = mean_squared_error(y_test_study, y_pred_study)
r2_study = r2_score(y_test_study, y_pred_study)
mae_study = mean_absolute_error(y_test_study, y_pred_study)

print(f"✓ Model trained successfully!")
print(f"  - R² Score: {r2_study:.4f}")
print(f"  - MAE: {mae_study:.4f} hours")
print(f"  - RMSE: {np.sqrt(mse_study):.4f} hours")

# Save model
joblib.dump(study_model, 'backend/models/saved_models/study_time_model.pkl')
print(f"  - Model saved to: backend/models/saved_models/study_time_model.pkl")

# ============================================================================
# MODEL 2: PRODUCTIVITY PREDICTION MODEL
# ============================================================================
print("\n[2/3] Training Productivity Prediction Model...")
print("-" * 60)

def generate_productivity_data(n_samples=12000):
    """Generate dummy dataset for productivity prediction"""
    np.random.seed(42)
    data = []
    
    for i in range(n_samples):
        # Features
        sleep_hours = np.random.uniform(5, 10)
        study_hours = np.random.uniform(1, 8)
        screen_time = np.random.uniform(2, 12)
        exercise_duration = np.random.uniform(0, 90)
        tasks_completed = np.random.randint(0, 10)
        tasks_total = np.random.randint(1, 12)
        completion_rate = tasks_completed / tasks_total if tasks_total > 0 else 0
        streak_days = np.random.randint(0, 30)
        day_of_week = np.random.randint(0, 7)
        stress_level = np.random.uniform(1, 10)  # 1=low, 10=high
        
        # Calculate productivity score (target variable)
        # Base productivity from sleep
        productivity = 5.0
        if 7 <= sleep_hours <= 9:
            productivity += 2.0
        elif sleep_hours < 6:
            productivity -= 1.5
        
        # Add from study hours
        productivity += min(study_hours * 0.3, 2.0)
        
        # Add from completion rate
        productivity += completion_rate * 2.0
        
        # Add from streak
        productivity += min(streak_days * 0.1, 1.0)
        
        # Subtract from screen time (too much is bad)
        if screen_time > 8:
            productivity -= 1.0
        
        # Add from exercise
        if exercise_duration > 30:
            productivity += 0.5
        
        # Subtract from stress
        productivity -= (stress_level - 5) * 0.2
        
        # Add some noise
        productivity += np.random.normal(0, 0.5)
        
        # Clamp between 0-10
        productivity = max(0, min(10, productivity))
        
        data.append({
            'sleep_hours': sleep_hours,
            'study_hours': study_hours,
            'screen_time': screen_time,
            'exercise_duration': exercise_duration,
            'tasks_completed': tasks_completed,
            'tasks_total': tasks_total,
            'completion_rate': completion_rate,
            'streak_days': streak_days,
            'day_of_week': day_of_week,
            'stress_level': stress_level,
            'productivity_score': productivity
        })
    
    return pd.DataFrame(data)

# Generate and prepare data
prod_df = generate_productivity_data(12000)
X_prod = prod_df.drop('productivity_score', axis=1)
y_prod = prod_df['productivity_score']

# Split data
X_train_prod, X_test_prod, y_train_prod, y_test_prod = train_test_split(
    X_prod, y_prod, test_size=0.2, random_state=42
)

# Train model
productivity_model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)
productivity_model.fit(X_train_prod, y_train_prod)

# Evaluate
y_pred_prod = productivity_model.predict(X_test_prod)
mse_prod = mean_squared_error(y_test_prod, y_pred_prod)
r2_prod = r2_score(y_test_prod, y_pred_prod)
mae_prod = mean_absolute_error(y_test_prod, y_pred_prod)

print(f"✓ Model trained successfully!")
print(f"  - R² Score: {r2_prod:.4f}")
print(f"  - MAE: {mae_prod:.4f} points")
print(f"  - RMSE: {np.sqrt(mse_prod):.4f} points")

# Save model
joblib.dump(productivity_model, 'backend/models/saved_models/productivity_model.pkl')
print(f"  - Model saved to: backend/models/saved_models/productivity_model.pkl")

# ============================================================================
# MODEL 3: TASK SCHEDULING MODEL
# ============================================================================
print("\n[3/3] Training Task Scheduling Model...")
print("-" * 60)

def generate_scheduling_data(n_samples=12000):
    """Generate dummy dataset for task scheduling prediction"""
    np.random.seed(42)
    data = []
    
    for i in range(n_samples):
        # Features
        task_priority = np.random.choice([0, 1, 2], p=[0.3, 0.5, 0.2])  # low, medium, high
        task_duration = np.random.uniform(15, 180)  # minutes
        deadline_hours_away = np.random.uniform(1, 72)
        current_hour = np.random.randint(6, 23)
        user_productivity_at_hour = np.random.uniform(3, 10)
        has_class_at_time = np.random.choice([0, 1], p=[0.7, 0.3])
        day_of_week = np.random.randint(0, 7)
        tasks_already_scheduled = np.random.randint(0, 5)
        user_energy_level = np.random.uniform(3, 10)
        
        # Calculate optimal start hour (target variable)
        # High priority tasks should be scheduled earlier
        optimal_hour = current_hour + 1
        
        if task_priority == 2:  # High priority
            optimal_hour = current_hour + np.random.choice([0, 1, 2], p=[0.5, 0.3, 0.2])
        elif task_priority == 1:  # Medium
            optimal_hour = current_hour + np.random.choice([1, 2, 3], p=[0.3, 0.4, 0.3])
        else:  # Low
            optimal_hour = current_hour + np.random.choice([2, 3, 4], p=[0.2, 0.4, 0.4])
        
        # Adjust based on productivity at that hour
        if user_productivity_at_hour > 7:
            optimal_hour -= 1
        elif user_productivity_at_hour < 5:
            optimal_hour += 2
        
        # Adjust based on deadline
        if deadline_hours_away < 6:
            optimal_hour = current_hour + 1
        
        # Adjust based on energy
        if user_energy_level < 5:
            optimal_hour += 2
        
        # Avoid class times
        if has_class_at_time:
            optimal_hour += 2
        
        optimal_hour = max(6, min(22, optimal_hour))  # Clamp between 6-22
        
        data.append({
            'task_priority': task_priority,
            'task_duration': task_duration,
            'deadline_hours_away': deadline_hours_away,
            'current_hour': current_hour,
            'user_productivity_at_hour': user_productivity_at_hour,
            'has_class_at_time': has_class_at_time,
            'day_of_week': day_of_week,
            'tasks_already_scheduled': tasks_already_scheduled,
            'user_energy_level': user_energy_level,
            'optimal_start_hour': optimal_hour
        })
    
    return pd.DataFrame(data)

# Generate and prepare data
schedule_df = generate_scheduling_data(12000)
X_schedule = schedule_df.drop('optimal_start_hour', axis=1)
y_schedule = schedule_df['optimal_start_hour']

# Split data
X_train_schedule, X_test_schedule, y_train_schedule, y_test_schedule = train_test_split(
    X_schedule, y_schedule, test_size=0.2, random_state=42
)

# Train model
scheduling_model = GradientBoostingRegressor(
    n_estimators=250,
    max_depth=10,
    learning_rate=0.08,
    random_state=42
)
scheduling_model.fit(X_train_schedule, y_train_schedule)

# Evaluate
y_pred_schedule = scheduling_model.predict(X_test_schedule)
mse_schedule = mean_squared_error(y_test_schedule, y_pred_schedule)
r2_schedule = r2_score(y_test_schedule, y_pred_schedule)
mae_schedule = mean_absolute_error(y_test_schedule, y_pred_schedule)

print(f"✓ Model trained successfully!")
print(f"  - R² Score: {r2_schedule:.4f}")
print(f"  - MAE: {mae_schedule:.4f} hours")
print(f"  - RMSE: {np.sqrt(mse_schedule):.4f} hours")

# Save model
joblib.dump(scheduling_model, 'backend/models/saved_models/task_scheduling_model.pkl')
print(f"  - Model saved to: backend/models/saved_models/task_scheduling_model.pkl")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 60)
print("Training Complete!")
print("=" * 60)
print("\nAll models have been trained and saved:")
print("  1. Study Time Prediction Model")
print("  2. Productivity Prediction Model")
print("  3. Task Scheduling Model")
print("\nModels are ready for integration into the application!")
print("=" * 60)

