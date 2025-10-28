'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { adminNavigation } from '@/config/admin-navigation';

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on dashboard
  if (pathname === '/admin') {
    return null;
  }

  // Generate breadcrumb items
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const navItem = adminNavigation.find((item) => item.href === href);
    
    return {
      name: navItem?.name || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href,
      icon: navItem?.icon,
    };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      {/* Home/Dashboard Link */}
      <Link
        href="/admin"
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = crumb.icon;

        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-gray-900 flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-gray-700 transition-colors flex items-center gap-2"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}








