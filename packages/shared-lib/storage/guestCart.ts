export type GuestCartItem = {
  id: string; // local id
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number; // snapshot price at time of add
  product_name?: string;
  image_url?: string;
  variant_label?: string;
};

const KEY = 'guest_cart_v1';

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read guest cart', e);
    return [];
  }
}

export function setGuestCart(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to write guest cart', e);
  }
}

export function clearGuestCart() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error('Failed to clear guest cart', e);
  }
}
