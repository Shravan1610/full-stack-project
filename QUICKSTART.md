# 🚀 Interactive Product Card - Quick Start

## ✅ You're All Set!

Your project already has everything needed. The component has been successfully integrated!

## 🎯 See It In Action (3 Steps)

### Step 1: Start Your Dev Server
```bash
cd apps/client
npm run dev
```

### Step 2: Visit Demo Pages

Open your browser and navigate to:

1. **User Demo Page**
   ```
   http://localhost:3000/demo/interactive-card
   ```
   - See 6 example cards with different sneaker brands
   - Full usage instructions
   - Props documentation

2. **Admin Preview Tool**
   ```
   http://localhost:3000/admin/preview-cards
   ```
   - Live card builder (edit and preview in real-time)
   - Pre-built examples
   - Implementation guide

### Step 3: Add to Your Pages

Choose one of these options:

#### Option A: Use the Ready-Made Component (Easiest! ⭐)

In any page, add:

```tsx
import { PremiumShowcase } from "@/components/blocks/PremiumShowcase";

export default function MyPage() {
  return (
    <>
      {/* Your existing content */}
      
      <PremiumShowcase limit={6} theme="dark" />
      
      {/* More content */}
    </>
  );
}
```

**That's it!** It will automatically fetch and display your featured products.

#### Option B: Use Individual Cards

```tsx
import { InteractiveProductCard } from "@/components/ui/card-7";

<InteractiveProductCard
  title="Nike M2K Tekno"
  description="Elevate Your Every Step"
  price="$149"
  imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  logoUrl="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
/>
```

#### Option C: Replace Your Homepage

```bash
# Backup your current homepage
mv apps/client/app/page.tsx apps/client/app/page-backup.tsx

# Use the enhanced version with premium showcase
mv apps/client/app/page-enhanced.tsx apps/client/app/page.tsx
```

Now visit `http://localhost:3000` to see your new homepage!

## 📁 What Was Added

### Main Component
- `apps/client/components/ui/card-7.tsx` - The interactive card component

### Ready-to-Use Wrapper
- `apps/client/components/blocks/PremiumShowcase.tsx` - Database-connected showcase

### Demo Pages
- `apps/client/app/demo/interactive-card/page.tsx` - User demo
- `apps/client/app/admin/preview-cards/page.tsx` - Admin tool
- `apps/client/app/page-enhanced.tsx` - Homepage example

### Documentation
- `INTERACTIVE_CARD_INTEGRATION.md` - Complete integration guide
- `QUICKSTART.md` - This file!

## 🎨 Customization Examples

### Change Number of Cards
```tsx
<PremiumShowcase limit={3} />  // Show 3 cards
<PremiumShowcase limit={9} />  // Show 9 cards
```

### Light Theme
```tsx
<PremiumShowcase theme="light" />
```

### Filter by Category
```tsx
<PremiumShowcase categoryId="your-category-id" />
```

### Custom Titles
```tsx
<PremiumShowcase
  title="Summer Collection"
  description="Hot styles for the season"
/>
```

## 💡 Pro Tips

1. **Best Use Cases**
   - Homepage hero sections
   - Featured product showcases
   - Landing pages
   - Admin product previews

2. **Image Requirements**
   - Use high-quality images (800x1200px minimum)
   - Portrait orientation works best
   - Ensure images are optimized (< 500KB)

3. **Performance**
   - Limit to 6-9 cards per section
   - Cards work best on desktop (mobile friendly but less interactive)
   - Use lazy loading for below-the-fold cards

## 🐛 Troubleshooting

**Cards not appearing?**
- Check browser console for errors
- Verify dev server is running
- Clear browser cache

**3D effect not working?**
- Make sure you're hovering over the card
- Check if using a modern browser (Chrome, Firefox, Safari, Edge)
- Effects work best on desktop

**Images not loading?**
- Verify image URLs are accessible
- Check CORS policy
- Try the example images from demo page first

## 📚 Learn More

For detailed documentation, see:
- `INTERACTIVE_CARD_INTEGRATION.md` - Complete guide
- Demo pages in your browser - Interactive examples
- Component code comments - Implementation details

## 🎉 You're Done!

The component is ready to use. Start with the demo pages to see it in action, then add it to your pages using the simple examples above.

**Questions?** Check the full integration guide in `INTERACTIVE_CARD_INTEGRATION.md`

---

**Happy building! 🚀**


