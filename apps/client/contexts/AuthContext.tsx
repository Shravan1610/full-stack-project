'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@repo/database';
import { Profile } from '@repo/database';
import { getProfile } from '@repo/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
  };

  useEffect(() => {
    // On initial load try to read session and profile, but always clear the
    // loading flag even if the DB (profiles table) doesn't exist yet. If the
    // migration hasn't been applied the profile query will throw and we don't
    // want the whole app to remain in a perpetual loading state.
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        try {
          setUser(session?.user ?? null);
          if (session?.user) {
            const profileData = await getProfile(session.user.id);
            setProfile(profileData);
          }
        } catch (error) {
          // Log and continue — migration or table may be missing. Caller should
          // still be allowed to render (possibly with limited functionality).
          // eslint-disable-next-line no-console
          console.error('Error fetching profile (ignored):', error);
        } finally {
          setLoading(false);
        }
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        try {
          setUser(session?.user ?? null);
          if (session?.user) {
            const profileData = await getProfile(session.user.id);
            setProfile(profileData);
          } else {
            setProfile(null);
          }
        } catch (error) {
          // Don't block UI updates on profile read errors.
          // eslint-disable-next-line no-console
          console.error('Error refreshing profile (ignored):', error);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
