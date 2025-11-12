const express = require('express');
const router = express.Router();
const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// GET /api/weather/current - Get current weather for location
router.get('/current', async (req, res) => {
  try {
    const { lat = 19.0760, lon = 72.8777 } = req.query; // Default: Mumbai

    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'OPENWEATHER_API_KEY not set' 
      });
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      { timeout: 5000 }
    );

    const weather = response.data;

    res.json({
      location: {
        name: weather.name,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      current: {
        temp: weather.main.temp,
        feels_like: weather.main.feels_like,
        pressure: weather.main.pressure,
        humidity: weather.main.humidity,
        visibility: weather.visibility,
        wind_speed: weather.wind.speed,
        wind_deg: weather.wind.deg,
        clouds: weather.clouds.all,
        weather: weather.weather[0].main,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
});

// GET /api/weather/forecast - Get 5-day forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat = 19.0760, lon = 72.8777 } = req.query;

    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured' 
      });
    }

    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      { timeout: 5000 }
    );

    const forecast = response.data.list.map(item => ({
      dt: item.dt,
      timestamp: new Date(item.dt * 1000).toISOString(),
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      clouds: item.clouds.all,
      wind_speed: item.wind.speed,
      weather: item.weather[0].main,
      description: item.weather[0].description,
      rain: item.rain?.['3h'] || 0,
      pop: item.pop // Probability of precipitation
    }));

    res.json({
      location: {
        name: response.data.city.name,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      },
      forecast,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ 
      error: 'Failed to fetch forecast data',
      message: error.message 
    });
  }
});

// GET /api/weather/layers - Get weather layer tile URLs
router.get('/layers', async (req, res) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured' 
      });
    }

    // Return tile layer URLs for different weather overlays
    res.json({
      layers: {
        precipitation: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        clouds: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        temperature: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        wind: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        pressure: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`
      },
      info: 'Use these tile URLs with Leaflet or other mapping libraries'
    });

  } catch (error) {
    console.error('Error getting layer URLs:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/alerts - Get weather alerts for location
router.get('/alerts', async (req, res) => {
  try {
    const { lat = 19.0760, lon = 72.8777 } = req.query;

    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({ 
        error: 'Weather service not configured' 
      });
    }

    // OneCall API for alerts
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      { timeout: 5000 }
    );

    const alerts = response.data.alerts || [];

    res.json({
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      alerts: alerts.map(alert => ({
        event: alert.event,
        start: alert.start,
        end: alert.end,
        description: alert.description,
        sender_name: alert.sender_name,
        tags: alert.tags
      })),
      count: alerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    // If OneCall is not available (requires paid plan), return empty
    res.json({
      location: { lat: req.query.lat, lon: req.query.lon },
      alerts: [],
      count: 0,
      message: 'Weather alerts require OneCall API subscription',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
