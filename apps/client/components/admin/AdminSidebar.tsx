'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Store, LogOut, User } from 'lucide-react';
import { cn } from '@repo/shared-lib';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@repo/shared-ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/shared-ui';
import { Avatar, AvatarFallback } from '@repo/shared-ui';
import { adminNavigation } from '@/config/admin-navigation';

interface AdminSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'A';
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200",
      mobile && "relative inset-auto border-r-0"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
          <Store className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">ShoeHub</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleNavigation}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                title={item.description}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Back to Store Link */}
          <Link
            href="/"
            onClick={handleNavigation}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
          >
            <Store className="h-4 w-4" />
            Back to Store
          </Link>
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate w-full text-left">
                    {profile?.full_name || user?.email || 'Admin'}
                  </span>
                  <span className="text-xs text-gray-500">Admin</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { router.push('/account/profile'); handleNavigation(); }}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
