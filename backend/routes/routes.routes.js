const express = require('express');
const router = express.Router();

// GET /api/routes - Get safe/blocked routes
router.get('/', async (req, res) => {
  try {
    const { origin, destination, disasterType } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    // Parse coordinates
    const [originLat, originLng] = origin.split(',').map(parseFloat);
    const [destLat, destLng] = destination.split(',').map(parseFloat);

    // Mock route data (in production, call OSRM or Google Directions API)
    const routes = [
      {
        routeId: 'safe-01',
        label: 'Safe Route (Recommended)',
        status: 'safe',
        color: '#06A77D',
        duration: '25 min',
        distance: '12 km',
        polyline: 'encoded_polyline_string',
        waypoints: [
          [originLat, originLng],
          [originLat + 0.01, originLng + 0.01],
          [destLat, destLng]
        ],
        confidence: 95
      },
      {
        routeId: 'blocked-01',
        label: 'Blocked Route (Original)',
        status: 'blocked',
        color: '#E63946',
        duration: '40 min',
        distance: '15 km',
        polyline: 'encoded_polyline_string',
        blockageReason: `Passes through ${disasterType} Zone`,
        blockageLocation: [[originLat + 0.005, originLng + 0.005]],
        confidence: 85
      }
    ];

    res.json({
      routes,
      metadata: {
        timestamp: Date.now(),
        weather: 'Heavy Rain',
        trafficStatus: 'Heavy'
      }
    });

  } catch (error) {
    console.error('Error in GET /api/routes:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
