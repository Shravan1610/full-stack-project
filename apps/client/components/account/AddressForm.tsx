'use client';

import { useState } from 'react';
import { Button } from '@repo/shared-ui';
import { Input } from '@repo/shared-ui';
import { Label } from '@repo/shared-ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared-ui';
import { RadioGroup, RadioGroupItem } from '@repo/shared-ui';
import { Checkbox } from '@repo/shared-ui';
import type { Address, AddressFormData } from '@repo/shared-lib';
import { COUNTRIES } from '@/lib/countries';

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({ address, onSubmit, onCancel, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    type: address?.type || 'shipping',
    is_default: address?.is_default || false,
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    address_line1: address?.address_line1 || '',
    address_line2: address?.address_line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || 'United States',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim() || formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address_line1.trim() || formData.address_line1.length < 5) {
      newErrors.address_line1 = 'Address must be at least 5 characters';
    }

    if (!formData.city.trim() || formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    if (!formData.state.trim() || formData.state.length < 2) {
      newErrors.state = 'State/Province must be at least 2 characters';
    }

    if (!formData.postal_code.trim() || formData.postal_code.length < 3) {
      newErrors.postal_code = 'Please enter a valid postal code';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          placeholder="John Doe"
          className={errors.full_name ? 'border-red-500' : ''}
        />
        {errors.full_name && (
          <p className="text-sm text-red-500">{errors.full_name}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* Address Line 1 */}
      <div className="space-y-2">
        <Label htmlFor="address_line1">
          Address Line 1 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) => handleChange('address_line1', e.target.value)}
          placeholder="123 Main Street"
          className={errors.address_line1 ? 'border-red-500' : ''}
        />
        {errors.address_line1 && (
          <p className="text-sm text-red-500">{errors.address_line1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2">
        <Label htmlFor="address_line2">
          Address Line 2 <span className="text-gray-400">(Optional)</span>
        </Label>
        <Input
          id="address_line2"
          value={formData.address_line2}
          onChange={(e) => handleChange('address_line2', e.target.value)}
          placeholder="Apartment, suite, unit, etc."
        />
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="New York"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">
            State/Province <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="NY"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-sm text-red-500">{errors.state}</p>
          )}
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">
            Postal Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            placeholder="10001"
            className={errors.postal_code ? 'border-red-500' : ''}
          />
          {errors.postal_code && (
            <p className="text-sm text-red-500">{errors.postal_code}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleChange('country', value)}
          >
            <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Address Type */}
      <div className="space-y-3">
        <Label>
          Address Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => handleChange('type', value as 'shipping' | 'billing' | 'both')}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shipping" id="shipping" />
            <Label htmlFor="shipping" className="font-normal cursor-pointer">
              Shipping
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="billing" id="billing" />
            <Label htmlFor="billing" className="font-normal cursor-pointer">
              Billing
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="font-normal cursor-pointer">
              Both
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Set as Default */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => handleChange('is_default', checked as boolean)}
        />
        <Label
          htmlFor="is_default"
          className="text-sm font-normal cursor-pointer"
        >
          Set as default address
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  );
}

