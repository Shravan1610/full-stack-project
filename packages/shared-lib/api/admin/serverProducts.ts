import { adminSupabase } from '@repo/database';

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
  featured?: boolean;
}

export async function getAdminProductsServer(
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 20
) {
  let query = adminSupabase
    .from('products')
    .select(
      `
      *,
      category:categories(id, name, slug),
      images:product_images(id, image_url, is_primary),
      variants:product_variants(id, sku, size, color, stock_quantity, price_adjustment)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
  }

  if (filters.category) {
    query = query.eq('category_id', filters.category);
  }

  if (filters.status && filters.status !== 'all') {
    query = query.eq('is_active', filters.status === 'active');
  }

  if (filters.featured !== undefined) {
    query = query.eq('is_featured', filters.featured);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    products: data || [],
    total: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function createProduct(productData: any) {
  const payload = {
    ...productData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await adminSupabase.from('products').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, productData: Partial<any>) {
  const payload = {
    ...productData,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await adminSupabase.from('products').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
