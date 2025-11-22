@echo off
echo ========================================
echo Training FocusFlow ML Models
echo ========================================
echo.

cd backend
python models/train_models.py

echo.
echo ========================================
echo Training Complete!
echo ========================================
pause

