'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@repo/shared-ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/shared-ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/shared-ui';
import { Plus, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AddressCard } from '@/components/account/AddressCard';
import { AddressForm } from '@/components/account/AddressForm';
import { useToast } from '@repo/shared-ui';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type AddressFormData,
} from '@repo/shared-lib';

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load addresses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      setIsSubmitting(true);
      await deleteAddress(addressToDelete);
      
      toast({
        title: 'Success',
        description: 'Address deleted successfully.',
      });
      
      await loadAddresses();
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      await setDefaultAddress(user.id, addressId);
      
      toast({
        title: 'Success',
        description: 'Default address updated.',
      });
      
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (data: AddressFormData) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      if (selectedAddress) {
        // Update existing address
        await updateAddress(selectedAddress.id, data);
        toast({
          title: 'Success',
          description: 'Address updated successfully.',
        });
      } else {
        // Create new address
        await createAddress(user.id, data);
        toast({
          title: 'Success',
          description: 'Address added successfully.',
        });
      }
      
      setIsDialogOpen(false);
      await loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Addresses</h1>
              <p className="text-gray-600">
                Manage your shipping and billing addresses
              </p>
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-5 w-5" />
              Add Address
            </Button>
          </div>

          {/* Addresses Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No addresses yet</h3>
              <p className="text-gray-600 mb-6">
                Add your first address to start shopping
              </p>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-5 w-5" />
                Add Your First Address
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription>
              {selectedAddress
                ? 'Update your address details below.'
                : 'Fill in the form below to add a new address.'}
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            address={selectedAddress}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
