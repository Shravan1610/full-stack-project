'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Checkout Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Full checkout flow with address management, payment processing, and order confirmation
            </p>
            <Button onClick={() => router.push('/cart')}>
              Back to Cart
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
