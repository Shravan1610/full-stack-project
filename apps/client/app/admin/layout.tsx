'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAdminAuth();

  // Show loading state
  if (loading) {
    return <AdminLayout loading />;
  }

  // If not admin, redirect is handled by hook
  if (!isAdmin) {
    return null;
  }

  // Render admin layout with children
  return <AdminLayout>{children}</AdminLayout>;
}




