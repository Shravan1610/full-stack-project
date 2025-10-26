# Interactive Product Card Integration Guide

## ✅ Integration Status

Your project is **fully compatible** with the Interactive Product Card component!

### Project Setup Verification

- ✅ **shadcn/ui**: Already configured (`components.json` found)
- ✅ **TypeScript**: Version 5.2.2 installed
- ✅ **Tailwind CSS**: Properly configured with animations
- ✅ **Component Structure**: `/components/ui` folder exists
- ✅ **Dependencies**: All required packages installed
  - `clsx` ✓
  - `tailwind-merge` ✓
  - `lucide-react` ✓
  - `@radix-ui/*` packages ✓

## 📁 Files Created

### 1. Component File
- **Location**: `apps/client/components/ui/card-7.tsx`
- **Description**: The main InteractiveProductCard component with 3D tilt effects

### 2. Demo Pages
- **User Demo**: `apps/client/app/demo/interactive-card/page.tsx`
  - Accessible at: `/demo/interactive-card`
  - Shows 6 example cards with different products
  - Includes usage instructions and props documentation

- **Admin Preview**: `apps/client/app/admin/preview-cards/page.tsx`
  - Accessible at: `/admin/preview-cards`
  - Live card builder with custom inputs
  - Pre-built examples
  - Implementation guide

- **Enhanced Homepage**: `apps/client/app/page-enhanced.tsx`
  - Shows how to integrate the cards into the main homepage
  - Includes a "Premium Showcase" section

## 🎨 Component Features

### Interactive 3D Effects
- **Mouse Hover**: Creates a 3D tilt effect following cursor movement
- **Smooth Animations**: Hardware-accelerated transforms
- **Auto-Reset**: Returns to original position on mouse leave

### Design Elements
- **Glassmorphism**: Semi-transparent header with backdrop blur
- **Gradient Overlay**: Ensures text readability over images
- **3D Depth**: Layered elements with translateZ for depth
- **Pagination Dots**: Visual indicator at the bottom

### Responsive Design
- Works on desktop and mobile devices
- Touch-friendly interactions
- Aspect ratio maintained (9:12 portrait)

## 🚀 Usage

### Basic Import

```tsx
import { InteractiveProductCard } from "@/components/ui/card-7";
```

### Simple Example

```tsx
<InteractiveProductCard
  title="Nike M2K Tekno"
  description="Elevate Your Every Step"
  price="$149"
  imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
/>
```

### With Database Products

```tsx
// Example: Using with your ProductWithDetails type
import { InteractiveProductCard } from "@/components/ui/card-7";
import { getProducts } from "@repo/shared-lib";
import { ProductWithDetails } from "@repo/database";

export default async function PremiumShowcase() {
  const products = await getProducts({ isFeatured: true, limit: 6 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <InteractiveProductCard
          key={product.id}
          title={product.name}
          description={product.short_description || product.description}
          price={`$${product.base_price.toFixed(2)}`}
          imageUrl={product.images?.[0]?.image_url || '/placeholder.jpg'}
          logoUrl={product.brand_logo || '/default-logo.svg'}
        />
      ))}
    </div>
  );
}
```

### With Click Handler

```tsx
<Link href={`/products/${product.slug}`}>
  <InteractiveProductCard
    title={product.name}
    description={product.description}
    price={`$${product.base_price}`}
    imageUrl={product.images[0].image_url}
    logoUrl={product.brand_logo}
    className="cursor-pointer"
  />
</Link>
```

## 📋 Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Product name |
| `description` | `string` | Yes | Short tagline or description |
| `price` | `string` | Yes | Display price (e.g., "$149") |
| `imageUrl` | `string` | Yes | Main product image URL |
| `logoUrl` | `string` | Yes | Brand logo URL (SVG recommended) |
| `className` | `string` | No | Additional CSS classes |
| `...props` | `HTMLAttributes<HTMLDivElement>` | No | Any valid div attributes |

## 🎯 Where to Use

### Recommended Placements

1. **Homepage Hero Section**
   - Showcase 3-6 featured products
   - Create a "Premium Showcase" section
   - Example: See `app/page-enhanced.tsx`

2. **Product Category Pages**
   - Highlight top products in each category
   - Create visual hierarchy

3. **Landing Pages**
   - Promotional campaigns
   - New arrivals
   - Seasonal collections

4. **Admin Dashboard**
   - Product preview tool
   - Visual merchandising
   - Example: `/admin/preview-cards`

### NOT Recommended For

- Regular product grid (too large)
- Mobile-only layouts (better suited for desktop highlight)
- List views
- Search results (use standard cards)

## 🖼️ Image Guidelines

### Product Image
- **Minimum Resolution**: 800x1200px (portrait)
- **Aspect Ratio**: 3:4 or similar
- **Format**: JPG or WebP
- **File Size**: < 500KB (optimized)
- **Subject**: Centered product with clean background

### Brand Logo
- **Format**: SVG (recommended) or PNG with transparency
- **Size**: Vector or at least 200px wide
- **Color**: White or light color (displays on dark background)
- **Style**: Simple, recognizable

## 🎨 Customization

### Changing Card Size

```tsx
<InteractiveProductCard
  {...props}
  className="max-w-[280px]" // Smaller
/>

<InteractiveProductCard
  {...props}
  className="max-w-[400px]" // Larger
/>
```

### Adjusting Tilt Intensity

Edit `card-7.tsx`:

```tsx
// Current: 8deg max rotation
const rotateX = (y - height / 2) / (height / 2) * -8;
const rotateY = (x - width / 2) / (width / 2) * 8;

// More intense: 15deg
const rotateX = (y - height / 2) / (height / 2) * -15;
const rotateY = (x - width / 2) / (width / 2) * 15;

// Subtle: 5deg
const rotateX = (y - height / 2) / (height / 2) * -5;
const rotateY = (x - width / 2) / (width / 2) * 5;
```

### Custom Colors

The component uses Tailwind CSS variables, so it respects your theme:

- `bg-card`: Card background
- `text-white`: Text colors (hardcoded for contrast)
- Modify in `card-7.tsx` for custom colors

## 🧪 Testing

### View Demo Pages

1. **Start Development Server**
   ```bash
   cd apps/client
   npm run dev
   ```

2. **Navigate to Demo Pages**
   - User Demo: http://localhost:3000/demo/interactive-card
   - Admin Preview: http://localhost:3000/admin/preview-cards

### Test Checklist

- [ ] Hover effect works smoothly
- [ ] Card resets position on mouse leave
- [ ] Images load correctly
- [ ] Text is readable over images
- [ ] Component is responsive
- [ ] No console errors
- [ ] Works on different browsers

## 📱 Mobile Considerations

While the component works on mobile, the 3D tilt effect is mouse-based. Consider:

1. **Mobile Alternative**: Use standard cards on small screens
   ```tsx
   <div className="hidden md:block">
     <InteractiveProductCard {...props} />
   </div>
   <div className="md:hidden">
     <StandardCard {...props} />
   </div>
   ```

2. **Touch Events**: Could be added for mobile tilt (gyroscope)

## 🔧 Troubleshooting

### Images Not Loading
- Check CORS policy for external images
- Verify image URLs are accessible
- Use Next.js Image component for optimization

### 3D Effect Not Working
- Ensure `transform-style: preserve-3d` is applied
- Check browser compatibility (works in modern browsers)
- Verify no parent elements have `transform` that flattens 3D

### Performance Issues
- Reduce number of cards displayed simultaneously
- Optimize image sizes
- Use lazy loading for off-screen cards

## 🚀 Next Steps

### Option 1: Replace Current Homepage
```bash
# Backup current homepage
mv apps/client/app/page.tsx apps/client/app/page-original.tsx

# Use enhanced version
mv apps/client/app/page-enhanced.tsx apps/client/app/page.tsx
```

### Option 2: Create New Section
- Copy the "Premium Showcase" section from `page-enhanced.tsx`
- Paste into your existing `page.tsx`

### Option 3: Admin Only
- Keep the component for admin use
- Use `/admin/preview-cards` for product visualization

## 📚 Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d)

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure images are accessible
4. Test in demo pages first
5. Check Tailwind configuration

---

**Integration Complete! 🎉**

All files have been created and the component is ready to use. Visit the demo pages to see it in action!


