'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@repo/shared-ui';
import { Card, CardContent, CardFooter } from '@repo/shared-ui';
import { getProducts } from '@repo/shared-lib';
import { ProductWithDetails } from '@repo/database';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const search = searchParams?.get('search') || undefined;
        const categoryId = searchParams?.get('category') || undefined;

        const data = await getProducts({
          search,
          categoryId,
          limit: 50,
        });
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchParams]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">All Products</h1>
            <p className="text-gray-600">Discover our complete collection</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].image_url}
                          alt={product.images[0].alt_text || product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-gray-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <p className="text-lg font-bold">${product.base_price.toFixed(2)}</p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <Button asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
