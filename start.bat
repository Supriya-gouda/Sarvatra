@echo off
echo ========================================
echo Starting Smart Disaster Alert System
echo ========================================
echo.
echo Opening 3 terminals...
echo.

REM Start Backend
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak > nul

REM Start AI Service
start "AI Service" cmd /k "cd ai-service && python -m uvicorn main:app --reload --port 8000"
timeout /t 2 /nobreak > nul

REM Start Frontend
start "Frontend" cmd /k "npm run dev"
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Check the 3 new terminal windows:
echo   1. Backend Server - http://localhost:5000
echo   2. AI Service - http://localhost:8000
echo   3. Frontend - http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop services.
echo.
pause
