"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@repo/shared-ui';
import { Input } from '@repo/shared-ui';
import { Textarea } from '@repo/shared-ui';
import { supabase } from '@repo/database';

type Props = {
  product?: any;
  onSuccess?: (product: any) => void;
};

export default function ProductForm({ product, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    base_price: product?.base_price || 0,
    category_id: product?.category_id || '',
    is_active: product?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      base_price: product.base_price || 0,
      category_id: product.category_id || '',
      is_active: product.is_active ?? true,
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (product?.id) {
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Update failed');
        onSuccess?.(json.product);
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Create failed');
        onSuccess?.(json);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <Input type="number" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{product ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
