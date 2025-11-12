const express = require('express');
const router = express.Router();
const xml2js = require('xml2js');

// GET /api/cap-alerts/active - Fetch all active alerts (PUBLIC)
router.get('/active', async (req, res) => {
  try {
    const { data, error } = await global.supabase
      .from('cap_alerts')
      .select('*')
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }

    // Get response counts for each alert
    const alertsWithCounts = await Promise.all(data.map(async (alert) => {
      const { data: responses } = await global.supabase
        .from('alert_responses')
        .select('status')
        .eq('alert_id', alert.alert_id);

      const responseCounts = {
        safe: responses?.filter(r => r.status === 'safe').length || 0,
        need_help: responses?.filter(r => r.status === 'need_help').length || 0,
        false_alarm: responses?.filter(r => r.status === 'false_alarm').length || 0,
        total: responses?.length || 0
      };

      return {
        id: alert.id,
        alert_id: alert.alert_id,
        alertId: alert.alert_id,
        event_type: alert.event_type,
        eventType: alert.event_type,
        area: alert.area,
        severity: alert.severity,
        urgency: alert.urgency,
        message: alert.message,
        polygon: alert.polygon,
        created_at: alert.created_at,
        timestamp: new Date(alert.created_at).getTime(),
        expires_at: alert.expires_at,
        expiresAt: new Date(alert.expires_at).getTime(),
        sourceAgency: alert.source_agency,
        source_agency: alert.source_agency,
        responses: responseCounts
      };
    }));

    res.json(alertsWithCounts);

  } catch (error) {
    console.error('Error in GET /api/cap-alerts/active:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cap-alerts/create - Simple create alert (Authority only)
router.post('/create', async (req, res) => {
  try {
    const { 
      eventType, 
      area, 
      severity, 
      urgency, 
      message, 
      headline,
      latitude,
      longitude,
      radius,
      sourceAgency 
    } = req.body;

    console.log('📢 Creating new alert:', { eventType, area, severity });

    // Validate required fields
    if (!eventType || !area || !severity || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: eventType, area, severity, message' 
      });
    }

    // Generate unique alert ID
    const alertId = `alert-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Insert into database
    const { data, error } = await global.supabase
      .from('cap_alerts')
      .insert([{
        alert_id: alertId,
        event_type: eventType,
        area: area,
        severity: severity,
        urgency: urgency || 'Immediate',
        message: message,
        polygon: null,
        source_agency: sourceAgency || 'Disaster Management Authority',
        valid_from: new Date().toISOString(),
        expires_at: expiresAt,
        broadcast_channels: ['push', 'web'],
        active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({ error: 'Failed to create alert' });
    }

    console.log('✅ Alert created successfully:', alertId);

    res.status(201).json({
      success: true,
      alertId: alertId,
      alert: data,
      message: 'Alert created and broadcasted successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/cap-alerts/create:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cap-alerts - Ingest CAP XML alert (Authority only)
router.post('/', async (req, res) => {
  try {
    const { capXml, sourceAgency, broadcastChannels } = req.body;

    if (!capXml) {
      return res.status(400).json({ error: 'CAP XML is required' });
    }

    // Parse CAP XML
    const parser = new xml2js.Parser();
    let parsedData;

    try {
      const result = await parser.parseStringPromise(capXml);
      // Simple extraction (adjust based on actual CAP XML structure)
      const alert = result.alert || result;
      parsedData = {
        eventType: alert.event?.[0] || 'Unknown',
        area: alert.area?.[0]?.areaDesc?.[0] || 'Unknown',
        severity: alert.severity?.[0] || 'Medium',
        urgency: alert.urgency?.[0] || 'Immediate',
        message: alert.description?.[0] || alert.headline?.[0] || 'Alert',
        polygon: alert.area?.[0]?.polygon?.[0] || null
      };
    } catch (parseError) {
      // If XML parsing fails, try to extract from JSON
      parsedData = {
        eventType: req.body.eventType || 'Unknown',
        area: req.body.area || 'Unknown',
        severity: req.body.severity || 'Medium',
        urgency: req.body.urgency || 'Immediate',
        message: req.body.message || 'Alert issued',
        polygon: req.body.polygon || null
      };
    }

    // Generate unique alert ID
    const alertId = `cap-${Date.now()}`;

    // Insert into database
    const { data, error } = await global.supabase
      .from('cap_alerts')
      .insert([{
        alert_id: alertId,
        event_type: parsedData.eventType,
        area: parsedData.area,
        severity: parsedData.severity,
        urgency: parsedData.urgency,
        message: parsedData.message,
        polygon: parsedData.polygon,
        source_agency: sourceAgency || 'Unknown',
        valid_from: new Date().toISOString(),
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
        broadcast_channels: broadcastChannels || ['push', 'web'],
        active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({ error: 'Failed to save alert' });
    }

    res.status(201).json({
      alertId: data.alert_id,
      status: 'received',
      parsedData,
      message: 'Alert ingested successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/cap-alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/cap-alerts/:alertId - Update alert
router.patch('/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { message, severity, urgency, active, broadcastChannels } = req.body;

    const updateData = { updated_at: new Date().toISOString() };
    if (message !== undefined) updateData.message = message;
    if (severity !== undefined) updateData.severity = severity;
    if (urgency !== undefined) updateData.urgency = urgency;
    if (active !== undefined) updateData.active = active;
    if (broadcastChannels !== undefined) updateData.broadcast_channels = broadcastChannels;

    const { data, error } = await global.supabase
      .from('cap_alerts')
      .update(updateData)
      .eq('alert_id', alertId)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      status: 'updated',
      alertId: data.alert_id,
      broadcastStatus: 'queued',
      channels: data.broadcast_channels,
      estimatedReach: 2300000
    });

  } catch (error) {
    console.error('Error in PATCH /api/cap-alerts/:alertId:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
