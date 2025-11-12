# Smart Disaster Alert Platform 🚨

A comprehensive disaster management system connecting citizens and authorities for real-time emergency response.

---

## 🎯 Project Overview

This platform enables:
- **Citizens** to report disasters and receive real-time alerts
- **Authorities** to verify reports, monitor situations, and coordinate responses
- **AI-powered** trust scoring to filter misinformation
- **Real-time** risk assessment and mapping

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```powershell
# Run the setup script
.\setup.bat

# Then start all services
.\start.bat
```

### Option 2: Manual Setup

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed step-by-step instructions.

---

## 📋 Prerequisites

- ✅ Node.js 18+ LTS
- ✅ Python 3.10+
- ✅ Supabase account (credentials provided)

---

## 🏗️ Architecture

```
Frontend (React)          Backend (Express)         AI Service (FastAPI)
http://localhost:5173  →  http://localhost:5000  →  http://localhost:8000
                               ↓
                          Supabase PostgreSQL
```

---

## 📁 Project Structure

```
.
├── src/                    # React frontend
│   ├── pages/             # All application pages
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities and API client
│   └── hooks/            # Custom React hooks
├── backend/               # Node.js/Express backend
│   ├── routes/           # API endpoints
│   ├── scripts/          # Database seeding
│   └── server.js         # Main server
├── ai-service/           # Python FastAPI AI service
│   ├── services/         # Trust scoring logic
│   └── main.py          # FastAPI app
├── supabase-schema.sql  # Database schema
└── SETUP_GUIDE.md       # Detailed setup instructions
```

---

## 🎨 Features

### For Citizens
- ✅ Report disasters with location and photos
- ✅ Receive real-time alerts
- ✅ Update safety status
- ✅ Access AI chatbot for guidance
- ✅ View disaster map
- ✅ Check risk gauge

### For Authorities
- ✅ Monitor all citizen reports
- ✅ View AI trust scores
- ✅ Approve/dismiss reports
- ✅ Broadcast alerts
- ✅ Comprehensive dashboard
- ✅ Risk analytics

---

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- shadcn/ui components
- Tailwind CSS
- React Router
- TanStack Query

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- JWT Authentication
- Multer (file uploads)

**AI Service:**
- Python + FastAPI
- VADER Sentiment Analysis
- NLP keyword detection

---

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[BACKEND_README.md](BACKEND_README.md)** - Backend API documentation
- **supabase-schema.sql** - Database schema

---
---

## 🧪 Testing

### Health Checks

```powershell
# Backend
curl http://localhost:5000/health

# AI Service
curl http://localhost:8000/health

# Frontend
# Open http://localhost:5173 in browser
```

### Demo Credentials

**Authority Login:**
- Email: `email@ndma.gov.in`
- Password: `password123`

---

## 📊 API Endpoints

All endpoints documented in [BACKEND_README.md](BACKEND_README.md)

**Base URL:** `http://localhost:5000`

Key endpoints:
- `POST /api/reports` - Submit disaster report
- `GET /api/cap-alerts/active` - Get active alerts  
- `GET /api/dashboard/data` - Dashboard data
- `GET /api/risk-index` - Current risk index
- `POST /api/auth/login` - Authority login

---

## 🎯 Database Schema

Run `supabase-schema.sql` in Supabase SQL Editor to create:
- ✅ `cap_alerts` - Official disaster alerts
- ✅ `citizen_reports` - User-submitted reports  
- ✅ `alert_responses` - Citizen feedback
- ✅ `risk_index_history` - Historical risk data
- ✅ `authorities` - Admin users
- ✅ `audit_logs` - System audit trail

---

## 🔐 Security

- JWT-based authentication for authorities
- CORS configured for localhost
- Helmet.js security headers
- Input validation on all endpoints
- File upload size limits

---

## 🚀 Deployment

**Backend:** Railway, Render, or Heroku  
**AI Service:** Railway Python or Docker  
**Frontend:** Vercel or Netlify

See deployment instructions in BACKEND_README.md

---

## 🤝 Contributing

This project was built for educational purposes. Feel free to:
- Report issues
- Suggest features
- Submit pull requests

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

Built as a demonstration of modern disaster management technology.

---

## 📞 Support

For setup issues, check:
1. SETUP_GUIDE.md for step-by-step instructions
2. BACKEND_README.md for API documentation  
3. Terminal logs for error messages
4. Supabase dashboard for database status

---

**Made with ❤️ for Smart India Hackathon** 🇮🇳

