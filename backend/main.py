from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user, tasks, routine, ai, analytics, notifications, streaks

app = FastAPI(
    title="FocusFlow API",
    description="AI-Based Student Productivity & Routine Optimizer",
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
app.include_router(user.router)
app.include_router(tasks.router)
app.include_router(routine.router)
app.include_router(ai.router)
app.include_router(analytics.router)
app.include_router(notifications.router)
app.include_router(streaks.router)

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

