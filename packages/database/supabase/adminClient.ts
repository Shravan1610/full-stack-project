import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _adminSupabaseClient: SupabaseClient | null = null;

/**
 * Get the Supabase admin client with lazy initialization.
 * Only validates environment variables when the client is actually used.
 * This prevents the fail-fast error from breaking non-admin pages.
 */
function getAdminClient(): SupabaseClient {
  // Return cached client if already initialized
  if (_adminSupabaseClient) {
    return _adminSupabaseClient;
  }

  // Validate environment variables only when admin client is first accessed
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_SUPABASE_SERVICE_ROLE;

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
      'Please set these in your .env file before using admin features.'
    );
  }

  // Create and cache the client
  _adminSupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  return _adminSupabaseClient;
}

// Export a proxy that lazily initializes the admin client
export const adminSupabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
