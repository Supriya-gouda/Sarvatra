@echo off
echo ========================================
echo Smart Disaster Alert - Complete Setup
echo ========================================
echo.

echo This script will:
echo   1. Check if Node.js and Python are installed
echo   2. Install all dependencies
echo   3. Guide you through database setup
echo   4. Seed mock data
echo.

pause

echo.
echo [Step 1/5] Checking prerequisites...
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo    Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed!
    echo    Please install from: https://python.org
    pause
    exit /b 1
)
echo ✅ Python found
echo.

echo [Step 2/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..
echo.

echo [Step 3/5] Installing AI Service Dependencies...
cd ai-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install AI dependencies
    pause
    exit /b 1
)
echo ✅ AI service dependencies installed
cd ..
echo.

echo [Step 4/5] Database Setup Required
echo.
echo ========================================
echo IMPORTANT: Manual Steps Required
echo ========================================
echo.
echo You need to create the database tables in Supabase.
echo.
echo Option 1 - Copy SQL from Console (EASIEST):
echo   Run: node backend/scripts/setupDatabase.js
echo   Then copy the displayed SQL to Supabase
echo.
echo Option 2 - Use SQL File Directly:
echo   1. Go to: https://efvoaeuzbdhfdhbdddra.supabase.co
echo   2. Click "SQL Editor"
echo   3. Copy contents of: supabase-schema.sql
echo   4. Paste and click "Run"
echo.
echo After creating tables, also create storage bucket:
echo   1. Go to "Storage" in Supabase
echo   2. Create bucket: "disaster-images" (PUBLIC)
echo.
echo Press any key after you've completed the database setup...
pause
echo.

echo [Step 5/5] Seeding Database with Mock Data...
cd backend
node scripts\seedData.js
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Warning: Seeding failed. This is normal if tables aren't created yet.
    echo    Please create the tables first, then run: node backend/scripts/seedData.js
    echo.
) else (
    echo ✅ Database seeded successfully
)
cd ..
echo.

echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo   1. Make sure database tables are created in Supabase
echo   2. Run: start.bat (to launch all services)
echo   3. Open: http://localhost:5173
echo.
echo Documentation:
echo   - QUICKSTART.md - Quick reference
echo   - SETUP_GUIDE.md - Detailed instructions
echo.
pause
