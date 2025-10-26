'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@repo/shared-ui';
import { Badge } from '@repo/shared-ui';
import { getProductBySlug } from '@repo/shared-lib';
import { ProductWithDetails, ProductVariant } from '@repo/database';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const slug = params?.slug as string;
        const data = await getProductBySlug(slug);
        setProduct(data);
        if (data?.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params]);

  const handleAddToCart = async () => {
    // allow guests to add to cart; if not logged in we'll store locally and prompt on cart view

    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    setAdding(true);
    try {
      const price = product!.base_price + selectedVariant.price_adjustment;
      await addToCart(product!.id, selectedVariant.id, quantity, price, {
        productName: product!.name,
        imageUrl: product!.images?.[0]?.image_url,
        variantLabel: `${selectedVariant.size || ''}${selectedVariant.color ? ' • ' + selectedVariant.color : ''}`,
      });
      if (!user) {
        toast.success('Added to cart as guest — sign in from the cart to save to your account');
      } else {
        toast.success('Added to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

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

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Product not found</p>
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentPrice = product.base_price + (selectedVariant?.price_adjustment || 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage].image_url}
                    alt={product.images[selectedImage].alt_text || product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || product.name}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold mb-6">${currentPrice.toFixed(2)}</p>

              {product.description && (
                <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
              )}

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Select Variant
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.stock_quantity === 0}
                        className={`p-3 rounded-lg border-2 text-center ${
                          selectedVariant?.id === variant.id
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 hover:border-gray-400'
                        } ${variant.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-sm font-medium">
                          {variant.size && <span>{variant.size}</span>}
                          {variant.size && variant.color && <span> / </span>}
                          {variant.color && <span>{variant.color}</span>}
                        </div>
                        {variant.stock_quantity === 0 && (
                          <div className="text-xs mt-1">Out of Stock</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {selectedVariant && selectedVariant.stock_quantity > 0 ? (
                <Badge className="mb-6" variant="secondary">
                  {selectedVariant.stock_quantity} in stock
                </Badge>
              ) : (
                <Badge className="mb-6" variant="destructive">
                  Out of stock
                </Badge>
              )}

              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={adding || !selectedVariant || selectedVariant.stock_quantity === 0}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
