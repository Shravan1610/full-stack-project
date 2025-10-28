import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface AdminAuthState {
  isAdmin: boolean;
  loading: boolean;
  user: any | null;
  profile: any | null;
  error?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
}








