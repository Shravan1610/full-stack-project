import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  Percent,
  BarChart3,
  Eye,
  LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

export const adminNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    id: 'products',
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage products and inventory',
  },
  {
    id: 'orders',
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'View and manage orders',
  },
  {
    id: 'customers',
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management',
  },
  {
    id: 'categories',
    name: 'Categories',
    href: '/admin/categories',
    icon: Tags,
    description: 'Product categories',
  },
  {
    id: 'promo-codes',
    name: 'Promo Codes',
    href: '/admin/promo-codes',
    icon: Percent,
    description: 'Discount codes and promotions',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Sales and performance analytics',
  },
  {
    id: 'preview-cards',
    name: 'Preview Cards',
    href: '/admin/preview-cards',
    icon: Eye,
    description: 'Interactive product card previews',
  },
];

export const getNavigationItem = (href: string): NavigationItem | undefined => {
  return adminNavigation.find((item) => item.href === href);
};

export const getPageTitle = (pathname: string): string => {
  const item = adminNavigation.find((item) => item.href === pathname);
  return item ? `${item.name} - Admin` : 'Admin';
};




