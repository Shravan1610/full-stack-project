import { supabase } from '@repo/database';

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  full_name: string;
  phone: string; // Database column name
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string; // Database column name
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  type: 'shipping' | 'billing' | 'both';
  is_default: boolean;
  full_name: string;
  phone: string; // Match database column
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string; // Match database column
  postal_code: string;
  country: string;
}

/**
 * Get all addresses for a user
 */
export async function getAddresses(userId: string): Promise<Address[]> {
  console.log('[getAddresses] Fetching addresses for userId:', userId);
  
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getAddresses] Error fetching addresses:', error);
    throw new Error('Failed to fetch addresses');
  }

  console.log('[getAddresses] Found', data?.length || 0, 'addresses');
  return data || [];
}

/**
 * Get default address for a user
 */
export async function getDefaultAddress(userId: string): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No default address found
      return null;
    }
    console.error('Error fetching default address:', error);
    throw new Error('Failed to fetch default address');
  }

  return data;
}

/**
 * Get a specific address by ID
 */
export async function getAddressById(addressId: string): Promise<Address | null> {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .single();

  if (error) {
    console.error('Error fetching address:', error);
    return null;
  }

  return data;
}

/**
 * Create a new address
 */
export async function createAddress(
  userId: string,
  addressData: AddressFormData
): Promise<Address> {
  console.log('[createAddress] Starting with userId:', userId);
  console.log('[createAddress] Address data:', addressData);
  
  // If this is set as default, unset other defaults first
  if (addressData.is_default) {
    console.log('[createAddress] Unsetting other default addresses...');
    await unsetDefaultAddresses(userId);
  }

  const insertData = {
    user_id: userId,
    ...addressData,
    updated_at: new Date().toISOString(),
  };
  
  console.log('[createAddress] Inserting data:', insertData);

  const { data, error } = await supabase
    .from('addresses')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[createAddress] Error creating address:', error);
    console.error('[createAddress] Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to create address: ${error.message}`);
  }

  console.log('[createAddress] Successfully created address:', data);
  return data;
}

/**
 * Update an existing address
 */
export async function updateAddress(
  addressId: string,
  addressData: Partial<AddressFormData>
): Promise<Address> {
  // Get the address to find its user_id
  const existingAddress = await getAddressById(addressId);
  if (!existingAddress) {
    throw new Error('Address not found');
  }

  // If setting as default, unset other defaults first
  if (addressData.is_default) {
    await unsetDefaultAddresses(existingAddress.user_id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .update({
      ...addressData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    throw new Error('Failed to update address');
  }

  return data;
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    throw new Error('Failed to delete address');
  }
}

/**
 * Set an address as default (and unset others)
 */
export async function setDefaultAddress(userId: string, addressId: string): Promise<void> {
  // First, unset all defaults for this user
  await unsetDefaultAddresses(userId);

  // Then set the new default
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error setting default address:', error);
    throw new Error('Failed to set default address');
  }
}

/**
 * Unset all default addresses for a user (internal helper)
 */
async function unsetDefaultAddresses(userId: string): Promise<void> {
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true);

  if (error) {
    console.error('Error unsetting default addresses:', error);
    // Don't throw here, as this is a helper function
  }
}

/**
 * Ensure user has at least one default address
 * If no default exists, set the first address as default
 */
export async function ensureDefaultAddress(userId: string): Promise<void> {
  const addresses = await getAddresses(userId);
  
  if (addresses.length === 0) {
    return; // No addresses to set as default
  }

  const hasDefault = addresses.some(addr => addr.is_default);
  
  if (!hasDefault) {
    // Set the first address as default
    await setDefaultAddress(userId, addresses[0].id);
  }
}

