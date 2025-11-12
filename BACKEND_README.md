# Smart Disaster Alert System - Backend

Complete backend infrastructure for the Smart Disaster Alert Platform.

## Architecture

```
Frontend (React)          Backend (Express)         AI Service (FastAPI)
http://localhost:5173  →  http://localhost:5000  →  http://localhost:8000
                               ↓
                          Supabase PostgreSQL
```

## Prerequisites

- Node.js 18+ LTS
- Python 3.10+
- Supabase account (already configured)

## Quick Start

### 1. Set Up Database

Run the SQL schema in Supabase Dashboard → SQL Editor:

```bash
# Open this file and copy contents to Supabase SQL Editor
cat supabase-schema.sql
```

Or visit: https://efvoaeuzbdhfdhbdddra.supabase.co

### 2. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 3. Install AI Service Dependencies

```powershell
cd ../ai-service
pip install -r requirements.txt
```

### 4. Seed Mock Data

```powershell
cd ../backend
node scripts/seedData.js
```

### 5. Start Backend Server

```powershell
# In backend folder
npm run dev
```

Server will start at: http://localhost:5000

### 6. Start AI Service

```powershell
# In new terminal, go to ai-service folder
cd ai-service
python -m uvicorn main:app --reload --port 8000
```

AI service will start at: http://localhost:8000

### 7. Start Frontend

```powershell
# In new terminal, go to root folder
cd ..
npm run dev
```

Frontend will start at: http://localhost:5173

## API Endpoints

### Citizen Reports
- `POST /api/reports` - Submit new report (with file upload)
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get specific report
- `PATCH /api/reports/:id` - Approve/dismiss report

### CAP Alerts
- `GET /api/cap-alerts/active` - Get active alerts
- `POST /api/cap-alerts` - Create new alert
- `PATCH /api/cap-alerts/:id` - Update alert

### Dashboard
- `GET /api/dashboard/data` - Get dashboard KPIs and data

### Risk Index
- `GET /api/risk-index` - Get real-time risk calculation

### Routes
- `GET /api/routes` - Get safe/blocked routes

### Alert Responses
- `POST /api/alert-response` - Submit citizen response
- `GET /api/alert-response/status` - Get response statistics

### Chatbot
- `POST /api/chatbot` - Query AI chatbot

### Authentication
- `POST /api/auth/login` - Login (demo credentials)
- `GET /api/auth/verify` - Verify JWT token

## Demo Credentials

**Authority Login:**
- Email: `email@ndma.gov.in`
- Password: `password123`

## Environment Variables

Backend (`.env`):
```
SUPABASE_URL=https://efvoaeuzbdhfdhbdddra.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
GEMINI_API_KEY=AIzaSy...
PORT=5000
JWT_SECRET=smart_disaster_alert_jwt_secret_key_min_32_characters_long
AI_SERVICE_URL=http://localhost:8000
```

## Testing Endpoints

```powershell
# Health check
curl http://localhost:5000/health

# Get all reports
curl http://localhost:5000/api/reports

# Get active alerts
curl http://localhost:5000/api/cap-alerts/active

# Get risk index
curl http://localhost:5000/api/risk-index

# Submit report (PowerShell)
$body = @{
    disasterType = "Flood"
    latitude = 19.0760
    longitude = 72.8777
    description = "Water rising rapidly"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/reports -Method POST -Body $body -ContentType "application/json"
```

## Database Tables

- `cap_alerts` - Official disaster alerts
- `citizen_reports` - User-submitted reports
- `alert_responses` - Citizen feedback on alerts
- `risk_index_history` - Historical risk calculations
- `authorities` - Admin users
- `audit_logs` - System audit trail

## AI Trust Scoring

The AI service analyzes reports using:
- **Sentiment Analysis (40%)** - VADER for emotional content
- **Keyword Intensity (20%)** - Disaster-specific terms
- **Location Proximity (25%)** - Geographic validation
- **Image Authenticity (15%)** - Photo presence check

Trust Tags:
- **Trusted** (75-100): High confidence
- **Likely** (50-74): Moderate confidence
- **Suspicious** (25-49): Low confidence
- **Fake** (0-24): Very low confidence

## Project Structure

```
backend/
├── routes/              # API endpoints
│   ├── reports.routes.js
│   ├── alerts.routes.js
│   ├── dashboard.routes.js
│   ├── risk.routes.js
│   ├── routes.routes.js
│   ├── feedback.routes.js
│   ├── chatbot.routes.js
│   └── auth.routes.js
├── scripts/
│   └── seedData.js      # Database seeding
├── server.js            # Main server
├── package.json
└── .env

ai-service/
├── services/
│   └── misinformation_filter.py
├── main.py              # FastAPI app
└── requirements.txt
```

## Features Implemented

✅ Complete REST API (8 endpoints)
✅ Supabase PostgreSQL integration
✅ Real-time database sync ready
✅ File upload to Supabase Storage
✅ AI trust scoring microservice
✅ JWT authentication
✅ FAQ-based chatbot
✅ Risk index calculation
✅ Mock data seeding
✅ CORS and security middleware

## Next Steps

1. Create Supabase Storage bucket named `disaster-images`
2. Enable Row Level Security (RLS) policies in Supabase
3. Set up real-time subscriptions in frontend
4. Integrate OpenWeatherMap API for live weather data
5. Add push notifications
6. Deploy to production

## Deployment

**Backend:**
- Railway, Render, or Heroku
- Set environment variables
- Auto-deploy from GitHub

**AI Service:**
- Railway Python deployment
- Or Docker container

**Frontend:**
- Vercel or Netlify
- Update API base URL to production

## Support

For issues or questions, check the main README.md or console logs for debugging.

---

**Built for Smart India Hackathon 2024** 🚀
