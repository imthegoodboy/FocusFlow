# Troubleshooting Guide

## Backend Issues

### Issue: `ModuleNotFoundError: No module named 'bson'`

**Problem**: The `bson` module should come from `pymongo`, not a separate package.

**Solution**:
1. Uninstall the incorrect `bson` package:
   ```bash
   pip uninstall bson -y
   ```

2. Make sure `pymongo` is installed (it includes `bson`):
   ```bash
   pip install pymongo==4.6.0
   ```

3. The import `from bson import ObjectId` will work once `pymongo` is correctly installed.

### Issue: `pydantic-core` requires Rust to compile

**Problem**: `pydantic-core==2.14.1` requires Rust compiler which may not be installed.

**Solutions**:

**Option 1 (Recommended)**: Use pre-built wheels by upgrading pip and using compatible versions:
```bash
pip install --upgrade pip
pip install pydantic>=2.5.0 pydantic-settings>=2.1.0
```

**Option 2**: If Option 1 doesn't work, install Rust:
- Windows: Download from https://rustup.rs/
- Or use Python 3.11 or 3.12 instead of 3.13 (better package compatibility)

**Option 3**: Use uvicorn directly instead of fastapi CLI:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Running the Backend

After fixing dependencies, run:
```bash
cd backend
uvicorn main:app --reload
```

Or if using FastAPI CLI:
```bash
fastapi dev main.py
```

## Frontend Issues

### Issue: TypeScript error for `js-cookie`

**Problem**: Missing TypeScript type definitions.

**Solution**:
```bash
cd frontend
npm install --save-dev @types/js-cookie
```

Then rebuild:
```bash
npm run build
```

## Quick Fix Commands

### Backend
```bash
cd backend
pip uninstall bson -y
pip install --upgrade pip
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install --save-dev @types/js-cookie
npm run build
```

