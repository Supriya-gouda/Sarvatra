const express = require('express');
const router = express.Router();

// FAQ-based chatbot intents
const FAQ_INTENTS = {
  shelter_lookup: {
    keywords: ['shelter', 'safe place', 'where to go', 'refuge', 'camp'],
    responses: [
      'The nearest shelter is at Mumbai Central Relief Camp, approximately 2 km from your location. Address: XYZ Street, Mumbai. Contact: +91-XXX-XXX-XXXX',
      'Would you like directions or more information?'
    ]
  },
  earthquake_safety: {
    keywords: ['earthquake', 'tremor', 'shake', 'quake', 'seismic'],
    responses: [
      'During an earthquake: DROP to the ground, take COVER under a desk or table, HOLD ON until shaking stops. Stay away from windows and heavy objects.',
      'For more tips, visit our FAQ page.'
    ]
  },
  flood_safety: {
    keywords: ['flood', 'water', 'rain', 'drowning', 'submerged'],
    responses: [
      'In a flood: Move to higher ground immediately. Avoid driving through flooded areas. Just 6 inches of water can sweep away a vehicle.',
      'Do not attempt to cross flooded roads or streams.'
    ]
  },
  fire_safety: {
    keywords: ['fire', 'smoke', 'burn', 'flames', 'blaze'],
    responses: [
      'In case of fire: GET OUT and STAY OUT. Crawl low under smoke. Test doors before opening. Never go back inside.',
      'Call emergency services: 101 (Fire)'
    ]
  },
  emergency_contact: {
    keywords: ['emergency', 'help', 'contact', 'call', 'number', 'phone'],
    responses: [
      'Emergency numbers: Police 100, Fire 101, Ambulance 102, Disaster Management 1070',
      'For immediate help, please call emergency services.'
    ]
  },
  evacuation: {
    keywords: ['evacuate', 'leave', 'escape', 'route', 'exit'],
    responses: [
      'Follow official evacuation routes. Take essentials: ID, medicines, water, phone. Avoid disaster zones marked on the map.',
      'Stay tuned to official alerts for updates.'
    ]
  }
};

// POST /api/chatbot - Query chatbot
router.post('/', async (req, res) => {
  try {
    const { query, location, language = 'en' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const queryLower = query.toLowerCase();
    let matchedIntent = null;
    let confidence = 0;

    // Match query against intents
    for (const [intentName, intent] of Object.entries(FAQ_INTENTS)) {
      const keywordMatches = intent.keywords.filter(kw => queryLower.includes(kw));
      if (keywordMatches.length > 0) {
        const intentConfidence = keywordMatches.length / intent.keywords.length;
        if (intentConfidence > confidence) {
          confidence = intentConfidence;
          matchedIntent = { name: intentName, ...intent };
        }
      }
    }

    // Default response if no match
    if (!matchedIntent || confidence < 0.2) {
      return res.json({
        query,
        response: 'I can help you with information about shelters, safety tips, evacuation routes, and emergency contacts. Please ask me about these topics.',
        followUp: 'What would you like to know?',
        intent: 'unknown',
        language,
        confidence: 0
      });
    }

    res.json({
      query,
      response: matchedIntent.responses[0],
      followUp: matchedIntent.responses[1] || 'Is there anything else I can help you with?',
      intent: matchedIntent.name,
      language,
      confidence: Math.round(confidence * 100) / 100
    });

  } catch (error) {
    console.error('Error in POST /api/chatbot:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
