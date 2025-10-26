'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getOrCreateCart,
  getCartItems,
  addToCart as addToCartAPI,
  updateCartItemQuantity as updateCartItemQuantityAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
} from '@repo/shared-lib';
import { CartItemWithDetails } from '@repo/database';
import { getGuestCart, setGuestCart, clearGuestCart, GuestCartItem } from '@repo/shared-lib';

interface CartContextType {
  items: CartItemWithDetails[];
  loading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, variantId: string, quantity: number, price: number, opts?: { productName?: string; imageUrl?: string; variantLabel?: string; }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  guestItems?: GuestCartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [guestItems, setGuestItems] = useState<GuestCartItem[]>(() => {
    try {
      return getGuestCart();
    } catch {
      return [];
    }
  });

  const refreshCart = async () => {
    if (!user) {
      // when not logged in we keep server items empty and rely on guestItems
      setItems([]);
      setCartId(null);
      return;
    }

    try {
      setLoading(true);
      const cart = await getOrCreateCart(user.id);
      setCartId(cart.id);
      const cartItems = await getCartItems(cart.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  // when user becomes available, merge guest cart into server cart
  const mergeGuestCart = useCallback(async () => {
    if (!user) return;
    if (!guestItems || guestItems.length === 0) return;

    try {
      // ensure server cart exists for user
      const cart = await getOrCreateCart(user.id);
      setCartId(cart.id);

      // push guest items into server using API
      for (const it of guestItems) {
        try {
          // addToCartAPI will upsert quantity for same variant
          await addToCartAPI(cart.id, it.product_id, it.variant_id, it.quantity, it.price);
        } catch (e) {
          console.error('Failed to merge guest item', it, e);
        }
      }

      // refresh server cart and clear guest storage
      await refreshCart();
      clearGuestCart();
      setGuestItems([]);
    } catch (e) {
      console.error('Error merging guest cart:', e);
    }
  }, [guestItems, user]);

  useEffect(() => {
    if (user) {
      mergeGuestCart();
    }
  }, [user, mergeGuestCart]);

  const addToCart = async (
    productId: string,
    variantId: string,
    quantity: number,
    price: number,
    opts?: { productName?: string; imageUrl?: string; variantLabel?: string }
  ) => {
    // Logged-in users: use server API
    if (user && cartId) {
      try {
        setLoading(true);
        await addToCartAPI(cartId, productId, variantId, quantity, price);
        await refreshCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      } finally {
        setLoading(false);
      }
      return;
    }

    // Guest flow: persist to localStorage-backed guest cart
    try {
      const existingIndex = guestItems.findIndex(
        (g: GuestCartItem) => g.product_id === productId && g.variant_id === variantId
      );

      let next: GuestCartItem[] = [];
      if (existingIndex === -1) {
        const newItem: GuestCartItem = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          product_id: productId,
          variant_id: variantId,
          quantity,
          price,
          product_name: opts?.productName,
          image_url: opts?.imageUrl,
          variant_label: opts?.variantLabel,
        };
        next = [...guestItems, newItem];
      } else {
        next = guestItems.map((g: GuestCartItem, i: number) =>
          i === existingIndex ? { ...g, quantity: g.quantity + quantity } : g
        );
      }
      setGuestItems(next);
      setGuestCart(next);
    } catch (e) {
      console.error('Failed to add to guest cart', e);
      throw e;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      await updateCartItemQuantityAPI(itemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      await removeFromCartAPI(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    // Clear both server and guest carts
    try {
      setLoading(true);
      if (cartId) {
        await clearCartAPI(cartId);
      }
      clearGuestCart();
      setGuestItems([]);
      await refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const serverCount = items.reduce((sum: number, item: CartItemWithDetails) => sum + item.quantity, 0);
  const guestCount = guestItems.reduce((sum: number, g: GuestCartItem) => sum + g.quantity, 0);
  const itemCount = user ? serverCount : guestCount;

  const serverSubtotal = items.reduce(
    (sum: number, item: CartItemWithDetails) => sum + item.quantity * (item.variant.price_adjustment + item.product.base_price),
    0
  );
  const guestSubtotal = guestItems.reduce((sum: number, g: GuestCartItem) => sum + g.quantity * g.price, 0);
  const subtotal = user ? serverSubtotal : guestSubtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        guestItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
