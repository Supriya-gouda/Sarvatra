# 🚀 Real-Time Implementation Plan

## ✅ COMPLETED

### Backend Setup
- [x] OpenWeather API key added to `.env`
- [x] CORS updated to allow port 8080
- [x] Backend running on port 5000
- [x] AI service running on port 8000  
- [x] Frontend running on port 8080

---

## 📋 TO-DO: Database & Infrastructure

### 1. Database Setup (CRITICAL - DO THIS FIRST!)

**Action:** Run SQL in Supabase

```bash
# SQL is displayed above - copy and paste into Supabase SQL Editor
# https://efvoaeuzbdhfdhbdddra.supabase.co
```

**Creates:**
- ✅ cap_alerts table
- ✅ citizen_reports table
- ✅ alert_responses table
- ✅ risk_index_history table
- ✅ authorities table
- ✅ audit_logs table

### 2. Storage Bucket Setup

**Action:** Manual in Supabase Dashboard

1. Go to Storage tab
2. Create bucket: `disaster-images`
3. Make it PUBLIC
4. Set permissions

### 3. Seed Database

```bash
cd backend
node scripts\seedData.js
```

**Creates:**
- 3 sample CAP alerts
- 5 citizen reports with trust scores
- 4 alert responses
- 2 risk index records

---

## 📝 TO-DO: Frontend Real-Time Updates

### Priority 1: Core Data Fetching

#### CitizenAlerts.tsx
- [ ] Replace mock alerts array with `alertApi.getActiveAlerts()`
- [ ] Add useEffect for initial fetch
- [ ] Add polling every 30s for real-time updates
- [ ] Implement handleResponse to call `feedbackApi.submitResponse()`
- [ ] Show loading states
- [ ] Error handling with fallback to mock data

#### AuthorityDashboard.tsx
- [ ] Replace mock KPIs with `dashboardApi.getDashboardData()`
- [ ] Replace mock reports with real data
- [ ] Add real-time polling (30s)
- [ ] Implement approve/dismiss functionality
- [ ] Connect to `/api/reports/:id` PATCH endpoint
- [ ] Refresh data after actions

#### PublicMap.tsx
- [ ] Fetch disaster locations from `reportApi.getReports()`
- [ ] Fetch alerts from `alertApi.getActiveAlerts()`
- [ ] Create markers from real data
- [ ] Add real-time updates (30s polling)
- [ ] Show report trust scores in popups

#### RiskGauge.tsx
- [ ] Fetch from `riskApi.getRiskIndex()`
- [ ] Real-time updates every 30s
- [ ] Show breakdown from API
- [ ] Display trend (increasing/decreasing)

### Priority 2: Form Submissions

#### CitizenReport.tsx
- [ ] Connect form submit to `reportApi.submitReport()`
- [ ] Handle file upload properly
- [ ] Show AI trust score in response
- [ ] Clear form on success
- [ ] Navigate to success page

#### AuthorityLogin.tsx
- [ ] Connect to `authApi.login()`
- [ ] Store JWT token in localStorage
- [ ] Redirect to dashboard on success
- [ ] Show error messages

---

## 🔄 TO-DO: Real-Time Features

### Supabase Realtime Integration

**Files to Update:**
- `src/lib/api.ts` - Add realtime subscription helpers
- All pages with data - Add Supabase realtime listeners

**Implementation:**
```typescript
// Subscribe to table changes
supabase
  .channel('citizen_reports')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'citizen_reports' }, 
    payload => {
      // Update state with new report
    }
  )
  .subscribe()
```

**Pages needing realtime:**
- CitizenAlerts (new alerts)
- AuthorityDashboard (new reports, status changes)
- PublicMap (new incidents)
- RiskGauge (index updates)

---

## 🔧 TO-DO: Backend Enhancements

### Update Risk Calculation
- [ ] Add OpenWeather API integration
- [ ] Real weather risk calculation
- [ ] Store in risk_index_history

### Photo Upload Enhancement
- [ ] Test Multer with Supabase Storage
- [ ] Verify public URL generation
- [ ] Add image validation

### Audit Logging
- [ ] Add audit log inserts to all authority actions
- [ ] Track approve/dismiss/create operations

---

## 🧪 TO-DO: Testing Checklist

### End-to-End Flow Tests

1. **Citizen Report Submission**
   - [ ] Fill form with all fields
   - [ ] Upload photo
   - [ ] Submit
   - [ ] Verify appears in database
   - [ ] Check AI trust score assigned
   - [ ] See on map
   - [ ] See in authority dashboard

2. **Authority Actions**
   - [ ] Login with demo credentials
   - [ ] View dashboard with real data
   - [ ] Approve a report
   - [ ] Verify status updates
   - [ ] Check audit log entry
   - [ ] See changes reflect on map

3. **Real-Time Updates**
   - [ ] Submit report in one window
   - [ ] See it appear in dashboard (another window)
   - [ ] No refresh needed
   - [ ] Map updates automatically

4. **Alert System**
   - [ ] Create new alert (authority)
   - [ ] Citizen sees it immediately
   - [ ] Responds to alert
   - [ ] Response recorded in DB

---

## 📊 Implementation Order

### Phase 1: Database (15 minutes)
1. Run SQL in Supabase ✅ **SQL READY ABOVE**
2. Create storage bucket
3. Run seed script
4. Verify tables exist

### Phase 2: API Integration (30 minutes)
1. CitizenAlerts - fetch real alerts
2. AuthorityDashboard - fetch real data
3. PublicMap - show real pins
4. RiskGauge - live calculation
5. Forms - submit to backend

### Phase 3: Real-Time (20 minutes)
1. Add polling to all pages (30s interval)
2. Implement Supabase realtime subscriptions
3. Test live updates

### Phase 4: Testing (15 minutes)
1. End-to-end flow test
2. Edge case handling
3. Error states
4. Performance check

---

## 🎯 Success Criteria

After implementation:

- ✅ Database has 6 tables with data
- ✅ Storage bucket accepts images
- ✅ Frontend fetches from backend APIs
- ✅ Forms submit to backend successfully
- ✅ AI trust scoring works on submissions
- ✅ Authority can approve/dismiss reports
- ✅ Map shows real disaster locations
- ✅ Dashboard shows live KPIs
- ✅ Real-time updates work (30s or realtime)
- ✅ No mock data in production mode
- ✅ All features functional end-to-end

---

## 📝 Files to Modify

### Frontend Components (7 files)
1. `src/pages/CitizenAlerts.tsx` - Real alerts
2. `src/pages/AuthorityDashboard.tsx` - Real dashboard
3. `src/pages/PublicMap.tsx` - Real pins
4. `src/pages/RiskGauge.tsx` - Live risk
5. `src/pages/CitizenReport.tsx` - Submit to API
6. `src/pages/AuthorityLogin.tsx` - Real auth
7. `src/lib/api.ts` - Add realtime helpers

### Backend Routes (Already coded, just need DB)
- All routes ready
- Just need database tables

---

## 🚨 NEXT IMMEDIATE ACTION

**YOU MUST DO THIS NOW:**

1. **Copy the SQL above** (from setupDatabase.js output)
2. **Open:** https://efvoaeuzbdhfdhbdddra.supabase.co
3. **Click:** SQL Editor → New Query
4. **Paste** the entire SQL
5. **Click:** Run

**This unlocks everything!**

After that, I'll update all 7 frontend files to use real data.

---

Last Updated: November 12, 2025
Status: Ready for database creation
