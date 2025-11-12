const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function seedData() {
  console.log('🌱 Seeding mock data to Supabase...\n');

  try {
    // 1. Seed CAP Alerts
    console.log('📢 Seeding CAP Alerts...');
    const { data: alertsData, error: alertsError } = await supabase
      .from('cap_alerts')
      .insert([
        {
          alert_id: 'cap-20251112-001',
          event_type: 'Flood',
          area: 'Mumbai, Maharashtra',
          severity: 'High',
          urgency: 'Immediate',
          message: 'Flash flood warning for Mumbai Central due to heavy rainfall. Residents are advised to move to higher ground immediately.',
          source_agency: 'IMD',
          valid_from: new Date().toISOString(),
          expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          active: true
        },
        {
          alert_id: 'cap-20251112-002',
          event_type: 'Earthquake',
          area: 'Gujarat',
          severity: 'Medium',
          urgency: 'Future',
          message: 'Low-intensity earthquake alert. Magnitude 4.2 detected. No immediate danger expected.',
          source_agency: 'USGS',
          valid_from: new Date().toISOString(),
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          active: true
        },
        {
          alert_id: 'cap-20251112-003',
          event_type: 'Fire',
          area: 'Industrial Zone, Mumbai',
          severity: 'Critical',
          urgency: 'Immediate',
          message: 'Major fire outbreak at industrial warehouse. Evacuation in progress. Avoid the area.',
          source_agency: 'Fire Department',
          valid_from: new Date().toISOString(),
          expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          active: true
        }
      ])
      .select();

    if (alertsError) {
      console.error('❌ Alerts error:', alertsError.message);
    } else {
      console.log(`✅ Seeded ${alertsData?.length || 0} CAP alerts\n`);
    }

    // 2. Seed Citizen Reports
    console.log('👥 Seeding Citizen Reports...');
    const { data: reportsData, error: reportsError } = await supabase
      .from('citizen_reports')
      .insert([
        {
          disaster_type: 'Flood',
          name: 'Rajesh Kumar',
          phone: '+919876543210',
          latitude: 19.0760,
          longitude: 72.8777,
          description: 'Water level rising rapidly near railway bridge. Flow is very strong. Roads completely submerged.',
          trust_score: 85,
          trust_tag: 'trusted',
          approved: true
        },
        {
          disaster_type: 'Flood',
          name: 'Priya Sharma',
          phone: '+919876543211',
          latitude: 19.0800,
          longitude: 72.8750,
          description: 'Streets are flooded, cannot move vehicles. Stuck in office building on ground floor.',
          trust_score: 82,
          trust_tag: 'trusted',
          approved: true
        },
        {
          disaster_type: 'Fire',
          name: 'Anonymous',
          latitude: 19.1000,
          longitude: 72.8600,
          description: 'URGENT! Massive fire at warehouse. Thick smoke visible. Evacuation ongoing!',
          trust_score: 45,
          trust_tag: 'suspicious',
          approved: false
        },
        {
          disaster_type: 'Earthquake',
          name: 'Amit Patel',
          phone: '+919876543212',
          latitude: 23.0225,
          longitude: 72.5714,
          description: 'Felt strong tremors for about 10 seconds. Building was shaking. People panicking.',
          trust_score: 78,
          trust_tag: 'likely',
          approved: true
        },
        {
          disaster_type: 'Flood',
          name: 'Neha Singh',
          phone: '+919876543213',
          latitude: 19.0850,
          longitude: 72.8720,
          description: 'Water entered ground floor. Electricity cut off. Need evacuation assistance.',
          trust_score: 90,
          trust_tag: 'trusted',
          approved: true
        }
      ])
      .select();

    if (reportsError) {
      console.error('❌ Reports error:', reportsError.message);
    } else {
      console.log(`✅ Seeded ${reportsData?.length || 0} citizen reports\n`);
    }

    // 3. Seed Alert Responses
    console.log('💬 Seeding Alert Responses...');
    const { data: responsesData, error: responsesError } = await supabase
      .from('alert_responses')
      .insert([
        {
          alert_id: 'cap-20251112-001',
          status: 'safe',
          latitude: 19.0760,
          longitude: 72.8777,
          comment: 'We are at the community shelter'
        },
        {
          alert_id: 'cap-20251112-001',
          status: 'safe',
          latitude: 19.0800,
          longitude: 72.8750
        },
        {
          alert_id: 'cap-20251112-001',
          status: 'needHelp',
          latitude: 19.0850,
          longitude: 72.8720,
          comment: 'Trapped on second floor, water rising'
        },
        {
          alert_id: 'cap-20251112-002',
          status: 'safe',
          latitude: 23.0225,
          longitude: 72.5714
        }
      ])
      .select();

    if (responsesError) {
      console.error('❌ Responses error:', responsesError.message);
    } else {
      console.log(`✅ Seeded ${responsesData?.length || 0} alert responses\n`);
    }

    // 4. Seed Risk Index History
    console.log('📊 Seeding Risk Index History...');
    const { data: riskData, error: riskError } = await supabase
      .from('risk_index_history')
      .insert([
        {
          risk_index: 64,
          weather_risk: 80,
          citizen_reports: 60,
          social_sentiment: 50,
          official_alerts: 65
        },
        {
          risk_index: 58,
          weather_risk: 70,
          citizen_reports: 55,
          social_sentiment: 48,
          official_alerts: 60,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ])
      .select();

    if (riskError) {
      console.error('❌ Risk index error:', riskError.message);
    } else {
      console.log(`✅ Seeded ${riskData?.length || 0} risk index records\n`);
    }

    console.log('🎉 All mock data seeded successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - ${alertsData?.length || 0} CAP Alerts`);
    console.log(`   - ${reportsData?.length || 0} Citizen Reports`);
    console.log(`   - ${responsesData?.length || 0} Alert Responses`);
    console.log(`   - ${riskData?.length || 0} Risk Index Records`);
    console.log('\n✅ Database is ready for testing!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run seeding
seedData().catch(console.error);
