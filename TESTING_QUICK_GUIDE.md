# Quick Testing Guide - Role-Based Auth & Real Maps

## ✅ All Services Running
- Backend: http://localhost:5000 ✓
- AI Service: http://localhost:8000 ✓
- Frontend: http://localhost:8080 ✓

## 🎯 Test Scenarios

### Scenario 1: Citizen Journey (No Login Required)
1. **Report a Disaster**
   - Click "Report Disaster" on homepage
   - Fill form (GPS auto-detected)
   - Upload photo (optional)
   - Submit → AI analyzes trust score

2. **View on Live Map**
   - Click "View Live Map" 
   - See your report as a marker
   - Color indicates trust score
   - Click marker for details

3. **Check Active Alerts**
   - Navigate to "Active Alerts"
   - See official government alerts
   - Respond to confirm receipt

### Scenario 2: Authority Login & Dashboard
1. **Login as Authority**
   - Click "Sign In" button in header
   - Or go to: http://localhost:8080/login
   - Select "Authority" tab
   - Enter credentials:
     ```
     Email: admin@authority.gov
     Password: admin123
     Access Code: AUTH2024
     ```
   - Click "Sign In as Authority"

2. **Authority Dashboard**
   - Automatically redirects to `/authority/dashboard`
   - See all citizen reports in table
   - View real map with all reports
   - Approve or dismiss reports
   - Check analytics

3. **Review Reports**
   - Each report shows:
     - Trust score (AI-calculated)
     - Location (GPS coordinates)
     - Photo (if uploaded)
     - Disaster type
   - Click "Approve" to verify
   - Click "Dismiss" to reject

### Scenario 3: Test Protected Routes
1. **Try Without Login**
   - Open: http://localhost:8080/authority/dashboard
   - Should redirect to `/login`

2. **Login as Citizen** (optional)
   ```
   Email: demo@citizen.com
   Password: demo123
   ```
   - Try accessing `/authority/dashboard`
   - Should redirect to homepage

3. **Login as Authority**
   - Use authority credentials
   - Can access `/authority/dashboard`
   - Protected route works!

### Scenario 4: Real Map Features
1. **Interactive Map**
   - Pan around by dragging
   - Zoom with mouse wheel or buttons
   - Click markers for popups
   - See affected area circles

2. **Layer Toggles** (on PublicMap page)
   - Toggle "Official Alerts" on/off
   - Toggle "Citizen Reports" on/off
   - See statistics update

3. **Auto-Refresh**
   - Map refreshes every 30 seconds
   - Click "Refresh" for manual update
   - See new reports appear

## 🔑 Demo Credentials

### Citizen Account
```
Email: demo@citizen.com
Password: demo123
Role: Citizen (no access code needed)
```

### Authority Account #1
```
Email: admin@authority.gov
Password: admin123
Access Code: AUTH2024
Role: Authority
```

### Authority Account #2
```
Email: email@ndma.gov.in
Password: password123
Access Code: AUTH2024
Role: Authority
```

## 🗺️ Map Marker Legend

| Marker Color | Trust Score | Meaning |
|-------------|-------------|---------|
| 🟢 Green | 70-100% | High trust, likely accurate |
| 🟠 Orange | 40-69% | Medium trust, needs review |
| 🔴 Red | 0-39% | Low trust, possible misinformation |
| 🟡 Yellow | N/A | Official government alert |

## 🧪 Testing Checklist

### Authentication
- [ ] Citizen can access public pages without login
- [ ] Authority login requires access code
- [ ] Invalid credentials show error
- [ ] Successful login redirects to correct page
- [ ] Logout clears session
- [ ] Protected routes redirect when not authenticated

### Real Maps
- [ ] Map loads with OpenStreetMap tiles
- [ ] Markers appear for reports and alerts
- [ ] Clicking marker shows popup with details
- [ ] Colors match trust scores
- [ ] Circles show affected areas
- [ ] Pan and zoom work smoothly
- [ ] Mobile responsive

### User Flow
- [ ] Header shows correct navigation based on role
- [ ] User menu displays email and role
- [ ] "Sign In" button changes to user menu when logged in
- [ ] Logout returns to homepage
- [ ] Report submission works
- [ ] AI trust scoring happens
- [ ] Reports appear on map

## 🚀 Key Features to Show

### 1. Role-Based Access Control
- Different dashboards for citizens vs authorities
- Protected routes with automatic redirects
- Access code requirement for authorities

### 2. Real Interactive Maps
- Leaflet integration with OpenStreetMap
- Live markers showing disasters
- Color-coded trust scores
- Popup information cards
- Affected area visualization

### 3. AI Trust Scoring
- Submit a report
- AI analyzes for misinformation
- Trust score calculated (0-100)
- Color-coded on map

### 4. Authority Dashboard
- Real map showing all reports
- Table view with filtering
- Approve/dismiss actions
- Analytics and statistics

### 5. Mobile Responsive
- Works on all screen sizes
- Touch-friendly maps
- Responsive navigation

## 📱 Mobile Testing
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test:
   - Navigation menu
   - Map pan/zoom with touch
   - Report submission
   - Login forms

## 🔧 Troubleshooting

### Map Not Showing
- Check browser console for errors
- Verify Leaflet CSS loaded
- Check network tab for tile requests

### Login Not Working
- Verify backend running (port 5000)
- Check credentials match exactly
- Clear browser localStorage
- Check browser console

### Reports Not Appearing
- Check AI service running (port 8000)
- Submit a new report
- Wait 2-3 seconds for processing
- Refresh the map

## 🎨 UI Highlights

### Login Page
- Tabbed interface (Citizen/Authority)
- Demo button for quick credentials
- Icon indicators for fields
- Clear role separation

### Header Navigation
- Sticky header
- Role-based menu items
- User dropdown with logout
- Mobile hamburger menu

### Maps
- Clean, professional design
- Legend in corner
- Statistics sidebar
- Filter controls

### Dashboard
- Cards layout
- Real-time updates
- Interactive table
- Action buttons

## 🌐 URLs to Test

| URL | Access | Description |
|-----|--------|-------------|
| / | Public | Homepage |
| /login | Public | Login page |
| /citizen/report | Public | Report disaster |
| /citizen/alerts | Public | View alerts |
| /map | Public | Live map |
| /risk-gauge | Public | Risk index |
| /authority/dashboard | Protected | Authority only |

## 📊 Expected Data Flow

```
Citizen Report → AI Analysis → Trust Score → Database
                                              ↓
                                    Authority Dashboard
                                              ↓
                                    Approve/Dismiss
                                              ↓
                                    Live Map Update
```

## ✨ Bonus Features Implemented

1. **Auto-location Detection**: GPS automatically detected
2. **Photo Upload**: Drag & drop or click to upload
3. **Real-time Stats**: Live count of reports/alerts
4. **Auto-refresh**: Maps update every 30 seconds
5. **Mobile Support**: Full touch gesture support
6. **Secure Auth**: JWT tokens with expiration
7. **Role Guards**: Client and server-side protection

---

## 🎯 Next Steps After Testing

1. ✅ Test all scenarios above
2. ✅ Verify maps work on different devices
3. ✅ Test login/logout flows
4. ✅ Check protected routes
5. 📝 Note any bugs or improvements
6. 🚀 Ready for production with real database!

**Happy Testing! 🎉**
