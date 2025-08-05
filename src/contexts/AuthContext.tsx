import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logAuthEvent, logSecurityEvent } from '@/lib/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  profile: any;
  userRoles: string[];
  hasRole: (role: string, scope?: string, scopeId?: string) => boolean;
  isAdmin: boolean;
  isProjectManager: boolean;
  refreshUserRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const [userRoleData, setUserRoleData] = useState<Array<{role: string, scope_type: string, scope_id: string | null}>>([]);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, scope_type, scope_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      const roleData = data || [];
      const roles = roleData.map(r => r.role);
      setUserRoleData(roleData);
      setUserRoles(roles);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const refreshUserRoles = async () => {
    if (user) {
      await fetchUserRoles(user.id);
    }
  };

  const hasRole = useMemo(() => {
    return (role: string, scope?: string, scopeId?: string): boolean => {
      // Check for global roles first (highest privilege)
      const hasGlobalRole = userRoleData.some(r => 
        r.role === role && r.scope_type === 'global'
      );
      
      if (hasGlobalRole) return true;
      
      // If no scope specified, only check for global roles
      if (!scope) return false;
      
      // Check for scoped roles
      const hasScopedRole = userRoleData.some(r => 
        r.role === role && 
        r.scope_type === scope && 
        (scopeId ? r.scope_id === scopeId : true)
      );
      
      return hasScopedRole;
    };
  }, [userRoleData]);

  const isAdmin = useMemo(() => hasRole('project_owner', 'global'), [hasRole]);
  const isProjectManager = useMemo(() => hasRole('project_manager', 'global') || isAdmin, [hasRole, isAdmin]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer profile and roles fetching
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setUserRoleData([]);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
          fetchUserRoles(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Log security event
      await logAuthEvent(!error, email, error?.message);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
      }
      
      return { error };
    } catch (error: any) {
      // Log unexpected error
      await logAuthEvent(false, email, 'Unexpected error occurred');
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      // Log security event
      if (!error) {
        await logSecurityEvent('user_registration', { email });
      } else {
        await logAuthEvent(false, email, error.message);
      }
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to verify your account.",
        });
      }
      
      return { error };
    } catch (error: any) {
      // Log unexpected error
      await logAuthEvent(false, email, 'Unexpected error during registration');
      
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Log logout before signing out
      await logSecurityEvent('user_logout');
      
      // Clear all sessions and sign out globally
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRoles([]);
      setUserRoleData([]);
      
      // Clear any cached data in localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Signed out successfully - all sessions cleared",
        });
        
        // Force redirect to auth page
        window.location.href = '/auth';
      }
    } catch (error: any) {
      // Even if there's an error, clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRoles([]);
      setUserRoleData([]);
      localStorage.clear();
      
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout",
        variant: "destructive"
      });
      
      // Still redirect to auth page
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    profile,
    userRoles,
    hasRole,
    isAdmin,
    isProjectManager,
    refreshUserRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};