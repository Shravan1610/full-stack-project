// Database diagnostic script
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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Database Diagnostic Report');
console.log('=' .repeat(60));
console.log('\n📋 Configuration:');
console.log('Supabase URL:', supabaseUrl || '❌ NOT SET');
console.log('Anon Key:', supabaseAnonKey ? '✅ SET' : '❌ NOT SET');
console.log('Service Key:', supabaseServiceKey ? '✅ SET' : '❌ NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERROR: Supabase credentials are not configured properly!');
  console.error('Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function checkDatabase() {
  console.log('\n🗄️  Checking Database Connection...');
  
  try {
    // Check connection
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database Connection Error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);
      
      if (error.code === 'PGRST301' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('\n⚠️  DIAGNOSIS: The database tables do not exist!');
        console.error('   Solution: You need to run the database migrations.');
      } else if (error.code === '42501' || error.message.includes('permission denied')) {
        console.error('\n⚠️  DIAGNOSIS: Row Level Security (RLS) policy issue or permission denied!');
      }
      return false;
    }
    
    console.log('✅ Database connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n📊 Checking Database Tables...');
  
  const tables = [
    'profiles',
    'categories',
    'products',
    'product_images',
    'product_variants',
    'addresses',
    'carts',
    'cart_items',
    'orders',
    'order_items',
    'promo_codes'
  ];
  
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error, count } = await adminClient
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, count: count || 0 };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }
  
  console.log('\n   Table Status:');
  let allTablesExist = true;
  
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`   ✅ ${table.padEnd(20)} - ${result.count} records`);
    } else {
      console.log(`   ❌ ${table.padEnd(20)} - NOT FOUND (${result.error})`);
      allTablesExist = false;
    }
  }
  
  return allTablesExist;
}

async function checkAuth() {
  console.log('\n🔐 Checking Authentication...');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('   ℹ️  No user currently logged in (this is normal)');
    } else if (user) {
      console.log('   ✅ User logged in:', user.email);
    } else {
      console.log('   ℹ️  No user currently logged in');
    }
  } catch (err) {
    console.error('   ❌ Auth check failed:', err.message);
  }
}

async function main() {
  const dbConnected = await checkDatabase();
  
  if (dbConnected) {
    const tablesExist = await checkTables();
    await checkAuth();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Summary:');
    
    if (tablesExist) {
      console.log('✅ Database is properly configured and tables exist!');
      console.log('\nNext steps:');
      console.log('1. Make sure you have some products in the database');
      console.log('2. Create an admin user in the profiles table with role="admin"');
      console.log('3. Run: npm run dev:client (for client app on port 3000)');
      console.log('4. Run: npm run dev:admin (for admin app on port 3001)');
    } else {
      console.log('❌ Some database tables are missing!');
      console.log('\n🔧 SOLUTION: Run the database migrations:');
      console.log('\nOption 1 - Using Supabase Dashboard:');
      console.log('1. Go to: https://supabase.com/dashboard/project/ribcvlvrxcadztnxqhce/sql/new');
      console.log('2. Copy the SQL from: packages/database/supabase/migrations/20241026000001_create_improved_ecommerce_schema.sql');
      console.log('3. Paste and run it in the SQL editor');
      console.log('\nOption 2 - Using Supabase CLI:');
      console.log('1. Install: npm install -g supabase');
      console.log('2. Login: supabase login');
      console.log('3. Link: supabase link --project-ref ribcvlvrxcadztnxqhce');
      console.log('4. Push: supabase db push');
    }
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('\n❌ CRITICAL: Database connection failed!');
    console.log('\n🔧 SOLUTION:');
    console.log('1. Check your .env.local file has correct Supabase credentials');
    console.log('2. Verify the Supabase project exists and is running');
    console.log('3. Run the database migrations (see above)');
  }
  
  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);


