import { supabase } from '@repo/database';
import { ProductWithDetails } from '@repo/database';

type AdminProductsFilters = {
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function getAdminProducts(
  filters: AdminProductsFilters = {},
  page = 1,
  pageSize = 50,
  sort: { column: string; direction: 'asc' | 'desc' } | null = { column: 'created_at', direction: 'desc' }
) {
  let query = supabase
    .from('products')
    .select(`*, images:product_images(*), variants:product_variants(*), category:categories(*)`);

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('base_price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('base_price', filters.maxPrice);
  }

  if (sort) {
    query = query.order(sort.column, { ascending: sort.direction === 'asc' });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to).order('created_at', { ascending: false }).throwOnError();

  if (error) throw error;

  return {
    data: (data as any) as ProductWithDetails[],
    total: typeof count === 'number' ? count : undefined,
    page,
    pageSize,
  };
}

export async function deleteProduct(productId: string) {
  // soft-delete: set status to 'archived'
  const { data, error } = await supabase
    .from('products')
    .update({ status: 'archived' })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function bulkDeleteProducts(productIds: string[]) {
  const { data, error } = await supabase
    .from('products')
    .update({ status: 'archived' })
    .in('id', productIds)
    .select();

  if (error) throw error;
  return data;
}

export async function bulkUpdateStatus(productIds: string[], status: string) {
  const { data, error } = await supabase
    .from('products')
    .update({ status })
    .in('id', productIds)
    .select();

  if (error) throw error;
  return data;
}

export async function duplicateProduct(productId: string) {
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!product) throw new Error('Product not found');

  const copy = {
    ...product,
    id: undefined,
    name: `${product.name} (Copy)`,
    slug: `${product.slug}-copy-${Date.now()}`,
    created_at: undefined,
    updated_at: undefined,
  } as any;

  const { data: newProduct, error: createError } = await supabase
    .from('products')
    .insert(copy)
    .select()
    .single();

  if (createError) throw createError;

  return newProduct;
}

export async function exportProductsCSV(filters: AdminProductsFilters = {}) {
  const { data } = await supabase
    .from('products')
    .select('id,name,slug,description,base_price,status')
    .maybeSingle();

  // For demo purposes return header only — implement full export later
  const header = 'id,name,slug,description,base_price,status\n';
  return header;
}
