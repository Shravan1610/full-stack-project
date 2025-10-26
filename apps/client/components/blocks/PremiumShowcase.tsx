"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InteractiveProductCard } from "@/components/ui/card-7";
import { getProducts } from "@repo/shared-lib";
import { ProductWithDetails } from "@repo/database";
import { Button } from "@repo/shared-ui";
import { Badge } from "@repo/shared-ui";
import { ArrowRight } from "lucide-react";

interface PremiumShowcaseProps {
  /**
   * Maximum number of products to display
   * @default 6
   */
  limit?: number;
  
  /**
   * Category ID to filter products
   */
  categoryId?: string;
  
  /**
   * Only show featured products
   * @default true
   */
  onlyFeatured?: boolean;
  
  /**
   * Custom section title
   */
  title?: string;
  
  /**
   * Custom section description
   */
  description?: string;
  
  /**
   * Background theme
   * @default "dark"
   */
  theme?: "dark" | "light";
}

/**
 * PremiumShowcase Component
 * 
 * Displays a grid of interactive product cards with 3D tilt effects.
 * Fetches products from the database and renders them beautifully.
 * 
 * @example
 * ```tsx
 * <PremiumShowcase limit={6} onlyFeatured={true} />
 * ```
 */
export function PremiumShowcase({
  limit = 6,
  categoryId,
  onlyFeatured = true,
  title = "Premium Showcase",
  description = "Experience our premium products with an interactive 3D preview. Hover to explore the details.",
  theme = "dark",
}: PremiumShowcaseProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts({
          isFeatured: onlyFeatured,
          categoryId,
          limit,
        });
        setProducts(data);
      } catch (error) {
        console.error("Error loading premium products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [limit, categoryId, onlyFeatured]);

  // Default fallback images in case product doesn't have images
  const getProductImage = (product: ProductWithDetails): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0].image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop";
    }
    // Fallback to a placeholder based on category or generic
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop";
  };

  // Default logo if not available
  const getProductLogo = (product: ProductWithDetails): string => {
    // Check if product has a brand logo field (you may need to adjust based on your schema)
    // For now, using Nike logo as default, but you should add brand_logo to your schema
    return "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg";
  };

  const bgClasses = theme === "dark" 
    ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
    : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900";

  return (
    <section className={`py-20 ${bgClasses}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge 
            className={theme === "dark" ? "mb-4 bg-white text-slate-900" : "mb-4"} 
            variant="secondary"
          >
            Premium Collection
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {description}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[340px] aspect-[9/12] rounded-3xl bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center mb-12">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug || product.id}`}>
                  <InteractiveProductCard
                    title={product.name || "Product"}
                    description={
                      product.description && product.description.length > 50
                        ? `${product.description.substring(0, 50)}...`
                        : product.description || "Premium Product"
                    }
                    price={`$${product.base_price.toFixed(2)}`}
                    imageUrl={getProductImage(product)}
                    logoUrl={getProductLogo(product)}
                    className="cursor-pointer"
                  />
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button size="lg" variant={theme === "dark" ? "secondary" : "default"} asChild>
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              No premium products available at the moment.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Example Usage:
 * 
 * 1. In Homepage (app/page.tsx):
 * ```tsx
 * import { PremiumShowcase } from "@/components/blocks/PremiumShowcase";
 * 
 * export default function HomePage() {
 *   return (
 *     <>
 *       <Header />
 *       <HeroSection />
 *       <PremiumShowcase limit={6} theme="dark" />
 *       <FeaturedProducts />
 *       <Footer />
 *     </>
 *   );
 * }
 * ```
 * 
 * 2. Category Page:
 * ```tsx
 * <PremiumShowcase 
 *   limit={3} 
 *   categoryId={categoryId} 
 *   onlyFeatured={false}
 *   theme="light"
 * />
 * ```
 * 
 * 3. Custom Landing Page:
 * ```tsx
 * <PremiumShowcase
 *   limit={9}
 *   title="Summer Collection"
 *   description="Discover our hottest summer styles"
 *   theme="dark"
 * />
 * ```
 */

