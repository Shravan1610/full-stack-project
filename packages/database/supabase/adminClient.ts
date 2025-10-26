import { createClient } from '@supabase/supabase-js';

/**
 * Factory function to create an admin Supabase client with service role key.
 * This should be called from Next.js API routes where environment variables are available.
 */
export function createAdminClient(url?: string, serviceRoleKey?: string) {
  const supabaseUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. ' +
      'Make sure these environment variables are set in your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

/**
 * Lazy-initialized admin client singleton.
 * This will be created on first access using environment variables from the calling context.
 */
let _adminSupabase: any | null = null;

export const adminSupabase: any = new Proxy({} as any, {
  get(_target, prop) {
    if (!_adminSupabase) {
      _adminSupabase = createAdminClient();
    }
    return (_adminSupabase as any)[prop];
  },
});
