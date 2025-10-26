'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@repo/shared-ui';
import { Card } from '@repo/shared-ui';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, loading, subtotal, updateQuantity, removeItem, guestItems } = useCart();
  // If not logged in but have guest items, show guest cart and prompt to sign in to persist
  if (!user && guestItems && guestItems.length > 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

            <Card className="p-6 mb-6">
              <p className="mb-2">You added items to the cart as a guest. Sign in to save these items to your account.</p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" onClick={() => router.push('/checkout')}>Checkout as Guest</Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {guestItems.map((item: any) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.product_name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.product_name}</h3>
                        <p className="font-bold">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => {/* implement guest quantity update if desired */}}>-</Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => {/* implement guest quantity update if desired */}}>+</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {subtotal >= 100 ? 'FREE' : '$10.00'}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(subtotal + (subtotal >= 100 ? 0 : 10)).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => router.push('/auth/signin')}>Proceed to Checkout</Button>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {loading ? (
            <p>Loading cart...</p>
          ) : items.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0].image_url}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                          {item.variant.size && item.variant.color && <span> • </span>}
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                        </p>
                        <p className="font-bold">
                          ${(item.product.base_price + item.variant.price_adjustment).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {subtotal >= 100 ? 'FREE' : '$10.00'}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${(subtotal + (subtotal >= 100 ? 0 : 10)).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
