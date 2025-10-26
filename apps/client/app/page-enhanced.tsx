'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@repo/shared-ui';
import { Card, CardContent, CardFooter } from '@repo/shared-ui';
import { Badge } from '@repo/shared-ui';
import { ArrowRight, TruckIcon, Shield, HeadphonesIcon } from 'lucide-react';
import { getProducts } from '@repo/shared-lib';
import { ProductWithDetails } from '@repo/database';
import { InteractiveProductCard } from '@/components/ui/card-7';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const products = await getProducts({ isFeatured: true, limit: 8 });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProducts();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4" variant="secondary">New Collection 2025</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Elevate Your Style
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover premium fashion that defines your unique character and confidence
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products?featured=true">View Featured</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <TruckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                <p className="text-gray-600">On orders over $100</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% secure transactions</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <HeadphonesIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: Premium Showcase Section with Interactive Cards */}
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-white text-slate-900" variant="secondary">Premium Collection</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Exclusive Showcase</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Experience our premium products with an interactive 3D preview. Hover to explore the details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center mb-12">
              {/* Example Premium Products - These can be dynamically loaded */}
              <InteractiveProductCard
                title="Nike M2K Tekno"
                description="Elevate Your Every Step"
                price="$149"
                imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
                logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
              />
              
              <InteractiveProductCard
                title="Adidas Ultraboost"
                description="Endless Energy Returns"
                price="$189"
                imageUrl="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2074&auto=format&fit=crop"
                logoUrl="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
              />
              
              <InteractiveProductCard
                title="Air Jordan 1"
                description="Legendary Basketball Icon"
                price="$179"
                imageUrl="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2787&auto=format&fit=crop"
                logoUrl="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg"
              />
            </div>

            <div className="text-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/demo/interactive-card">
                  View All Interactive Cards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-gray-600 text-lg">Handpicked selections from our latest collection</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
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
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No featured products available yet.</p>
                <Button asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
              </div>
            )}

            {featuredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Get exclusive access to new arrivals, special offers, and style inspiration.
                  Be the first to know about our latest collections.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/signup">Sign Up Now</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <p className="text-3xl font-bold mb-2">10k+</p>
                  <p className="text-gray-400">Happy Customers</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <p className="text-3xl font-bold mb-2">500+</p>
                  <p className="text-gray-400">Products</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <p className="text-3xl font-bold mb-2">50+</p>
                  <p className="text-gray-400">Brands</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <p className="text-3xl font-bold mb-2">24/7</p>
                  <p className="text-gray-400">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


