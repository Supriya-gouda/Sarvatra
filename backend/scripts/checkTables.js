const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function createTables() {
  console.log('🚀 Creating database tables in Supabase...\n');

  // Note: Supabase client cannot execute DDL (CREATE TABLE) statements
  // You need to use Supabase Management API or SQL Editor
  
  console.log('⚠️  IMPORTANT: Supabase JavaScript client cannot create tables.');
  console.log('');
  console.log('Please use ONE of these methods:');
  console.log('');
  console.log('Option 1: Supabase Dashboard (RECOMMENDED)');
  console.log('  1. Go to: https://efvoaeuzbdhfdhbdddra.supabase.co');
  console.log('  2. Click "SQL Editor" in sidebar');
  console.log('  3. Copy contents of supabase-schema.sql');
  console.log('  4. Paste and click "Run"');
  console.log('');
  console.log('Option 2: Use this automated script (ALTERNATIVE)');
  console.log('  Run: node backend/scripts/createTablesAPI.js');
  console.log('');
  
  // Check if tables exist
  console.log('Checking existing tables...\n');
  
  const tables = [
    'cap_alerts',
    'citizen_reports', 
    'alert_responses',
    'risk_index_history',
    'authorities',
    'audit_logs'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table '${table}' does not exist`);
      } else {
        console.log(`✅ Table '${table}' exists (${data || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' does not exist`);
    }
  }
  
  console.log('\n📝 Next Steps:');
  console.log('  1. Run the SQL schema in Supabase Dashboard');
  console.log('  2. Then run: node backend/scripts/seedData.js');
}

createTables().catch(console.error);
