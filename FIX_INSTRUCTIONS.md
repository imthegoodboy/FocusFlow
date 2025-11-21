# Fix Instructions

## Backend Fix

Run these commands in PowerShell (in the backend directory):

```powershell
# 1. Uninstall the incorrect bson package
pip uninstall bson -y

# 2. Upgrade pip
python.exe -m pip install --upgrade pip

# 3. Install dependencies (this will install pymongo which includes bson)
pip install -r requirements.txt

# 4. If pydantic-core still fails, try installing it separately with a pre-built wheel
pip install pydantic pydantic-settings --upgrade

# 5. Run the server using uvicorn directly (recommended)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Note**: If you still get Rust errors, you can:
- Use Python 3.11 or 3.12 instead of 3.13 (better compatibility)
- Or install Rust from https://rustup.rs/

## Frontend Fix

Run these commands in PowerShell (in the frontend directory):

```powershell
# Install TypeScript types for js-cookie
npm install --save-dev @types/js-cookie

# Rebuild
npm run build
```

## Alternative: Use uvicorn directly

If `fastapi dev` doesn't work, always use:
```powershell
cd backend
uvicorn main:app --reload
```

This bypasses the FastAPI CLI and directly runs uvicorn.

