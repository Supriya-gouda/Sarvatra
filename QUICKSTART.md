# 🚀 QUICK START CARD - Smart Disaster Alert System

## ⚡ 3-Step Launch

### 1️⃣ Database Setup (One-time)
```
1. Go to: https://efvoaeuzbdhfdhbdddra.supabase.co
2. Click "SQL Editor"
3. Copy contents of supabase-schema.sql
4. Paste and click "Run"
5. Go to "Storage" → Create bucket "disaster-images" (public)
```

### 2️⃣ Install Dependencies (One-time)
```powershell
.\setup.bat
```
**OR manually:**
```powershell
cd backend && npm install
cd ../ai-service && pip install -r requirements.txt
cd ../backend && node scripts/seedData.js
```

### 3️⃣ Start All Services
```powershell
.\start.bat
```
**OR manually open 3 terminals:**
```powershell
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: AI Service  
cd ai-service && python -m uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
npm run dev
```

---

## ✅ Verify It's Working

| Service | URL | Expected Response |
|---------|-----|-------------------|
| Frontend | http://localhost:5173 | Homepage loads |
| Backend | http://localhost:5000/health | `{"status":"ok"}` |
| AI Service | http://localhost:8000/health | `{"status":"ok"}` |

---

## 🔑 Demo Login

**Authority Portal:**
- URL: http://localhost:5173/authority-login
- Email: `email@ndma.gov.in`
- Password: `password123`

---

## 🧪 Quick Test

### Test Citizen Report
1. Go to http://localhost:5173/citizen
2. Select disaster type: "Flood"
3. Click location button
4. Add description: "Test report"
5. Submit
6. Check Supabase → `citizen_reports` table

### Test Dashboard
1. Login at /authority-login
2. Should see dashboard with KPIs
3. View reports with trust scores

---

## 📊 API Quick Reference

**Base URL:** `http://localhost:5000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | All citizen reports |
| POST | `/api/reports` | Submit new report |
| GET | `/api/cap-alerts/active` | Active alerts |
| GET | `/api/dashboard/data` | Dashboard KPIs |
| GET | `/api/risk-index` | Current risk score |
| POST | `/api/auth/login` | Authority login |
| POST | `/api/chatbot` | Query chatbot |

---

## 🔧 Common Issues

**Port already in use:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module not found:**
```powershell
cd backend
rm -rf node_modules
npm install
```

**Python error:**
```powershell
cd ai-service
pip install -r requirements.txt --upgrade
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `BACKEND_README.md` | API documentation |
| `PROJECT_SUMMARY.md` | Complete overview |
| `supabase-schema.sql` | Database schema |
| `src/lib/api.ts` | Frontend API client |

---

## 🎯 System Architecture

```
┌──────────────┐
│   Frontend   │ :5173
│   (React)    │
└──────┬───────┘
       │
       ↓
┌──────────────┐     ┌──────────────┐
│   Backend    │ →   │  AI Service  │
│   (Express)  │ :5000│  (FastAPI)   │ :8000
└──────┬───────┘     └──────────────┘
       │
       ↓
┌──────────────┐
│   Supabase   │
│  PostgreSQL  │
└──────────────┘
```

---

## 📞 Need Help?

1. Check terminal logs for errors
2. Verify all 3 services are running
3. Check Supabase has data: https://efvoaeuzbdhfdhbdddra.supabase.co
4. Read SETUP_GUIDE.md for detailed steps
5. Check browser console (F12) for frontend errors

---

## ✨ Pro Tips

- Use `.\start.bat` to launch everything at once
- Check health endpoints first before testing features
- Seed data is already in database after setup
- Trust scores appear after AI service processes reports
- Use PowerShell (not CMD) for best compatibility

---

**Happy Coding! 🚀**

For full documentation, see: SETUP_GUIDE.md, BACKEND_README.md, PROJECT_SUMMARY.md
