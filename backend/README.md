# FocusFlow Backend API

FastAPI backend for the FocusFlow student productivity application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=focusflow
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

3. Run the server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

- `main.py` - FastAPI application entry point
- `config.py` - Configuration settings
- `database.py` - MongoDB connection and collections
- `auth.py` - Authentication and JWT utilities
- `models/` - Pydantic models for data validation
- `routers/` - API route handlers
- `services/` - Business logic and service functions

## Key Features

- JWT-based authentication
- MongoDB data persistence
- Task management with conflict detection
- Routine logging
- AI recommendations (dummy logic, ready for ML model)
- Analytics and reporting
- Notifications system
- Streaks tracking

