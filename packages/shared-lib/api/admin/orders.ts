import { adminSupabase } from '@repo/database';

export type OrderFilters = {
  status?: string;
};

export async function getAdminOrders(filters: OrderFilters = {}, page = 1, pageSize = 20) {
  let query = adminSupabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (filters.status) query = query.eq('status', filters.status);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return { orders: data || [], total: count || 0 };
}

export async function getOrderById(id: string) {
  const { data, error } = await adminSupabase.from('orders').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await adminSupabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function updateOrderTracking(id: string, tracking: string) {
  const { data, error } = await adminSupabase.from('orders').update({ tracking }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getOrderStats() {
  const { data: todayOrders } = await adminSupabase.from('orders').select('*').gte('created_at', new Date().toISOString());
  return { todayOrders: 0, todayRevenue: 0, pendingOrders: 0, totalRevenue: 0 };
}
