'use client';

import Link from 'next/link';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { Button } from '@repo/shared-ui';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-lg text-gray-600 mb-4">
            You don't have permission to access the admin portal.
          </p>
          <p className="text-sm text-gray-500">
            This area is restricted to administrators only. If you believe you should have access, please contact your system administrator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signin">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}




