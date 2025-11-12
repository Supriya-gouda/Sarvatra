const express = require('express');
const router = express.Router();
const axios = require('axios');

// Calculate Disaster Confidence Index (DCI)
async function calculateDCI() {
  try {
    let weatherRisk = 0;
    let citizenActivityScore = 0;
    let officialAlertScore = 0;

    // 1. Weather Risk Score (0-100) from OpenWeatherMap
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        // Default location: Mumbai (can be made dynamic)
        const lat = 19.0760;
        const lon = 72.8777;
        
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`,
          { timeout: 3000 }
        );

        const weather = weatherResponse.data;
        const main = weather.weather[0]?.main?.toLowerCase();
        
        // Calculate weather risk based on conditions
        if (main?.includes('thunder') || main?.includes('tornado')) {
          weatherRisk = 95;
        } else if (main?.includes('rain') || main?.includes('drizzle')) {
          weatherRisk = 75;
        } else if (main?.includes('snow') || main?.includes('fog')) {
          weatherRisk = 60;
        } else if (main?.includes('clouds')) {
          weatherRisk = 40;
        } else {
          weatherRisk = 20;
        }

        // Adjust for wind speed
        const windSpeed = weather.wind?.speed || 0;
        if (windSpeed > 20) weatherRisk = Math.min(100, weatherRisk + 20);
        else if (windSpeed > 10) weatherRisk = Math.min(100, weatherRisk + 10);

      } catch (error) {
        console.error('Weather API error:', error.message);
        weatherRisk = 50; // Default
      }
    } else {
      weatherRisk = 50; // Default when no API key
    }

    // 2. Citizen Activity Score based on recent reports (0-100)
    const { data: recentReports, count: totalReports } = await global.supabase
      .from('citizen_reports')
      .select('trust_score', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .gte('trust_score', 50); // Only credible reports

    const reportsIn24h = totalReports || 0;
    
    // More reports = higher activity score
    if (reportsIn24h >= 20) citizenActivityScore = 90;
    else if (reportsIn24h >= 10) citizenActivityScore = 70;
    else if (reportsIn24h >= 5) citizenActivityScore = 50;
    else if (reportsIn24h >= 1) citizenActivityScore = 30;
    else citizenActivityScore = 10;

    // Adjust based on average trust score
    if (recentReports && recentReports.length > 0) {
      const avgTrustScore = recentReports.reduce((sum, r) => sum + (r.trust_score || 0), 0) / recentReports.length;
      if (avgTrustScore >= 75) citizenActivityScore = Math.min(100, citizenActivityScore + 10);
    }

    // 3. Official Alert Score (0-100)
    const { count: activeAlertsCount } = await global.supabase
      .from('cap_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .gt('expires_at', new Date().toISOString());

    const activeAlerts = activeAlertsCount || 0;

    // More active alerts = higher score
    if (activeAlerts >= 5) officialAlertScore = 100;
    else if (activeAlerts >= 3) officialAlertScore = 80;
    else if (activeAlerts >= 2) officialAlertScore = 60;
    else if (activeAlerts >= 1) officialAlertScore = 40;
    else officialAlertScore = 10;

    // Calculate weighted DCI (0-100)
    // Weights: Weather 40%, Citizen Activity 30%, Official Alerts 30%
    const dci = Math.round(
      (weatherRisk * 0.4) +
      (citizenActivityScore * 0.3) +
      (officialAlertScore * 0.3)
    );

    // Store in database
    await global.supabase
      .from('risk_index_history')
      .insert([{
        risk_index: dci,
        weather_risk: weatherRisk,
        citizen_activity: citizenActivityScore,
        official_alerts: officialAlertScore,
        metadata: {
          reportsIn24h,
          activeAlerts,
          timestamp: new Date().toISOString()
        }
      }]);

    return {
      dci,
      components: {
        weatherRisk,
        citizenActivity: citizenActivityScore,
        officialAlerts: officialAlertScore
      },
      metadata: {
        reportsIn24h,
        activeAlerts
      }
    };

  } catch (error) {
    console.error('DCI calculation error:', error);
    throw error;
  }
}

// GET /api/risk-index - Calculate real-time risk index
router.get('/', async (req, res) => {
  try {
    const dciData = await calculateDCI();
    
    res.json({
      currentDCI: dciData.dci,
      riskIndex: dciData.dci,
      riskLevel: dciData.dci >= 75 ? 'Critical' : 
                 dciData.dci >= 50 ? 'High' : 
                 dciData.dci >= 25 ? 'Medium' : 'Low',
      components: dciData.components,
      breakdown: {
        weatherRisk: dciData.components.weatherRisk,
        citizenActivity: dciData.components.citizenActivity,
        officialAlerts: dciData.components.officialAlerts
      },
      metadata: dciData.metadata,
      updatedAt: new Date().toISOString()
    });


  } catch (error) {
    console.error('Error in GET /api/risk-index:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/risk-index/history - Get DCI history
router.get('/history', async (req, res) => {
  try {
    const { limit = 24, hours = 24 } = req.query;

    const { data, error } = await global.supabase
      .from('risk_index_history')
      .select('*')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (error) throw error;

    const history = data.map(record => ({
      dci: record.risk_index,
      weatherRisk: record.weather_risk,
      citizenActivity: record.citizen_activity,
      officialAlerts: record.official_alerts,
      timestamp: new Date(record.created_at).getTime()
    }));

    res.json({
      history,
      total: data.length
    });

  } catch (error) {
    console.error('Error in GET /api/risk-index/history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
