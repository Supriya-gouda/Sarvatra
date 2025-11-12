-- Smart Disaster Alert Platform - Database Schema
-- Run this in Supabase SQL Editor

-- Table 1: CAP Alerts (Official Disaster Alerts)
CREATE TABLE IF NOT EXISTS cap_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id TEXT UNIQUE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  area TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'Medium',
  urgency VARCHAR(20) NOT NULL DEFAULT 'Immediate',
  message TEXT NOT NULL,
  polygon TEXT,
  source_agency VARCHAR(100),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  broadcast_channels TEXT[] DEFAULT ARRAY['push', 'web'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_cap_alerts_active ON cap_alerts(active);
CREATE INDEX IF NOT EXISTS idx_cap_alerts_expires ON cap_alerts(expires_at);
CREATE INDEX IF NOT EXISTS idx_cap_alerts_event_type ON cap_alerts(event_type);

-- Table 2: Citizen Reports
CREATE TABLE IF NOT EXISTS citizen_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_type VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  trust_score INTEGER CHECK (trust_score >= 0 AND trust_score <= 100),
  trust_tag VARCHAR(20) DEFAULT 'unverified',
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_citizen_reports_trust ON citizen_reports(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_disaster_type ON citizen_reports(disaster_type);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_location ON citizen_reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_approved ON citizen_reports(approved);

-- Table 3: Alert Responses (Citizen Feedback)
CREATE TABLE IF NOT EXISTS alert_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id TEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_responses_alert_id ON alert_responses(alert_id);
CREATE INDEX IF NOT EXISTS idx_alert_responses_status ON alert_responses(status);

-- Table 4: Risk Index History
CREATE TABLE IF NOT EXISTS risk_index_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_index INTEGER NOT NULL,
  weather_risk INTEGER,
  citizen_reports INTEGER,
  social_sentiment INTEGER,
  official_alerts INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_index_history_created_at ON risk_index_history(created_at DESC);

-- Table 5: Authorities (Admin Users)
CREATE TABLE IF NOT EXISTS authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'officer',
  agency VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authorities_email ON authorities(email);

-- Table 6: Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Insert demo authority
INSERT INTO authorities (email, name, role, agency) 
VALUES ('email@ndma.gov.in', 'Demo Officer', 'authority', 'NDMA')
ON CONFLICT (email) DO NOTHING;
