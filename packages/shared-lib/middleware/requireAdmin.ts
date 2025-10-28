import { adminSupabase } from '@repo/database';

type AdminCheckResult = {
  userId: string;
  role: string;
};

export async function requireAdmin(accessToken?: string): Promise<AdminCheckResult> {
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

  if (!profile || ((profile as any).role !== 'admin' && (profile as any).role !== 'super_admin')) {
    throw new Error('Forbidden');
  }

  return { userId: (profile as any).id, role: (profile as any).role };
}
