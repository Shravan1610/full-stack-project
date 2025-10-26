# Interactive Product Card - Component Structure

## 📊 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                  Your Next.js Application                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────┐
│   Homepage   │    │  Category Pages  │   │ Landing Page │
│  page.tsx    │    │                  │   │              │
└──────────────┘    └──────────────────┘   └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │   PremiumShowcase.tsx       │
                │   (Database Connected)      │
                │   • Fetches products        │
                │   • Handles loading state   │
                │   • Renders cards grid      │
                └─────────────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │   InteractiveProductCard    │
                │   (card-7.tsx)              │
                │   • 3D tilt effect          │
                │   • Glassmorphism UI        │
                │   • Smooth animations       │
                └─────────────────────────────┘
```

## 📁 File Organization

```
project-root/
│
├── apps/client/
│   ├── components/
│   │   ├── ui/
│   │   │   └── card-7.tsx                    ← Core Component
│   │   │       • InteractiveProductCard
│   │   │       • Props: title, description, price, imageUrl, logoUrl
│   │   │       • Features: 3D tilt, animations
│   │   │
│   │   └── blocks/
│   │       └── PremiumShowcase.tsx           ← Database Wrapper
│   │           • Fetches products from DB
│   │           • Renders grid of cards
│   │           • Customizable props
│   │
│   └── app/
│       ├── demo/
│       │   └── interactive-card/
│       │       └── page.tsx                  ← User Demo
│       │           • 6 example cards
│       │           • Usage instructions
│       │           • URL: /demo/interactive-card
│       │
│       ├── admin/
│       │   └── preview-cards/
│       │       └── page.tsx                  ← Admin Tool
│       │           • Live card builder
│       │           • Custom preview
│       │           • URL: /admin/preview-cards
│       │
│       └── page-enhanced.tsx                 ← Homepage Example
│           • Enhanced homepage
│           • Premium showcase section
│
└── Documentation/
    ├── QUICKSTART.md                         ← Start Here!
    ├── INTEGRATION_SUMMARY.md                ← Status & Overview
    ├── INTERACTIVE_CARD_INTEGRATION.md       ← Detailed Guide
    └── COMPONENT_STRUCTURE.md                ← This File
```

## 🔄 Data Flow

```
User Database (Supabase)
        │
        │ getProducts()
        ▼
┌─────────────────────┐
│  PremiumShowcase    │
│  • limit: 6         │
│  • theme: "dark"    │
└─────────────────────┘
        │
        │ Maps products
        ▼
┌─────────────────────┐
│ InteractiveCard #1  │  ─┐
└─────────────────────┘   │
                          │ Grid Display
┌─────────────────────┐   │
│ InteractiveCard #2  │  ─┤ (3 columns)
└─────────────────────┘   │
                          │
┌─────────────────────┐   │
│ InteractiveCard #3  │  ─┘
└─────────────────────┘
```

## 🎨 Component Props Flow

### InteractiveProductCard (Low Level)

```typescript
<InteractiveProductCard
  title: string              // "Nike M2K Tekno"
  description: string        // "Elevate Your Every Step"
  price: string             // "$149"
  imageUrl: string          // Product image URL
  logoUrl: string           // Brand logo URL
  className?: string        // Optional CSS classes
  ...HTMLDivAttributes      // Any div props
/>
```

### PremiumShowcase (High Level)

```typescript
<PremiumShowcase
  limit?: number            // Default: 6
  categoryId?: string       // Filter by category
  onlyFeatured?: boolean    // Default: true
  title?: string           // Section title
  description?: string     // Section description
  theme?: "dark" | "light" // Default: "dark"
/>
```

## 🔌 Integration Patterns

### Pattern 1: Quick Integration (Easiest)

```tsx
// In any page component
import { PremiumShowcase } from "@/components/blocks/PremiumShowcase";

export default function MyPage() {
  return (
    <>
      <PremiumShowcase limit={6} theme="dark" />
    </>
  );
}
```

**Use Case**: Quick showcase of featured products

---

### Pattern 2: Custom Data (More Control)

```tsx
import { InteractiveProductCard } from "@/components/ui/card-7";
import { getProducts } from "@repo/shared-lib";

export default async function CustomPage() {
  const products = await getProducts({ limit: 3 });

  return (
    <div className="grid grid-cols-3 gap-8">
      {products.map(product => (
        <InteractiveProductCard
          key={product.id}
          title={product.name}
          description={product.description}
          price={`$${product.base_price}`}
          imageUrl={product.images[0].url}
          logoUrl={product.brand_logo}
        />
      ))}
    </div>
  );
}
```

**Use Case**: Custom product selection or layout

---

### Pattern 3: Static Showcase (No Database)

```tsx
import { InteractiveProductCard } from "@/components/ui/card-7";

const FEATURED_PRODUCTS = [
  {
    title: "Nike M2K Tekno",
    description: "Elevate Your Every Step",
    price: "$149",
    imageUrl: "https://...",
    logoUrl: "https://..."
  },
  // ... more products
];

export default function StaticShowcase() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {FEATURED_PRODUCTS.map(product => (
        <InteractiveProductCard {...product} />
      ))}
    </div>
  );
}
```

**Use Case**: Landing pages, marketing campaigns

## 🔍 Component Internals

### InteractiveProductCard Lifecycle

```
1. Component Mounts
   ├─ Initialize refs (cardRef)
   └─ Set initial state (style)

2. User Hovers Over Card
   ├─ onMouseMove triggered
   ├─ Calculate mouse position
   ├─ Compute rotation angles
   └─ Update style state → triggers re-render

3. Re-render with New Style
   ├─ Apply transform: rotateX() rotateY() scale3d()
   └─ CSS transitions smooth the animation

4. User Moves Mouse Out
   ├─ onMouseLeave triggered
   ├─ Reset style to default
   └─ CSS transitions animate back

5. Component Unmounts
   └─ Cleanup (automatic)
```

## 🎯 Use Case Matrix

| Use Case | Component | Props Example |
|----------|-----------|---------------|
| **Homepage showcase** | PremiumShowcase | `limit={6}` |
| **Category highlights** | PremiumShowcase | `categoryId="123"` |
| **Admin preview** | Demo page | Visit `/admin/preview-cards` |
| **Custom layout** | InteractiveProductCard | Map over custom data |
| **Landing page** | InteractiveProductCard | Static content |
| **Marketing campaign** | Both | Mix and match |

## 🛠️ Customization Points

### 1. Card Appearance

**File**: `components/ui/card-7.tsx`

```tsx
// Line 59: Card size
className="w-full max-w-[340px]"  // Change max-w value

// Line 31-32: Tilt intensity
const rotateX = ... * -8;  // Change multiplier
const rotateY = ... * 8;   // Change multiplier

// Line 93: Glassmorphism header
className="bg-white/5 backdrop-blur-md"  // Adjust opacity
```

### 2. Grid Layout

**File**: `components/blocks/PremiumShowcase.tsx`

```tsx
// Line 138: Grid columns
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Change to: lg:grid-cols-4 for 4 columns
```

### 3. Section Theme

**Usage**: Pass theme prop

```tsx
<PremiumShowcase theme="dark" />   // Dark background
<PremiumShowcase theme="light" />  // Light background
```

## 📚 Related Files

### Dependencies Used

- `react` - Core React hooks (useRef, useState)
- `@repo/shared-lib` - cn() utility, getProducts()
- `@repo/database` - ProductWithDetails type
- `@repo/shared-ui` - UI components (Button, Badge, etc.)
- `lucide-react` - Icons

### Styles Applied

- Tailwind CSS classes
- Custom CSS transforms
- CSS transitions
- Glassmorphism effects

## 🎓 Learning Resources

### Component Code

1. **card-7.tsx** - Study the 3D transform logic
2. **PremiumShowcase.tsx** - See data fetching pattern
3. **Demo pages** - Interactive examples

### Documentation

1. **QUICKSTART.md** - Get started fast
2. **INTEGRATION_SUMMARY.md** - Overview
3. **INTERACTIVE_CARD_INTEGRATION.md** - Deep dive

## 🚀 Quick Reference

### URLs (When Dev Server Running)

```
User Demo:    http://localhost:3000/demo/interactive-card
Admin Tool:   http://localhost:3000/admin/preview-cards
Homepage:     http://localhost:3000
```

### Import Paths

```tsx
// Core component
import { InteractiveProductCard } from "@/components/ui/card-7";

// Database wrapper
import { PremiumShowcase } from "@/components/blocks/PremiumShowcase";
```

### Minimal Example

```tsx
<InteractiveProductCard
  title="Product"
  description="Description"
  price="$99"
  imageUrl="https://..."
  logoUrl="https://..."
/>
```

---

**Ready to integrate? Start with QUICKSTART.md!** 🚀


