const express = require('express');
const router = express.Router();

// GET /api/dashboard/data - Fetch dashboard data (Authority only)
router.get('/data', async (req, res) => {
  try {
    // Get active alerts count
    const { count: activeAlertsCount } = await global.supabase
      .from('cap_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .gt('expires_at', new Date().toISOString());

    // Get total reports count
    const { count: totalReportsCount } = await global.supabase
      .from('citizen_reports')
      .select('*', { count: 'exact', head: true });

    // Get reports by trust tag
    const { data: allReports } = await global.supabase
      .from('citizen_reports')
      .select('trust_tag');

    const reportsByTrust = {
      trusted: allReports?.filter(r => r.trust_tag === 'trusted').length || 0,
      likely: allReports?.filter(r => r.trust_tag === 'likely').length || 0,
      suspicious: allReports?.filter(r => r.trust_tag === 'suspicious').length || 0,
      fake: allReports?.filter(r => r.trust_tag === 'fake').length || 0
    };

    // Get current risk index
    const { data: latestRisk } = await global.supabase
      .from('risk_index_history')
      .select('risk_index')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get recent reports (last 10)
    const { data: recentReports } = await global.supabase
      .from('citizen_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get active alerts
    const { data: activeAlerts } = await global.supabase
      .from('cap_alerts')
      .select('*')
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Format recent reports
    const formattedReports = recentReports?.map(report => ({
      id: report.id,
      disasterType: report.disaster_type,
      area: `Lat: ${report.latitude}, Lng: ${report.longitude}`,
      trustScore: report.trust_score,
      trustTag: report.trust_tag,
      createdAt: new Date(report.created_at).getTime()
    })) || [];

    // Format active alerts
    const formattedAlerts = activeAlerts?.map(alert => ({
      alertId: alert.alert_id,
      eventType: alert.event_type,
      area: alert.area,
      severity: alert.severity,
      message: alert.message,
      createdAt: new Date(alert.created_at).getTime()
    })) || [];

    // Get map data (pins for reports and alerts)
    const alertPins = activeAlerts?.map(alert => ({
      alertId: alert.alert_id,
      latitude: 19.0760, // Mock location
      longitude: 72.8777,
      type: 'alert'
    })) || [];

    const reportPins = recentReports?.map(report => ({
      reportId: report.id,
      latitude: report.latitude,
      longitude: report.longitude,
      trustScore: report.trust_score
    })) || [];

    res.json({
      kpis: {
        activeAlerts: activeAlertsCount || 0,
        totalReports: totalReportsCount || 0,
        reportsByTrust,
        currentRiskIndex: latestRisk?.risk_index || 64
      },
      recentReports: formattedReports,
      activeAlerts: formattedAlerts,
      mapData: {
        alertPins,
        reportPins,
        polygons: []
      },
      lastUpdated: Date.now()
    });

  } catch (error) {
    console.error('Error in GET /api/dashboard/data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
