import { adminSupabase } from '@repo/database';

type AdminCheckResult = {
  userId: string;
  role: string;
};

export async function requireAdmin(userId: string): Promise<AdminCheckResult> {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { data: profile, error } = await adminSupabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error('Failed to verify admin status');
  }

  if (!profile || profile.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return { userId: profile.id, role: profile.role };
}
