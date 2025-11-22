# ML Models Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Train All Models
```bash
# Windows
train_all_models.bat

# Linux/Mac
python models/train_models.py
```

This will:
- Generate 12,000+ dummy data samples for each model
- Train 3 ML models (Study Time, Productivity, Task Scheduling)
- Save models to `backend/models/saved_models/`

### 3. Configure Gemini API (Optional)
Add to `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Models Created

1. **Study Time Prediction Model** (`study_time_model.pkl`)
   - Predicts best study hours based on user patterns
   - Uses Gradient Boosting Regressor
   - 12,000 training samples

2. **Productivity Prediction Model** (`productivity_model.pkl`)
   - Predicts productivity scores (0-10)
   - Uses Random Forest Regressor
   - 12,000 training samples

3. **Task Scheduling Model** (`task_scheduling_model.pkl`)
   - Predicts optimal task scheduling times
   - Uses Gradient Boosting Regressor
   - 12,000 training samples

## Model Integration

Models are automatically integrated into:
- `backend/services/task_service.py` - Task scheduling
- `backend/services/ai_recommendation.py` - Study recommendations
- `backend/services/analytics_service.py` - Productivity predictions

## Verification

After training, check that these files exist:
- `backend/models/saved_models/study_time_model.pkl`
- `backend/models/saved_models/productivity_model.pkl`
- `backend/models/saved_models/task_scheduling_model.pkl`

## Troubleshooting

If models fail to load:
- Models will fall back to heuristic-based predictions
- Check that model files exist in `saved_models/` directory
- Verify scikit-learn is installed: `pip install scikit-learn`

## Next Steps

1. Train models: Run `train_models.py`
2. Test predictions: Models are used automatically in the app
3. Monitor performance: Check prediction accuracy in production
4. Retrain periodically: Update models with new user data

