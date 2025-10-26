'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">My Orders</h1>

          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
