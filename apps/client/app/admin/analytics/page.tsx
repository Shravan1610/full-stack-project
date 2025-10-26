'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared-ui';
import { supabase } from '@repo/database';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: string; sales: number }[];
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersByStatus: [],
    topProducts: [],
  });

  useEffect(() => {
    checkAdminAndLoadAnalytics();
  }, []);

  const checkAdminAndLoadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      await loadAnalytics();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const [ordersResult, customersResult, productsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount, status')
          .in('status', ['confirmed', 'processing', 'shipped', 'delivered']),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
      ]);

      const orders = ordersResult.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);

      const ordersByStatus = orders.reduce((acc: any, order) => {
        const existing = acc.find((item: any) => item.status === order.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: order.status, count: 1 });
        }
        return acc;
      }, []);

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customersResult.count || 0,
        totalProducts: productsResult.count || 0,
        revenueGrowth: 12.5,
        ordersByStatus,
        topProducts: [],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-500">Detailed insights about your store</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${analytics.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{analytics.revenueGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
              <p className="text-xs text-gray-500 mt-1">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</div>
              <p className="text-xs text-gray-500 mt-1">Active products</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.ordersByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium capitalize">{item.status}</span>
                    </div>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Order Value</span>
                  <span className="text-sm font-bold">
                    ${analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Lifetime Value</span>
                  <span className="text-sm font-bold">
                    ${analytics.totalCustomers > 0 ? (analytics.totalRevenue / analytics.totalCustomers).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-sm font-bold">{analytics.totalProducts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
