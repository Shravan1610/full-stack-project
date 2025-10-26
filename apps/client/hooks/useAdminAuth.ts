'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@repo/database';

interface AdminAuthState {
  isAdmin: boolean;
  loading: boolean;
  user: any | null;
  profile: any | null;
  error?: string;
}

export function useAdminAuth(redirectOnFail: boolean = true): AdminAuthState {
  const router = useRouter();
  const [state, setState] = useState<AdminAuthState>({
    isAdmin: false,
    loading: true,
    user: null,
    profile: null,
    error: undefined,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('[useAdminAuth] Starting admin access check...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('[useAdminAuth] Error getting user:', userError);
        throw userError;
      }

      console.log('[useAdminAuth] User:', user ? `Found (${user.email})` : 'None');

      if (!user) {
        console.log('[useAdminAuth] No user found, redirecting to signin...');
        if (redirectOnFail) {
          router.push('/auth/signin?redirect=/admin');
        }
        setState({ isAdmin: false, loading: false, user: null, profile: null, error: 'Not authenticated' });
        return;
      }

      // Get user profile with role
      console.log('[useAdminAuth] Fetching profile for user:', user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('[useAdminAuth] Error fetching profile:', profileError);
        throw profileError;
      }

      console.log('[useAdminAuth] Profile:', profile ? `Found (role: ${profile.role})` : 'None');

      if (!profile) {
        console.log('[useAdminAuth] No profile found, redirecting to home...');
        if (redirectOnFail) {
          router.push('/admin/unauthorized');
        }
        setState({ isAdmin: false, loading: false, user, profile: null, error: 'Profile not found' });
        return;
      }

      // Check admin role (both 'admin' and 'super_admin' have access)
      const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
      console.log('[useAdminAuth] Is admin:', isAdmin);

      if (!isAdmin) {
        console.log('[useAdminAuth] User is not admin, redirecting to unauthorized...');
        if (redirectOnFail) {
          router.push('/admin/unauthorized');
        }
      }

      setState({
        isAdmin,
        loading: false,
        user,
        profile,
      });

      console.log('[useAdminAuth] Admin check complete. Admin:', isAdmin);
    } catch (error) {
      console.error('[useAdminAuth] Error in checkAdminAccess:', error);
      if (redirectOnFail) {
        router.push('/admin/unauthorized');
      }
      setState({
        isAdmin: false,
        loading: false,
        user: null,
        profile: null,
        error: error instanceof Error ? error.message : 'Authentication error',
      });
    }
  };

  return state;
}

