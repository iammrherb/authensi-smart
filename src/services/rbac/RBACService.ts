import { supabase } from '@/integrations/supabase/client';

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  is_system_permission: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  assigned_at: string;
  assigned_by?: string;
  expires_at?: string;
  notes?: string;
  role?: Role;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
  created_by?: string;
  permission?: Permission;
}

export interface RoleHierarchy {
  id: string;
  parent_role_id: string;
  child_role_id: string;
  created_at: string;
  created_by?: string;
  parent_role?: Role;
  child_role?: Role;
}

export interface RoleAuditLog {
  id: string;
  user_id?: string;
  role_id?: string;
  action: 'assigned' | 'revoked' | 'modified';
  old_values?: any;
  new_values?: any;
  performed_by?: string;
  performed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface UserPermissionsCache {
  id: string;
  user_id: string;
  permission_id: string;
  cached_at: string;
  expires_at: string;
}

class RBACService {
  // =============================================
  // ROLE MANAGEMENT
  // =============================================

  async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getRole(id: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .insert(role)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateRole(id: string, updates: Partial<Omit<Role, 'id' | 'is_system_role' | 'created_at' | 'created_by'>>): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // =============================================
  // PERMISSION MANAGEMENT
  // =============================================

  async getPermissions(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('resource, action');
    
    if (error) throw error;
    return data || [];
  }

  async getPermission(id: string): Promise<Permission | null> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createPermission(permission: Omit<Permission, 'id' | 'created_at' | 'updated_at'>): Promise<Permission> {
    const { data, error } = await supabase
      .from('permissions')
      .insert(permission)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePermission(id: string, updates: Partial<Omit<Permission, 'id' | 'is_system_permission' | 'created_at' | 'created_by'>>): Promise<Permission> {
    const { data, error } = await supabase
      .from('permissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePermission(id: string): Promise<void> {
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // =============================================
  // USER ROLE MANAGEMENT
  // =============================================

  async getUserRoles(userId?: string): Promise<UserRole[]> {
    const userIdToUse = userId || (await this.getCurrentUserId());
    
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('user_id', userIdToUse)
      .eq('is_active', true);
    
    if (error) throw error;
    return data || [];
  }

  async getAllUserRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(*)
      `)
      .order('user_id, assigned_at');
    
    if (error) throw error;
    return data || [];
  }

  async assignRoleToUser(
    userId: string,
    roleId: string,
    assignedBy?: string,
    expiresAt?: string,
    notes?: string
  ): Promise<string> {
    const { data, error } = await supabase.rpc('assign_role_to_user', {
      p_user_id: userId,
      p_role_id: roleId,
      p_assigned_by: assignedBy,
      p_expires_at: expiresAt,
      p_notes: notes
    });
    
    if (error) throw error;
    return data;
  }

  async revokeRoleFromUser(userId: string, roleId: string, revokedBy?: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('revoke_role_from_user', {
      p_user_id: userId,
      p_role_id: roleId,
      p_revoked_by: revokedBy
    });
    
    if (error) throw error;
    return data;
  }

  async getUserRole(userId: string, roleId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('user_id', userId)
      .eq('role_id', roleId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // =============================================
  // PERMISSION CHECKING
  // =============================================

  async checkUserPermission(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc('check_user_permission', {
      p_user_id: userId,
      p_resource: resource,
      p_action: action
    });
    
    if (error) throw error;
    return data;
  }

  async getUserPermissions(userId?: string): Promise<Permission[]> {
    const userIdToUse = userId || (await this.getCurrentUserId());
    
    const { data, error } = await supabase.rpc('get_user_permissions', {
      p_user_id: userIdToUse
    });
    
    if (error) throw error;
    return data || [];
  }

  async checkCurrentUserPermission(resource: string, action: string): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    return this.checkUserPermission(userId, resource, action);
  }

  // =============================================
  // ROLE PERMISSIONS MANAGEMENT
  // =============================================

  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        *,
        permission:permissions(*)
      `)
      .eq('role_id', roleId);
    
    if (error) throw error;
    return data || [];
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('role_permissions')
      .insert({
        role_id: roleId,
        permission_id: permissionId
      });
    
    if (error) throw error;
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);
    
    if (error) throw error;
  }

  // =============================================
  // ROLE HIERARCHY MANAGEMENT
  // =============================================

  async getRoleHierarchy(): Promise<RoleHierarchy[]> {
    const { data, error } = await supabase
      .from('role_hierarchy')
      .select(`
        *,
        parent_role:roles!role_hierarchy_parent_role_id_fkey(*),
        child_role:roles!role_hierarchy_child_role_id_fkey(*)
      `);
    
    if (error) throw error;
    return data || [];
  }

  async createRoleHierarchy(parentRoleId: string, childRoleId: string): Promise<RoleHierarchy> {
    const { data, error } = await supabase
      .from('role_hierarchy')
      .insert({
        parent_role_id: parentRoleId,
        child_role_id: childRoleId
      })
      .select(`
        *,
        parent_role:roles!role_hierarchy_parent_role_id_fkey(*),
        child_role:roles!role_hierarchy_child_role_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteRoleHierarchy(parentRoleId: string, childRoleId: string): Promise<void> {
    const { error } = await supabase
      .from('role_hierarchy')
      .delete()
      .eq('parent_role_id', parentRoleId)
      .eq('child_role_id', childRoleId);
    
    if (error) throw error;
  }

  // =============================================
  // AUDIT LOG MANAGEMENT
  // =============================================

  async getAuditLogs(
    filters?: {
      userId?: string;
      roleId?: string;
      action?: string;
      startDate?: string;
      endDate?: string;
    },
    limit: number = 100,
    offset: number = 0
  ): Promise<RoleAuditLog[]> {
    let query = supabase
      .from('role_audit_log')
      .select('*')
      .order('performed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.roleId) {
      query = query.eq('role_id', filters.roleId);
    }
    if (filters?.action) {
      query = query.eq('action', filters.action);
    }
    if (filters?.startDate) {
      query = query.gte('performed_at', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('performed_at', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // =============================================
  // CACHE MANAGEMENT
  // =============================================

  async cleanExpiredPermissionCache(): Promise<number> {
    const { data, error } = await supabase.rpc('clean_expired_permission_cache');
    if (error) throw error;
    return data;
  }

  async clearUserPermissionCache(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_permissions_cache')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  private async getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }

  async getUsersWithRole(roleName: string): Promise<{ user_id: string; email?: string }[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role:roles!inner(name)
      `)
      .eq('roles.name', roleName)
      .eq('is_active', true);
    
    if (error) throw error;
    
    // Get user emails
    const userIds = data?.map(ur => ur.user_id) || [];
    if (userIds.length === 0) return [];

    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    return userIds.map(userId => {
      const user = users?.users?.find(u => u.id === userId);
      return {
        user_id: userId,
        email: user?.email
      };
    });
  }

  async getRolePermissionsByResource(): Promise<Record<string, Permission[]>> {
    const permissions = await this.getPermissions();
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }

  async bulkAssignRoles(
    assignments: Array<{
      userId: string;
      roleId: string;
      assignedBy?: string;
      expiresAt?: string;
      notes?: string;
    }>
  ): Promise<string[]> {
    const results: string[] = [];
    
    for (const assignment of assignments) {
      try {
        const result = await this.assignRoleToUser(
          assignment.userId,
          assignment.roleId,
          assignment.assignedBy,
          assignment.expiresAt,
          assignment.notes
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed to assign role ${assignment.roleId} to user ${assignment.userId}:`, error);
        throw error;
      }
    }
    
    return results;
  }

  async getSystemRoles(): Promise<Role[]> {
    const roles = await this.getRoles();
    return roles.filter(role => role.is_system_role);
  }

  async getCustomRoles(): Promise<Role[]> {
    const roles = await this.getRoles();
    return roles.filter(role => !role.is_system_role);
  }
}

export const rbacService = new RBACService();
export default rbacService;
