const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();

// Security & CORS
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Make supabase available globally
global.supabase = supabase;

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/reports', require('./routes/reports.routes'));
app.use('/api/cap-alerts', require('./routes/alerts.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/risk-index', require('./routes/risk.routes'));
app.use('/api/routes', require('./routes/routes.routes'));
app.use('/api/alert-response', require('./routes/feedback.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/weather', require('./routes/weather.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Disaster Alert Backend',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ Supabase connected to: ${process.env.SUPABASE_URL}`);
});
