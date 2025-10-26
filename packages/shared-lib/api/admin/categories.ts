import { adminSupabase } from '@repo/database';

export type CategoryFormData = {
  name: string;
  slug: string;
  parent_id?: string | null;
};

export async function getAdminCategories() {
  const { data, error } = await adminSupabase.from('categories').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCategory(payload: CategoryFormData) {
  const { data, error } = await adminSupabase.from('categories').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, payload: Partial<CategoryFormData>) {
  const { data, error } = await adminSupabase.from('categories').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await adminSupabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
