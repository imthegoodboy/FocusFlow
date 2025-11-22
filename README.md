# 🎯 FocusFlow - AI-Powered Student Productivity Optimizer

<div align="center">

# 🎯 FocusFlow

<div style="font-size: 48px; margin: 20px 0;">⚡📚🎯</div>

**An intelligent productivity system that helps students optimize their daily routines using AI and machine learning**

[![Demo Video](https://img.shields.io/badge/📹-Watch%20Demo-red)](https://youtu.be/xeOttl1d2bo?si=M5XENojZ4u8pFSQj)
[![Model Training](https://img.shields.io/badge/🤖-Model%20Training-blue)](https://colab.research.google.com/drive/1AVepXQp2d71g0zdHJRLHtJ7SU8KW5DJa?usp=sharing)
[![Tech Stack](https://img.shields.io/badge/Tech-FastAPI%20%2B%20Next.js-blue)]()

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [AI/ML Models](#aiml-models)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Scheduling Logic](#scheduling-logic)
- [Application Flow](#application-flow)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Demo Video](#demo-video)
- [Model Training](#model-training)

---

## 🎯 Overview

FocusFlow is a comprehensive student productivity platform that uses **artificial intelligence** and **machine learning** to help students:
- 📅 Plan their day intelligently
- ⏰ Find their best study hours
- 📊 Track productivity patterns
- 🎯 Complete tasks efficiently
- 🔥 Build consistent study streaks

The system analyzes student behavior patterns and provides personalized recommendations to maximize productivity and academic performance.

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure registration and login
- ✅ **Profile Management** - Student profiles with goals and preferences
- ✅ **Task Management** - Create, schedule, and track tasks with AI-powered scheduling
- ✅ **Daily Planning** - AI generates optimal daily schedules
- ✅ **Routine Tracking** - Log daily activities (sleep, study, exercise)
- ✅ **Productivity Scoring** - Real-time productivity scores (0-10)
- ✅ **Analytics Dashboard** - Comprehensive charts and insights
- ✅ **Streak Tracking** - Visual streak counter with fire animation
- ✅ **Smart Notifications** - Context-aware alerts and reminders

### AI-Powered Features
- 🤖 **ML-Based Task Scheduling** - Optimal task timing predictions
- 🧠 **Study Time Prediction** - Best study hours based on patterns
- 📈 **Productivity Forecasting** - Predict productivity scores
- 💬 **Personalized Explanations** - AI-generated scheduling reasons
- 🎯 **Smart Recommendations** - Context-aware study suggestions

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **ML Framework**: scikit-learn, BentoML
- **NLP**: Google Gemini API

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Lottie

### AI/ML
- **Local Models**: scikit-learn (Gradient Boosting, Random Forest)
- **Hosted Model**: BentoML (Productivity Prediction)
- **NLP**: Google Gemini API

---

## 🤖 AI/ML Models

FocusFlow uses **3 trained machine learning models** for intelligent predictions:

### 1. Study Time Prediction Model
- **Location**: Local (`backend/models/saved_models/study_time_model.pkl`)
- **Algorithm**: Gradient Boosting Regressor
- **Purpose**: Predicts the best study hour for students
- **Input**: Wake time, sleep time, study patterns, productivity history
- **Output**: Optimal study hour (6-23) with confidence score
- **Training**: 12,000+ samples
- **Performance**: R² > 0.85, MAE < 1.5 hours

### 2. Task Scheduling Model
- **Location**: Local (`backend/models/saved_models/task_scheduling_model.pkl`)
- **Algorithm**: Gradient Boosting Regressor
- **Purpose**: Predicts optimal task scheduling times
- **Input**: Task priority, duration, deadline, user productivity, energy levels
- **Output**: Optimal scheduling hour (6-22) with confidence
- **Training**: 12,000+ samples
- **Performance**: R² > 0.83, MAE < 1.2 hours

### 3. Productivity Prediction Model
- **Location**: **BentoML Hosted** (due to large model size)
- **Algorithm**: Random Forest Regressor
- **Purpose**: Predicts student productivity scores (0-10)
- **Input**: Sleep, study hours, screen time, exercise, task completion, streaks
- **Output**: Productivity score (0-10) with confidence
- **Training**: 12,000+ samples
- **Performance**: R² > 0.88, MAE < 0.8 points
- **Connection**: HTTP API to BentoML service

### NLP: Google Gemini API
- **Purpose**: Natural language processing for personalized explanations
- **Features**:
  - Generates personalized task scheduling explanations
  - Creates motivational messages based on progress
  - Analyzes task descriptions
- **Configuration**: Add `GEMINI_API_KEY` to `.env` file

### Model Training
- **Training Notebook**: [Google Colab](https://colab.research.google.com/drive/1AVepXQp2d71g0zdHJRLHtJ7SU8KW5DJa?usp=sharing)
- **Training Data**: 12,000+ synthetic samples per model
- **Training Method**: Supervised learning with scikit-learn

---

## 📁 Project Structure

```
FocusFlow/
├── backend/
│   ├── main.py                    # FastAPI application entry
│   ├── config.py                  # Configuration & environment
│   ├── database.py                # MongoDB connection
│   ├── auth.py                    # JWT authentication
│   ├── models/                    # Data models & ML models
│   │   ├── user.py                # User model
│   │   ├── student.py             # Student profile model
│   │   ├── task.py                # Task model
│   │   ├── routine.py              # Routine log model
│   │   ├── ml_models.py           # ML model inference
│   │   ├── saved_models/          # Trained model files
│   │   │   ├── study_time_model.pkl
│   │   │   └── task_scheduling_model.pkl
│   │   └── README_MODELS.md       # Model documentation
│   ├── routers/                   # API route handlers
│   │   ├── auth.py                # Authentication routes
│   │   ├── user.py                # User routes
│   │   ├── tasks.py               # Task routes
│   │   ├── routine.py              # Routine routes
│   │   ├── ai.py                  # AI recommendation routes
│   │   ├── analytics.py           # Analytics routes
│   │   ├── notifications.py       # Notification routes
│   │   └── streaks.py              # Streak routes
│   └── services/                   # Business logic
│       ├── task_service.py        # Task scheduling (uses ML)
│       ├── routine_service.py    # Routine logging
│       ├── ai_recommendation.py   # AI recommendations (uses ML)
│       ├── analytics_service.py   # Analytics (uses ML)
│       ├── gemini_service.py      # Gemini NLP integration
│       ├── bentoml_client.py      # BentoML client
│       ├── scheduler.py           # Conflict detection
│       ├── streak_service.py      # Streak calculations
│       └── notification_service.py # Notifications
└── frontend/
    ├── app/                       # Next.js app directory
    │   ├── page.tsx               # Home page
    │   ├── login/                 # Login page
    │   ├── register/              # Registration page
    │   ├── dashboard/             # Main dashboard
    │   ├── plan/                  # Task planning page
    │   ├── analytics/             # Analytics page
    │   └── onboarding/            # Profile setup
    ├── components/                # React components
    │   ├── DashboardLayout.tsx    # Dashboard layout
    │   ├── TodayTasksList.tsx     # Task list with completion
    │   ├── FocusTimer.tsx         # Circular timer
    │   ├── StreaksDisplay.tsx     # Streak counter
    │   ├── QuickStats.tsx         # Quick statistics
    │   ├── MotivationalQuote.tsx  # Daily quotes
    │   └── AnalyticsSection.tsx   # Analytics charts
    └── lib/                       # Utilities
        ├── api.ts                 # API client
        └── auth.ts                # Auth utilities
```

---

## 🗄️ Database Schema

FocusFlow uses **MongoDB** with the following collections:

### 1. `users` Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  hashed_password: String,
  is_active: Boolean,
  created_at: DateTime
}
```

### 2. `students` Collection
```javascript
{
  _id: ObjectId,
  user_id: String (references users),
  name: String,
  age: Number,
  class_name: String,
  school_name: String,
  avatar_emoji: String,
  avatar_url: String,
  survey: {
    wakeup_time: String,        // "07:00"
    sleep_time: String,          // "22:00"
    study_hours: Number,
    screen_time: Number,
    exercise_duration: Number,
    preferred_break_length: Number,
    class_schedule: [{
      day: String,               // "Monday"
      start: String,             // "09:00"
      end: String                // "10:30"
    }]
  },
  created_at: DateTime,
  updated_at: DateTime
}
```

### 3. `tasks` Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  name: String,
  duration: Number,              // minutes
  deadline: DateTime,
  priority: String,               // "low", "medium", "high"
  category: String,               // "Study", "Health", etc.
  status: String,                 // "pending", "completed", "cancelled"
  scheduled_start: DateTime,      // ML-predicted time
  scheduled_end: DateTime,
  plan_reason: String,            // AI-generated explanation
  sequence: Number,               // Order in daily plan
  is_today_plan: Boolean,
  created_at: DateTime,
  updated_at: DateTime,
  completed_at: DateTime
}
```

### 4. `routine_logs` Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  date: Date,
  wakeup_time: String,
  sleep_time: String,
  study_hours: Number,
  screen_time: Number,
  exercise_duration: Number,
  productivity_score: Number,     // 0-10
  breaks: [{
    start: String,
    end: String,
    type: String
  }],
  class_timings: [{
    start: String,
    end: String,
    subject: String
  }],
  notes: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

### 5. `streaks` Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  study_streak: Number,
  task_streak: Number,
  logging_streak: Number,
  overall_streak: Number,
  last_updated: Date
}
```

### 6. `notifications` Collection
```javascript
{
  _id: ObjectId,
  user_id: String,
  message: String,
  type: String,                   // "task", "break", "deadline"
  read: Boolean,
  created_at: DateTime
}
```

---

## ⚙️ Scheduling Logic

### Task Scheduling Flow

1. **User Input**: User adds tasks with name, duration, and priority
2. **Data Collection**: System gathers user's historical data:
   - Past 30 days of routine logs
   - Average productivity scores
   - Study patterns
   - Class schedule
3. **ML Prediction**: 
   - **Study Time Model** predicts best study hour
   - **Task Scheduling Model** predicts optimal time for each task
4. **Conflict Detection**: Checks for:
   - Class schedule conflicts
   - Overlapping tasks
   - Time constraints (wake/sleep times)
5. **Optimization**: Adjusts schedule to:
   - Avoid conflicts
   - Respect user preferences
   - Maximize productivity
6. **AI Explanation**: **Gemini API** generates personalized reason for each scheduled task
7. **Schedule Display**: User sees optimized schedule with AI explanations

### Priority Sorting
- **High Priority**: Scheduled first, during peak hours
- **Medium Priority**: Scheduled after high-priority tasks
- **Low Priority**: Scheduled last, flexible timing

### Conflict Resolution
- Tasks cannot overlap
- Must respect class schedules
- Must fit within wake/sleep window
- Auto-adjusts if conflicts detected

---

## 🔄 Application Flow

```
┌─────────────────┐
│   User Login    │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│  Profile Setup   │
│  (Survey Data)   │
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│   Dashboard     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ Add    │ │ View     │
│ Tasks  │ │ Analytics│
└───┬────┘ └────┬─────┘
    │           │
    ▼           ▼
┌─────────────────────┐
│  Plan My Day        │
│  (AI Scheduling)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ML Models Predict  │
│  - Study Time       │
│  - Task Scheduling  │
│  - Productivity     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Gemini API         │
│  Generates Reasons  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Optimized Schedule │
│  Displayed to User  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User Completes      │
│  Tasks & Logs Data  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analytics Updated  │
│  Streaks Updated    │
└─────────────────────┘
```

### Detailed Flow

1. **Registration/Login** → User creates account
2. **Onboarding** → User fills profile and survey
3. **Dashboard** → User sees productivity score, streaks, quick stats
4. **Add Tasks** → User clicks "Add Daily Tasks"
5. **Task Entry** → User enters up to 5 tasks (name, duration, priority)
6. **AI Planning** → User clicks "Plan My Day"
   - System loads user's historical data
   - **ML Models** predict optimal scheduling
   - **Gemini API** generates explanations
7. **Schedule Review** → User sees AI-generated schedule with reasons
8. **Schedule Confirmation** → User confirms or edits schedule
9. **Task Execution** → User completes tasks, marks Yes/No
10. **Real-time Updates** → Productivity score updates, streaks update
11. **Analytics** → User views charts and insights

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or cloud)
- BentoML service running (for productivity model)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=focusflow
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your_gemini_api_key_here
BENTOML_ENDPOINT=http://your-bentoml-service:3000/predict
```

5. **Run backend server:**
```bash
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run development server:**
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`

### Model Setup

1. **Local Models**: Already included in `backend/models/saved_models/`
   - `study_time_model.pkl`
   - `task_scheduling_model.pkl`

2. **BentoML Model**: 
   - Ensure BentoML service is running
   - Update `BENTOML_ENDPOINT` in `.env`
   - Model will be called via HTTP API

3. **Gemini API** (Optional):
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `.env` as `GEMINI_API_KEY`
   - Falls back to templates if unavailable

---

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/plan-preview` - Preview AI-generated plan
- `POST /api/tasks/plan-day` - Confirm daily plan

### Analytics
- `GET /api/analytics/daily-productivity` - Daily productivity data
- `GET /api/analytics/weekly-productivity` - Weekly productivity data
- `GET /api/analytics/task-statistics` - Task statistics
- `GET /api/analytics/focus-hours` - Focus hours analysis
- `GET /api/analytics/task-comparison` - Week comparison
- `GET /api/analytics/productivity-trends` - Productivity trends

### AI Recommendations
- `GET /api/ai/productive-hours` - Get productive hours (ML-based)
- `GET /api/ai/recommendations` - Get study recommendations
- `GET /api/ai/task-suggestions` - Get task suggestions

### Streaks
- `GET /api/streaks` - Get streak data

Full API documentation available at: `http://localhost:8000/docs`

---

## 🎥 Demo Video

**Watch the complete demo:** [YouTube Video](https://youtu.be/xeOttl1d2bo?si=M5XENojZ4u8pFSQj)

The demo showcases:
- User registration and onboarding
- Task creation and AI-powered scheduling
- Real-time productivity tracking
- Analytics dashboard
- Streak tracking
- All features working end-to-end

---

## 🤖 Model Training

**Training Notebook:** [Google Colab](https://colab.research.google.com/drive/1AVepXQp2d71g0zdHJRLHtJ7SU8KW5DJa?usp=sharing)

### Models Trained:
1. **Study Time Prediction** - 12,000+ samples
2. **Task Scheduling** - 12,000+ samples  
3. **Productivity Prediction** - 12,000+ samples (hosted on BentoML)

### Training Process:
- Synthetic data generation
- Feature engineering
- Model training with scikit-learn
- Model evaluation and validation
- Model deployment (local + BentoML)

---

## 🎯 Key Features Explained

### 1. AI-Powered Task Scheduling
- Uses **Task Scheduling ML Model** to predict optimal times
- Considers user's productivity patterns
- Avoids conflicts with classes
- Generates personalized explanations via Gemini API

### 2. Productivity Scoring
- Real-time productivity score (0-10)
- Uses **Productivity Prediction Model** (BentoML)
- Updates as tasks are completed
- Shows 10/10 celebration when all tasks done

### 3. Study Time Recommendations
- Uses **Study Time Prediction Model**
- Analyzes past 30 days of data
- Predicts best study hours
- Personalized to each user

### 4. Smart Analytics
- Daily/weekly productivity charts
- Task completion statistics
- Focus hours analysis
- Week-over-week comparisons
- Productivity trends

### 5. Streak Tracking
- Visual streak counter with fire animation
- Tracks study days, task days, routine days
- Motivates consistency

---

## 🔧 Configuration

### Environment Variables

**Backend (`.env`):**
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=focusflow
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your_gemini_key
BENTOML_ENDPOINT=http://localhost:3000/predict
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📊 Performance Metrics

- **Task Scheduling Accuracy**: 83%+ (R² score)
- **Study Time Prediction**: 85%+ (R² score)
- **Productivity Prediction**: 88%+ (R² score)
- **API Response Time**: < 200ms
- **Model Inference Time**: < 50ms (local), < 500ms (BentoML)

---

## 🏆 Hackathon Features

FocusFlow includes several features that make it hackathon-ready:

1. **Complete AI/ML Integration** - 3 trained models + NLP
2. **Production-Ready Code** - Error handling, fallbacks, validation
3. **Beautiful UI/UX** - Modern design, animations, responsive
4. **Real-time Updates** - Live productivity scores, streak tracking
5. **Comprehensive Analytics** - Multiple charts and insights
6. **Motivational Elements** - Quotes, celebrations, streak fire
7. **Full Documentation** - README, API docs, model docs
8. **Demo Video** - Complete walkthrough
9. **Model Training Proof** - Colab notebook link

---

## 🐛 Troubleshooting

### Models not loading?
- Check model files exist in `backend/models/saved_models/`
- System falls back to heuristics automatically

### BentoML connection failed?
- Verify BentoML service is running
- Check `BENTOML_ENDPOINT` in `.env`
- System falls back to local model or heuristics

### Gemini API errors?
- API key is optional
- System uses template-based explanations if unavailable

### MongoDB connection issues?
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`

---

## 📝 License

This project is created for educational and hackathon purposes.

---

## 👥 Contributing

Feel free to submit issues and enhancement requests!

---

## 🙏 Acknowledgments

- **Google Gemini** for NLP capabilities
- **BentoML** for model serving
- **scikit-learn** for ML models
- **FastAPI** and **Next.js** communities

---

<div align="center">

**Built with ❤️ for students who want to maximize their productivity**

[Watch Demo](https://youtu.be/xeOttl1d2bo?si=M5XENojZ4u8pFSQj) • [View Models](https://colab.research.google.com/drive/1AVepXQp2d71g0zdHJRLHtJ7SU8KW5DJa?usp=sharing)

</div>
