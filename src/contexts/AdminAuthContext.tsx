import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type AppRole = 'super_admin' | 'location_admin';

interface AdminUser {
  user: User;
  role: AppRole;
  locationName: string | null;
  locationId: string | null;
  displayName: string | null;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  adminSignIn: (email: string, password: string, locationName: string) => Promise<void>;
  adminSignOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async (user: User) => {
    // Check role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData) {
      setAdminUser(null);
      return;
    }

    const role = roleData.role as AppRole;

    // Get location assignment
    let locationName: string | null = null;
    let locationId: string | null = null;

    if (role === 'location_admin') {
      const { data: locData } = await supabase
        .from('admin_locations')
        .select('location_id, locations(name)')
        .eq('user_id', user.id)
        .single();

      if (locData) {
        locationId = locData.location_id;
        locationName = (locData as any).locations?.name ?? null;
      }
    }

    // Get display name from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();

    setAdminUser({
      user,
      role,
      locationName,
      locationId,
      displayName: profile?.display_name ?? user.email ?? 'Admin',
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setTimeout(() => loadAdminData(session.user), 0);
        } else {
          setAdminUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadAdminData(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const adminSignIn = async (email: string, password: string, locationName: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Invalid credentials');

    const user = data.user;

    // Check role exists
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData) {
      await supabase.auth.signOut();
      throw new Error('You do not have admin access');
    }

    const role = roleData.role as AppRole;

    // For location admins, validate location matches
    if (role === 'location_admin') {
      const { data: locData } = await supabase
        .from('admin_locations')
        .select('location_id, locations(name)')
        .eq('user_id', user.id)
        .single();

      const assignedLocation = (locData as any)?.locations?.name;
      if (!assignedLocation || assignedLocation !== locationName) {
        await supabase.auth.signOut();
        throw new Error('Wrong location selected for your account');
      }
    }

    await loadAdminData(user);
  };

  const adminSignOut = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, adminSignIn, adminSignOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}
