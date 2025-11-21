Write-Host "Starting FocusFlow Backend Server..." -ForegroundColor Green
cd $PSScriptRoot
uvicorn main:app --reload --host 0.0.0.0 --port 8000

