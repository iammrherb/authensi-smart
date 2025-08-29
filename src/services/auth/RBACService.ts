import { supabase } from '@/integrations/supabase/client';

export type LegacyRole = 'super_admin' | 'admin' | 'manager' | 'engineer' | 'analyst' | 'viewer' | 'customer_admin' | 'customer_user' | 'vendor_admin' | 'vendor_user' | 'project_creator' | 'project_viewer' | 'product_manager' | 'sales_engineer' | 'technical_account_manager' | 'technical_seller' | 'sales' | 'lead_engineer';
export type ScopeType = 'global' | 'project' | 'site';

export interface LegacyUserRole {
  id: string;
  user_id: string;
  role: LegacyRole;
  scope_type: ScopeType;
  scope_id?: string | null;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  notes?: string;
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

export interface AssignLegacyRoleData {
  user_id: string;
  role: LegacyRole;
  scope_type?: ScopeType;
  scope_id?: string;
  expires_at?: string;
  notes?: string;
}

/**
 * RBAC Service that provides backward compatibility with legacy role system
 */
export class RBACService {
  /**
   * Fetch user roles in legacy format for backward compatibility
   */
  static async getUserRoles(): Promise<LegacyUserRole[]> {
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

    // Convert RBAC roles to legacy format
    return roles.map(role => ({
      id: role.id,
      user_id: role.user_id,
      role: role.roles.name as LegacyRole,
      scope_type: 'global' as ScopeType, // Default for RBAC system
      scope_id: null,
      assigned_by: role.assigned_by,
      assigned_at: role.assigned_at,
      expires_at: role.expires_at,
      notes: role.notes,
      user_profile: profileMap.get(role.user_id) || null,
      assigned_by_profile: role.assigned_by ? profileMap.get(role.assigned_by) || null : null
    }));
  }

  /**
   * Check if current user has a specific role
   */
  static async hasRole(role: LegacyRole, scopeType: ScopeType = 'global', scopeId?: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('has_role', {
        _user_id: user.id,
        _role: role as any,
        _scope_type: scopeType,
        _scope_id: scopeId
      });

    if (error) throw error;
    return data as boolean;
  }

  /**
   * Assign a role to a user (converts legacy to RBAC)
   */
  static async assignRole(roleData: AssignLegacyRoleData): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to assign roles');
    }

    // Look up role_id from role name
    const { data: roleRecord, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleData.role)
      .single();
    
    if (roleError || !roleRecord) {
      throw new Error(`Role '${roleData.role}' not found`);
    }

    const { data, error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: roleData.user_id,
        role_id: roleRecord.id,
        expires_at: roleData.expires_at,
        notes: roleData.notes,
        assigned_by: user.id,
      }])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
    return data;
  }

  /**
   * Remove a role from a user
   */
  static async removeRole(roleId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);

    if (error) throw error;
  }

  /**
   * Update a role
   */
  static async updateRole(id: string, updates: Partial<LegacyUserRole>): Promise<any> {
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
  }
}