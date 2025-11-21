# Quick Start Guide

## Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed
- MongoDB running (local or MongoDB Atlas)

## Step 1: Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=focusflow
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Start backend:
```bash
uvicorn main:app --reload
```

Backend runs on http://localhost:8000

## Step 2: Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Step 3: First Use

1. Open http://localhost:3000
2. Click "Register" to create an account
3. Complete profile setup:
   - Add goals and exam dates
   - Complete routine survey
4. You'll be redirected to the dashboard
5. Start adding tasks and logging your routine!

## Testing the API

Visit http://localhost:8000/docs for interactive API documentation.

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in backend/.env

### Frontend Can't Connect to Backend
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Check CORS settings in backend/main.py

### Import Errors
- Make sure all dependencies are installed
- Activate virtual environment for backend
- Run `npm install` in frontend directory

