"""Test script to verify all imports work correctly"""
try:
    print("Testing imports...")
    
    # Test bson import
    try:
        from bson import ObjectId
        print("[OK] bson.ObjectId imported successfully")
    except ImportError:
        try:
            from pymongo import ObjectId
            print("[OK] pymongo.ObjectId imported successfully (fallback)")
        except ImportError:
            print("[FAIL] Failed to import ObjectId")
    
    # Test main app
    try:
        from main import app
        print("[OK] FastAPI app imported successfully")
    except Exception as e:
        print(f"[FAIL] Failed to import app: {e}")
    
    # Test routers
    try:
        from routers import auth, user, tasks, routine, ai, analytics, notifications, streaks
        print("[OK] All routers imported successfully")
    except Exception as e:
        print(f"[FAIL] Failed to import routers: {e}")
    
    print("\n[SUCCESS] All imports successful! You can run the server with: uvicorn main:app --reload")
    
except Exception as e:
    print(f"[ERROR] Error: {e}")

