import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { RBACService, type LegacyUserRole, type AssignLegacyRoleData, type LegacyRole, type ScopeType } from '@/services/auth/RBACService';

export type AppRole = LegacyRole;
export { type ScopeType };

export interface UserRole extends LegacyUserRole {
  role_name?: string; // For display purposes
  role_id?: string; // For RBAC compatibility
}

export interface AssignRoleData extends AssignLegacyRoleData {
  role_id?: string; // For RBAC compatibility
}

// Fetch user roles with role names for display
export const useUserRoles = () => {
  return useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const roles = await RBACService.getUserRoles();
      // Add role_name and role_id for compatibility
      return roles.map(role => ({
        ...role,
        role_name: role.role,
        role_id: 'legacy-' + role.role, // Placeholder for RBAC compatibility
      }));
    },
  });
};

// Check if current user has a specific role
export const useHasRole = (role: AppRole, scopeType: ScopeType = 'global', scopeId?: string) => {
  return useQuery({
    queryKey: ['has-role', role, scopeType, scopeId],
    queryFn: () => RBACService.hasRole(role, scopeType, scopeId),
  });
};

// Check if current user can manage roles
export const useCanManageRoles = (scopeType: ScopeType = 'global', scopeId?: string) => {
  return useQuery({
    queryKey: ['can-manage-roles', scopeType, scopeId],
    queryFn: () => RBACService.hasRole('super_admin', scopeType, scopeId),
  });
};

// Assign a role to a user
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roleData: AssignRoleData) => {
      return await RBACService.assignRole(roleData);
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
      await RBACService.removeRole(roleId);
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
      return await RBACService.updateRole(id, updates);
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