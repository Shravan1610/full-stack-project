"use client";

import { InteractiveProductCard } from "@repo/shared-ui";

export default function InteractiveProductCardDemo() {
  return (
    <div className="min-h-screen w-full bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interactive Product Cards</h1>
          <p className="text-muted-foreground">
            Hover over the cards to see the 3D tilt effect. These cards are perfect for showcasing featured products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {/* Nike Sneakers */}
          <InteractiveProductCard
            title="Nike M2K Tekno"
            description="Elevate Your Every Step"
            price="$149"
            imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
          />

          {/* Adidas Sneakers */}
          <InteractiveProductCard
            title="Adidas Ultraboost"
            description="Endless Energy Returns"
            price="$189"
            imageUrl="https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
          />

          {/* Converse Sneakers */}
          <InteractiveProductCard
            title="Converse Chuck 70"
            description="Classic Street Style"
            price="$85"
            imageUrl="https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg"
          />

          {/* Air Jordan */}
          <InteractiveProductCard
            title="Air Jordan 1"
            description="Legendary Basketball Icon"
            price="$179"
            imageUrl="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg"
          />

          {/* Vans Sneakers */}
          <InteractiveProductCard
            title="Vans Old Skool"
            description="Off The Wall Forever"
            price="$70"
            imageUrl="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg"
          />

          {/* New Balance */}
          <InteractiveProductCard
            title="New Balance 574"
            description="Timeless Comfort Design"
            price="$95"
            imageUrl="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            logoUrl="https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg"
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Usage Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Import the component:</h3>
              <code className="block bg-background p-3 rounded">
                {`import { InteractiveProductCard } from "@repo/shared-ui";`}
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Use it in your component:</h3>
              <code className="block bg-background p-3 rounded whitespace-pre">
                {`<InteractiveProductCard
  title="Product Name"
  description="Product Description"
  price="$99"
  imageUrl="https://example.com/image.jpg"
  logoUrl="https://example.com/logo.svg"
/>`}
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Props:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>title:</strong> Product name (string)</li>
                <li><strong>description:</strong> Short product description (string)</li>
                <li><strong>price:</strong> Product price display (string)</li>
                <li><strong>imageUrl:</strong> Main product image URL (string)</li>
                <li><strong>logoUrl:</strong> Brand logo URL (string)</li>
                <li><strong>className:</strong> Optional additional CSS classes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>3D tilt effect on mouse hover</li>
                <li>Smooth animations and transitions</li>
                <li>Glassmorphism design with backdrop blur</li>
                <li>Responsive and mobile-friendly</li>
                <li>Accessible with proper ARIA labels</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


