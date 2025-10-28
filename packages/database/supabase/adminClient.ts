import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_SUPABASE_SERVICE_ROLE;

// Fail fast if required environment variables are missing
if (!supabaseUrl || !supabaseServiceKey) {
  const missingVars: string[] = [];
  
  if (!supabaseUrl) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  }
  
  if (!supabaseServiceKey) {
    missingVars.push('SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_ROLE, or NEXT_SUPABASE_SERVICE_ROLE');
  }
  
  throw new Error(
    `Supabase admin client configuration error: Missing required environment variables: ${missingVars.join(', ')}. ` +
    'Please set these in your .env file before starting the application.'
  );
}

export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
