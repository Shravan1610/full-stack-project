#!/usr/bin/env node

/**
 * Admin User Creation Utility
 * 
 * This script promotes a user to admin role in the database.
 * 
 * Usage:
 *   node make-admin.js <email>
 * 
 * Example:
 *   node make-admin.js user@example.com
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './apps/client/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in apps/client/.env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeAdmin(email) {
  try {
    console.log(`\n🔍 Looking for user: ${email}`);

    // Check if user exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) {
      console.error('❌ Error fetching user:', fetchError.message);
      process.exit(1);
    }

    if (!profile) {
      console.error(`❌ Error: No user found with email: ${email}`);
      console.error('\nMake sure:');
      console.error('1. The user has signed up');
      console.error('2. The email is correct');
      console.error('3. The database migration has been run');
      process.exit(1);
    }

    console.log(`✅ Found user: ${profile.email}`);
    console.log(`   Current role: ${profile.role}`);

    if (profile.role === 'admin' || profile.role === 'super_admin') {
      console.log(`\n✓ User is already an admin!`);
      console.log(`\nYou can now access the admin portal at:`);
      console.log(`http://localhost:3000/admin`);
      process.exit(0);
    }

    // Update role to admin
    console.log('\n⚙️  Updating role to admin...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', profile.id);

    if (updateError) {
      console.error('❌ Error updating role:', updateError.message);
      process.exit(1);
    }

    console.log('\n✅ SUCCESS! User promoted to admin');
    console.log(`\n📧 Email: ${email}`);
    console.log(`🔐 Role: admin`);
    console.log(`\nNext steps:`);
    console.log(`1. Sign out and sign back in`);
    console.log(`2. Visit: http://localhost:3000/admin`);
    console.log(`3. You should now have full admin access!`);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.log('\n📝 Admin User Creation Utility\n');
  console.log('Usage: node make-admin.js <email>');
  console.log('\nExample:');
  console.log('  node make-admin.js user@example.com\n');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Error: Invalid email format');
  process.exit(1);
}

// Run the script
makeAdmin(email);

