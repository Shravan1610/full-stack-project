import { adminSupabase } from '@repo/database';

export type PromoCodeFormData = {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  max_uses?: number;
  max_uses_per_user?: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
};

export async function getAdminPromoCodes() {
  const { data, error } = await adminSupabase.from('promo_codes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPromoCode(payload: PromoCodeFormData) {
  const { data, error } = await adminSupabase.from('promo_codes').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updatePromoCode(id: string, payload: Partial<PromoCodeFormData>) {
  const { data, error } = await adminSupabase.from('promo_codes').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePromoCode(id: string) {
  const { error } = await adminSupabase.from('promo_codes').delete().eq('id', id);
  if (error) throw error;
}
