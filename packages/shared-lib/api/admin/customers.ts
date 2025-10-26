import { adminSupabase } from '@repo/database';

export type CustomerFilters = {
  search?: string;
};

export async function getAdminCustomers(filters: CustomerFilters = {}) {
  let query = adminSupabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (filters.search) {
    query = query.ilike('full_name', `%${filters.search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCustomerStats() {
  const { data: totalRes, error: totalErr } = await adminSupabase.from('profiles').select('id', { count: 'exact' });
  if (totalErr) throw totalErr;
  return { totalCustomers: (totalRes as any)?.length || 0, newToday: 0 };
}
