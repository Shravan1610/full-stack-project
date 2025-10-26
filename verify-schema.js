// Verify database schema
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        env[key.trim()] = values.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔍 Verifying Database Schema...\n');
console.log('Project URL:', supabaseUrl);
console.log('');

async function checkTables() {
  console.log('📊 Checking if tables exist using direct queries...\n');
  
  // Try to query information_schema to see what tables exist
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
  });
  
  if (error) {
    console.log('   ℹ️  Could not query information_schema (expected if RPC not set up)');
    console.log('   Trying alternative method...\n');
    
    // Try direct table access
    const tables = ['categories', 'products', 'profiles', 'orders'];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          if (error.message.includes('does not exist') || error.code === '42P01') {
            console.log(`   ❌ Table "${table}" does NOT exist`);
            console.log(`      Error: ${error.message}`);
          } else if (error.message.includes('permission denied') || error.code === '42501') {
            console.log(`   ⚠️  Table "${table}" exists but has permission issues`);
            console.log(`      Error: ${error.message}`);
          } else {
            console.log(`   ❓ Table "${table}" status unknown`);
            console.log(`      Error: ${error.message}`);
          }
        } else {
          console.log(`   ✅ Table "${table}" exists (${count || 0} rows)`);
        }
      } catch (err) {
        console.log(`   ❌ Table "${table}" error: ${err.message}`);
      }
    }
  } else {
    console.log('   Found tables:');
    data.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
  }
}

async function main() {
  await checkTables();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 DIAGNOSIS:\n');
  console.log('If tables do NOT exist, you need to run the database migration:');
  console.log('');
  console.log('Option 1 - Supabase Dashboard (RECOMMENDED):');
  console.log('1. Open: https://supabase.com/dashboard/project/ribcvlvrxcadztnxqhce/sql/new');
  console.log('2. Copy the entire SQL from:');
  console.log('   packages/database/supabase/migrations/20241026000001_create_improved_ecommerce_schema.sql');
  console.log('3. Paste it into the SQL editor and click "Run"');
  console.log('');
  console.log('Option 2 - Using Supabase CLI:');
  console.log('1. Install CLI: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link project: supabase link --project-ref ribcvlvrxcadztnxqhce');
  console.log('4. Push migration: supabase db push');
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);

