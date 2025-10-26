'use client';

import { Card, CardContent } from '@repo/shared-ui';
import { Button } from '@repo/shared-ui';
import { Badge } from '@repo/shared-ui';
import { MapPin, Phone, Edit, Trash2, Star } from 'lucide-react';
import type { Address } from '@repo/shared-lib';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const getAddressTypeBadge = () => {
    const colors = {
      shipping: 'bg-blue-100 text-blue-800',
      billing: 'bg-purple-100 text-purple-800',
      both: 'bg-green-100 text-green-800',
    };
    
    const labels = {
      shipping: 'Shipping',
      billing: 'Billing',
      both: 'Shipping & Billing',
    };

    return (
      <Badge className={colors[address.type]}>
        {labels[address.type]}
      </Badge>
    );
  };

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {address.is_default && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Star className="h-3 w-3 mr-1 fill-yellow-600" />
                Default
              </Badge>
            )}
            {getAddressTypeBadge()}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{address.full_name}</h3>
          </div>

          <div className="flex items-start gap-2 text-gray-600">
            <Phone className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="text-sm">{address.phone}</span>
          </div>

          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="text-sm space-y-0.5">
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          {!address.is_default && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              className="flex-1"
            >
              <Star className="h-4 w-4 mr-1" />
              Set Default
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className={address.is_default ? 'flex-1' : ''}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

