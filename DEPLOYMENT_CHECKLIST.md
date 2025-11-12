# 🚀 Smart Disaster Alert - Deployment Checklist

## Pre-Deployment Setup

### ✅ 1. Database Setup (REQUIRED - Do This First!)

**Option A: Automated Helper Script (Recommended)**
```bash
cd backend
node scripts/setupDatabase.js
```
This will display the SQL schema with clear instructions. Then:
1. Copy the displayed SQL
2. Go to [Supabase SQL Editor](https://efvoaeuzbdhfdhbdddra.supabase.co)
3. Paste and run the SQL
4. Verify 6 tables are created

**Option B: Manual Setup**
1. Open `supabase-schema.sql`
2. Copy entire contents
3. Go to [Supabase SQL Editor](https://efvoaeuzbdhfdhbdddra.supabase.co)
4. Paste and execute
5. Check "Table Editor" - should see 6 tables

**Tables to verify:**
- [ ] `cap_alerts`
- [ ] `citizen_reports`
- [ ] `alert_responses`
- [ ] `risk_index_history`
- [ ] `authorities`
- [ ] `audit_logs`

### ✅ 2. Storage Bucket Setup (REQUIRED for Photo Uploads)

1. Go to [Supabase Storage](https://efvoaeuzbdhfdhbdddra.supabase.co) → "Storage" tab
2. Click "New bucket"
3. Enter name: `disaster-images`
4. **Toggle "Public bucket" to ON** ⚠️
5. Click "Create bucket"

### ✅ 3. Install Dependencies

**Option A: Automated (Recommended)**
```bash
# Run from project root
setup-complete.bat
```

**Option B: Manual**
```bash
# Backend
cd backend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### ✅ 4. Verify Environment Variables

Check `backend/.env` has:
```env
SUPABASE_URL=https://efvoaeuzbdhfdhbdddra.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdm9hZXV6YmRoZmRoYmRkZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjQyMzksImV4cCI6MjA0NjkwMDIzOX0.XKzIxdvdR_OGQPZ3E-dKHuXBH8gYZDCzNnkqXlQoKvk
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=AIzaSyALu8CWpxjRCHoZHMkv5Y31mQdec1LDzfo
PORT=5000
```

### ✅ 5. Seed Mock Data (Optional but Recommended)

```bash
cd backend
node scripts/seedData.js
```

This creates:
- 3 sample CAP alerts (Flood, Earthquake, Fire)
- 5 citizen reports with varying trust scores
- 4 alert responses (Acknowledged/Safe/Affected)
- 2 risk index history entries

---

## 🎯 Launch Sequence

### Quick Start (All Services)
```bash
# From project root
start.bat
```

This launches in 3 separate terminals:
1. **Frontend** → http://localhost:5173
2. **Backend** → http://localhost:5000
3. **AI Service** → http://localhost:8000

### Manual Start (Individual Services)

**Terminal 1: Frontend**
```bash
npm run dev
# Opens: http://localhost:5173
```

**Terminal 2: Backend**
```bash
cd backend
node server.js
# Listening: http://localhost:5000
```

**Terminal 3: AI Service**
```bash
cd ai-service
uvicorn main:app --reload --port 8000
# Listening: http://localhost:8000
```

---

## 🧪 Testing Checklist

### Verify Backend Health
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "OK", "timestamp": "..." }
```

### Verify AI Service
```bash
curl http://localhost:8000/health
# Should return: { "status": "healthy" }
```

### Test Database Connection
```bash
cd backend
node scripts/checkTables.js
# Should show ✅ for all 6 tables
```

### Frontend Test Flow
1. [ ] Open http://localhost:5173
2. [ ] Navigate to "Authority Login"
3. [ ] Login with: `email@ndma.gov.in` / `password123`
4. [ ] Should redirect to Authority Dashboard
5. [ ] Dashboard shows KPIs (alerts, reports, risk index)
6. [ ] Click "Citizens" → "Report Incident"
7. [ ] Fill form and submit (with optional photo)
8. [ ] Check backend terminal - should see AI service call
9. [ ] Go to Dashboard → verify new report appears

### API Endpoint Tests
```bash
# Get all alerts
curl http://localhost:5000/api/alerts

# Get all reports
curl http://localhost:5000/api/reports

# Get dashboard data
curl http://localhost:5000/api/dashboard

# Get current risk index
curl http://localhost:5000/api/risk

# Test chatbot
curl -X POST http://localhost:5000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is nearest shelter?"}'
```

---

## 🔍 Troubleshooting

### Database Tables Not Found
**Symptom:** Backend errors mentioning tables don't exist  
**Fix:** Run database setup (Step 1 above)

### Photo Upload Fails
**Symptom:** 400 error when uploading images  
**Fix:** 
1. Verify storage bucket exists: `disaster-images`
2. Ensure bucket is PUBLIC
3. Check Supabase Storage policies

### AI Service Connection Failed
**Symptom:** Reports saved but trust_score is null  
**Fix:**
1. Verify AI service is running on port 8000
2. Check Python dependencies installed
3. Test: `curl http://localhost:8000/health`

### CORS Errors in Browser
**Symptom:** Network errors in browser console  
**Fix:** 
1. Verify frontend runs on http://localhost:5173
2. Check backend CORS config allows localhost:5173
3. Restart both services

### Authentication Fails
**Symptom:** Can't login to Authority Dashboard  
**Fix:**
- Use exact credentials: `email@ndma.gov.in` / `password123`
- Check JWT_SECRET in `.env`
- Clear browser localStorage

---

## 📊 System Architecture

```
┌─────────────────┐
│   Frontend      │
│  localhost:5173 │ (React + TypeScript)
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend       │
│  localhost:5000 │ (Express + Node.js)
└────┬───────┬────┘
     │       │
     │       └─────────┐
     ▼                 ▼
┌────────────┐   ┌──────────────┐
│  Supabase  │   │  AI Service  │
│ PostgreSQL │   │localhost:8000│
│  + Storage │   │(FastAPI+ML)  │
└────────────┘   └──────────────┘
```

---

## 🎓 Demo Credentials

### Authority Login
- **Email:** `email@ndma.gov.in`
- **Password:** `password123`

### Supabase Dashboard
- **URL:** https://efvoaeuzbdhfdhbdddra.supabase.co
- **Anon Key:** (in `.env` file)

---

## 📚 Documentation Reference

- **QUICKSTART.md** - 5-minute quick reference
- **SETUP_GUIDE.md** - Detailed setup instructions
- **BACKEND_README.md** - Complete API documentation
- **PROJECT_SUMMARY.md** - Full implementation overview
- **FILE_STRUCTURE.md** - Project organization guide

---

## ✨ Success Criteria

Your deployment is successful when:

- [ ] All 3 services start without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can login to Authority Dashboard
- [ ] Dashboard shows mock data (3 alerts, 5 reports)
- [ ] Can submit new citizen report
- [ ] Report gets AI trust score automatically
- [ ] Map shows disaster pins
- [ ] Chatbot responds to questions

---

## 🆘 Need Help?

1. **Check logs** - All 3 terminal windows show real-time logs
2. **Run checks** - Use `checkTables.js` to verify database
3. **Review docs** - See SETUP_GUIDE.md for detailed troubleshooting
4. **Test APIs** - Use curl/Postman to test endpoints directly

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
