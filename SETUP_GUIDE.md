# 🚀 Complete Setup Guide - Smart Disaster Alert System

Follow these steps in order to get your complete system running.

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.10+ installed (`python --version`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account access

---

## Step 1: Set Up Supabase Database ⚡

### 1.1 Go to Supabase SQL Editor

Visit: https://efvoaeuzbdhfdhbdddra.supabase.co

Click on "SQL Editor" in the left sidebar

### 1.2 Run the Schema

1. Open the file `supabase-schema.sql` in your project
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click "Run" button

You should see: ✅ Success message

### 1.3 Create Storage Bucket

1. Go to "Storage" in Supabase sidebar
2. Click "New bucket"
3. Name: `disaster-images`
4. Make it **Public**
5. Click "Create bucket"

---

## Step 2: Install Backend Dependencies 📦

```powershell
# Navigate to backend folder
cd backend

# Install Node.js dependencies
npm install
```

Expected output: ✅ Installed 20+ packages

---

## Step 3: Install AI Service Dependencies 🤖

```powershell
# Navigate to ai-service folder
cd ../ai-service

# Install Python dependencies
pip install -r requirements.txt
```

Expected output: ✅ Successfully installed 8 packages

---

## Step 4: Seed Mock Data 🌱

```powershell
# Go back to backend folder
cd ../backend

# Run seed script
node scripts/seedData.js
```

Expected output:
```
✅ Seeded 3 CAP alerts
✅ Seeded 5 citizen reports
✅ Seeded 4 alert responses
✅ Seeded 2 risk index records
```

---

## Step 5: Start All Services 🚀

### Terminal 1: Backend Server

```powershell
# In backend folder
npm run dev
```

Expected output:
```
✅ Backend running on http://localhost:5000
✅ Supabase connected to: https://efvoaeuzbdhfdhbdddra.supabase.co
```

Keep this terminal running!

### Terminal 2: AI Service

Open a NEW terminal:

```powershell
# Navigate to ai-service folder
cd ai-service

# Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

Keep this terminal running!

### Terminal 3: Frontend

Open a NEW terminal:

```powershell
# Navigate to project root
cd ..

# Start frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Keep this terminal running!

---

## Step 6: Test the System ✅

### 6.1 Health Checks

Open these URLs in your browser:

1. **Backend**: http://localhost:5000/health
   - Should show: `{"status":"ok","service":"Disaster Alert Backend"}`

2. **AI Service**: http://localhost:8000/health
   - Should show: `{"status":"ok","service":"AI Microservice"}`

3. **Frontend**: http://localhost:5173
   - Should show the homepage

### 6.2 Test Login

1. Go to: http://localhost:5173/authority-login
2. Enter credentials:
   - Email: `email@ndma.gov.in`
   - Password: `password123`
3. Click "Login"
4. Should redirect to dashboard

### 6.3 Test Report Submission

1. Go to: http://localhost:5173/citizen
2. Fill out the form:
   - Disaster Type: Flood
   - Location: Click the location button
   - Description: "Test report"
3. Click "Submit Report"
4. Should see success toast

### 6.4 View Data in Database

1. Go to Supabase → Table Editor
2. Check `citizen_reports` table
3. Should see your test report

---

## 🎯 Common Issues & Solutions

### Issue: "Module not found" in backend

**Solution:**
```powershell
cd backend
rm -rf node_modules
npm install
```

### Issue: "Python module not found"

**Solution:**
```powershell
cd ai-service
pip install -r requirements.txt --upgrade
```

### Issue: "CORS error" in browser

**Solution:** Make sure backend is running on port 5000

### Issue: "Supabase connection failed"

**Solution:** Check `.env` file has correct credentials:
```
SUPABASE_URL=https://efvoaeuzbdhfdhbdddra.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

### Issue: Port already in use

**Solution:**
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use a different port in .env
PORT=5001
```

---

## 📊 System Architecture

```
┌─────────────────┐
│   Frontend      │ http://localhost:5173
│   (React)       │
└────────┬────────┘
         │
         ↓ API Calls
┌─────────────────┐
│   Backend       │ http://localhost:5000
│   (Express)     │
└────────┬────────┘
         │
         ├─→ ┌──────────────┐
         │   │  AI Service  │ http://localhost:8000
         │   │  (FastAPI)   │
         │   └──────────────┘
         │
         ↓
┌─────────────────┐
│   Supabase DB   │ https://efvoaeuzbdhfdhbdddra.supabase.co
│   (PostgreSQL)  │
└─────────────────┘
```

---

## 🎨 Features to Test

### For Citizens:
1. ✅ Submit disaster report with photo
2. ✅ View active alerts
3. ✅ Respond to alerts (Safe/Need Help/False Alarm)
4. ✅ View public map
5. ✅ Check risk gauge
6. ✅ Use chatbot

### For Authorities:
1. ✅ Login to dashboard
2. ✅ View all citizen reports with trust scores
3. ✅ Filter by trust level
4. ✅ Approve/dismiss reports
5. ✅ View KPIs and statistics
6. ✅ Monitor risk index

---

## 📝 API Testing with PowerShell

```powershell
# Test: Get all reports
Invoke-RestMethod -Uri http://localhost:5000/api/reports

# Test: Get active alerts
Invoke-RestMethod -Uri http://localhost:5000/api/cap-alerts/active

# Test: Get risk index
Invoke-RestMethod -Uri http://localhost:5000/api/risk-index

# Test: Submit a report
$body = @{
    disasterType = "Flood"
    latitude = 19.0760
    longitude = 72.8777
    description = "Heavy flooding on streets"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/reports -Method POST -Body $body -ContentType "application/json"

# Test: Login
$loginBody = @{
    email = "email@ndma.gov.in"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method POST -Body $loginBody -ContentType "application/json"
```

---

## 🚀 Next Steps

1. ✅ Test all features manually
2. ✅ Submit sample reports from UI
3. ✅ Check trust scores in database
4. ✅ Test authority dashboard
5. ✅ Verify real-time data flow
6. 🔜 Deploy to production

---

## 📞 Support

If you encounter issues:

1. Check all terminals are running
2. Verify database has data (Supabase → Table Editor)
3. Check browser console for errors (F12)
4. Check backend logs in terminal
5. Verify .env file has correct values

---

## 🎉 Success Indicators

Your system is working if:

- ✅ All 3 terminals show no errors
- ✅ Health checks return "ok"
- ✅ Frontend loads without errors
- ✅ Can login as authority
- ✅ Can submit reports as citizen
- ✅ Data appears in Supabase tables
- ✅ Trust scores are calculated (check reports table)

---

**Congratulations! Your Smart Disaster Alert System is now fully operational!** 🚀

For deployment instructions, see BACKEND_README.md
