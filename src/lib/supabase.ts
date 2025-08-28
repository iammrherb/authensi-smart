import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          is_system_role: boolean
          is_customer_portal_role: boolean
          priority: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_system_role?: boolean
          is_customer_portal_role?: boolean
          priority?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_system_role?: boolean
          is_customer_portal_role?: boolean
          priority?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          resource: string
          action: string
          scope: string
          is_system_permission: boolean
          is_customer_portal_permission: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          resource: string
          action: string
          scope?: string
          is_system_permission?: boolean
          is_customer_portal_permission?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          resource?: string
          action?: string
          scope?: string
          is_system_permission?: boolean
          is_customer_portal_permission?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          conditions: any | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          conditions?: any | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          conditions?: any | null
          created_at?: string
          created_by?: string | null
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          is_active: boolean
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          notes: string | null
          scope_data: any | null
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          is_active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          notes?: string | null
          scope_data?: any | null
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          is_active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          notes?: string | null
          scope_data?: any | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          first_name: string | null
          last_name: string | null
          display_name: string | null
          avatar_url: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          department: string | null
          location: string | null
          timezone: string
          language: string
          preferences: any
          is_active: boolean
          is_verified: boolean
          last_login: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          department?: string | null
          location?: string | null
          timezone?: string
          language?: string
          preferences?: any
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          department?: string | null
          location?: string | null
          timezone?: string
          language?: string
          preferences?: any
          is_active?: boolean
          is_verified?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      customer_portals: {
        Row: {
          id: string
          customer_name: string
          customer_code: string | null
          description: string | null
          contact_email: string | null
          contact_phone: string | null
          address: any | null
          industry: string | null
          size: string | null
          status: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_code?: string | null
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: any | null
          industry?: string | null
          size?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          customer_code?: string | null
          description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: any | null
          industry?: string | null
          size?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      customer_portal_users: {
        Row: {
          id: string
          customer_portal_id: string
          user_id: string
          role_id: string
          access_level: string
          is_primary_contact: boolean
          is_billing_contact: boolean
          is_technical_contact: boolean
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          customer_portal_id: string
          user_id: string
          role_id: string
          access_level?: string
          is_primary_contact?: boolean
          is_billing_contact?: boolean
          is_technical_contact?: boolean
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          customer_portal_id?: string
          user_id?: string
          role_id?: string
          access_level?: string
          is_primary_contact?: boolean
          is_billing_contact?: boolean
          is_technical_contact?: boolean
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          notes?: string | null
        }
      }
    }
    Views: {}
    Functions: {
      check_user_permission: {
        Args: {
          p_user_id: string
          p_resource: string
          p_action: string
        }
        Returns: boolean
      }
      assign_role_to_user: {
        Args: {
          p_user_id: string
          p_role_id: string
          p_assigned_by?: string
          p_expires_at?: string
          p_notes?: string
        }
        Returns: string
      }
      revoke_role_from_user: {
        Args: {
          p_user_id: string
          p_role_id: string
          p_revoked_by?: string
        }
        Returns: boolean
      }
    }
    Enums: {}
  }
}
