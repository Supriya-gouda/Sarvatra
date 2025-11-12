# 🎯 FINAL SETUP GUIDE - Start Here!

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  SMART DISASTER ALERT PLATFORM - YOUR COMPLETE SETUP GUIDE      ║
║                                                                  ║
║  Follow these steps EXACTLY to get your system running          ║
║  Total Time: ~10 minutes                                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 📌 What You're About to Build

A **full-stack disaster management platform** with:
- ✅ React frontend with 10 pages
- ✅ Node.js/Express backend with 8 API endpoints
- ✅ Python FastAPI AI service for trust scoring
- ✅ Supabase PostgreSQL database
- ✅ Real-time maps, charts, and alerts

---

## 🎬 STEP-BY-STEP SETUP

### ✅ STEP 1: Verify Prerequisites (2 min)

Open PowerShell and run:

```powershell
# Check Node.js (should be v18+)
node --version

# Check Python (should be v3.10+)
python --version
```

❌ **Don't have them?**
- Node.js: Download from https://nodejs.org
- Python: Download from https://python.org

---

### ✅ STEP 2: Install All Dependencies (3 min)

From your project root (`d:\TECH`), run:

```powershell
.\setup-complete.bat
```

This will:
1. ✅ Check Node.js and Python
2. ✅ Install backend dependencies (Express, Supabase, etc.)
3. ✅ Install AI service dependencies (FastAPI, VADER, etc.)
4. ✅ Guide you through database setup

**Wait for it to finish!** ☕ (Takes ~2-3 minutes)

---

### ✅ STEP 3: Create Database Tables (2 min) ⚠️ CRITICAL

#### Part A: Display the SQL

```powershell
cd backend
node scripts\setupDatabase.js
```

This will show you:
- Step-by-step instructions
- The complete SQL schema to copy

#### Part B: Execute in Supabase

1. **Open Supabase:** https://efvoaeuzbdhfdhbdddra.supabase.co
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New Query"** button
4. **Copy the SQL** from your terminal (between the ▼▼▼ arrows)
5. **Paste into editor**
6. **Click "RUN"** button (or press Ctrl+Enter)

You should see: `Success. No rows returned`

#### Part C: Verify Tables Created

In Supabase, click **"Table Editor"** - you should see:
- ✅ cap_alerts
- ✅ citizen_reports  
- ✅ alert_responses
- ✅ risk_index_history
- ✅ authorities
- ✅ audit_logs

**OR run this check:**

```powershell
node scripts\checkTables.js
```

Should show ✅ for all 6 tables.

---

### ✅ STEP 4: Create Storage Bucket (1 min) ⚠️ CRITICAL

This is needed for photo uploads!

1. In **Supabase Dashboard**, click **"Storage"** (left sidebar)
2. Click **"New bucket"** button
3. Enter name: `disaster-images`
4. **Toggle "Public bucket" to ON** ⚠️ (Important!)
5. Click **"Create bucket"**

✅ Verify: You should see `disaster-images` in the buckets list

---

### ✅ STEP 5: Seed Mock Data (1 min)

```powershell
# Still in backend folder
node scripts\seedData.js
```

This creates:
- 3 sample alerts (Flood, Earthquake, Fire)
- 5 citizen reports with trust scores
- 4 alert responses
- 2 risk index entries

You should see:
```
✅ Successfully seeded 3 CAP alerts
✅ Successfully seeded 5 citizen reports
✅ Successfully seeded 4 alert responses
✅ Successfully seeded 2 risk index records
```

---

### ✅ STEP 6: Launch All Services (1 min)

Go back to project root and run:

```powershell
cd ..
.\start.bat
```

This opens **3 terminal windows**:

**Terminal 1: Frontend**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Terminal 2: Backend**
```
🚀 Backend server running on http://localhost:5000
✅ Connected to Supabase
```

**Terminal 3: AI Service**
```
INFO:     Uvicorn running on http://localhost:8000
```

---

### ✅ STEP 7: Test the Application (2 min)

#### 7.1: Open Frontend

Navigate to: **http://localhost:5173**

You should see the landing page with:
- "Your Lifeline During Disasters" heading
- "Report Incident" and "View Alerts" buttons

#### 7.2: Login to Authority Dashboard

1. Click **"Authority Login"** in the navigation
2. Enter credentials:
   - **Email:** `email@ndma.gov.in`
   - **Password:** `password123`
3. Click **"Login"**

You should be redirected to the **Dashboard** showing:
- Active Alerts: 3
- Total Reports: 5
- Current Risk Index with gauge
- Recent Reports table

#### 7.3: Test Citizen Reporting

1. Click **"Citizens"** → **"Report Incident"**
2. Fill the form:
   - Description: "Fire near city center"
   - Severity: High
   - Type: Fire
   - Location: "Downtown"
   - Latitude: 28.6139
   - Longitude: 77.2090
   - (Optional) Upload a photo
3. Click **"Submit Report"**

Watch the **backend terminal** - you should see:
```
Calling AI service for trust scoring...
✅ AI service response received
```

#### 7.4: Verify AI Trust Score

Go back to **Authority Dashboard** and check the reports table.

Your new report should appear with a **trust score** (e.g., 75/100) and a **tag** (Trusted/Likely/Suspicious/Fake).

---

## 🎉 SUCCESS! Your System is Running!

```
✅ Frontend:    http://localhost:5173
✅ Backend:     http://localhost:5000  
✅ AI Service:  http://localhost:8000
✅ Database:    Connected to Supabase
✅ Storage:     disaster-images bucket created
✅ Mock Data:   3 alerts, 5 reports loaded
```

---

## 🗺️ Explore the Platform

### Citizen Features
- **Home** (`/`) - Landing page
- **About** (`/about`) - Platform information
- **FAQ** (`/faq`) - Common questions
- **Public Map** (`/map`) - See disaster locations
- **Risk Gauge** (`/risk`) - Current risk index
- **Report Incident** (`/report`) - Submit disaster reports
- **View Alerts** (`/alerts`) - Active CAP alerts

### Authority Features (Login Required)
- **Dashboard** (`/authority/dashboard`) - KPIs and reports management
- **Approve/Reject Reports** - Click on reports in dashboard
- **View Analytics** - Charts and statistics

---

## 🔧 Daily Workflow

### Starting the System
```powershell
# From project root
.\start.bat
```

### Stopping the System
Close all 3 terminal windows (or press Ctrl+C in each)

### Restarting After Changes

**Frontend changes:**
```powershell
# Auto-reloads with Vite (no restart needed)
```

**Backend changes:**
```powershell
# In backend terminal, press Ctrl+C
node server.js
```

**AI Service changes:**
```powershell
# In ai-service terminal, press Ctrl+C  
uvicorn main:app --reload --port 8000
```

---

## 🐛 Common Issues & Fixes

### Issue: "Tables not found" errors in backend

**Fix:**
```powershell
cd backend
node scripts\checkTables.js
```
If shows ❌, run Step 3 again (database setup)

---

### Issue: Photo upload fails with 400 error

**Fix:**
1. Go to Supabase → Storage
2. Verify `disaster-images` bucket exists
3. Ensure it's marked as **PUBLIC**
4. If not, recreate (Step 4)

---

### Issue: Reports have null trust_score

**Fix:**
1. Check AI service terminal - should show startup logs
2. Test AI health: `curl http://localhost:8000/health`
3. If not running, restart:
   ```powershell
   cd ai-service
   uvicorn main:app --reload --port 8000
   ```

---

### Issue: CORS errors in browser console

**Fix:**
1. Ensure frontend runs on exactly `http://localhost:5173`
2. Check backend terminal - CORS should allow localhost:5173
3. Clear browser cache and reload

---

### Issue: Can't login to dashboard

**Fix:**
- Use exact credentials: `email@ndma.gov.in` / `password123`
- Check backend terminal for authentication logs
- Clear browser localStorage: F12 → Application → Local Storage → Clear

---

## 📊 Testing Checklist

Use this to verify everything works:

- [ ] Frontend loads at http://localhost:5173
- [ ] Can navigate all pages (Home, About, FAQ, Map, Risk, Report, Alerts)
- [ ] Login works with demo credentials
- [ ] Dashboard shows 3 alerts and 5 reports
- [ ] Can submit new citizen report
- [ ] New report gets AI trust score
- [ ] Map shows disaster pins
- [ ] Chatbot responds to questions
- [ ] Backend API responds: `curl http://localhost:5000/api/health`
- [ ] AI service healthy: `curl http://localhost:8000/health`

---

## 📚 Next Steps

### Learn More
- **API Documentation:** See `backend/BACKEND_README.md`
- **Full Setup Guide:** See `SETUP_GUIDE.md`
- **Project Details:** See `PROJECT_SUMMARY.md`
- **All Docs:** See `INDEX.md`

### Customize
- Change demo credentials in `backend/routes/auth.routes.js`
- Add real weather API key in `backend/.env`
- Modify trust scoring weights in `ai-service/services/misinformation_filter.py`
- Update UI theme in `tailwind.config.ts`

### Deploy to Production
- See `DEPLOYMENT_CHECKLIST.md`
- Configure production environment variables
- Set up HTTPS
- Add rate limiting
- Configure CI/CD pipeline

---

## 💡 Pro Tips

1. **Keep terminals open** - Watch real-time logs to understand system behavior

2. **Use the scripts** - All automation is in:
   - `setup-complete.bat` - Full setup
   - `start.bat` - Launch services
   - `backend/scripts/checkTables.js` - Verify database
   - `backend/scripts/setupDatabase.js` - Show SQL
   - `backend/scripts/seedData.js` - Load mock data

3. **Check logs first** - Most issues are visible in terminal logs

4. **Test incrementally** - After each change, verify in browser immediately

5. **Use the docs** - 8 documentation files cover everything

---

## 🆘 Still Stuck?

1. **Re-run setup:**
   ```powershell
   .\setup-complete.bat
   ```

2. **Check all services are running:**
   - Frontend: http://localhost:5173 (should show UI)
   - Backend: http://localhost:5000/api/health (should return JSON)
   - AI: http://localhost:8000/health (should return JSON)

3. **Verify database:**
   ```powershell
   cd backend
   node scripts\checkTables.js
   ```

4. **Read detailed docs:**
   - `SETUP_GUIDE.md` - Step-by-step troubleshooting
   - `DEPLOYMENT_CHECKLIST.md` - Pre-launch checks
   - `backend/BACKEND_README.md` - API errors

---

<div align="center">

## 🎊 Congratulations!

**You've successfully set up a production-ready disaster management platform!**

🌐 Frontend • 🔧 Backend • 🤖 AI Service • 🗄️ Database

---

**Questions? Check:** `INDEX.md` for all documentation

**Ready to customize?** See `PROJECT_SUMMARY.md` for architecture details

</div>

---

**Created:** November 2025  
**Version:** 1.0.0  
**Status:** ✅ Fully Operational
