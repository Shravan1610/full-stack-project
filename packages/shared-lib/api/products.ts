import { supabase } from '@repo/database';
import { Product, ProductWithDetails, ProductImage, ProductVariant } from '@repo/database';

export async function getProducts(filters?: {
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('is_active', true);

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.isFeatured) {
    query = query.eq('is_featured', true);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.minPrice !== undefined) {
    query = query.gte('base_price', filters.minPrice);
  }

  if (filters?.maxPrice !== undefined) {
    query = query.lte('base_price', filters.maxPrice);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProductWithDetails[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as ProductWithDetails | null;
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      category:categories(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as ProductWithDetails | null;
}
