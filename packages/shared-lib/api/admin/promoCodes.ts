import { adminSupabase } from '@repo/database';

export type PromoCodeFormData = {
  code: string;
  discount_percent?: number;
  active?: boolean;
  starts_at?: string;
  ends_at?: string;
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
