'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';
import { Input } from '@repo/shared-ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/shared-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/shared-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/shared-ui';
import { Badge } from '@repo/shared-ui';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getAdminPromoCodes, createPromoCode, updatePromoCode, deletePromoCode, PromoCodeFormData } from '@repo/shared-lib';
import { supabase } from '@repo/database';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminPromoCodesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [formData, setFormData] = useState<PromoCodeFormData>({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    is_active: true,
  });

  useEffect(() => {
    checkAdminAndLoadPromoCodes();
  }, []);

  const checkAdminAndLoadPromoCodes = async () => {
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

      await loadPromoCodes();
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    }
  };

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const data = await getAdminPromoCodes();
      setPromoCodes(data);
    } catch (error) {
      console.error('Error loading promo codes:', error);
      toast.error('Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingPromo) {
        await updatePromoCode(editingPromo.id, formData);
        toast.success('Promo code updated successfully');
      } else {
        await createPromoCode(formData);
        toast.success('Promo code created successfully');
      }
      setShowDialog(false);
      resetForm();
      loadPromoCodes();
    } catch (error) {
      console.error('Error saving promo code:', error);
      toast.error('Failed to save promo code');
    }
  };

  const handleEdit = (promo: any) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_purchase_amount: promo.min_purchase_amount,
      max_uses: promo.max_uses,
      valid_from: promo.valid_from,
      valid_until: promo.valid_until,
      is_active: promo.is_active,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await deletePromoCode(id);
      toast.success('Promo code deleted successfully');
      loadPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      toast.error('Failed to delete promo code');
    }
  };

  const resetForm = () => {
    setEditingPromo(null);
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      is_active: true,
    });
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
            <p className="mt-1 text-gray-500">Manage discount codes</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Promo Code
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No promo codes found
                  </TableCell>
                </TableRow>
              ) : (
                promoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.code}</TableCell>
                    <TableCell>
                      {promo.discount_type === 'percentage'
                        ? `${promo.discount_value}%`
                        : `$${promo.discount_value}`}
                    </TableCell>
                    <TableCell>
                      {promo.times_used} / {promo.max_uses || '∞'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {promo.valid_until ? format(new Date(promo.valid_until), 'MMM dd, yyyy') : 'No expiry'}
                    </TableCell>
                    <TableCell>
                      {promo.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(promo)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(promo.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Code</label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER25"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Discount Type</label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: any) => setFormData({ ...formData, discount_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Discount Value</label>
                <Input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                  placeholder="10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summer sale discount"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Min Purchase</label>
                <Input
                  type="number"
                  value={formData.min_purchase_amount || ''}
                  onChange={(e) => setFormData({ ...formData, min_purchase_amount: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Uses</label>
                <Input
                  type="number"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
                  placeholder="Unlimited"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPromo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
