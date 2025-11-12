const fs = require('fs');
const path = require('path');

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Smart Disaster Alert - Database Setup Helper             ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('\n');

const sqlPath = path.join(__dirname, '../../supabase-schema.sql');

if (!fs.existsSync(sqlPath)) {
  console.log('❌ SQL schema file not found at:', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('📋 STEP-BY-STEP INSTRUCTIONS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('STEP 1: Open Supabase SQL Editor');
console.log('   → https://efvoaeuzbdhfdhbdddra.supabase.co');
console.log('   → Click "SQL Editor" in the left sidebar');
console.log('   → Click "New Query"\n');

console.log('STEP 2: Copy & Execute SQL');
console.log('   → The SQL schema will be displayed below');
console.log('   → Copy everything between the dividers');
console.log('   → Paste into Supabase SQL Editor');
console.log('   → Click "Run" or press Ctrl+Enter\n');

console.log('STEP 3: Create Storage Bucket');
console.log('   → Go to "Storage" tab in Supabase');
console.log('   → Click "New bucket"');
console.log('   → Name: disaster-images');
console.log('   → Toggle "Public bucket" to ON');
console.log('   → Click "Create bucket"\n');

console.log('STEP 4: Seed Mock Data');
console.log('   → Run: node scripts/seedData.js\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📝 COPY THIS SQL (between the arrows):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('▼▼▼ START COPYING FROM HERE ▼▼▼\n');
console.log(sql);
console.log('\n▲▲▲ STOP COPYING HERE ▲▲▲\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ Next: After running SQL in Supabase, run the seed script');
console.log('   → cd backend');
console.log('   → node scripts/seedData.js\n');
