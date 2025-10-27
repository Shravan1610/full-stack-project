"use client";

import { useState } from "react";
import { InteractiveProductCard } from "@repo/shared-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui";
import { Input } from "@repo/shared-ui";
import { Label } from "@repo/shared-ui";
import { Button } from "@repo/shared-ui";
import { Badge } from "@repo/shared-ui";

export default function AdminPreviewCardsPage() {
  // State for custom card preview
  const [customCard, setCustomCard] = useState({
    title: "Custom Product",
    description: "Edit to preview",
    price: "$99",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomCard((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interactive Product Cards</h1>
            <p className="text-muted-foreground mt-2">
              Preview and customize the interactive 3D product card component
            </p>
          </div>
          <Badge variant="secondary">Admin Preview</Badge>
        </div>

        {/* Custom Card Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Card Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={customCard.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter product title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={customCard.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter product description"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={customCard.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., $99"
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={customCard.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={customCard.logoUrl}
                    onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.svg"
                  />
                </div>
                <Button
                  onClick={() =>
                    setCustomCard({
                      title: "Nike M2K Tekno",
                      description: "Elevate Your Every Step",
                      price: "$149",
                      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
                      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
                    })
                  }
                  variant="outline"
                  className="w-full"
                >
                  Reset to Default
                </Button>
              </div>

              {/* Live Preview */}
              <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg p-8">
                <InteractiveProductCard
                  title={customCard.title}
                  description={customCard.description}
                  price={customCard.price}
                  imageUrl={customCard.imageUrl}
                  logoUrl={customCard.logoUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pre-built Examples */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Example Cards</h2>
          <p className="text-muted-foreground mb-6">
            Pre-configured examples to showcase different product categories
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
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
              title="Converse Chuck 70"
              description="Classic Street Style"
              price="$85"
              imageUrl="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=2021&auto=format&fit=crop"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg"
            />

            <InteractiveProductCard
              title="Air Jordan 1"
              description="Legendary Basketball Icon"
              price="$179"
              imageUrl="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2787&auto=format&fit=crop"
              logoUrl="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg"
            />

            <InteractiveProductCard
              title="Vans Old Skool"
              description="Off The Wall Forever"
              price="$70"
              imageUrl="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2043&auto=format&fit=crop"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg"
            />

            <InteractiveProductCard
              title="New Balance 574"
              description="Timeless Comfort Design"
              price="$95"
              imageUrl="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2064&auto=format&fit=crop"
              logoUrl="https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg"
            />
          </div>
        </div>

        {/* Implementation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Import the Component</h3>
              <code className="block bg-slate-100 p-3 rounded text-sm">
                {`import { InteractiveProductCard } from "@repo/shared-ui";`}
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Use in Your Page</h3>
              <code className="block bg-slate-100 p-3 rounded text-sm whitespace-pre">
                {`<InteractiveProductCard
  title="Product Name"
  description="Product Description"
  price="$99"
  imageUrl="https://example.com/product.jpg"
  logoUrl="https://example.com/brand-logo.svg"
/>`}
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Required Props</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li><strong>title:</strong> Product name (string)</li>
                <li><strong>description:</strong> Short tagline or description (string)</li>
                <li><strong>price:</strong> Display price (string)</li>
                <li><strong>imageUrl:</strong> Main product image URL (string)</li>
                <li><strong>logoUrl:</strong> Brand logo URL (string)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>3D tilt effect on mouse hover</li>
                <li>Smooth animations with hardware acceleration</li>
                <li>Glassmorphism UI with backdrop blur</li>
                <li>Responsive and mobile-optimized</li>
                <li>Customizable with className prop</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. Best Practices</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>Use high-quality images (minimum 800x1200px)</li>
                <li>Keep titles concise (2-4 words)</li>
                <li>Use taglines that convey brand value</li>
                <li>Ensure logo has transparent background (SVG or PNG)</li>
                <li>Test hover effects on both desktop and mobile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

