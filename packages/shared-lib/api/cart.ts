import { supabase } from '@repo/database';
import { Cart, CartItem, CartItemWithDetails } from '@repo/database';

export async function getOrCreateCart(userId: string): Promise<Cart> {
  const { data: existingCart, error: fetchError } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingCart) {
    return existingCart;
  }

  const { data: newCart, error: createError } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select()
    .single();

  if (createError) throw createError;
  return newCart;
}

export async function getCartItems(cartId: string): Promise<CartItemWithDetails[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*),
      variant:product_variants(*),
      images:products(product_images(*))
    `)
    .eq('cart_id', cartId);

  if (error) throw error;

  return data.map((item: any) => ({
    ...item,
    images: item.images?.product_images || [],
  })) as CartItemWithDetails[];
}

export async function addToCart(
  cartId: string,
  productId: string,
  variantId: string,
  quantity: number,
  price: number
): Promise<CartItem> {
  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId)
    .eq('variant_id', variantId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingItem) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      price_at_add: price,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<CartItem> {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function clearCart(cartId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (error) throw error;
}
