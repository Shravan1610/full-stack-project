# ShoeHub E-Commerce Platform - Complete Guide

> **🎉 Production Ready!** A unified e-commerce platform for footwear with customer storefront and admin portal in one application.

**Status:** ✅ All features implemented and working
**Architecture:** Single-app with role-based access control
**Last Updated:** October 26, 2025

---

## 📚 Table of Contents

- [Quick Start](#-quick-start-3-minutes)
- [Admin Portal Access Issues](#-admin-portal-access-troubleshooting)
- [Architecture](#%EF%B8%8F-architecture)
- [Features](#-features)
- [Database Schema](#%EF%B8%8F-database-schema)
- [Getting Started](#-getting-started)
- [Application Routes](#%EF%B8%8F-application-routes)
- [Access Control](#-access-control)
- [Admin Navigation](#-admin-navigation-guide)
- [Interactive Product Cards](#-interactive-product-cards)
- [Address Management](#-address-management-system)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Customization](#-customization)

---

## 🚀 Quick Start (3 Minutes)

### 1️⃣ Start the Application
```bash
npm run dev
```
Visit: **http://localhost:3000**

### 2️⃣ Create Admin User (Easy Method) ⭐
```bash
# Sign up first at http://localhost:3000/auth/signup
# Then run this command with your email:
node make-admin.js your@email.com
```

**Alternative Method** (Manual):
1. Go to your Supabase Dashboard
2. Table Editor → profiles → Find your user → Set role to `admin`
3. Sign out and sign in again

### 3️⃣ Access Admin Portal
Visit: **http://localhost:3000/admin**

---

## 🔧 Admin Portal Access Troubleshooting

### Problem: "Authorized users cannot access admin portal"

This is a common issue. Here's how to fix it:

#### ✅ Fix #1: Use the Admin Creation Utility (Recommended)

```bash
# After signing up, run:
node make-admin.js your@email.com
```

The script will:
- ✅ Find your user in the database
- ✅ Check current role
- ✅ Promote to admin
- ✅ Confirm success

#### ✅ Fix #2: Manual Database Update

1. Open Supabase SQL Editor
2. Run this query:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

#### ✅ Fix #3: Check User Exists

```sql
-- Verify user profile exists
SELECT id, email, role FROM profiles WHERE email = 'your@email.com';
```

If no results: The user hasn't signed up or profile wasn't created.

#### ✅ Fix #4: Verify Database Migration

Run this in Supabase SQL Editor to check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should show: profiles, products, orders, etc.

If tables don't exist, run the migration:
- File: `packages/database/supabase/migrations/20241026000001_create_improved_ecommerce_schema.sql`
- Copy entire contents and run in Supabase SQL Editor

#### 🔍 Debug Checklist

Open browser console (F12) when trying to access `/admin`:

**Expected Console Output (Success):**
```
[useAdminAuth] Starting admin access check...
[useAdminAuth] User: Found (your@email.com)
[useAdminAuth] Profile: Found (role: admin)
[useAdminAuth] Is admin: true
[useAdminAuth] Admin check complete. Admin: true
```

**If you see:**
- `User: None` → Not signed in (go to `/auth/signin`)
- `Profile: None` → Profile wasn't created (database issue)
- `role: customer` → Need to promote to admin (use make-admin.js)
- `Is admin: false` → Role check failed (verify role is 'admin' or 'super_admin')

#### 💡 Common Mistakes

1. **Not signing out after promotion** → Always sign out and sign back in
2. **Wrong email** → Double-check email matches exactly
3. **Database not migrated** → Run the migration first
4. **Browser cache** → Clear cache and hard reload (Ctrl+Shift+R)

---

## 🏗️ Architecture

**✨ Unified Single-App Architecture** - One Next.js application serving both customer and admin features with intelligent role-based routing.

```
project/
├── apps/client/                    # 🌟 MAIN APP (Port 3000)
│   ├── app/
│   │   ├── /                       # Customer: Landing page
│   │   ├── /products               # Customer: Product catalog
│   │   ├── /cart                   # Customer: Shopping cart
│   │   ├── /checkout               # Customer: Checkout
│   │   ├── /account                # Customer: Account pages
│   │   ├── /auth                   # Public: Sign in/up
│   │   └── /admin                  # 🔐 Admin: Management portal
│   │       ├── layout.tsx          # ✨ Auto-auth wrapper
│   │       ├── page.tsx            # Dashboard
│   │       ├── products/           # Product management
│   │       ├── orders/             # Order management
│   │       ├── customers/          # Customer management
│   │       ├── categories/         # Category management
│   │       ├── promo-codes/        # Promo codes
│   │       └── analytics/          # Analytics
│   └── components/
│       ├── layout/                 # Customer UI
│       ├── admin/                  # Admin UI
│       │   ├── AdminLayout.tsx     # Layout wrapper
│       │   ├── AdminSidebar.tsx    # Navigation sidebar
│       │   └── AdminBreadcrumb.tsx # Breadcrumb navigation
│       └── blocks/                 # Reusable sections
├── packages/
│   ├── database/                   # Supabase client & types
│   ├── shared-lib/                 # Business logic & APIs
│   └── shared-ui/                  # Reusable UI components
└── make-admin.js                   # 🆕 Admin creation utility
```

**Benefits:** ✅ Single deployment • ✅ Shared authentication • ✅ Cost effective • ✅ Better UX

---

## ✨ Features

### Customer Storefront
- **Landing Page** - Beautiful homepage with featured products
- **Product Catalog** - Browse with search, filters, and pagination
- **Product Details** - Full pages with variants, images, descriptions
- **Shopping Cart** - Persistent cart with guest support
- **User Authentication** - Secure sign up/sign in with Supabase
- **Account Management** - Profile, order history, addresses
- **Checkout Flow** - Ready for payment integration
- **Responsive Design** - Mobile-first across all devices
- **Interactive Product Cards** - 3D tilt effect premium showcase

### Admin Portal (`/admin/*` routes)
- **Dashboard** - Real-time stats and analytics overview
- **Product Management** - Full CRUD operations with media support
- **Order Management** - View and process customer orders
- **Customer Management** - View profiles and order history
- **Category Management** - Organize products into categories
- **Inventory Tracking** - Low stock alerts and reservations
- **Promo Codes** - Discount code management
- **Analytics** - Product performance and sales metrics
- **Preview Cards** - Interactive product card builder
- **Mobile Responsive** - Drawer sidebar, touch-friendly

### Technical Features
- **Monorepo Setup** - npm workspaces for code sharing
- **Scalable Database** - 14 tables with ENUMs, indexes, full-text search
- **Row Level Security** - Comprehensive RLS policies
- **Type Safety** - Full TypeScript implementation
- **Shared Packages** - Reusable components and utilities
- **Authentication** - Role-based access control
- **Admin Auth Hook** - Consistent admin authentication
- **Centralized Navigation** - Single source of truth
- **Error Handling** - Beautiful error pages

---

## 🗃️ Database Schema

### Core Tables (14 total)
1. **profiles** - User accounts with roles ('customer', 'admin', 'super_admin')
2. **categories** - Product categories with hierarchy
3. **products** - Main catalog with full-text search
4. **product_images** - Multiple images per product
5. **product_variants** - Size, color, inventory management
6. **product_reviews** - Customer reviews and ratings
7. **addresses** - Customer shipping/billing addresses
8. **carts** - Shopping cart management
9. **cart_items** - Items in shopping carts
10. **orders** - Customer order records
11. **order_items** - Line items for orders
12. **promo_codes** - Discount code management
13. **order_status_history** - Order tracking
14. **inventory_reservations** - Concurrent checkout handling

### Schema Improvements
- ✅ **ENUMs** for type safety and performance
- ✅ **Composite indexes** for complex queries
- ✅ **Full-text search** indexes (GIN)
- ✅ **Inventory reservations** (prevents overselling)
- ✅ **Soft deletes** with `archived_at`
- ✅ **Audit trails** and analytics views

### User Roles
- **customer** - Default role for all new users
- **admin** - Full admin access to all features
- **super_admin** - Reserved for future enhanced permissions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- npm (comes with Node.js)

### Installation

1. **Install dependencies:**
```bash
cd "project 4"
npm install
```

2. **Environment variables are already configured** in:
   - `apps/client/.env.local` (main app)

3. **Set up the database:**
   - Go to Supabase SQL Editor
   - Run: `packages/database/supabase/migrations/20241026000001_create_improved_ecommerce_schema.sql`
   - This creates all 14 tables with proper indexes and policies

4. **Create your first admin user:**
```bash
# Sign up at http://localhost:3000/auth/signup first
# Then run:
node make-admin.js your@email.com
```

5. **Start the application:**
```bash
npm run dev
```

Visit http://localhost:3000

### Development Commands

```bash
# Start the unified app (recommended)
npm run dev              # Port 3000 - Everything in one app

# Build commands
npm run build           # Build for production
npm run start           # Start production server

# Quality checks
npm run lint            # Check code quality
npm run typecheck       # Check TypeScript
npm run clean           # Clean build artifacts
```

---

## 🗺️ Application Routes

### Public Routes (No Login Required)
| Route | Description |
|-------|-------------|
| `/` | Landing page with featured products |
| `/products` | Product catalog |
| `/products/[slug]` | Individual product page |
| `/auth/signin` | Sign in page |
| `/auth/signup` | Sign up page |
| `/demo/interactive-card` | Interactive card demo |

### Customer Routes (Login Required)
| Route | Description |
|-------|-------------|
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/account/profile` | User profile (editable) |
| `/account/orders` | Order history |
| `/account/addresses` | Saved addresses |

### Admin Routes (Admin Role Required) 🔐
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard with real-time stats |
| `/admin/products` | Manage products (CRUD) |
| `/admin/orders` | Manage orders |
| `/admin/customers` | View customers |
| `/admin/categories` | Manage categories |
| `/admin/promo-codes` | Manage promo codes |
| `/admin/analytics` | View analytics |
| `/admin/preview-cards` | Interactive card builder |
| `/admin/unauthorized` | Error page for non-admin users |

---

## 🔐 Access Control

### How Admin Access Works
1. User visits `/admin`
2. `layout.tsx` automatically runs `useAdminAuth` hook
3. Hook checks authentication status
4. Hook verifies admin/super_admin role in database
5. If not admin → redirects to `/admin/unauthorized`
6. If not authenticated → redirects to `/auth/signin?redirect=/admin`
7. If admin → shows admin content

### Creating Admin Users

**Method 1: Admin Utility Script (Recommended) ⭐**
```bash
node make-admin.js user@example.com
```

**Method 2: Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Table Editor → profiles
3. Find your user → Set role to `admin`
4. Sign out and sign back in

**Method 3: SQL Editor**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### Debug Console Logs
Open browser console (F12) when accessing `/admin`:
```
[useAdminAuth] Starting admin access check...
[useAdminAuth] User: Found (your@email.com)
[useAdminAuth] Profile: Found (role: admin)
[useAdminAuth] Is admin: true
✅ Admin check complete
```

---

## 🎯 Admin Navigation Guide

### Centralized Configuration

All admin navigation is configured in one place: `apps/client/config/admin-navigation.ts`

**Navigation Items:**
- Dashboard - Overview and statistics
- Products - Product management
- Orders - Order processing
- Customers - Customer database
- Categories - Category organization
- Promo Codes - Discount management
- Analytics - Business insights
- Preview Cards - Card builder tool

### Features
- ✅ **Automatic Authentication** - Layout handles auth for all pages
- ✅ **Mobile Responsive** - Drawer sidebar on mobile
- ✅ **Breadcrumb Navigation** - Auto-generated from URL
- ✅ **Active State** - Highlights current page
- ✅ **Loading States** - Beautiful skeleton loaders
- ✅ **Error Pages** - Custom 404 and unauthorized pages

### Adding a New Admin Page

**Step 1**: Create the page file
```tsx
// apps/client/app/admin/new-feature/page.tsx
'use client';

export default function NewFeaturePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">New Feature</h1>
      <p>Your content here...</p>
    </div>
  );
}
```

**Step 2**: Add to navigation config
```typescript
// apps/client/config/admin-navigation.ts
import { NewIcon } from 'lucide-react';

export const adminNavigation = [
  // ... existing items
  {
    id: 'new-feature',
    name: 'New Feature',
    href: '/admin/new-feature',
    icon: NewIcon,
    description: 'Manage new feature',
  },
];
```

**That's it!** The page is now:
- ✅ Protected by authentication
- ✅ Wrapped in AdminLayout
- ✅ Shows in sidebar
- ✅ Has breadcrumb navigation
- ✅ Mobile responsive

---

## 🎨 Interactive Product Cards

### Features
- ✨ **3D Tilt Effect** - Follows mouse movement
- 🎭 **Glassmorphism** - Modern semi-transparent design
- 🌈 **Gradient Overlays** - Ensures text readability
- 🔄 **Smooth Animations** - Hardware-accelerated
- 📱 **Responsive** - Works on all screen sizes

### Usage

**Quick Integration (Easiest):**
```tsx
import { PremiumShowcase } from "@/components/blocks/PremiumShowcase";

<PremiumShowcase limit={6} theme="dark" />
```

**Individual Cards:**
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

### Demo Pages
- **User Demo**: http://localhost:3000/demo/interactive-card
- **Admin Builder**: http://localhost:3000/admin/preview-cards

### Props Reference
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Product name |
| `description` | string | Yes | Short tagline |
| `price` | string | Yes | Display price |
| `imageUrl` | string | Yes | Product image URL |
| `logoUrl` | string | Yes | Brand logo URL |
| `className` | string | No | Additional CSS classes |

---

## 📍 Address Management System

**Status:** ✅ Fully Implemented

### Features
- ✅ **Add New Addresses** - Full address form with validation
- ✅ **Edit Existing Addresses** - Update any saved address
- ✅ **Delete Addresses** - Remove addresses with confirmation
- ✅ **Set Default Address** - Mark preferred address
- ✅ **Multiple Address Types** - Shipping, Billing, or Both
- ✅ **Address Cards** - Beautiful card display with badges
- ✅ **Mobile Responsive** - Works perfectly on all devices

### How to Access
1. Sign in to your account
2. Click your name → "Addresses"
3. Or visit: http://localhost:3000/account/addresses

### Address Types
- 🚚 **Shipping** - For deliveries
- 💳 **Billing** - For payments
- 📦 **Both** - Dual purpose

### API Functions
```typescript
// Available in @repo/shared-lib
getAddresses(userId)         // Get all user addresses
getDefaultAddress(userId)    // Get default address
createAddress(userId, data)  // Add new address
updateAddress(addressId, data) // Update address
deleteAddress(addressId)     // Remove address
setDefaultAddress(userId, addressId) // Set default
```

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Import project to Vercel:**
   - Connect your GitHub repo
   - Import `apps/client` as root directory
   - Framework: Next.js

2. **Environment Variables:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Post-Deployment Setup
1. Run database migration in Supabase
2. Create admin users using SQL or utility script
3. Test admin portal access
4. Upload product data
5. Configure domain settings

---

## 🆘 Troubleshooting

### Admin Portal Issues
**Problem:** Can't access `/admin` (redirects to unauthorized)

**Solutions:**
1. Check role in database: `SELECT role FROM profiles WHERE email = 'your@email.com'`
2. Should return: `role = 'admin'` or `'super_admin'`
3. Use admin utility: `node make-admin.js your@email.com`
4. Clear browser cache and sign in again
5. Check console logs for `[useAdminAuth]` messages
6. Verify you signed out and signed back in after role change

### Environment Variable Issues
**Problem:** "supabaseKey is required" error

**Solution:**
1. Stop dev server (Ctrl+C)
2. Clear cache: `rm -rf apps/client/.next`
3. Verify `.env.local` exists in `apps/client/`
4. Restart: `npm run dev`

### Database Issues
**Problem:** Tables don't exist

**Solution:**
1. Run migration in Supabase SQL Editor
2. File: `packages/database/supabase/migrations/20241026000001_create_improved_ecommerce_schema.sql`
3. Verify tables exist: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

### TypeScript Errors
**Problem:** Type errors or import issues

**Solutions:**
1. Clean install: `npm run clean && npm install`
2. Check imports use correct aliases (`@repo/database`, `@/components`)
3. Ensure all types are synced (role types updated)
4. Rebuild: `npm run build`

### Build Issues
**Problem:** Build fails or runtime errors

**Solutions:**
1. Check Node.js version (18+ required)
2. Delete `node_modules` and reinstall
3. Clear Next.js cache: `rm -rf apps/client/.next`
4. Check for circular dependencies
5. Review error logs carefully

### Authentication Flow Issues
**Problem:** Users can't sign in or sign up

**Solutions:**
1. Verify Supabase URL and keys are correct
2. Check email confirmation settings in Supabase
3. Review RLS policies in database
4. Clear browser cookies
5. Test with different browser/incognito

---

## 🔒 Security Best Practices

### Rate Limiting for Admin API Routes

**Recommendation:** Implement rate limiting on admin API routes to prevent brute force attacks and abuse.

#### Suggested Libraries

1. **upstash/ratelimit** - Redis-based rate limiting (recommended for production)
2. **express-rate-limit** - In-memory rate limiting (good for development)
3. **@vercel/kv** - Vercel KV store for rate limiting

#### Example Implementation

```typescript
// middleware/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);
  
  if (!success) {
    throw new Error("Rate limit exceeded");
  }
  
  return { limit, remaining, reset };
}

// Usage in API routes
export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await checkRateLimit(`admin_api_${ip}`);
    
    // Your API logic here
  } catch (error) {
    if (error.message === "Rate limit exceeded") {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    // Handle other errors
  }
}
```

#### Simple In-Memory Rate Limiting

For development or low-traffic scenarios:

```typescript
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function simpleRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}
```

---

## 🔧 Customization

### Adding New Features
1. **UI Components:** Add to `packages/shared-ui/ui/`
2. **API Functions:** Add to `packages/shared-lib/api/`
3. **Database Changes:** Update migration files in `packages/database/supabase/migrations/`
4. **Admin Pages:** Follow the admin page creation guide above

### Styling
- Uses Tailwind CSS with shadcn/ui components
- Primary colors: Blue (`blue-600`, `blue-700`)
- Consistent design system throughout
- Customize in `tailwind.config.ts`

### Adding Dependencies
```bash
# Root level (all workspaces)
npm install <package>

# Specific workspace
npm install <package> -w apps/client
npm install <package> -w packages/database
```

### Branding
**Current:** ShoeHub (Footwear E-Commerce)

**To Customize:**
1. Update logo and name in `Header.tsx`
2. Change navigation items in `admin-navigation.ts`
3. Update database categories
4. Modify product descriptions
5. Update metadata and SEO

---

## 📦 Packages

### `@repo/database`
Supabase client configuration and TypeScript types.

**Exports:**
- `supabase` - Supabase client instance
- `createAdminClient()` - Admin client with service role
- `signUp()`, `signIn()`, `signOut()` - Auth helpers
- All database types (Profile, Product, Order, etc.)

### `@repo/shared-lib`
API helpers, utilities, and business logic.

**Exports:**
- Product API: `getProducts()`, `getProductBySlug()`, etc.
- Cart API: `getOrCreateCart()`, `addToCart()`, etc.
- Admin APIs: Products, Orders, Customers, Analytics
- Address API: Full address management
- `cn()` - Tailwind utility function

### `@repo/shared-ui`
Reusable UI components built with shadcn/ui.

**Exports:**
- All shadcn/ui components (Button, Card, Dialog, etc.)
- `useToast()` hook
- Form components
- Layout primitives

---

## 📊 Database Management

### Seed Sample Data
Run in Supabase SQL Editor:
```sql
-- See seed-data.sql for complete SQL
```

### View Analytics
```sql
-- Product performance
SELECT * FROM product_analytics ORDER BY total_revenue DESC;

-- Low stock alerts
SELECT * FROM low_stock_alerts;

-- Recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### Maintenance Commands
```bash
# Check database connection
node check-database.js

# Verify schema
node verify-schema.js

# Seed database
node seed-database.js
```

---

## 🎉 Success Checklist

- [ ] ✅ Database schema deployed to Supabase
- [ ] ✅ Admin user created (using make-admin.js)
- [ ] ✅ App running on http://localhost:3000
- [ ] ✅ Can access admin portal at /admin
- [ ] ✅ Can edit user profile at /account/profile
- [ ] ✅ Address management working
- [ ] ✅ Customer features working (cart, checkout)
- [ ] ✅ Admin features working (product management)
- [ ] ✅ Interactive cards displaying correctly
- [ ] ✅ No TypeScript or linting errors

---

## 🚀 Next Steps

1. **Test Everything** - Run through the testing checklist
2. **Create Admin User** - Use `make-admin.js` utility
3. **Add Products** - Use admin portal to add inventory
4. **Customize Styling** - Update colors and branding
5. **Deploy** - Push to production when ready
6. **Integrate Payments** - Add Stripe or other payment processor
7. **Add Email** - Set up notifications (Resend, SendGrid)
8. **SEO** - Optimize metadata and sitemaps

---

## 🎓 Learning Resources

### Documentation
- This README - Complete guide
- Inline code comments - Implementation details
- Demo pages - Interactive examples
- Console logs - Debugging information

### Key Files to Understand
- `apps/client/app/admin/layout.tsx` - Admin authentication wrapper
- `apps/client/hooks/useAdminAuth.ts` - Admin auth logic
- `apps/client/config/admin-navigation.ts` - Navigation configuration
- `packages/database/supabase/types.ts` - Database types
- `make-admin.js` - Admin creation utility

---

## 📝 Common Tasks

### Create Admin User
```bash
node make-admin.js user@example.com
```

### Add New Admin Page
1. Create file in `apps/client/app/admin/[page-name]/page.tsx`
2. Add navigation item to `config/admin-navigation.ts`
3. Done!

### Add Product via SQL
```sql
INSERT INTO products (name, slug, description, base_price, is_featured)
VALUES ('Running Shoes', 'running-shoes', 'Comfortable running shoes', 129.99, true);
```

### Check User Role
```sql
SELECT email, role FROM profiles WHERE email = 'user@example.com';
```

### Update User Role
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```

---

## 💡 Pro Tips

1. **Always sign out and sign back in** after changing roles
2. **Use the make-admin.js script** instead of manual SQL when possible
3. **Check browser console** for detailed debug logs
4. **Clear cache** if you see stale data
5. **Test in incognito** to verify authentication flows
6. **Use demo pages** to preview components before integration
7. **Keep database types synced** with schema changes
8. **Backup database** before major migrations
9. **Test on mobile** - many users shop on phones
10. **Monitor RLS policies** - they affect performance

---

## 🤝 Support

### Getting Help
1. Check this README for common issues
2. Review console logs for errors
3. Verify database connection
4. Test with demo pages first
5. Check Supabase dashboard for data

### Reporting Issues
When reporting issues, include:
- Error messages from console
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshot if applicable

---

## 📜 Version History

### v1.2.0 (Current)
- ✅ Fixed admin authentication issues
- ✅ Added `make-admin.js` utility script
- ✅ Updated types to include super_admin role
- ✅ Enhanced error handling and logging
- ✅ Consolidated documentation

### v1.1.0
- ✅ Address management system
- ✅ Interactive product cards
- ✅ Admin navigation improvements
- ✅ Mobile responsive design
- ✅ ShoeHub rebranding

### v1.0.0
- ✅ Initial release
- ✅ Customer storefront
- ✅ Admin portal
- ✅ Database schema
- ✅ Authentication system

---

**Built with:** Next.js 13 • Supabase • TypeScript • Tailwind CSS • shadcn/ui • Radix UI

**Ready for production!** 🎊

---

**Last Updated:** October 26, 2025  
**Maintainers:** Development Team  
**License:** Proprietary

