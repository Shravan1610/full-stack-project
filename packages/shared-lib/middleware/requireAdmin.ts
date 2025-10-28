import { adminSupabase } from '@repo/database';

type UserRole = 'customer' | 'admin' | 'super_admin';

interface ProfileRow {
  id: string;
  role: UserRole;
}

type AdminCheckResult = {
  userId: string;
  role: UserRole;
};

export async function requireAdmin(accessToken: string): Promise<AdminCheckResult> {
  if (!accessToken) {
    throw new Error('Unauthorized');
  }

  // Validate token and get user
  const { data, error } = await adminSupabase.auth.getUser(accessToken);
  if (error || !data?.user) {
    throw new Error('Unauthorized');
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    throw new Error('Failed to verify admin status');
  }

  // Type assertion for the profile data returned from Supabase
  const typedProfile = profile as ProfileRow | null;

  if (!typedProfile || (typedProfile.role !== 'admin' && typedProfile.role !== 'super_admin')) {
    throw new Error('Forbidden');
  }

  return { userId: typedProfile.id, role: typedProfile.role };
}
