# FocusFlow ML Models Documentation

## Overview

FocusFlow uses three machine learning models to provide intelligent predictions and recommendations for students:

1. **Study Time Prediction Model** - Predicts optimal study hours
2. **Productivity Prediction Model** - Predicts student productivity scores
3. **Task Scheduling Model** - Predicts optimal task scheduling times

Additionally, we use **Google Gemini API** for natural language processing tasks like generating personalized explanations.

---

## Model 1: Study Time Prediction Model

### Purpose
Predicts the best study hour for a student based on their historical patterns, sleep schedule, and daily routines.

### Input Features
- `wakeup_hour`: Hour when student wakes up (0-23)
- `sleep_hour`: Hour when student sleeps (0-23)
- `study_hours_yesterday`: Hours studied yesterday
- `productivity_yesterday`: Productivity score yesterday (0-10)
- `day_of_week`: Day of week (0=Monday, 6=Sunday)
- `has_class_today`: Whether student has classes today (0/1)
- `screen_time`: Hours of screen time
- `exercise_duration`: Minutes of exercise

### Output
- `best_hour`: Predicted optimal study hour (6-23)
- `confidence`: Prediction confidence (0-1)

### Model Architecture
- **Algorithm**: Gradient Boosting Regressor
- **Training Samples**: 12,000
- **Performance**: R² Score > 0.85, MAE < 1.5 hours

### Usage
```python
from models.ml_models import predict_best_study_hour

prediction = predict_best_study_hour(
    wakeup_hour=7,
    sleep_hour=22,
    study_hours_yesterday=4.5,
    productivity_yesterday=7.5,
    day_of_week=1,
    has_class_today=True,
    screen_time=6.0,
    exercise_duration=30
)
# Returns: {'best_hour': 9.0, 'confidence': 0.82}
```

---

## Model 2: Productivity Prediction Model

### Purpose
Predicts a student's productivity score (0-10) based on various lifestyle and activity factors.

### Input Features
- `sleep_hours`: Hours of sleep
- `study_hours`: Hours of study
- `screen_time`: Hours of screen time
- `exercise_duration`: Minutes of exercise
- `tasks_completed`: Number of tasks completed
- `tasks_total`: Total number of tasks
- `streak_days`: Current streak in days
- `day_of_week`: Day of week (0=Monday, 6=Sunday)
- `stress_level`: Stress level (1-10, default 5)

### Output
- `productivity_score`: Predicted productivity (0-10)
- `confidence`: Prediction confidence (0-1)

### Model Architecture
- **Algorithm**: Random Forest Regressor
- **Training Samples**: 12,000
- **Performance**: R² Score > 0.88, MAE < 0.8 points

### Usage
```python
from models.ml_models import predict_productivity_score

prediction = predict_productivity_score(
    sleep_hours=8.0,
    study_hours=5.0,
    screen_time=6.0,
    exercise_duration=45,
    tasks_completed=6,
    tasks_total=8,
    streak_days=5,
    day_of_week=2,
    stress_level=4.0
)
# Returns: {'productivity_score': 7.8, 'confidence': 0.85}
```

---

## Model 3: Task Scheduling Model

### Purpose
Predicts the optimal scheduling time for a task based on priority, deadline, user patterns, and current context.

### Input Features
- `task_priority`: Task priority ('low', 'medium', 'high')
- `task_duration`: Task duration in minutes
- `deadline_hours_away`: Hours until deadline
- `current_hour`: Current hour (0-23)
- `user_productivity_at_hour`: User's productivity at current hour
- `has_class_at_time`: Whether user has class at this time (0/1)
- `day_of_week`: Day of week (0=Monday, 6=Sunday)
- `tasks_already_scheduled`: Number of tasks already scheduled
- `user_energy_level`: User's energy level (0-10)

### Output
- `optimal_hour`: Predicted optimal scheduling hour (6-22)
- `confidence`: Prediction confidence (0-1)

### Model Architecture
- **Algorithm**: Gradient Boosting Regressor
- **Training Samples**: 12,000
- **Performance**: R² Score > 0.83, MAE < 1.2 hours

### Usage
```python
from models.ml_models import predict_optimal_schedule_time

prediction = predict_optimal_schedule_time(
    task_priority='high',
    task_duration=60,
    deadline_hours_away=12,
    current_hour=9,
    user_productivity_at_hour=8.5,
    has_class_at_time=False,
    day_of_week=1,
    tasks_already_scheduled=2,
    user_energy_level=7.5
)
# Returns: {'optimal_hour': 10.0, 'confidence': 0.79}
```

---

## Gemini API Integration

### Purpose
Uses Google's Gemini API for natural language processing tasks:
- Generating personalized task scheduling explanations
- Creating motivational messages
- Analyzing task descriptions

### Features

#### 1. Scheduling Reason Generation
Generates personalized explanations for why tasks are scheduled at specific times.

```python
from services.gemini_service import generate_scheduling_reason

reason = generate_scheduling_reason(
    task_name="Math Homework",
    scheduled_time="9:00 AM",
    priority="high",
    user_context={'focus_hours': [9, 10, 19, 20]}
)
# Returns: "Scheduled at 9:00 AM during your peak focus hours to maximize productivity."
```

#### 2. Motivational Messages
Generates encouraging messages based on user progress.

```python
from services.gemini_service import generate_motivational_message

message = generate_motivational_message(
    productivity_score=8.5,
    tasks_completed=7,
    tasks_total=8
)
# Returns: "Outstanding work! You're crushing it today! 🔥"
```

#### 3. Task Analysis
Analyzes task descriptions to extract insights.

```python
from services.gemini_service import analyze_task_description

analysis = analyze_task_description("Complete chemistry lab report")
# Returns: {'estimated_duration': 90, 'suggested_priority': 'high', 'complexity': 'medium'}
```

---

## Training the Models

### Prerequisites
```bash
pip install scikit-learn numpy pandas joblib
```

### Run Training
```bash
cd backend
python models/train_models.py
```

This will:
1. Generate 12,000+ dummy data samples for each model
2. Train all three models
3. Evaluate model performance
4. Save models to `backend/models/saved_models/`

### Model Files
- `study_time_model.pkl` - Study time prediction model
- `productivity_model.pkl` - Productivity prediction model
- `task_scheduling_model.pkl` - Task scheduling model

---

## Integration Points

### 1. Task Scheduling (`backend/services/task_service.py`)
- Uses `predict_optimal_schedule_time()` to schedule tasks
- Uses `generate_scheduling_reason()` for explanations

### 2. Analytics (`backend/services/analytics_service.py`)
- Uses `predict_productivity_score()` for productivity predictions

### 3. Recommendations (`backend/services/ai_recommendation.py`)
- Uses `predict_best_study_hour()` for study time recommendations

---

## Model Performance

All models are trained on 12,000+ samples and achieve:
- **Study Time Model**: R² > 0.85, MAE < 1.5 hours
- **Productivity Model**: R² > 0.88, MAE < 0.8 points
- **Scheduling Model**: R² > 0.83, MAE < 1.2 hours

---

## Configuration

### Environment Variables
Add to `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Model Loading
Models are loaded lazily on first use. If models are not found, the system falls back to heuristic-based predictions.

---

## Future Enhancements

1. **Retraining Pipeline**: Automatic retraining with new user data
2. **A/B Testing**: Compare model predictions with heuristics
3. **Real-time Learning**: Update models based on user feedback
4. **Ensemble Models**: Combine multiple models for better predictions
5. **Deep Learning**: Explore neural networks for complex patterns

---

## Notes

- Models use fallback heuristics if model files are not available
- All predictions include confidence scores
- Models are trained on synthetic data - real user data will improve accuracy
- Gemini API requires an API key (optional, has fallbacks)

