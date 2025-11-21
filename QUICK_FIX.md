# Quick Fix Guide

## Backend Issues Fixed

### Problem 1: `ModuleNotFoundError: No module named 'bson'`
- **Cause**: `bson` comes from `pymongo`, not a separate package
- **Fix**: The incorrect `bson` package has been removed. `pymongo` includes `bson` automatically.

### Problem 2: `pydantic-core` requires Rust
- **Cause**: Some pydantic versions need Rust to compile
- **Fix**: Use uvicorn directly instead of FastAPI CLI, or install pydantic with pre-built wheels

## Quick Fix Commands

### Backend (Run in PowerShell from `backend` directory):

```powershell
# Option 1: Run the fix script
.\install_fix.ps1

# Option 2: Manual fix
pip uninstall bson -y
python.exe -m pip install --upgrade pip
pip install pymongo==4.6.0
pip install -r requirements.txt
```

**Then run the server:**
```powershell
# Recommended: Use uvicorn directly
uvicorn main:app --reload

# Or use Python directly
python main.py
```

### Frontend (Run in PowerShell from `frontend` directory):

```powershell
# Option 1: Run the fix script
.\install_fix.ps1

# Option 2: Manual fix
npm install --save-dev @types/js-cookie
npm run build
```

## If pydantic still fails:

**Option A**: Use Python 3.11 or 3.12 (better package compatibility)
```powershell
# Create new venv with Python 3.11/3.12
python3.11 -m venv venv
# or
python3.12 -m venv venv
```

**Option B**: Install Rust (if you want to keep Python 3.13)
- Download from: https://rustup.rs/
- Then run: `rustup default stable`

**Option C**: Use uvicorn directly (bypasses FastAPI CLI)
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing

After fixes, test:

**Backend:**
```powershell
cd backend
uvicorn main:app --reload
# Visit http://localhost:8000/docs
```

**Frontend:**
```powershell
cd frontend
npm run dev
# Visit http://localhost:3000
```

