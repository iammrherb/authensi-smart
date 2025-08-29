import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AppRole = 'super_admin' | 'project_creator' | 'project_viewer' | 'product_manager' | 'sales_engineer' | 'technical_account_manager' | 'technical_seller' | 'sales' | 'lead_engineer' | 'engineer' | 'viewer';
export type ScopeType = 'global' | 'project' | 'site';

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  notes?: string;
  role_name?: string; // For display purposes
  // Legacy compatibility fields
  role: string;
  scope_type: string;
  scope_id?: string;
  user_profile?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  assigned_by_profile?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
}

export interface AssignRoleData {
  user_id: string;
  role_id?: string; // Optional - can be derived from role name
  expires_at?: string;
  notes?: string;
  // Legacy compatibility
  role?: string;
  scope_type?: string;
  scope_id?: string;
}

// Fetch user roles with role names for display
export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          roles!inner(name, priority)
        `)
        .eq('is_active', true)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      
      if (!roles || roles.length === 0) {
        return [];
      }

      // Get all unique user IDs
      const userIds = [...new Set([
        ...roles.map(role => role.user_id),
        ...roles.map(role => role.assigned_by).filter(Boolean)
      ])];

      // Fetch user profiles for involved users (RLS may restrict visibility)
      let profiles = [] as Array<{ id: string; email: string; first_name: string; last_name: string }>;
      try {
        if (userIds.length > 0) {
          const { data, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name')
            .in('id', userIds);

          if (profilesError) {
            console.warn('Profiles fetch restricted by RLS; proceeding without some profile details:', profilesError.message || profilesError);
          }
          profiles = data || [];
        }
      } catch (e: any) {
        console.warn('Profiles lookup skipped due to RLS or network error:', e?.message || e);
      }

      // Create a map for quick lookup
      const profileMap = new Map(profiles.map(p => [p.id, p]));

      // Combine roles with profile data and role names + legacy compatibility
      return roles.map(role => ({
        ...role,
        role_name: role.roles.name,
        // Legacy compatibility fields
        role: role.roles.name,
        scope_type: 'global',
        scope_id: null,
        user_profile: profileMap.get(role.user_id) || null,
        assigned_by_profile: role.assigned_by ? profileMap.get(role.assigned_by) || null : null
      }));
    },
  });
};

// Check if current user has a specific role
export const useHasRole = (role: AppRole, scopeType: ScopeType = 'global', scopeId?: string) => {
  return useQuery({
    queryKey: ['has-role', role, scopeType, scopeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('has_role', {
          _user_id: user.id,
          _role: role,
          _scope_type: scopeType,
          _scope_id: scopeId
        });

      if (error) throw error;
      return data as boolean;
    },
  });
};

// Check if current user can manage roles
export const useCanManageRoles = (scopeType: ScopeType = 'global', scopeId?: string) => {
  return useQuery({
    queryKey: ['can-manage-roles', scopeType, scopeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('can_manage_roles', {
          _user_id: user.id,
          _scope_type: scopeType,
          _scope_id: scopeId
        });

      if (error) throw error;
      return data as boolean;
    },
  });
};

// Assign a role to a user
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roleData: AssignRoleData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to assign roles');
      }

      // Convert legacy role to role_id if needed
      let finalRoleData = { ...roleData };
      if (roleData.role && !roleData.role_id) {
        // Look up role_id from role name
        const { data: roleRecord, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', roleData.role)
          .single();
        
        if (roleError || !roleRecord) {
          throw new Error(`Role '${roleData.role}' not found`);
        }
        
        finalRoleData.role_id = roleRecord.id;
      }
      
      if (!finalRoleData.role_id) {
        throw new Error('Either role_id or role name must be provided');
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: finalRoleData.user_id,
          role_id: finalRoleData.role_id,
          expires_at: finalRoleData.expires_at,
          notes: finalRoleData.notes,
          assigned_by: user.id,
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error assigning role:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['has-role'] });
      queryClient.invalidateQueries({ queryKey: ['can-manage-roles'] });
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
    },
    onError: (error: any) => {
      console.error('Role assignment error:', error);
      toast({
        title: "Error",
        description: "Failed to assign role: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Remove a role from a user
export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['has-role'] });
      queryClient.invalidateQueries({ queryKey: ['can-manage-roles'] });
      toast({
        title: "Success",
        description: "Role removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove role: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Update a role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<UserRole> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating role:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['has-role'] });
      queryClient.invalidateQueries({ queryKey: ['can-manage-roles'] });
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update role: " + error.message,
        variant: "destructive",
      });
    },
  });
};