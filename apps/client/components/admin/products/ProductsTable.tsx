"use client";

import React, { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { supabase } from '@repo/database';

export default function ProductsTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const fetchPage = async (p = page) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const url = new URL('/api/admin/products', window.location.origin);
      url.searchParams.set('page', String(p));
      url.searchParams.set('pageSize', String(pageSize));

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch admin products: ${res.status}`);
      }

      const result = await res.json();
      setData(result.products || []);
      setTotal(result.total);
      setPage(result.page || p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Archive this product?')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (!res.ok) throw new Error('Failed to archive');
      await fetchPage(page);
    } catch (err) {
      console.error(err);
      alert('Error archiving product');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to duplicate');
      await fetchPage(1);
    } catch (err) {
      console.error(err);
      alert('Error duplicating product');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'name',
      header: 'Name',
      render: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.slug}</div>
        </div>
      ),
    },
    { key: 'base_price', header: 'Price', render: (r: any) => `$${(r.base_price || 0).toFixed(2)}` },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <button onClick={() => (window.location.href = `/admin/products/${row.id}/edit`)} className="px-2 py-1 border rounded text-sm">
            Edit
          </button>
          <button onClick={() => handleDuplicate(row.id)} className="px-2 py-1 border rounded text-sm">
            Duplicate
          </button>
          <button onClick={() => handleDelete(row.id)} className="px-2 py-1 border rounded text-sm text-red-600">
            Archive
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex gap-2">
          <button onClick={() => (window.location.href = '/admin/products/new')} className="px-3 py-1 bg-black text-white rounded">
            New Product
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <DataTable columns={columns} data={data} page={page} pageSize={pageSize} total={total} onPageChange={(p) => { setPage(p); fetchPage(p); }} />
      )}
    </div>
  );
}
