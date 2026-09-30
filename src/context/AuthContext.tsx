'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/types/database';

export interface SignInResult {
  error: Error | null;
  role?: UserRole | null;
  isAdmin?: boolean;
}

export const isOwnerAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  const envAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  return clean === 'ahmedthor33@gmail.com' || (!!envAdmin && clean === envAdmin);
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isOwner: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  loginAsDemoAdmin?: () => void;
  loginAsDemoCustomer?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const supabase = createClient();

  // Load user profile and role from Supabase
  const fetchProfile = async (
    userId: string,
    userEmail: string
  ): Promise<{ profile: Profile | null; role: UserRole }> => {
    try {
      const isTarget = isOwnerAdminEmail(userEmail);
      const { data, error } = await supabase
        .from('profiles')
        .select('*, roles(name)')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Fallback profile if user was created directly in auth
        const defaultRole: UserRole = isTarget ? 'owner' : 'customer';
        setRole(defaultRole);
        const fallbackProfile: Profile = {
          id: userId,
          role_id: isTarget ? '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000004',
          email: userEmail,
          full_name: isTarget ? 'Ahmed (Store Owner)' : 'EBA Customer',
          phone: null,
          avatar_url: null,
          address_line1: null,
          address_line2: null,
          city: null,
          postal_code: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
        return { profile: fallbackProfile, role: defaultRole };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let roleName = (data.roles as any)?.name as UserRole;
        if (isTarget) {
          roleName = 'owner';
        }
        const resolvedRole = roleName || 'customer';
        setRole(resolvedRole);
        setProfile(data as Profile);
        return { profile: data as Profile, role: resolvedRole };
      }
    } catch {
      const isTarget = isOwnerAdminEmail(userEmail);
      const fallbackRole: UserRole = isTarget ? 'owner' : 'customer';
      setRole(fallbackRole);
      return { profile: null, role: fallbackRole };
    }
  };

  useEffect(() => {
    let mounted = true;

    // Clear legacy mock demo session from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eba_demo_user');
    }

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.warn('Auth initialization fallback:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        setProfile(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error, role: null, isAdmin: false };
      }

      if (data.user) {
        setUser(data.user);
        const { role: userRole } = await fetchProfile(data.user.id, data.user.email || email);
        const isTarget = isOwnerAdminEmail(data.user.email || email);
        const userIsAdmin = userRole === 'owner' || userRole === 'admin' || userRole === 'staff' || isTarget;
        return { error: null, role: userRole, isAdmin: userIsAdmin };
      }

      return { error: null, role: null, isAdmin: false };
    } catch (err) {
      return { error: err as Error, role: null, isAdmin: false };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) return { error };

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, email);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eba_demo_user');
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Quick Demo Access functions for testing
  const loginAsDemoAdmin = () => {
    startTransition(() => {
      const demoAdminUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'owner@ebaskincare.pk',
        app_metadata: {},
        user_metadata: { full_name: 'EBA Skin Care Owner' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoAdminUser.id,
        role_id: '00000000-0000-0000-0000-000000000001',
        email: 'owner@ebaskincare.pk',
        full_name: 'EBA Skin Care Owner',
        phone: '+92 300 1234567',
        avatar_url: null,
        address_line1: 'Clifton Block 4',
        address_line2: null,
        city: 'Karachi',
        postal_code: '75600',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoAdminUser);
      setProfile(demoProfile);
      setRole('owner');
      localStorage.setItem('eba_demo_user', JSON.stringify({ user: demoAdminUser, profile: demoProfile, role: 'owner' }));
    });
  };

  const loginAsDemoCustomer = () => {
    startTransition(() => {
      const demoCustomerUser = {
        id: '00000000-0000-0000-0000-000000000004',
        email: 'ayesha.khan@example.com',
        app_metadata: {},
        user_metadata: { full_name: 'Ayesha Khan' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const demoProfile: Profile = {
        id: demoCustomerUser.id,
        role_id: '00000000-0000-0000-0000-000000000004',
        email: 'ayesha.khan@example.com',
        full_name: 'Ayesha Khan',
        phone: '+92 321 9876543',
        avatar_url: null,
        address_line1: 'House 42, Street 8, F-7/2',
        address_line2: null,
        city: 'Islamabad',
        postal_code: '44000',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoCustomerUser);
      setProfile(demoProfile);
      setRole('customer');
      localStorage.setItem('eba_demo_user', JSON.stringify({ user: demoCustomerUser, profile: demoProfile, role: 'customer' }));
    });
  };

  const isTargetOwner = isOwnerAdminEmail(user?.email);
  const isAdmin = role === 'owner' || role === 'admin' || role === 'staff' || isTargetOwner;
  const isOwner = role === 'owner' || isTargetOwner;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isAdmin,
        isOwner,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
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
