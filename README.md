# FocusFlow - AI-Based Student Productivity & Routine Optimizer

A full-stack application that helps students track their daily routines, manage tasks, and optimize their productivity using AI-powered recommendations.

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js 14  
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Features

### Core Features
- ✅ Student registration and authentication
- ✅ Profile setup with goals, exam dates, and study targets
- ✅ Comprehensive routine survey
- ✅ Task management with priority sorting and conflict detection
- ✅ Daily routine logging
- ✅ AI-powered productivity recommendations
- ✅ Analytics dashboard with charts
- ✅ Smart notifications and alerts
- ✅ Streaks tracking

### AI Features
- Pattern-based productivity analysis
- Optimal study time recommendations
- Break scheduling suggestions
- Sleep-performance correlation
- Low productivity period detection

## Project Structure

```
FocusFlow/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration settings
│   ├── database.py            # MongoDB connection
│   ├── auth.py                # Authentication utilities
│   ├── models/                # Data models
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── routine.py
│   │   └── ai_model.py        # AI model input/output structures
│   ├── routers/               # API routes
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── tasks.py
│   │   ├── routine.py
│   │   ├── ai.py
│   │   ├── analytics.py
│   │   ├── notifications.py
│   │   └── streaks.py
│   └── services/              # Business logic
│       ├── task_service.py
│       ├── routine_service.py
│       ├── ai_recommendation.py
│       ├── analytics_service.py
│       ├── notification_service.py
│       ├── streak_service.py
│       └── scheduler.py
└── frontend/
    ├── app/                   # Next.js app directory
    │   ├── page.tsx
    │   ├── login/
    │   ├── register/
    │   ├── profile-setup/
    │   └── dashboard/
    ├── components/            # React components
    │   ├── DashboardLayout.tsx
    │   ├── TasksSection.tsx
    │   ├── RoutineSection.tsx
    │   ├── AnalyticsSection.tsx
    │   ├── NotificationsPanel.tsx
    │   ├── StreaksDisplay.tsx
    │   └── AIRecommendations.tsx
    └── lib/                   # Utilities
        ├── api.ts
        └── auth.ts
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=focusflow
SECRET_KEY=your-secret-key-here
```

6. Run the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### User Flow

1. **Registration**: Create an account with email and password
2. **Profile Setup**: Add goals, exam dates, and semester plans
3. **Survey**: Complete routine survey (wakeup time, sleep time, study hours, etc.)
4. **Dashboard**: Access the main dashboard with:
   - Task management
   - Routine logging
   - Analytics
   - AI recommendations
   - Notifications
   - Streaks

### Key Features

#### Task Management
- Create tasks with name, duration, deadline, priority, and category
- Automatic priority sorting (high > medium > low)
- Conflict detection for overlapping schedules
- Auto-scheduling based on productive hours

#### Routine Logging
- Log daily activities (wakeup, sleep, study, exercise, etc.)
- Track productivity scores
- Detect missing entries

#### AI Recommendations
- Productive hours analysis
- Study time suggestions
- Break recommendations
- Sleep-performance insights

#### Analytics
- Daily/weekly productivity charts
- Task completion statistics
- Focus hours analysis
- Sleep-performance correlation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/survey` - Update survey

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Routine
- `GET /api/routine` - Get routine logs
- `POST /api/routine` - Create routine log
- `PUT /api/routine/{id}` - Update routine log
- `GET /api/routine/today` - Get today's log

### AI
- `GET /api/ai/productive-hours` - Get productive hours
- `GET /api/ai/recommendations` - Get recommendations
- `GET /api/ai/task-suggestions` - Get task suggestions

### Analytics
- `GET /api/analytics/daily-productivity` - Daily productivity data
- `GET /api/analytics/weekly-productivity` - Weekly productivity data
- `GET /api/analytics/task-statistics` - Task statistics
- `GET /api/analytics/focus-hours` - Focus hours analysis

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/check` - Check for new notifications

### Streaks
- `GET /api/streaks` - Get streak data
- `POST /api/streaks/update` - Update streaks

## AI Model

The AI model structure is defined in `backend/models/ai_model.py`. Currently, it uses dummy/hardcoded logic. You can replace the functions with your trained ML model:

- `predict_productivity()` - Predict productivity for time slots
- `recommend_task_time()` - Recommend task scheduling
- `optimize_routine()` - Optimize daily routine
- `detect_patterns()` - Detect behavioral patterns

## Color Scheme

- Primary: Dark Orange (`#f97316`, `#ea580c`)
- Background: White
- Accent: Gray shades

## Development

### Backend Development
- FastAPI with automatic API documentation
- MongoDB for data persistence
- JWT authentication
- CORS enabled for frontend

### Frontend Development
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for forms
- Recharts for data visualization

## Production Deployment

1. Set environment variables for production
2. Use a production MongoDB instance
3. Set secure SECRET_KEY
4. Build frontend: `npm run build`
5. Use a production server (e.g., Gunicorn for FastAPI)
 

This project is created for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!

