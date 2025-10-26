'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminOrdersPage() {
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
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>

          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Order Management Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Full order management interface with status updates, tracking, and fulfillment
            </p>
            <Button onClick={() => router.push('/admin')}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
}
