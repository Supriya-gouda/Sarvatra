const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/reports - Submit new citizen report
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('📝 Report submission received');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'Yes' : 'No');
    
    const { disasterType, name, phone, latitude, longitude, description } = req.body;

    // Validate required fields
    if (!disasterType || !latitude || !longitude || !description) {
      console.log('❌ Validation failed:', { disasterType, latitude, longitude, description });
      return res.status(400).json({ 
        error: 'Missing required fields: disasterType, latitude, longitude, description' 
      });
    }

    console.log('✅ Validation passed');
    let photoUrl = null;

    // Upload photo to Supabase Storage if provided
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await global.supabase.storage
        .from('disaster-images')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
      } else {
        const { data: publicData } = global.supabase.storage
          .from('disaster-images')
          .getPublicUrl(fileName);
        photoUrl = publicData.publicUrl;
      }
    }

    // Call AI filter service FIRST (synchronously)
    let trustScore = null;
    let trustTag = 'unverified';

    if (process.env.AI_SERVICE_URL) {
      try {
        // Generate temporary reportId for AI analysis
        const tempReportId = `temp-${Date.now()}`;
        
        console.log('🤖 Calling AI service with:', { 
          reportId: tempReportId,
          disasterType, 
          textLength: description.length,
          hasPhoto: !!photoUrl 
        });
        
        const aiResponse = await axios.post(
          `${process.env.AI_SERVICE_URL}/api/filter`,
          {
            reportId: tempReportId,
            text: description,
            photoUrl: photoUrl,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            disasterType
          },
          { timeout: 5000 } // 5 second timeout
        );

        trustScore = aiResponse.data.trustScore || aiResponse.data.trust_score;
        trustTag = aiResponse.data.trustTag || aiResponse.data.trust_tag || 'unverified';
        
        console.log('✅ AI Filter Response:', { 
          trustScore, 
          trustTag,
          reasoning: aiResponse.data.reasoning 
        });
      } catch (aiError) {
        console.error('⚠️ AI service error (using defaults):', aiError.message);
        // Use default values if AI service fails
        trustScore = 50;
        trustTag = 'unverified';
      }
    } else {
      // No AI service configured - assign default trust score
      console.log('⚠️ No AI_SERVICE_URL configured, using default trust score');
      trustScore = 50;
      trustTag = 'unverified';
    }

    // Insert report into database with AI trust score
    const { data: reportData, error: insertError } = await global.supabase
      .from('citizen_reports')
      .insert([{
        disaster_type: disasterType,
        name: name || null,
        phone: phone || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description,
        photo_url: photoUrl,
        trust_score: trustScore,
        trust_tag: trustTag,
        approved: false
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({ error: 'Failed to save report' });
    }

    res.status(201).json({
      reportId: reportData.id,
      status: 'submitted',
      message: 'Report analyzed and submitted',
      trust_score: trustScore,
      trustScore: trustScore, // Both formats for compatibility
      trust_tag: trustTag,
      trustTag: trustTag,
      verified: trustScore >= 75,
      createdAt: new Date(reportData.created_at).getTime()
    });

  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports - Fetch all reports with filtering
router.get('/', async (req, res) => {
  try {
    const { trust = 'all', limit = 20, offset = 0, disasterType } = req.query;

    let query = global.supabase
      .from('citizen_reports')
      .select('*', { count: 'exact' });

    // Apply trust filter
    if (trust !== 'all') {
      query = query.eq('trust_tag', trust);
    }

    // Apply disaster type filter
    if (disasterType) {
      query = query.eq('disaster_type', disasterType);
    }

    // Pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    // Get response counts for each report
    const reportsWithCounts = await Promise.all(data.map(async (report) => {
      const { data: responses } = await global.supabase
        .from('alert_responses')
        .select('status')
        .eq('alert_id', report.id);

      const responseCounts = {
        safe: responses?.filter(r => r.status === 'safe').length || 0,
        needHelp: responses?.filter(r => r.status === 'needHelp').length || 0,
        falseAlarm: responses?.filter(r => r.status === 'falseAlarm').length || 0
      };

      return {
        id: report.id,
        disasterType: report.disaster_type,
        name: report.name || 'Anonymous',
        phone: report.phone,
        latitude: report.latitude,
        longitude: report.longitude,
        description: report.description,
        photoUrl: report.photo_url,
        trustScore: report.trust_score,
        trustTag: report.trust_tag,
        approved: report.approved,
        createdAt: new Date(report.created_at).getTime(),
        responseCount: responseCounts
      };
    }));

    res.json({
      reports: reportsWithCounts,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/:reportId - Fetch specific report
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    const { data, error } = await global.supabase
      .from('citizen_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      id: data.id,
      disasterType: data.disaster_type,
      name: data.name || 'Anonymous',
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      photoUrl: data.photo_url,
      trustScore: data.trust_score,
      trustTag: data.trust_tag,
      approved: data.approved,
      createdAt: new Date(data.created_at).getTime()
    });

  } catch (error) {
    console.error('Error in GET /api/reports/:reportId:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/reports/:reportId - Approve/dismiss report
router.patch('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, trustScore } = req.body;

    const updateData = {
      approved: action === 'approve',
      updated_at: new Date().toISOString()
    };

    if (trustScore !== undefined) {
      updateData.trust_score = trustScore;
    }

    const { data, error } = await global.supabase
      .from('citizen_reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update report' });
    }

    res.json({
      status: action === 'approve' ? 'approved' : 'dismissed',
      reportId: data.id,
      message: `Report ${action === 'approve' ? 'approved' : 'dismissed'} successfully`
    });

  } catch (error) {
    console.error('Error in PATCH /api/reports/:reportId:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
