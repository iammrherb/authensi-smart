export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      implementation_checklists: {
        Row: {
          assigned_to: string | null
          checklist_items: Json | null
          checklist_type: string | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          project_id: string | null
          site_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          checklist_items?: Json | null
          checklist_type?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          site_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          checklist_items?: Json | null
          checklist_type?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          project_id?: string | null
          site_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "implementation_checklists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "implementation_checklists_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sites: {
        Row: {
          created_at: string
          deployment_order: number | null
          id: string
          project_id: string
          site_id: string
          site_specific_notes: string | null
        }
        Insert: {
          created_at?: string
          deployment_order?: number | null
          id?: string
          project_id: string
          site_id: string
          site_specific_notes?: string | null
        }
        Update: {
          created_at?: string
          deployment_order?: number | null
          id?: string
          project_id?: string
          site_id?: string
          site_specific_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion: string | null
          budget: number | null
          client_name: string | null
          created_at: string
          created_by: string | null
          current_phase: string | null
          description: string | null
          id: string
          name: string
          progress_percentage: number | null
          project_manager: string | null
          start_date: string | null
          status: string | null
          target_completion: string | null
          updated_at: string
        }
        Insert: {
          actual_completion?: string | null
          budget?: number | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          description?: string | null
          id?: string
          name: string
          progress_percentage?: number | null
          project_manager?: string | null
          start_date?: string | null
          status?: string | null
          target_completion?: string | null
          updated_at?: string
        }
        Update: {
          actual_completion?: string | null
          budget?: number | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          description?: string | null
          id?: string
          name?: string
          progress_percentage?: number | null
          project_manager?: string | null
          start_date?: string | null
          status?: string | null
          target_completion?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scoping_questionnaires: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          id: string
          project_id: string | null
          questionnaire_data: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          site_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          questionnaire_data?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          site_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          questionnaire_data?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          site_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scoping_questionnaires_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scoping_questionnaires_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address: string | null
          assigned_engineer: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          device_count: number | null
          id: string
          location: string | null
          name: string
          network_segments: number | null
          priority: string | null
          site_type: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_engineer?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          device_count?: number | null
          id?: string
          location?: string | null
          name: string
          network_segments?: number | null
          priority?: string | null
          site_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_engineer?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          device_count?: number | null
          id?: string
          location?: string | null
          name?: string
          network_segments?: number | null
          priority?: string | null
          site_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_project: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      user_owns_site: {
        Args: { site_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
