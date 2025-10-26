'use client';

import { ReactNode, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminBreadcrumb from './AdminBreadcrumb';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: ReactNode;
  loading?: boolean;
}

export default function AdminLayout({ children, loading = false }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="animate-pulse p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <AdminSidebar mobile onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 text-lg font-semibold">Admin Portal</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <main className="p-4 md:p-8">
          {/* Breadcrumb */}
          <AdminBreadcrumb />
          
          {/* Page Content */}
          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
