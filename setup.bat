@echo off
echo ========================================
echo Smart Disaster Alert System - Setup
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)
echo Done!
echo.

echo [2/4] Installing AI Service Dependencies...
cd ..\ai-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing AI service dependencies!
    pause
    exit /b 1
)
echo Done!
echo.

echo [3/4] Seeding Database...
cd ..\backend
node scripts\seedData.js
if %errorlevel% neq 0 (
    echo Warning: Database seeding had issues. Check if schema is created in Supabase.
)
echo Done!
echo.

echo [4/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Make sure you ran supabase-schema.sql in Supabase
echo 2. Created 'disaster-images' storage bucket
echo.
echo To start the system, run:
echo   - Terminal 1: cd backend ^&^& npm run dev
echo   - Terminal 2: cd ai-service ^&^& python -m uvicorn main:app --reload --port 8000
echo   - Terminal 3: npm run dev (in root folder)
echo.
echo ========================================
echo.
pause
