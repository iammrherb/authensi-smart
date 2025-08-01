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
      ai_optimization_history: {
        Row: {
          ai_model_used: string | null
          changes_summary: Json | null
          compliance_impact: Json | null
          created_at: string | null
          created_by: string | null
          feedback_rating: number | null
          id: string
          optimization_score_after: number | null
          optimization_score_before: number | null
          optimization_type: string
          optimized_config: string
          original_config: string
          performance_impact: Json | null
          security_impact: Json | null
          template_id: string | null
          user_feedback: string | null
        }
        Insert: {
          ai_model_used?: string | null
          changes_summary?: Json | null
          compliance_impact?: Json | null
          created_at?: string | null
          created_by?: string | null
          feedback_rating?: number | null
          id?: string
          optimization_score_after?: number | null
          optimization_score_before?: number | null
          optimization_type: string
          optimized_config: string
          original_config: string
          performance_impact?: Json | null
          security_impact?: Json | null
          template_id?: string | null
          user_feedback?: string | null
        }
        Update: {
          ai_model_used?: string | null
          changes_summary?: Json | null
          compliance_impact?: Json | null
          created_at?: string | null
          created_by?: string | null
          feedback_rating?: number | null
          id?: string
          optimization_score_after?: number | null
          optimization_score_before?: number | null
          optimization_type?: string
          optimized_config?: string
          original_config?: string
          performance_impact?: Json | null
          security_impact?: Json | null
          template_id?: string | null
          user_feedback?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_optimization_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      authentication_methods: {
        Row: {
          configuration_complexity: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          documentation_links: Json | null
          id: string
          is_active: boolean | null
          method_type: string
          name: string
          portnox_integration: Json | null
          security_level: string | null
          updated_at: string | null
          vendor_support: Json | null
        }
        Insert: {
          configuration_complexity?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          documentation_links?: Json | null
          id?: string
          is_active?: boolean | null
          method_type: string
          name: string
          portnox_integration?: Json | null
          security_level?: string | null
          updated_at?: string | null
          vendor_support?: Json | null
        }
        Update: {
          configuration_complexity?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          documentation_links?: Json | null
          id?: string
          is_active?: boolean | null
          method_type?: string
          name?: string
          portnox_integration?: Json | null
          security_level?: string | null
          updated_at?: string | null
          vendor_support?: Json | null
        }
        Relationships: []
      }
      authentication_workflows: {
        Row: {
          authentication_method: string
          complexity: string
          configuration_steps: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          industry_applications: Json | null
          integration_points: Json | null
          name: string
          portnox_specific: Json | null
          prerequisites: Json | null
          security_considerations: Json | null
          supported_devices: Json | null
          troubleshooting_guide: Json | null
          updated_at: string
          use_cases: Json | null
          workflow_type: string
        }
        Insert: {
          authentication_method: string
          complexity: string
          configuration_steps?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_applications?: Json | null
          integration_points?: Json | null
          name: string
          portnox_specific?: Json | null
          prerequisites?: Json | null
          security_considerations?: Json | null
          supported_devices?: Json | null
          troubleshooting_guide?: Json | null
          updated_at?: string
          use_cases?: Json | null
          workflow_type: string
        }
        Update: {
          authentication_method?: string
          complexity?: string
          configuration_steps?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_applications?: Json | null
          integration_points?: Json | null
          name?: string
          portnox_specific?: Json | null
          prerequisites?: Json | null
          security_considerations?: Json | null
          supported_devices?: Json | null
          troubleshooting_guide?: Json | null
          updated_at?: string
          use_cases?: Json | null
          workflow_type?: string
        }
        Relationships: []
      }
      bulk_site_templates: {
        Row: {
          created_at: string
          created_by: string | null
          csv_headers: Json
          default_values: Json
          field_mappings: Json
          id: string
          template_description: string | null
          template_name: string
          updated_at: string
          validation_rules: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          csv_headers?: Json
          default_values?: Json
          field_mappings?: Json
          id?: string
          template_description?: string | null
          template_name: string
          updated_at?: string
          validation_rules?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          csv_headers?: Json
          default_values?: Json
          field_mappings?: Json
          id?: string
          template_description?: string | null
          template_name?: string
          updated_at?: string
          validation_rules?: Json
        }
        Relationships: []
      }
      business_domains: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry_alignment: Json | null
          is_active: boolean | null
          name: string
          typical_use_cases: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_alignment?: Json | null
          is_active?: boolean | null
          name: string
          typical_use_cases?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_alignment?: Json | null
          is_active?: boolean | null
          name?: string
          typical_use_cases?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry_specific: Json | null
          is_active: boolean | null
          name: string
          requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_specific?: Json | null
          is_active?: boolean | null
          name: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry_specific?: Json | null
          is_active?: boolean | null
          name?: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      config_generation_sessions: {
        Row: {
          ai_recommendations: Json | null
          completed_at: string | null
          completion_percentage: number | null
          created_by: string | null
          current_step: number | null
          generated_config: string | null
          id: string
          last_activity: string | null
          session_token: string
          started_at: string | null
          status: string | null
          template_id: string | null
          wizard_data: Json | null
        }
        Insert: {
          ai_recommendations?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_by?: string | null
          current_step?: number | null
          generated_config?: string | null
          id?: string
          last_activity?: string | null
          session_token: string
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          wizard_data?: Json | null
        }
        Update: {
          ai_recommendations?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_by?: string | null
          current_step?: number | null
          generated_config?: string | null
          id?: string
          last_activity?: string | null
          session_token?: string
          started_at?: string | null
          status?: string | null
          template_id?: string | null
          wizard_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "config_generation_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      config_template_categories: {
        Row: {
          ai_priority_weight: number | null
          category_type: string
          color_scheme: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          name: string
          parent_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          ai_priority_weight?: number | null
          category_type?: string
          color_scheme?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_priority_weight?: number | null
          category_type?: string
          color_scheme?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_template_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "config_template_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      config_wizard_steps: {
        Row: {
          ai_suggestions_enabled: boolean | null
          auto_populate_rules: Json | null
          conditional_logic: Json | null
          created_at: string | null
          help_content: string | null
          id: string
          required_fields: Json | null
          step_description: string | null
          step_name: string
          step_order: number
          step_type: string
          template_id: string | null
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          ai_suggestions_enabled?: boolean | null
          auto_populate_rules?: Json | null
          conditional_logic?: Json | null
          created_at?: string | null
          help_content?: string | null
          id?: string
          required_fields?: Json | null
          step_description?: string | null
          step_name: string
          step_order: number
          step_type?: string
          template_id?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          ai_suggestions_enabled?: boolean | null
          auto_populate_rules?: Json | null
          conditional_logic?: Json | null
          created_at?: string | null
          help_content?: string | null
          id?: string
          required_fields?: Json | null
          step_description?: string | null
          step_name?: string
          step_order?: number
          step_type?: string
          template_id?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "config_wizard_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      configuration_files: {
        Row: {
          checksum: string | null
          content_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_encrypted: boolean | null
          metadata: Json | null
          model_id: string | null
          name: string
          tags: Json | null
          template_id: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          checksum?: string | null
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          metadata?: Json | null
          model_id?: string | null
          name: string
          tags?: Json | null
          template_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          checksum?: string | null
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          metadata?: Json | null
          model_id?: string | null
          name?: string
          tags?: Json | null
          template_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuration_files_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vendor_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuration_files_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuration_files_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_library"
            referencedColumns: ["id"]
          },
        ]
      }
      configuration_templates: {
        Row: {
          ai_generated: boolean | null
          ai_optimization_rules: Json | null
          authentication_methods: Json | null
          automation_level: string | null
          best_practices: Json | null
          category: string
          compatibility_matrix: Json | null
          complexity_level: string | null
          config_sections: Json | null
          configuration_type: string
          created_at: string
          created_by: string | null
          deployment_scenarios: Json | null
          description: string | null
          id: string
          is_public: boolean | null
          is_validated: boolean | null
          last_ai_review: string | null
          model_id: string | null
          name: string
          network_requirements: Json | null
          optimization_recommendations: Json | null
          optimization_score: number | null
          performance_metrics: Json | null
          rating: number | null
          required_features: Json | null
          security_features: Json | null
          subcategory: string | null
          supported_scenarios: Json | null
          tags: Json | null
          template_content: string
          template_dependencies: Json | null
          template_source: string | null
          template_structure: Json | null
          template_variables: Json | null
          troubleshooting_guide: Json | null
          troubleshooting_scenarios: Json | null
          updated_at: string
          usage_count: number | null
          validation_commands: Json | null
          validation_notes: string | null
          validation_rules: Json | null
          variable_definitions: Json | null
          vendor_id: string | null
          wizard_parameters: Json | null
        }
        Insert: {
          ai_generated?: boolean | null
          ai_optimization_rules?: Json | null
          authentication_methods?: Json | null
          automation_level?: string | null
          best_practices?: Json | null
          category: string
          compatibility_matrix?: Json | null
          complexity_level?: string | null
          config_sections?: Json | null
          configuration_type: string
          created_at?: string
          created_by?: string | null
          deployment_scenarios?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_validated?: boolean | null
          last_ai_review?: string | null
          model_id?: string | null
          name: string
          network_requirements?: Json | null
          optimization_recommendations?: Json | null
          optimization_score?: number | null
          performance_metrics?: Json | null
          rating?: number | null
          required_features?: Json | null
          security_features?: Json | null
          subcategory?: string | null
          supported_scenarios?: Json | null
          tags?: Json | null
          template_content: string
          template_dependencies?: Json | null
          template_source?: string | null
          template_structure?: Json | null
          template_variables?: Json | null
          troubleshooting_guide?: Json | null
          troubleshooting_scenarios?: Json | null
          updated_at?: string
          usage_count?: number | null
          validation_commands?: Json | null
          validation_notes?: string | null
          validation_rules?: Json | null
          variable_definitions?: Json | null
          vendor_id?: string | null
          wizard_parameters?: Json | null
        }
        Update: {
          ai_generated?: boolean | null
          ai_optimization_rules?: Json | null
          authentication_methods?: Json | null
          automation_level?: string | null
          best_practices?: Json | null
          category?: string
          compatibility_matrix?: Json | null
          complexity_level?: string | null
          config_sections?: Json | null
          configuration_type?: string
          created_at?: string
          created_by?: string | null
          deployment_scenarios?: Json | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_validated?: boolean | null
          last_ai_review?: string | null
          model_id?: string | null
          name?: string
          network_requirements?: Json | null
          optimization_recommendations?: Json | null
          optimization_score?: number | null
          performance_metrics?: Json | null
          rating?: number | null
          required_features?: Json | null
          security_features?: Json | null
          subcategory?: string | null
          supported_scenarios?: Json | null
          tags?: Json | null
          template_content?: string
          template_dependencies?: Json | null
          template_source?: string | null
          template_structure?: Json | null
          template_variables?: Json | null
          troubleshooting_guide?: Json | null
          troubleshooting_scenarios?: Json | null
          updated_at?: string
          usage_count?: number | null
          validation_commands?: Json | null
          validation_notes?: string | null
          validation_rules?: Json | null
          variable_definitions?: Json | null
          vendor_id?: string | null
          wizard_parameters?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "configuration_templates_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vendor_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuration_templates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_library"
            referencedColumns: ["id"]
          },
        ]
      }
      countries_regions: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          region_name: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          region_name: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          region_name?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      custom_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_system_role: boolean | null
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean | null
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      deployment_types: {
        Row: {
          complexity_level: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          requirements: Json | null
          typical_timeline: string | null
          updated_at: string | null
        }
        Insert: {
          complexity_level?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          requirements?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          complexity_level?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          requirements?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
      industry_options: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      network_authentication_scenarios: {
        Row: {
          authentication_flow: Json
          compliance_requirements: Json | null
          configuration_steps: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          required_components: Json | null
          scenario_type: string
          security_considerations: Json | null
          troubleshooting_steps: Json | null
          updated_at: string
          use_cases: Json | null
          vendor_specific_configs: Json | null
        }
        Insert: {
          authentication_flow: Json
          compliance_requirements?: Json | null
          configuration_steps?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          required_components?: Json | null
          scenario_type: string
          security_considerations?: Json | null
          troubleshooting_steps?: Json | null
          updated_at?: string
          use_cases?: Json | null
          vendor_specific_configs?: Json | null
        }
        Update: {
          authentication_flow?: Json
          compliance_requirements?: Json | null
          configuration_steps?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          required_components?: Json | null
          scenario_type?: string
          security_considerations?: Json | null
          troubleshooting_steps?: Json | null
          updated_at?: string
          use_cases?: Json | null
          vendor_specific_configs?: Json | null
        }
        Relationships: []
      }
      network_segments: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          security_requirements: Json | null
          segment_type: string
          typical_size_range: string | null
          updated_at: string | null
          vendor_considerations: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          security_requirements?: Json | null
          segment_type: string
          typical_size_range?: string | null
          updated_at?: string | null
          vendor_considerations?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          security_requirements?: Json | null
          segment_type?: string
          typical_size_range?: string | null
          updated_at?: string | null
          vendor_considerations?: Json | null
        }
        Relationships: []
      }
      pain_points_library: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          industry_specific: Json | null
          recommended_solutions: Json | null
          severity: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_specific?: Json | null
          recommended_solutions?: Json | null
          severity?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          industry_specific?: Json | null
          recommended_solutions?: Json | null
          severity?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      poc_activities: {
        Row: {
          activity_type: string
          actual_completion: string | null
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          documentation: Json | null
          id: string
          next_steps: string | null
          project_id: string
          results: Json | null
          stakeholders: Json | null
          start_date: string | null
          status: string | null
          success_criteria: Json | null
          target_completion: string | null
          title: string
          updated_at: string
        }
        Insert: {
          activity_type: string
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation?: Json | null
          id?: string
          next_steps?: string | null
          project_id: string
          results?: Json | null
          stakeholders?: Json | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          activity_type?: string
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation?: Json | null
          id?: string
          next_steps?: string | null
          project_id?: string
          results?: Json | null
          stakeholders?: Json | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poc_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          department: string | null
          email: string | null
          failed_login_attempts: number | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_blocked: boolean | null
          job_title: string | null
          last_login: string | null
          last_name: string | null
          locked_until: string | null
          password_changed_at: string | null
          phone: string | null
          two_factor_deadline: string | null
          two_factor_enabled: boolean | null
          two_factor_required: boolean | null
          two_factor_secret: string | null
          two_factor_setup_forced: boolean | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          failed_login_attempts?: number | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_blocked?: boolean | null
          job_title?: string | null
          last_login?: string | null
          last_name?: string | null
          locked_until?: string | null
          password_changed_at?: string | null
          phone?: string | null
          two_factor_deadline?: string | null
          two_factor_enabled?: boolean | null
          two_factor_required?: boolean | null
          two_factor_secret?: string | null
          two_factor_setup_forced?: boolean | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          failed_login_attempts?: number | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_blocked?: boolean | null
          job_title?: string | null
          last_login?: string | null
          last_name?: string | null
          locked_until?: string | null
          password_changed_at?: string | null
          phone?: string | null
          two_factor_deadline?: string | null
          two_factor_enabled?: boolean | null
          two_factor_required?: boolean | null
          two_factor_secret?: string | null
          two_factor_setup_forced?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      project_handoffs: {
        Row: {
          completion_date: string | null
          created_at: string
          created_by: string | null
          documentation_items: Json | null
          from_team: string
          handoff_date: string | null
          handoff_type: string
          id: string
          knowledge_transfer_items: Json | null
          notes: string | null
          outstanding_items: Json | null
          project_id: string
          signoff_date: string | null
          signoff_from: string | null
          signoff_to: string | null
          status: string | null
          to_team: string
          training_sessions: Json | null
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          documentation_items?: Json | null
          from_team: string
          handoff_date?: string | null
          handoff_type: string
          id?: string
          knowledge_transfer_items?: Json | null
          notes?: string | null
          outstanding_items?: Json | null
          project_id: string
          signoff_date?: string | null
          signoff_from?: string | null
          signoff_to?: string | null
          status?: string | null
          to_team: string
          training_sessions?: Json | null
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          created_by?: string | null
          documentation_items?: Json | null
          from_team?: string
          handoff_date?: string | null
          handoff_type?: string
          id?: string
          knowledge_transfer_items?: Json | null
          notes?: string | null
          outstanding_items?: Json | null
          project_id?: string
          signoff_date?: string | null
          signoff_from?: string | null
          signoff_to?: string | null
          status?: string | null
          to_team?: string
          training_sessions?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_handoffs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          actual_date: string | null
          assigned_to: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          deliverables: Json | null
          dependencies: Json | null
          description: string | null
          id: string
          milestone_type: string
          name: string
          notes: string | null
          project_id: string
          responsible_team: string | null
          status: string | null
          success_criteria: Json | null
          target_date: string | null
          updated_at: string
        }
        Insert: {
          actual_date?: string | null
          assigned_to?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          dependencies?: Json | null
          description?: string | null
          id?: string
          milestone_type: string
          name: string
          notes?: string | null
          project_id: string
          responsible_team?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_date?: string | null
          assigned_to?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          dependencies?: Json | null
          description?: string | null
          id?: string
          milestone_type?: string
          name?: string
          notes?: string | null
          project_id?: string
          responsible_team?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          created_at: string | null
          created_by: string | null
          deliverables: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          phase_order: number | null
          prerequisites: Json | null
          success_criteria: Json | null
          typical_duration: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phase_order?: number | null
          prerequisites?: Json | null
          success_criteria?: Json | null
          typical_duration?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phase_order?: number | null
          prerequisites?: Json | null
          success_criteria?: Json | null
          typical_duration?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_requirements: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          created_at: string
          id: string
          implementation_approach: string | null
          project_id: string
          requirement_id: string
          status: string | null
          target_date: string | null
          updated_at: string
          verification_notes: string | null
          verification_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          implementation_approach?: string | null
          project_id: string
          requirement_id: string
          status?: string | null
          target_date?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          implementation_approach?: string | null
          project_id?: string
          requirement_id?: string
          status?: string | null
          target_date?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requirements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements_library"
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
      project_templates: {
        Row: {
          authentication_workflows: Json | null
          compliance_frameworks: string[] | null
          created_at: string
          created_by: string | null
          deployment_type: string
          description: string | null
          id: string
          industry: string | null
          name: string
          network_requirements: Json | null
          requirements: Json | null
          security_level: string
          test_cases: Json | null
          timeline_template: Json | null
          updated_at: string
          use_cases: Json | null
          vendor_configurations: Json | null
        }
        Insert: {
          authentication_workflows?: Json | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          deployment_type: string
          description?: string | null
          id?: string
          industry?: string | null
          name: string
          network_requirements?: Json | null
          requirements?: Json | null
          security_level: string
          test_cases?: Json | null
          timeline_template?: Json | null
          updated_at?: string
          use_cases?: Json | null
          vendor_configurations?: Json | null
        }
        Update: {
          authentication_workflows?: Json | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          deployment_type?: string
          description?: string | null
          id?: string
          industry?: string | null
          name?: string
          network_requirements?: Json | null
          requirements?: Json | null
          security_level?: string
          test_cases?: Json | null
          timeline_template?: Json | null
          updated_at?: string
          use_cases?: Json | null
          vendor_configurations?: Json | null
        }
        Relationships: []
      }
      project_test_cases: {
        Row: {
          created_at: string
          defects_found: Json | null
          executed_by: string | null
          execution_date: string | null
          execution_notes: string | null
          id: string
          project_id: string
          status: string | null
          test_case_id: string
          test_results: Json | null
          updated_at: string
          use_case_reference: string | null
        }
        Insert: {
          created_at?: string
          defects_found?: Json | null
          executed_by?: string | null
          execution_date?: string | null
          execution_notes?: string | null
          id?: string
          project_id: string
          status?: string | null
          test_case_id: string
          test_results?: Json | null
          updated_at?: string
          use_case_reference?: string | null
        }
        Update: {
          created_at?: string
          defects_found?: Json | null
          executed_by?: string | null
          execution_date?: string | null
          execution_notes?: string | null
          id?: string
          project_id?: string
          status?: string | null
          test_case_id?: string
          test_results?: Json | null
          updated_at?: string
          use_case_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_test_cases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_test_cases_test_case_id_fkey"
            columns: ["test_case_id"]
            isOneToOne: false
            referencedRelation: "test_case_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_test_cases_use_case_reference_fkey"
            columns: ["use_case_reference"]
            isOneToOne: false
            referencedRelation: "project_use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      project_use_cases: {
        Row: {
          actual_completion: string | null
          assigned_to: string | null
          created_at: string
          id: string
          implementation_notes: string | null
          priority: string
          project_id: string
          status: string | null
          target_completion: string | null
          test_results: Json | null
          updated_at: string
          use_case_id: string
        }
        Insert: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          implementation_notes?: string | null
          priority: string
          project_id: string
          status?: string | null
          target_completion?: string | null
          test_results?: Json | null
          updated_at?: string
          use_case_id: string
        }
        Update: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          implementation_notes?: string | null
          priority?: string
          project_id?: string
          status?: string | null
          target_completion?: string | null
          test_results?: Json | null
          updated_at?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_use_cases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_use_cases_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_case_library"
            referencedColumns: ["id"]
          },
        ]
      }
      project_vendors: {
        Row: {
          configuration_backup: Json | null
          configuration_status: string | null
          created_at: string
          id: string
          integration_notes: string | null
          models_used: Json | null
          project_id: string
          role: string
          support_contact: Json | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          configuration_backup?: Json | null
          configuration_status?: string | null
          created_at?: string
          id?: string
          integration_notes?: string | null
          models_used?: Json | null
          project_id: string
          role: string
          support_contact?: Json | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          configuration_backup?: Json | null
          configuration_status?: string | null
          created_at?: string
          id?: string
          integration_notes?: string | null
          models_used?: Json | null
          project_id?: string
          role?: string
          support_contact?: Json | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_vendors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_library"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_completion: string | null
          additional_stakeholders: Json | null
          budget: number | null
          bulk_sites_data: Json | null
          business_domain: string | null
          business_summary: string | null
          business_website: string | null
          client_name: string | null
          compliance_frameworks: string[] | null
          created_at: string
          created_by: string | null
          current_phase: string | null
          deployment_type: string | null
          description: string | null
          enable_auto_vendors: boolean | null
          enable_bulk_sites: boolean | null
          enable_bulk_users: boolean | null
          id: string
          industry: string | null
          integration_requirements: Json | null
          migration_scope: Json | null
          name: string
          pain_points: Json | null
          poc_status: string | null
          portnox_owner: string | null
          primary_country: string | null
          primary_region: string | null
          progress_percentage: number | null
          project_manager: string | null
          project_owner: string | null
          project_type: string | null
          security_level: string | null
          start_date: string | null
          status: string | null
          success_criteria: Json | null
          target_completion: string | null
          technical_owner: string | null
          template_id: string | null
          timezone: string | null
          total_endpoints: number | null
          total_sites: number | null
          updated_at: string
        }
        Insert: {
          actual_completion?: string | null
          additional_stakeholders?: Json | null
          budget?: number | null
          bulk_sites_data?: Json | null
          business_domain?: string | null
          business_summary?: string | null
          business_website?: string | null
          client_name?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          deployment_type?: string | null
          description?: string | null
          enable_auto_vendors?: boolean | null
          enable_bulk_sites?: boolean | null
          enable_bulk_users?: boolean | null
          id?: string
          industry?: string | null
          integration_requirements?: Json | null
          migration_scope?: Json | null
          name: string
          pain_points?: Json | null
          poc_status?: string | null
          portnox_owner?: string | null
          primary_country?: string | null
          primary_region?: string | null
          progress_percentage?: number | null
          project_manager?: string | null
          project_owner?: string | null
          project_type?: string | null
          security_level?: string | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          technical_owner?: string | null
          template_id?: string | null
          timezone?: string | null
          total_endpoints?: number | null
          total_sites?: number | null
          updated_at?: string
        }
        Update: {
          actual_completion?: string | null
          additional_stakeholders?: Json | null
          budget?: number | null
          bulk_sites_data?: Json | null
          business_domain?: string | null
          business_summary?: string | null
          business_website?: string | null
          client_name?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          deployment_type?: string | null
          description?: string | null
          enable_auto_vendors?: boolean | null
          enable_bulk_sites?: boolean | null
          enable_bulk_users?: boolean | null
          id?: string
          industry?: string | null
          integration_requirements?: Json | null
          migration_scope?: Json | null
          name?: string
          pain_points?: Json | null
          poc_status?: string | null
          portnox_owner?: string | null
          primary_country?: string | null
          primary_region?: string | null
          progress_percentage?: number | null
          project_manager?: string | null
          project_owner?: string | null
          project_type?: string | null
          security_level?: string | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          technical_owner?: string | null
          template_id?: string | null
          timezone?: string | null
          total_endpoints?: number | null
          total_sites?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations_library: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          expected_outcome: string | null
          id: string
          implementation_effort: string
          industry_specific: Json | null
          portnox_features: Json | null
          prerequisites: Json | null
          priority: string
          related_pain_points: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description: string
          expected_outcome?: string | null
          id?: string
          implementation_effort?: string
          industry_specific?: Json | null
          portnox_features?: Json | null
          prerequisites?: Json | null
          priority?: string
          related_pain_points?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          expected_outcome?: string | null
          id?: string
          implementation_effort?: string
          industry_specific?: Json | null
          portnox_features?: Json | null
          prerequisites?: Json | null
          priority?: string
          related_pain_points?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      requirements_library: {
        Row: {
          acceptance_criteria: Json | null
          assumptions: Json | null
          category: string
          compliance_frameworks: string[] | null
          constraints: Json | null
          created_at: string
          created_by: string | null
          dependencies: Json | null
          description: string | null
          documentation_references: Json | null
          id: string
          portnox_features: Json | null
          priority: string
          rationale: string | null
          related_use_cases: Json | null
          requirement_type: string
          status: string | null
          subcategory: string | null
          tags: string[] | null
          test_cases: Json | null
          title: string
          updated_at: string
          vendor_requirements: Json | null
          verification_methods: Json | null
        }
        Insert: {
          acceptance_criteria?: Json | null
          assumptions?: Json | null
          category: string
          compliance_frameworks?: string[] | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          documentation_references?: Json | null
          id?: string
          portnox_features?: Json | null
          priority: string
          rationale?: string | null
          related_use_cases?: Json | null
          requirement_type: string
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          title: string
          updated_at?: string
          vendor_requirements?: Json | null
          verification_methods?: Json | null
        }
        Update: {
          acceptance_criteria?: Json | null
          assumptions?: Json | null
          category?: string
          compliance_frameworks?: string[] | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          documentation_references?: Json | null
          id?: string
          portnox_features?: Json | null
          priority?: string
          rationale?: string | null
          related_use_cases?: Json | null
          requirement_type?: string
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          title?: string
          updated_at?: string
          vendor_requirements?: Json | null
          verification_methods?: Json | null
        }
        Relationships: []
      }
      scoping_questionnaires: {
        Row: {
          authentication_requirements: Json | null
          completed_at: string | null
          completion_percentage: number | null
          compliance_requirements: Json | null
          created_at: string
          created_by: string | null
          deployment_type: string | null
          id: string
          industry: string | null
          infrastructure_details: Json | null
          integration_scope: Json | null
          pain_points: Json | null
          project_id: string | null
          questionnaire_data: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          security_requirements: Json | null
          site_id: string
          sizing_calculations: Json | null
          status: string | null
          success_criteria: Json | null
          template_used: string | null
          updated_at: string
        }
        Insert: {
          authentication_requirements?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          compliance_requirements?: Json | null
          created_at?: string
          created_by?: string | null
          deployment_type?: string | null
          id?: string
          industry?: string | null
          infrastructure_details?: Json | null
          integration_scope?: Json | null
          pain_points?: Json | null
          project_id?: string | null
          questionnaire_data?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          security_requirements?: Json | null
          site_id: string
          sizing_calculations?: Json | null
          status?: string | null
          success_criteria?: Json | null
          template_used?: string | null
          updated_at?: string
        }
        Update: {
          authentication_requirements?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          compliance_requirements?: Json | null
          created_at?: string
          created_by?: string | null
          deployment_type?: string | null
          id?: string
          industry?: string | null
          infrastructure_details?: Json | null
          integration_scope?: Json | null
          pain_points?: Json | null
          project_id?: string | null
          questionnaire_data?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          security_requirements?: Json | null
          site_id?: string
          sizing_calculations?: Json | null
          status?: string | null
          success_criteria?: Json | null
          template_used?: string | null
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
          {
            foreignKeyName: "scoping_questionnaires_template_used_fkey"
            columns: ["template_used"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_levels: {
        Row: {
          compliance_mappings: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          compliance_mappings?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          compliance_mappings?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_requirements: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          created_at: string
          id: string
          implementation_approach: string | null
          requirement_id: string
          site_id: string
          status: string | null
          target_date: string | null
          updated_at: string
          verification_notes: string | null
          verification_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          implementation_approach?: string | null
          requirement_id: string
          site_id: string
          status?: string | null
          target_date?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          implementation_approach?: string | null
          requirement_id?: string
          site_id?: string
          status?: string | null
          target_date?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements_library"
            referencedColumns: ["id"]
          },
        ]
      }
      site_use_cases: {
        Row: {
          actual_completion: string | null
          assigned_to: string | null
          created_at: string
          id: string
          implementation_notes: string | null
          priority: string
          site_id: string
          status: string | null
          target_completion: string | null
          updated_at: string
          use_case_id: string
        }
        Insert: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          implementation_notes?: string | null
          priority: string
          site_id: string
          status?: string | null
          target_completion?: string | null
          updated_at?: string
          use_case_id: string
        }
        Update: {
          actual_completion?: string | null
          assigned_to?: string | null
          created_at?: string
          id?: string
          implementation_notes?: string | null
          priority?: string
          site_id?: string
          status?: string | null
          target_completion?: string | null
          updated_at?: string
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_use_cases_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_case_library"
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
          country: string | null
          created_at: string
          created_by: string | null
          current_phase: string | null
          deployment_config: Json | null
          device_count: number | null
          id: string
          location: string | null
          name: string
          network_segments: number | null
          notifications_enabled: boolean | null
          priority: string | null
          progress_percentage: number | null
          region: string | null
          site_id: string | null
          site_type: string | null
          status: string | null
          timeline_end: string | null
          timeline_start: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_engineer?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          deployment_config?: Json | null
          device_count?: number | null
          id?: string
          location?: string | null
          name: string
          network_segments?: number | null
          notifications_enabled?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          region?: string | null
          site_id?: string | null
          site_type?: string | null
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_engineer?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          deployment_config?: Json | null
          device_count?: number | null
          id?: string
          location?: string | null
          name?: string
          network_segments?: number | null
          notifications_enabled?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          region?: string | null
          site_id?: string | null
          site_type?: string | null
          status?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_usage_analytics: {
        Row: {
          created_at: string | null
          created_by: string | null
          environment_details: Json | null
          errors_encountered: Json | null
          id: string
          success_rate: number | null
          template_id: string | null
          time_to_complete: number | null
          usage_type: string
          user_context: Json | null
          user_satisfaction: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          environment_details?: Json | null
          errors_encountered?: Json | null
          id?: string
          success_rate?: number | null
          template_id?: string | null
          time_to_complete?: number | null
          usage_type: string
          user_context?: Json | null
          user_satisfaction?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          environment_details?: Json | null
          errors_encountered?: Json | null
          id?: string
          success_rate?: number | null
          template_id?: string | null
          time_to_complete?: number | null
          usage_type?: string
          user_context?: Json | null
          user_satisfaction?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_usage_analytics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      test_case_library: {
        Row: {
          automation_possible: boolean | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          estimated_duration_minutes: number | null
          expected_results: Json | null
          id: string
          name: string
          prerequisites: Json | null
          priority: string
          related_use_cases: Json | null
          tags: string[] | null
          test_steps: Json | null
          test_type: string
          updated_at: string
          validation_criteria: Json | null
          vendor_specific: Json | null
        }
        Insert: {
          automation_possible?: boolean | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          expected_results?: Json | null
          id?: string
          name: string
          prerequisites?: Json | null
          priority: string
          related_use_cases?: Json | null
          tags?: string[] | null
          test_steps?: Json | null
          test_type: string
          updated_at?: string
          validation_criteria?: Json | null
          vendor_specific?: Json | null
        }
        Update: {
          automation_possible?: boolean | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          expected_results?: Json | null
          id?: string
          name?: string
          prerequisites?: Json | null
          priority?: string
          related_use_cases?: Json | null
          tags?: string[] | null
          test_steps?: Json | null
          test_type?: string
          updated_at?: string
          validation_criteria?: Json | null
          vendor_specific?: Json | null
        }
        Relationships: []
      }
      use_case_library: {
        Row: {
          authentication_methods: Json | null
          business_value: string | null
          category: string
          complexity: string
          compliance_frameworks: string[] | null
          created_at: string
          created_by: string | null
          dependencies: Json | null
          deployment_scenarios: Json | null
          description: string | null
          estimated_effort_weeks: number | null
          id: string
          name: string
          portnox_features: Json | null
          prerequisites: Json | null
          status: string | null
          subcategory: string | null
          supported_vendors: Json | null
          tags: string[] | null
          technical_requirements: Json | null
          test_scenarios: Json | null
          updated_at: string
        }
        Insert: {
          authentication_methods?: Json | null
          business_value?: string | null
          category: string
          complexity: string
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          deployment_scenarios?: Json | null
          description?: string | null
          estimated_effort_weeks?: number | null
          id?: string
          name: string
          portnox_features?: Json | null
          prerequisites?: Json | null
          status?: string | null
          subcategory?: string | null
          supported_vendors?: Json | null
          tags?: string[] | null
          technical_requirements?: Json | null
          test_scenarios?: Json | null
          updated_at?: string
        }
        Update: {
          authentication_methods?: Json | null
          business_value?: string | null
          category?: string
          complexity?: string
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          deployment_scenarios?: Json | null
          description?: string | null
          estimated_effort_weeks?: number | null
          id?: string
          name?: string
          portnox_features?: Json | null
          prerequisites?: Json | null
          status?: string | null
          subcategory?: string | null
          supported_vendors?: Json | null
          tags?: string[] | null
          technical_requirements?: Json | null
          test_scenarios?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          custom_role_id: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by: string
          metadata: Json | null
          scope_id: string | null
          scope_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          custom_role_id?: string | null
          email: string
          expires_at?: string
          id?: string
          invitation_token: string
          invited_by: string
          metadata?: Json | null
          scope_id?: string | null
          scope_type?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          custom_role_id?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          metadata?: Json | null
          scope_id?: string | null
          scope_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          custom_role_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          scope_id: string | null
          scope_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          custom_role_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          scope_id?: string | null
          scope_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          custom_role_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scope_id?: string | null
          scope_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_library: {
        Row: {
          category: string
          certifications: Json | null
          configuration_templates: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          documentation_links: Json | null
          firmware_requirements: Json | null
          id: string
          integration_methods: Json | null
          known_limitations: Json | null
          last_tested_date: string | null
          models: Json | null
          portnox_compatibility: Json | null
          portnox_documentation: Json | null
          portnox_integration_level: string | null
          status: string | null
          support_contact: Json | null
          support_level: string | null
          supported_protocols: Json | null
          updated_at: string
          vendor_name: string
          vendor_type: string
          website_url: string | null
        }
        Insert: {
          category: string
          certifications?: Json | null
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          integration_methods?: Json | null
          known_limitations?: Json | null
          last_tested_date?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          portnox_documentation?: Json | null
          portnox_integration_level?: string | null
          status?: string | null
          support_contact?: Json | null
          support_level?: string | null
          supported_protocols?: Json | null
          updated_at?: string
          vendor_name: string
          vendor_type: string
          website_url?: string | null
        }
        Update: {
          category?: string
          certifications?: Json | null
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          integration_methods?: Json | null
          known_limitations?: Json | null
          last_tested_date?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          portnox_documentation?: Json | null
          portnox_integration_level?: string | null
          status?: string | null
          support_contact?: Json | null
          support_level?: string | null
          supported_protocols?: Json | null
          updated_at?: string
          vendor_name?: string
          vendor_type?: string
          website_url?: string | null
        }
        Relationships: []
      }
      vendor_models: {
        Row: {
          configuration_notes: string | null
          created_at: string
          created_by: string | null
          documentation_links: Json | null
          eol_date: string | null
          eos_date: string | null
          firmware_versions: Json | null
          hardware_specs: Json | null
          id: string
          model_name: string
          model_series: string | null
          port_configurations: Json | null
          supported_features: Json | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          configuration_notes?: string | null
          created_at?: string
          created_by?: string | null
          documentation_links?: Json | null
          eol_date?: string | null
          eos_date?: string | null
          firmware_versions?: Json | null
          hardware_specs?: Json | null
          id?: string
          model_name: string
          model_series?: string | null
          port_configurations?: Json | null
          supported_features?: Json | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          configuration_notes?: string | null
          created_at?: string
          created_by?: string | null
          documentation_links?: Json | null
          eol_date?: string | null
          eos_date?: string | null
          firmware_versions?: Json | null
          hardware_specs?: Json | null
          id?: string
          model_name?: string
          model_series?: string | null
          port_configurations?: Json | null
          supported_features?: Json | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_models_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_library"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_roles: {
        Args: { _user_id: string; _scope_type?: string; _scope_id?: string }
        Returns: boolean
      }
      create_initial_admin: {
        Args: { _user_id: string }
        Returns: undefined
      }
      create_user_safely: {
        Args: {
          p_email: string
          p_password: string
          p_first_name?: string
          p_last_name?: string
          p_role?: Database["public"]["Enums"]["app_role"]
          p_scope_type?: string
          p_scope_id?: string
        }
        Returns: Json
      }
      delete_user_safely: {
        Args: { p_user_id: string }
        Returns: Json
      }
      disable_two_factor_auth: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      enable_two_factor_auth: {
        Args: {
          p_user_id: string
          p_secret: string
          p_verification_code: string
        }
        Returns: boolean
      }
      enforce_2fa_for_user: {
        Args: { p_user_id: string; p_deadline?: string; p_immediate?: boolean }
        Returns: boolean
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_super_admin_emails: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      has_permission: {
        Args: {
          user_id: string
          resource: Database["public"]["Enums"]["resource_type"]
          permission: Database["public"]["Enums"]["permission_type"]
          scope_type?: string
          scope_id?: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _scope_type?: string
          _scope_id?: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: { _event_type: string; _event_details?: Json; _user_id?: string }
        Returns: undefined
      }
      request_password_reset: {
        Args: { p_email: string }
        Returns: Json
      }
      reset_user_2fa: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      toggle_user_block: {
        Args: { p_user_id: string; p_block?: boolean }
        Returns: Json
      }
      update_2fa_enforcement: {
        Args: { p_settings: Json }
        Returns: boolean
      }
      user_owns_project: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      user_owns_site: {
        Args: { site_uuid: string }
        Returns: boolean
      }
      user_requires_2fa: {
        Args: { p_user_id?: string }
        Returns: boolean
      }
      verify_totp_code: {
        Args: { p_user_id: string; p_code: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "project_creator"
        | "project_viewer"
        | "product_manager"
        | "sales_engineer"
        | "technical_account_manager"
        | "technical_seller"
        | "sales"
        | "lead_engineer"
        | "engineer"
        | "viewer"
      permission_type: "read" | "write" | "update" | "delete" | "admin"
      resource_type:
        | "projects"
        | "sites"
        | "users"
        | "vendors"
        | "use_cases"
        | "requirements"
        | "test_cases"
        | "reports"
        | "settings"
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
    Enums: {
      app_role: [
        "super_admin",
        "project_creator",
        "project_viewer",
        "product_manager",
        "sales_engineer",
        "technical_account_manager",
        "technical_seller",
        "sales",
        "lead_engineer",
        "engineer",
        "viewer",
      ],
      permission_type: ["read", "write", "update", "delete", "admin"],
      resource_type: [
        "projects",
        "sites",
        "users",
        "vendors",
        "use_cases",
        "requirements",
        "test_cases",
        "reports",
        "settings",
      ],
    },
  },
} as const
