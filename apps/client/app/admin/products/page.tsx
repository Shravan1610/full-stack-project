"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import ProductsTable from '@/components/admin/products/ProductsTable';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminProductsPage() {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <ProductsTable />
      </div>
    </AdminLayout>
  );
}
