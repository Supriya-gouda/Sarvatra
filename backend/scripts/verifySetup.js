const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function verifySetup() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         Database & Storage Verification              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const tables = [
    'cap_alerts',
    'citizen_reports',
    'alert_responses',
    'risk_index_history',
    'authorities',
    'audit_logs'
  ];

  let allGood = true;

  // Check tables
  console.log('📋 Checking Database Tables:\n');
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table.padEnd(25)} - NOT FOUND`);
        allGood = false;
      } else {
        console.log(`✅ ${table.padEnd(25)} - EXISTS`);
      }
    } catch (err) {
      console.log(`❌ ${table.padEnd(25)} - ERROR: ${err.message}`);
      allGood = false;
    }
  }

  // Check storage bucket
  console.log('\n📦 Checking Storage Bucket:\n');
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const hasDisasterImages = buckets?.some(b => b.name === 'disaster-images');
    
    if (hasDisasterImages) {
      console.log('✅ disaster-images bucket    - EXISTS');
    } else {
      console.log('❌ disaster-images bucket    - NOT FOUND');
      allGood = false;
    }
  } catch (err) {
    console.log('❌ Storage check failed:', err.message);
    allGood = false;
  }

  // Check if seeded
  console.log('\n📊 Checking Data:\n');
  try {
    const { data: alerts } = await supabase.from('cap_alerts').select('count');
    const { data: reports } = await supabase.from('citizen_reports').select('count');
    
    console.log(`   Alerts:  ${alerts?.length || 0} rows`);
    console.log(`   Reports: ${reports?.length || 0} rows`);
    
    if ((alerts?.length || 0) === 0 && (reports?.length || 0) === 0) {
      console.log('\n⚠️  Database is empty. Run: node scripts/seedData.js');
    }
  } catch (err) {
    console.log('   Could not check data');
  }

  console.log('\n' + '═'.repeat(60) + '\n');

  if (allGood) {
    console.log('🎉 SUCCESS! Everything is set up correctly!\n');
    console.log('Next steps:');
    console.log('1. If data is empty, run: node scripts/seedData.js');
    console.log('2. Restart backend server (Ctrl+C and node server.js)');
    console.log('3. Frontend will now fetch real data!\n');
    return true;
  } else {
    console.log('❌ Setup incomplete. Please:');
    console.log('1. Run SQL in Supabase SQL Editor');
    console.log('2. Create disaster-images storage bucket');
    console.log('3. Run this script again\n');
    return false;
  }
}

verifySetup()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
