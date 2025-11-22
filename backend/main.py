import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import auth, tasks, routine, analytics, notifications, streaks, student, support, achievements

os.makedirs(os.path.join("uploads", "avatars"), exist_ok=True)

app = FastAPI(
    title="FocusFlow API",
    description="Student Productivity & Routine Optimizer",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(routine.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(streaks.router)
app.include_router(student.router)
app.include_router(support.router)
app.include_router(achievements.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "FocusFlow API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

