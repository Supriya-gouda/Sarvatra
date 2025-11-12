const express = require('express');
const router = express.Router();

// POST /api/alert-response - Citizen responds to alert
router.post('/', async (req, res) => {
  try {
    const { alertId, status, latitude, longitude, comment } = req.body;

    // Validate required fields
    if (!alertId || !status || !latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Missing required fields: alertId, status, latitude, longitude' 
      });
    }

    // Validate status
    const validStatuses = ['safe', 'needHelp', 'falseAlarm'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: safe, needHelp, or falseAlarm' 
      });
    }

    // Verify alert exists
    const { data: alert } = await global.supabase
      .from('cap_alerts')
      .select('alert_id')
      .eq('alert_id', alertId)
      .single();

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    // Insert response
    const { data, error } = await global.supabase
      .from('alert_responses')
      .insert([{
        alert_id: alertId,
        status,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        comment: comment || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({ error: 'Failed to save response' });
    }

    res.status(201).json({
      status: 'recorded',
      alertId,
      responseId: data.id,
      message: 'Your status has been recorded. Thank you!'
    });

  } catch (error) {
    console.error('Error in POST /api/alert-response:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/alert-response/status - Get response statistics
router.get('/status', async (req, res) => {
  try {
    const { alertId } = req.query;

    if (!alertId) {
      return res.status(400).json({ error: 'alertId is required' });
    }

    // Get all responses for this alert
    const { data: responses, error } = await global.supabase
      .from('alert_responses')
      .select('*')
      .eq('alert_id', alertId);

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch responses' });
    }

    // Count by status
    const responseCounts = {
      safe: responses?.filter(r => r.status === 'safe').length || 0,
      needHelp: responses?.filter(r => r.status === 'needHelp').length || 0,
      falseAlarm: responses?.filter(r => r.status === 'falseAlarm').length || 0
    };

    // Mock location-based grouping
    const responsesByLocation = {
      'Downtown Area': { safe: 145, needHelp: 8, falseAlarm: 2 },
      'Northern District': { safe: 89, needHelp: 4, falseAlarm: 3 }
    };

    res.json({
      alertId,
      totalResponses: responses?.length || 0,
      responseCounts,
      responsesByLocation,
      lastUpdated: Date.now()
    });

  } catch (error) {
    console.error('Error in GET /api/alert-response/status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
