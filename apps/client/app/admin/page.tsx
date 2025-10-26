'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { getOrderStats } from '@repo/shared-lib';
import { getCustomerStats } from '@repo/shared-lib';
import { supabase } from '@repo/database';

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  newCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    newCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [orderStats, customerStats] = await Promise.all([
        getOrderStats(),
        getCustomerStats(),
      ]);

      const { data: products } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('is_active', true);

      const { data: lowStock } = await supabase
        .from('product_variants')
        .select('id', { count: 'exact' })
        .lt('stock_quantity', 10)
        .eq('is_active', true);

      setStats({
        todayOrders: orderStats.todayOrders,
        todayRevenue: orderStats.todayRevenue,
        pendingOrders: orderStats.pendingOrders,
        totalRevenue: orderStats.totalRevenue,
        totalCustomers: customerStats.totalCustomers,
        newCustomers: customerStats.newToday,
        totalProducts: products?.length || 0,
        lowStockProducts: lowStock?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Overview of your store performance</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today&apos;s Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${stats.todayRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.todayOrders} orders today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.pendingOrders}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{stats.newCustomers} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.lowStockProducts} low stock items
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>All-time sales revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => router.push('/admin/products/new')}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Product
              </button>
              <button
                onClick={() => router.push('/admin/orders?status=pending')}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Pending Orders
              </button>
              <button
                onClick={() => router.push('/admin/categories')}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Manage Categories
              </button>
            </CardContent>
          </Card>
        </div>

        {stats.lowStockProducts > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <TrendingDown className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800">
                You have {stats.lowStockProducts} product variants with low stock (less than 10 units).
                Consider restocking to avoid running out.
              </p>
              <button
                onClick={() => router.push('/admin/products?filter=low-stock')}
                className="mt-4 px-4 py-2 text-sm font-medium text-orange-900 bg-orange-200 rounded-lg hover:bg-orange-300 transition-colors"
              >
                View Low Stock Products
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
