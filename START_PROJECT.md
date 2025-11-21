# How to Start the Project

## Quick Start

### Backend (Terminal 1)

**Option 1: Using PowerShell (Recommended)**
```powershell
cd backend
.\run_server.ps1
```

**Option 2: Using Batch File**
```cmd
cd backend
run_server.bat
```

**Option 3: Manual**
```powershell
cd backend
uvicorn main:app --reload
```

The backend will run on: http://localhost:8000
API docs: http://localhost:8000/docs

### Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

The frontend will run on: http://localhost:3000

## First Time Setup

### Backend
1. Make sure you're in the virtual environment:
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   ```

2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

3. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=focusflow
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

4. Start server:
   ```powershell
   uvicorn main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```powershell
   cd frontend
   npm install
   ```

2. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Start dev server:
   ```powershell
   npm run dev
   ```

## Access the Application

1. Open browser: http://localhost:3000
2. You'll see the splash screen with animated cat
3. Then the home page with website information
4. Click "Get Started" to register or "Login" to sign in

## Troubleshooting

### Backend: "No module named 'bson'"
- Make sure pymongo is installed: `pip install pymongo`
- The code now has fallback imports, so it should work

### Backend: Rust compilation error
- Use `uvicorn main:app --reload` directly (bypasses FastAPI CLI)
- Or use Python 3.11/3.12 instead of 3.13

### Frontend: TypeScript errors
- Run: `npm install --save-dev @types/js-cookie`
- Then: `npm run build`

## Features

✅ Splash screen with animated cat
✅ Beautiful home page
✅ User registration and login
✅ Profile setup
✅ Task management
✅ Routine logging
✅ Analytics dashboard
✅ AI recommendations
✅ Notifications
✅ Streaks tracking

Enjoy using FocusFlow! 🐱

