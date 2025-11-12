# ⚡ QUICK START - Testing All Features

## 🚀 Start All Services

### Terminal 1 - Backend Server
```bash
cd backend
node server.js
```
**Expected**: Server running on port 5000

### Terminal 2 - Frontend
```bash
npm run dev
```
**Expected**: Vite dev server on port 5173

### Terminal 3 - AI Service
```bash
cd ai-service
python main.py
```
**Expected**: FastAPI server on port 8000

---

## ✅ Test Each Feature (In Order)

### 1️⃣ Citizen Report Submission
**URL**: http://localhost:5173/citizen-report

**Steps**:
1. Select disaster type: "Flood"
2. Click GPS button → Location captured
3. Enter description: "Heavy flooding near..."
4. Upload a photo (optional)
5. Click "Submit Report"

**Expected Result**:
```
✅ Report submitted! AI Trust Score: 75/100
```

---

### 2️⃣ AI Misinformation Filter
**Happens automatically** with Feature #1

**Verification**:
- Check backend logs: `✅ AI Filter Response: { trustScore: 75, trustTag: 'trusted' }`
- Check AI service logs: `POST /api/filter - 200 OK`

**Expected**: Trust score between 0-100 based on content analysis

---

### 3️⃣ Authority Dashboard
**URL**: http://localhost:5173/authority/dashboard

**Steps**:
1. View "Citizen Reports" section
2. See report you just submitted
3. Check trust score badge (green/yellow/red)
4. Look at Live Map - see report pin
5. Click "Approve" or "Dismiss"

**Expected Result**:
- Report visible with trust score
- Map shows report location
- Approval updates status

---

### 4️⃣ Disaster Confidence Index (DCI)
**URL**: http://localhost:5173/risk-gauge

**Steps**:
1. Page loads automatically
2. View circular gauge showing DCI
3. See 3 component breakdowns
4. Click "Refresh" button

**Expected Result**:
```
Current DCI: 64/100 (High Risk)
- Weather Risk: 80%
- Citizen Activity: 60%
- Official Alerts: 40%
```

---

### 5️⃣ Weather Map with Live Layers
**URL**: http://localhost:5173/public-map

**Steps**:
1. Click "Weather" tab in layer controls
2. Check "Rainfall" layer
3. Check "Temperature" layer
4. View current weather card

**Expected Result**:
- Toast: "Rainfall layer activated"
- Weather card shows live temp, humidity, wind
- Map updates every 5 minutes

---

### 6️⃣ Two-Way Alert Confirmation
**URL**: http://localhost:5173/citizen-alerts

**Prerequisites**: Create an alert first
```bash
# Using Postman or curl
POST http://localhost:5000/api/cap-alerts
{
  "eventType": "Flood",
  "area": "Mumbai",
  "severity": "High",
  "message": "Heavy rainfall alert",
  "urgency": "Immediate"
}
```

**Steps**:
1. View active alert card
2. Click "I'm Safe" button
3. Wait 3 seconds
4. See response count update

**Expected Result**:
```
Community Response (1 people):
- Safe: 1
- Need Help: 0
- False Alarm: 0
```

---

### 7️⃣ AI Chatbot
**Available on**: Any page with chatbot button

**Steps**:
1. Click floating chatbot button (bottom-right)
2. Type: "Where is the nearest shelter?"
3. Send message
4. Change language to "हिंदी"
5. Ask: "What to do in earthquake?"

**Expected Result**:
```
Bot: The nearest shelter is at Mumbai Central Relief Camp...
Bot: Would you like directions or more information?
```

---

## 🔍 Verify Feature Independence

### Test 1: Report Without AI Service
```bash
# Stop AI service (Ctrl+C in Terminal 3)
# Submit a report
# Expected: Report saved with default trust score 50
```

### Test 2: Dashboard Without Reports
```bash
# Clear all reports from database
# Open dashboard
# Expected: "No reports yet" message, empty map
```

### Test 3: DCI Without Weather API
```bash
# Remove OPENWEATHER_API_KEY from .env
# Restart backend
# Open risk gauge
# Expected: DCI calculated with default weather risk 50
```

### Test 4: Chatbot Offline
```bash
# Disconnect internet
# Ask chatbot question
# Expected: FAQ-based response without external API
```

---

## 📊 Data Flow Verification

### Check Database Tables

```sql
-- Reports with trust scores
SELECT id, disaster_type, trust_score, trust_tag FROM citizen_reports;

-- Alert responses
SELECT alert_id, status, COUNT(*) FROM alert_responses GROUP BY alert_id, status;

-- DCI history
SELECT risk_index, weather_risk, citizen_activity, official_alerts FROM risk_index_history ORDER BY created_at DESC LIMIT 5;

-- Active alerts
SELECT alert_id, event_type, severity FROM cap_alerts WHERE active = true;
```

---

## 🎨 UI/UX Verification

### Responsive Testing
```
✅ Desktop: All features work at 1920x1080
✅ Tablet: Test at 768px width
✅ Mobile: Test at 375px width
```

### Accessibility
```
✅ Keyboard navigation works
✅ Screen reader labels present
✅ Color contrast meets WCAG AA
```

---

## ⚙️ API Endpoints Quick Reference

```
POST   /api/reports                    → Submit citizen report
GET    /api/reports                    → Get all reports
GET    /api/dashboard/data             → Get dashboard data
GET    /api/risk-index                 → Get current DCI
GET    /api/weather/current            → Get weather data
GET    /api/weather/layers             → Get weather map layers
GET    /api/cap-alerts/active          → Get active alerts
POST   /api/alert-response             → Submit alert response
POST   /api/chatbot                    → Query chatbot
```

---

## 🐛 Common Issues & Fixes

### Issue: Trust score is null
**Fix**: Check AI service is running on port 8000

### Issue: Weather layers not showing
**Fix**: Add `OPENWEATHER_API_KEY` to `.env`

### Issue: DCI shows 0
**Fix**: Create some reports and alerts first

### Issue: Map is empty
**Fix**: Submit at least one report or create an alert

### Issue: Chatbot doesn't respond
**Fix**: Check backend /api/chatbot route is accessible

---

## ✨ Success Criteria

All features working if you see:

✅ Reports submitted with trust scores (0-100)  
✅ Dashboard showing reports with color-coded badges  
✅ Live map displaying report pins  
✅ DCI gauge showing 3-component breakdown  
✅ Weather layers toggle on map  
✅ Alert response counts updating  
✅ Chatbot providing contextual answers  

---

## 📞 Need Help?

Check logs:
- Backend: Terminal 1 output
- Frontend: Browser console (F12)
- AI Service: Terminal 3 output

All features are independent - if one fails, others continue working! 🎯
