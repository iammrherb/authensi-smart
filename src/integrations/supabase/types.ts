export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_analysis_sessions: {
        Row: {
          analysis_criteria: Json | null
          analysis_model: string | null
          analysis_results: Json | null
          confidence_score: number | null
          created_at: string | null
          created_by: string | null
          file_id: string | null
          id: string
          input_data: string
          processing_time_ms: number | null
          project_id: string | null
          session_type: string
          site_id: string | null
        }
        Insert: {
          analysis_criteria?: Json | null
          analysis_model?: string | null
          analysis_results?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          file_id?: string | null
          id?: string
          input_data: string
          processing_time_ms?: number | null
          project_id?: string | null
          session_type: string
          site_id?: string | null
        }
        Update: {
          analysis_criteria?: Json | null
          analysis_model?: string | null
          analysis_results?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          created_by?: string | null
          file_id?: string | null
          id?: string
          input_data?: string
          processing_time_ms?: number | null
          project_id?: string | null
          session_type?: string
          site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_sessions_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "uploaded_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_sessions_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_context_patterns: {
        Row: {
          confidence_score: number | null
          context_tags: Json | null
          created_at: string
          frequency_count: number | null
          id: string
          last_seen: string | null
          pattern_data: Json
          pattern_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          context_tags?: Json | null
          created_at?: string
          frequency_count?: number | null
          id?: string
          last_seen?: string | null
          pattern_data?: Json
          pattern_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          context_tags?: Json | null
          created_at?: string
          frequency_count?: number | null
          id?: string
          last_seen?: string | null
          pattern_data?: Json
          pattern_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_context_sessions: {
        Row: {
          accumulated_context: Json | null
          context_summary: string | null
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          project_context: Json | null
          session_token: string
          session_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accumulated_context?: Json | null
          context_summary?: string | null
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          project_context?: Json | null
          session_token: string
          session_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accumulated_context?: Json | null
          context_summary?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          project_context?: Json | null
          session_token?: string
          session_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversation_history: {
        Row: {
          ai_model_used: string | null
          context_data: Json | null
          conversation_type: string
          created_at: string
          id: string
          message_content: string
          message_metadata: Json | null
          message_role: string
          project_id: string | null
          session_id: string
          site_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          context_data?: Json | null
          conversation_type?: string
          created_at?: string
          id?: string
          message_content: string
          message_metadata?: Json | null
          message_role: string
          project_id?: string | null
          session_id: string
          site_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          context_data?: Json | null
          conversation_type?: string
          created_at?: string
          id?: string
          message_content?: string
          message_metadata?: Json | null
          message_role?: string
          project_id?: string | null
          session_id?: string
          site_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      ai_providers: {
        Row: {
          api_endpoint: string
          authentication_method: string
          capabilities: Json | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          pricing_info: Json | null
          provider_name: string
          rate_limits: Json | null
          supported_models: Json
          updated_at: string
        }
        Insert: {
          api_endpoint: string
          authentication_method?: string
          capabilities?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          pricing_info?: Json | null
          provider_name: string
          rate_limits?: Json | null
          supported_models?: Json
          updated_at?: string
        }
        Update: {
          api_endpoint?: string
          authentication_method?: string
          capabilities?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          pricing_info?: Json | null
          provider_name?: string
          rate_limits?: Json | null
          supported_models?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_providers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_analytics: {
        Row: {
          cost_cents: number | null
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          model_used: string
          provider_id: string
          request_type: string
          response_time_ms: number | null
          success: boolean | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          cost_cents?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model_used: string
          provider_id: string
          request_type: string
          response_time_ms?: number | null
          success?: boolean | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          cost_cents?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          model_used?: string
          provider_id?: string
          request_type?: string
          response_time_ms?: number | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_analytics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_preferences: {
        Row: {
          auto_context_building: boolean | null
          communication_style: Json | null
          context_retention_days: number | null
          created_at: string
          domain_expertise: Json | null
          id: string
          learning_preferences: Json | null
          preferred_methodologies: Json | null
          preferred_vendors: Json | null
          technical_expertise_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_context_building?: boolean | null
          communication_style?: Json | null
          context_retention_days?: number | null
          created_at?: string
          domain_expertise?: Json | null
          id?: string
          learning_preferences?: Json | null
          preferred_methodologies?: Json | null
          preferred_vendors?: Json | null
          technical_expertise_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_context_building?: boolean | null
          communication_style?: Json | null
          context_retention_days?: number | null
          created_at?: string
          domain_expertise?: Json | null
          id?: string
          learning_preferences?: Json | null
          preferred_methodologies?: Json | null
          preferred_vendors?: Json | null
          technical_expertise_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
          typical_use_cases?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      catalog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          key: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          key: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          key?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          category_key: string
          created_at: string
          created_by: string | null
          firmware_version: string | null
          id: string
          is_active: boolean | null
          labels: Json
          metadata: Json
          model: string | null
          name: string
          tags: Json
          updated_at: string
          vendor: string | null
        }
        Insert: {
          category_key: string
          created_at?: string
          created_by?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          labels?: Json
          metadata?: Json
          model?: string | null
          name: string
          tags?: Json
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          category_key?: string
          created_at?: string
          created_by?: string | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          labels?: Json
          metadata?: Json
          model?: string | null
          name?: string
          tags?: Json
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_items_category_key_fkey"
            columns: ["category_key"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["key"]
          },
        ]
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
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
          associated_projects: Json | null
          associated_sites: Json | null
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
          associated_projects?: Json | null
          associated_sites?: Json | null
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
          associated_projects?: Json | null
          associated_sites?: Json | null
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
            foreignKeyName: "fk_configuration_templates_vendor"
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
      customer_analytics: {
        Row: {
          created_at: string
          customer_user_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          project_id: string
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          customer_user_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          project_id: string
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          customer_user_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          project_id?: string
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_analytics_customer_user_id_fkey"
            columns: ["customer_user_id"]
            isOneToOne: false
            referencedRelation: "customer_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "customer_portal_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_implementation_tracking: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          created_at: string
          deliverables: Json | null
          dependencies: Json | null
          description: string | null
          id: string
          milestone_name: string
          phase: string
          progress_percentage: number | null
          project_id: string
          status: string
          success_criteria: Json | null
          target_date: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          deliverables?: Json | null
          dependencies?: Json | null
          description?: string | null
          id?: string
          milestone_name: string
          phase: string
          progress_percentage?: number | null
          project_id: string
          status?: string
          success_criteria?: Json | null
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          created_at?: string
          deliverables?: Json | null
          dependencies?: Json | null
          description?: string | null
          id?: string
          milestone_name?: string
          phase?: string
          progress_percentage?: number | null
          project_id?: string
          status?: string
          success_criteria?: Json | null
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_implementation_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portal_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          customer_portal_id: string
          id: string
          ip_address: unknown | null
          project_id: string
          user_agent: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          customer_portal_id: string
          id?: string
          ip_address?: unknown | null
          project_id: string
          user_agent?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          customer_portal_id?: string
          id?: string
          ip_address?: unknown | null
          project_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_activity_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portal_sessions: {
        Row: {
          created_at: string
          customer_user_id: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          project_id: string
          session_token: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          customer_user_id: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          project_id: string
          session_token: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          customer_user_id?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          project_id?: string
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_sessions_customer_user_id_fkey"
            columns: ["customer_user_id"]
            isOneToOne: false
            referencedRelation: "customer_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_portal_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portal_users: {
        Row: {
          access_level: string | null
          assigned_at: string | null
          assigned_by: string | null
          customer_portal_id: string
          expires_at: string | null
          id: string
          is_billing_contact: boolean | null
          is_primary_contact: boolean | null
          is_technical_contact: boolean | null
          notes: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          access_level?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          customer_portal_id: string
          expires_at?: string | null
          id?: string
          is_billing_contact?: boolean | null
          is_primary_contact?: boolean | null
          is_technical_contact?: boolean | null
          notes?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          access_level?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          customer_portal_id?: string
          expires_at?: string | null
          id?: string
          is_billing_contact?: boolean | null
          is_primary_contact?: boolean | null
          is_technical_contact?: boolean | null
          notes?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_users_customer_portal_id_fkey"
            columns: ["customer_portal_id"]
            isOneToOne: false
            referencedRelation: "customer_portals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_portal_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portals: {
        Row: {
          address: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          customer_code: string | null
          customer_name: string
          description: string | null
          id: string
          industry: string | null
          size: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string | null
          customer_name: string
          description?: string | null
          id?: string
          industry?: string | null
          size?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string | null
          customer_name?: string
          description?: string | null
          id?: string
          industry?: string | null
          size?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_team_members: {
        Row: {
          can_receive_notifications: boolean | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string
          id: string
          is_primary_contact: boolean | null
          name: string
          phone: string | null
          project_id: string
          responsibilities: Json | null
          role: string
          updated_at: string
        }
        Insert: {
          can_receive_notifications?: boolean | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email: string
          id?: string
          is_primary_contact?: boolean | null
          name: string
          phone?: string | null
          project_id: string
          responsibilities?: Json | null
          role: string
          updated_at?: string
        }
        Update: {
          can_receive_notifications?: boolean | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string
          id?: string
          is_primary_contact?: boolean | null
          name?: string
          phone?: string | null
          project_id?: string
          responsibilities?: Json | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_team_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "customer_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_users: {
        Row: {
          created_at: string
          created_by: string | null
          customer_organization: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          password_hash: string
          project_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_organization?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password_hash: string
          project_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_organization?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          password_hash?: string
          project_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_checklists: {
        Row: {
          category: string
          checklist_items: Json
          complexity_level: string | null
          created_at: string
          created_by: string | null
          deployment_type: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          name: string
          order_sequence: number
          prerequisites_checklist_ids: string[] | null
          product: string | null
          updated_at: string
          vendor: string | null
          version: string | null
        }
        Insert: {
          category: string
          checklist_items?: Json
          complexity_level?: string | null
          created_at?: string
          created_by?: string | null
          deployment_type?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          name: string
          order_sequence?: number
          prerequisites_checklist_ids?: string[] | null
          product?: string | null
          updated_at?: string
          vendor?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          checklist_items?: Json
          complexity_level?: string | null
          created_at?: string
          created_by?: string | null
          deployment_type?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          name?: string
          order_sequence?: number
          prerequisites_checklist_ids?: string[] | null
          product?: string | null
          updated_at?: string
          vendor?: string | null
          version?: string | null
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
          typical_timeline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      device_permissions: {
        Row: {
          conditions: Json | null
          device_id: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          user_id: string
        }
        Insert: {
          conditions?: Json | null
          device_id: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          user_id: string
        }
        Update: {
          conditions?: Json | null
          device_id?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      device_types: {
        Row: {
          authentication_capabilities: Json | null
          category: string
          compliance_requirements: Json | null
          created_at: string | null
          created_by: string | null
          deployment_considerations: Json | null
          description: string | null
          device_name: string
          documentation_links: Json
          id: string
          integration_complexity: string | null
          management_options: Json | null
          manufacturer: string
          operating_systems: Json | null
          security_features: Json | null
          tags: Json
          typical_use_cases: Json | null
          updated_at: string | null
        }
        Insert: {
          authentication_capabilities?: Json | null
          category: string
          compliance_requirements?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_considerations?: Json | null
          description?: string | null
          device_name: string
          documentation_links?: Json
          id?: string
          integration_complexity?: string | null
          management_options?: Json | null
          manufacturer: string
          operating_systems?: Json | null
          security_features?: Json | null
          tags?: Json
          typical_use_cases?: Json | null
          updated_at?: string | null
        }
        Update: {
          authentication_capabilities?: Json | null
          category?: string
          compliance_requirements?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_considerations?: Json | null
          description?: string | null
          device_name?: string
          documentation_links?: Json
          id?: string
          integration_complexity?: string | null
          management_options?: Json | null
          manufacturer?: string
          operating_systems?: Json | null
          security_features?: Json | null
          tags?: Json
          typical_use_cases?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documentation_sources: {
        Row: {
          content_freshness_score: number | null
          content_hash: string
          created_at: string
          document_type: string | null
          extracted_content: string | null
          id: string
          last_crawled_at: string | null
          last_modified_at: string | null
          processing_status: string
          product: string | null
          quality_score: number | null
          relevance_score: number | null
          source_type: string
          structured_data: Json | null
          tags: string[] | null
          title: string
          updated_at: string
          url: string
          vendor: string | null
          version: string | null
        }
        Insert: {
          content_freshness_score?: number | null
          content_hash: string
          created_at?: string
          document_type?: string | null
          extracted_content?: string | null
          id?: string
          last_crawled_at?: string | null
          last_modified_at?: string | null
          processing_status?: string
          product?: string | null
          quality_score?: number | null
          relevance_score?: number | null
          source_type: string
          structured_data?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string
          url: string
          vendor?: string | null
          version?: string | null
        }
        Update: {
          content_freshness_score?: number | null
          content_hash?: string
          created_at?: string
          document_type?: string | null
          extracted_content?: string | null
          id?: string
          last_crawled_at?: string | null
          last_modified_at?: string | null
          processing_status?: string
          product?: string | null
          quality_score?: number | null
          relevance_score?: number | null
          source_type?: string
          structured_data?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          url?: string
          vendor?: string | null
          version?: string | null
        }
        Relationships: []
      }
      enhanced_resource_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          last_activity: string
          resource_selections: Json
          session_data: Json
          session_type: string
          sharing_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean
          last_activity?: string
          resource_selections?: Json
          session_data?: Json
          session_type: string
          sharing_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          last_activity?: string
          resource_selections?: Json
          session_data?: Json
          session_type?: string
          sharing_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      enhanced_scoping_sessions: {
        Row: {
          ai_analysis: Json | null
          completed_at: string | null
          completion_percentage: number | null
          compliance_mapping: Json | null
          cost_estimates: Json | null
          created_at: string
          id: string
          inventory_data: Json | null
          phase_breakdown: Json | null
          project_id: string | null
          recommended_approach: Json | null
          requirements_analysis: Json | null
          resource_requirements: Json | null
          risk_assessment: Json | null
          scoping_data: Json
          session_name: string
          session_type: string
          stakeholder_mapping: Json | null
          status: string | null
          success_criteria: Json | null
          timeline_estimates: Json | null
          updated_at: string
          user_id: string
          vendor_recommendations: Json | null
        }
        Insert: {
          ai_analysis?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          compliance_mapping?: Json | null
          cost_estimates?: Json | null
          created_at?: string
          id?: string
          inventory_data?: Json | null
          phase_breakdown?: Json | null
          project_id?: string | null
          recommended_approach?: Json | null
          requirements_analysis?: Json | null
          resource_requirements?: Json | null
          risk_assessment?: Json | null
          scoping_data?: Json
          session_name: string
          session_type?: string
          stakeholder_mapping?: Json | null
          status?: string | null
          success_criteria?: Json | null
          timeline_estimates?: Json | null
          updated_at?: string
          user_id: string
          vendor_recommendations?: Json | null
        }
        Update: {
          ai_analysis?: Json | null
          completed_at?: string | null
          completion_percentage?: number | null
          compliance_mapping?: Json | null
          cost_estimates?: Json | null
          created_at?: string
          id?: string
          inventory_data?: Json | null
          phase_breakdown?: Json | null
          project_id?: string | null
          recommended_approach?: Json | null
          requirements_analysis?: Json | null
          resource_requirements?: Json | null
          risk_assessment?: Json | null
          scoping_data?: Json
          session_name?: string
          session_type?: string
          stakeholder_mapping?: Json | null
          status?: string | null
          success_criteria?: Json | null
          timeline_estimates?: Json | null
          updated_at?: string
          user_id?: string
          vendor_recommendations?: Json | null
        }
        Relationships: []
      }
      enterprise_reports: {
        Row: {
          content: Json
          created_at: string
          generated_at: string
          generated_by: string | null
          id: string
          metadata: Json
          project_id: string | null
          report_type: string
          status: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          content?: Json
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          report_type: string
          status?: string
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          content?: Json
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          metadata?: Json
          project_id?: string | null
          report_type?: string
          status?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      external_resource_links: {
        Row: {
          check_frequency_days: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          last_checked_at: string | null
          link_title: string
          link_type: string
          link_url: string
          metadata: Json | null
          relevance_score: number
          resource_id: string
          resource_type: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          check_frequency_days?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          last_checked_at?: string | null
          link_title: string
          link_type: string
          link_url: string
          metadata?: Json | null
          relevance_score?: number
          resource_id: string
          resource_type: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          check_frequency_days?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          last_checked_at?: string | null
          link_title?: string
          link_type?: string
          link_url?: string
          metadata?: Json | null
          relevance_score?: number
          resource_id?: string
          resource_type?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      firecrawler_jobs: {
        Row: {
          completed_at: string | null
          content_size_bytes: number | null
          crawl_type: string
          created_at: string
          error_message: string | null
          id: string
          initiated_by: string | null
          job_id: string
          max_retries: number
          options: Json
          pages_crawled: number | null
          processing_time_ms: number | null
          related_entity_id: string | null
          related_entity_type: string | null
          result: Json | null
          retry_count: number
          status: string
          tags: string[] | null
          url: string
        }
        Insert: {
          completed_at?: string | null
          content_size_bytes?: number | null
          crawl_type?: string
          created_at?: string
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          job_id: string
          max_retries?: number
          options?: Json
          pages_crawled?: number | null
          processing_time_ms?: number | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          result?: Json | null
          retry_count?: number
          status?: string
          tags?: string[] | null
          url: string
        }
        Update: {
          completed_at?: string | null
          content_size_bytes?: number | null
          crawl_type?: string
          created_at?: string
          error_message?: string | null
          id?: string
          initiated_by?: string | null
          job_id?: string
          max_retries?: number
          options?: Json
          pages_crawled?: number | null
          processing_time_ms?: number | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          result?: Json | null
          retry_count?: number
          status?: string
          tags?: string[] | null
          url?: string
        }
        Relationships: []
      }
      firewall_requirements: {
        Row: {
          category: string
          component: string
          created_at: string
          created_by: string | null
          description: string
          destination_description: string
          direction: string
          documentation_url: string | null
          id: string
          is_mandatory: boolean
          ports: string[]
          product: string | null
          protocol: string
          service_name: string
          source_description: string
          source_document_id: string | null
          updated_at: string
          vendor: string | null
          version: string | null
        }
        Insert: {
          category?: string
          component: string
          created_at?: string
          created_by?: string | null
          description: string
          destination_description: string
          direction: string
          documentation_url?: string | null
          id?: string
          is_mandatory?: boolean
          ports: string[]
          product?: string | null
          protocol: string
          service_name: string
          source_description: string
          source_document_id?: string | null
          updated_at?: string
          vendor?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          component?: string
          created_at?: string
          created_by?: string | null
          description?: string
          destination_description?: string
          direction?: string
          documentation_url?: string | null
          id?: string
          is_mandatory?: boolean
          ports?: string[]
          product?: string | null
          protocol?: string
          service_name?: string
          source_description?: string
          source_document_id?: string | null
          updated_at?: string
          vendor?: string | null
          version?: string | null
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          access_level: string | null
          analytics_data: Json | null
          content: string
          content_html: string | null
          created_by: string | null
          download_count: number | null
          expiry_date: string | null
          export_formats: Json | null
          file_size_bytes: number | null
          generated_at: string | null
          id: string
          is_favorite: boolean | null
          metadata: Json | null
          project_ids: Json | null
          report_type: string
          site_ids: Json | null
          tags: Json | null
          template_id: string | null
          title: string
          view_count: number | null
        }
        Insert: {
          access_level?: string | null
          analytics_data?: Json | null
          content: string
          content_html?: string | null
          created_by?: string | null
          download_count?: number | null
          expiry_date?: string | null
          export_formats?: Json | null
          file_size_bytes?: number | null
          generated_at?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          project_ids?: Json | null
          report_type: string
          site_ids?: Json | null
          tags?: Json | null
          template_id?: string | null
          title: string
          view_count?: number | null
        }
        Update: {
          access_level?: string | null
          analytics_data?: Json | null
          content?: string
          content_html?: string | null
          created_by?: string | null
          download_count?: number | null
          expiry_date?: string | null
          export_formats?: Json | null
          file_size_bytes?: number | null
          generated_at?: string | null
          id?: string
          is_favorite?: boolean | null
          metadata?: Json | null
          project_ids?: Json | null
          report_type?: string
          site_ids?: Json | null
          tags?: Json | null
          template_id?: string | null
          title?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      infrastructure_inventory: {
        Row: {
          ai_recommendations: Json | null
          capacity_analysis: Json | null
          compliance_status: Json | null
          cost_analysis: Json | null
          created_at: string
          created_by: string | null
          device_catalog: Json
          id: string
          integration_readiness: Json | null
          inventory_type: string
          lifecycle_analysis: Json | null
          migration_requirements: Json | null
          network_topology: Json | null
          optimization_opportunities: Json | null
          performance_metrics: Json | null
          project_id: string | null
          risk_factors: Json | null
          scoping_session_id: string | null
          security_assessment: Json | null
          site_id: string | null
          support_requirements: Json | null
          updated_at: string
          validation_status: string | null
          vendor_analysis: Json | null
        }
        Insert: {
          ai_recommendations?: Json | null
          capacity_analysis?: Json | null
          compliance_status?: Json | null
          cost_analysis?: Json | null
          created_at?: string
          created_by?: string | null
          device_catalog?: Json
          id?: string
          integration_readiness?: Json | null
          inventory_type?: string
          lifecycle_analysis?: Json | null
          migration_requirements?: Json | null
          network_topology?: Json | null
          optimization_opportunities?: Json | null
          performance_metrics?: Json | null
          project_id?: string | null
          risk_factors?: Json | null
          scoping_session_id?: string | null
          security_assessment?: Json | null
          site_id?: string | null
          support_requirements?: Json | null
          updated_at?: string
          validation_status?: string | null
          vendor_analysis?: Json | null
        }
        Update: {
          ai_recommendations?: Json | null
          capacity_analysis?: Json | null
          compliance_status?: Json | null
          cost_analysis?: Json | null
          created_at?: string
          created_by?: string | null
          device_catalog?: Json
          id?: string
          integration_readiness?: Json | null
          inventory_type?: string
          lifecycle_analysis?: Json | null
          migration_requirements?: Json | null
          network_topology?: Json | null
          optimization_opportunities?: Json | null
          performance_metrics?: Json | null
          project_id?: string | null
          risk_factors?: Json | null
          scoping_session_id?: string | null
          security_assessment?: Json | null
          site_id?: string | null
          support_requirements?: Json | null
          updated_at?: string
          validation_status?: string | null
          vendor_analysis?: Json | null
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
          typical_size_range?: string | null
          updated_at?: string | null
          vendor_considerations?: Json | null
        }
        Relationships: []
      }
      pain_points_library: {
        Row: {
          category: string
          complexity_level: string | null
          compliance_frameworks: string[] | null
          created_at: string
          created_by: string | null
          deployment_phases: string[] | null
          description: string | null
          id: string
          industry_relevance: string[] | null
          industry_specific: Json | null
          last_modified_by: string | null
          maturity_level: string | null
          quality_score: number | null
          recommended_solutions: Json | null
          severity: string
          title: string
          updated_at: string
          validation_status: string | null
          version: string | null
        }
        Insert: {
          category?: string
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          deployment_phases?: string[] | null
          description?: string | null
          id?: string
          industry_relevance?: string[] | null
          industry_specific?: Json | null
          last_modified_by?: string | null
          maturity_level?: string | null
          quality_score?: number | null
          recommended_solutions?: Json | null
          severity?: string
          title: string
          updated_at?: string
          validation_status?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          deployment_phases?: string[] | null
          description?: string | null
          id?: string
          industry_relevance?: string[] | null
          industry_specific?: Json | null
          last_modified_by?: string | null
          maturity_level?: string | null
          quality_score?: number | null
          recommended_solutions?: Json | null
          severity?: string
          title?: string
          updated_at?: string
          validation_status?: string | null
          version?: string | null
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
      permission_usage_log: {
        Row: {
          action_performed: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          ip_address: unknown | null
          permission_id: string
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          timestamp: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_performed?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          ip_address?: unknown | null
          permission_id: string
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_performed?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          ip_address?: unknown | null
          permission_id?: string
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_usage_log_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_customer_portal_permission: boolean | null
          is_system_permission: boolean | null
          name: string
          resource: string
          scope: string | null
          updated_at: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_customer_portal_permission?: boolean | null
          is_system_permission?: boolean | null
          name: string
          resource: string
          scope?: string | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_customer_portal_permission?: boolean | null
          is_system_permission?: boolean | null
          name?: string
          resource?: string
          scope?: string | null
          updated_at?: string | null
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
      portnox_credentials: {
        Row: {
          api_token: string
          base_url: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          name: string
          project_id: string | null
          updated_at: string
        }
        Insert: {
          api_token: string
          base_url?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          name: string
          project_id?: string | null
          updated_at?: string
        }
        Update: {
          api_token?: string
          base_url?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          name?: string
          project_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portnox_openapi_cache: {
        Row: {
          base_path: string | null
          base_url: string
          cache_key: string
          created_at: string
          created_by: string | null
          derived_base: string | null
          etag: string | null
          expires_at: string | null
          fetched_at: string
          id: string
          source: string | null
          spec: Json
          updated_at: string
        }
        Insert: {
          base_path?: string | null
          base_url: string
          cache_key: string
          created_at?: string
          created_by?: string | null
          derived_base?: string | null
          etag?: string | null
          expires_at?: string | null
          fetched_at?: string
          id?: string
          source?: string | null
          spec: Json
          updated_at?: string
        }
        Update: {
          base_path?: string | null
          base_url?: string
          cache_key?: string
          created_at?: string
          created_by?: string | null
          derived_base?: string | null
          etag?: string | null
          expires_at?: string | null
          fetched_at?: string
          id?: string
          source?: string | null
          spec?: Json
          updated_at?: string
        }
        Relationships: []
      }
      portnox_site_configurations: {
        Row: {
          configuration_data: Json | null
          created_at: string
          created_by: string
          deployment_status: string | null
          id: string
          last_sync: string | null
          portnox_site_id: string | null
          site_id: string
          sync_errors: Json | null
          updated_at: string
        }
        Insert: {
          configuration_data?: Json | null
          created_at?: string
          created_by: string
          deployment_status?: string | null
          id?: string
          last_sync?: string | null
          portnox_site_id?: string | null
          site_id: string
          sync_errors?: Json | null
          updated_at?: string
        }
        Update: {
          configuration_data?: Json | null
          created_at?: string
          created_by?: string
          deployment_status?: string | null
          id?: string
          last_sync?: string | null
          portnox_site_id?: string | null
          site_id?: string
          sync_errors?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portnox_site_configurations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portnox_site_configurations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      prerequisites: {
        Row: {
          alternatives: string[] | null
          category: string
          created_at: string
          created_by: string | null
          description: string
          documentation_url: string | null
          enterprise_specification: string | null
          id: string
          is_mandatory: boolean
          minimum_specification: string | null
          product: string | null
          recommended_specification: string | null
          requirement: string
          source_document_id: string | null
          updated_at: string
          vendor: string | null
          verification_steps: string[] | null
          version: string | null
        }
        Insert: {
          alternatives?: string[] | null
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          documentation_url?: string | null
          enterprise_specification?: string | null
          id?: string
          is_mandatory?: boolean
          minimum_specification?: string | null
          product?: string | null
          recommended_specification?: string | null
          requirement: string
          source_document_id?: string | null
          updated_at?: string
          vendor?: string | null
          verification_steps?: string[] | null
          version?: string | null
        }
        Update: {
          alternatives?: string[] | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          documentation_url?: string | null
          enterprise_specification?: string | null
          id?: string
          is_mandatory?: boolean
          minimum_specification?: string | null
          product?: string | null
          recommended_specification?: string | null
          requirement?: string
          source_document_id?: string | null
          updated_at?: string
          vendor?: string | null
          verification_steps?: string[] | null
          version?: string | null
        }
        Relationships: []
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
      project_files: {
        Row: {
          access_level: string | null
          ai_analysis_status: string | null
          ai_extracted_content: Json | null
          ai_summary: string | null
          ai_tags: Json | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          is_deleted: boolean | null
          metadata: Json | null
          mime_type: string | null
          project_id: string
          storage_path: string
          upload_date: string
          uploaded_by: string
          version_number: number | null
        }
        Insert: {
          access_level?: string | null
          ai_analysis_status?: string | null
          ai_extracted_content?: Json | null
          ai_summary?: string | null
          ai_tags?: Json | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          project_id: string
          storage_path: string
          upload_date?: string
          uploaded_by: string
          version_number?: number | null
        }
        Update: {
          access_level?: string | null
          ai_analysis_status?: string | null
          ai_extracted_content?: Json | null
          ai_summary?: string | null
          ai_tags?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          project_id?: string
          storage_path?: string
          upload_date?: string
          uploaded_by?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      project_knowledge_base: {
        Row: {
          ai_analysis_results: Json | null
          category: string
          content: string | null
          content_type: string
          created_at: string | null
          created_by: string | null
          external_links: Json | null
          file_attachments: Json | null
          id: string
          is_ai_enhanced: boolean | null
          last_ai_analysis: string | null
          metadata: Json | null
          priority_level: string | null
          project_id: string
          site_id: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_analysis_results?: Json | null
          category?: string
          content?: string | null
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          external_links?: Json | null
          file_attachments?: Json | null
          id?: string
          is_ai_enhanced?: boolean | null
          last_ai_analysis?: string | null
          metadata?: Json | null
          priority_level?: string | null
          project_id: string
          site_id?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_analysis_results?: Json | null
          category?: string
          content?: string | null
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          external_links?: Json | null
          file_attachments?: Json | null
          id?: string
          is_ai_enhanced?: boolean | null
          last_ai_analysis?: string | null
          metadata?: Json | null
          priority_level?: string | null
          project_id?: string
          site_id?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_knowledge_base_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_knowledge_base_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
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
      project_permissions: {
        Row: {
          conditions: Json | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          project_id: string
          user_id: string
        }
        Insert: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          project_id: string
          user_id: string
        }
        Update: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phase_tracking: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          blockers: Json | null
          created_at: string | null
          deliverables: Json | null
          id: string
          phase_name: string
          phase_order: number
          planned_end: string | null
          planned_start: string | null
          progress_percentage: number | null
          project_id: string
          resources_assigned: Json | null
          status: string | null
          tasks: Json | null
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          blockers?: Json | null
          created_at?: string | null
          deliverables?: Json | null
          id?: string
          phase_name: string
          phase_order: number
          planned_end?: string | null
          planned_start?: string | null
          progress_percentage?: number | null
          project_id: string
          resources_assigned?: Json | null
          status?: string | null
          tasks?: Json | null
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          blockers?: Json | null
          created_at?: string | null
          deliverables?: Json | null
          id?: string
          phase_name?: string
          phase_order?: number
          planned_end?: string | null
          planned_start?: string | null
          progress_percentage?: number | null
          project_id?: string
          resources_assigned?: Json | null
          status?: string | null
          tasks?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_phase_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "unified_projects"
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
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
      project_resources: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          implementation_notes: string | null
          implementation_status: string | null
          metadata: Json | null
          priority: string | null
          project_id: string
          resource_id: string
          resource_type: string
          target_date: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          implementation_notes?: string | null
          implementation_status?: string | null
          metadata?: Json | null
          priority?: string | null
          project_id: string
          resource_id: string
          resource_type: string
          target_date?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          implementation_notes?: string | null
          implementation_status?: string | null
          metadata?: Json | null
          priority?: string | null
          project_id?: string
          resource_id?: string
          resource_type?: string
          target_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "unified_projects"
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
      project_template_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assignment_role: string
          custom_variables: Json | null
          id: string
          implementation_notes: string | null
          implementation_status: string | null
          implemented_at: string | null
          is_active: boolean | null
          project_id: string
          template_id: string
          template_type: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_role: string
          custom_variables?: Json | null
          id?: string
          implementation_notes?: string | null
          implementation_status?: string | null
          implemented_at?: string | null
          is_active?: boolean | null
          project_id: string
          template_id: string
          template_type: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_role?: string
          custom_variables?: Json | null
          id?: string
          implementation_notes?: string | null
          implementation_status?: string | null
          implemented_at?: string | null
          is_active?: boolean | null
          project_id?: string
          template_id?: string
          template_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_template_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_template_assignments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
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
          ai_recommendations: string | null
          budget: number | null
          bulk_sites_data: Json | null
          business_domain: string | null
          business_summary: string | null
          business_website: string | null
          client_name: string | null
          compliance_frameworks: string[] | null
          country_code: string | null
          created_at: string
          created_by: string | null
          current_phase: string | null
          customer_access_expires_at: string | null
          customer_organization: string | null
          customer_portal_enabled: boolean | null
          customer_portal_id: string | null
          deployment_type: string | null
          description: string | null
          enable_auto_vendors: boolean | null
          enable_bulk_sites: boolean | null
          enable_bulk_users: boolean | null
          id: string
          industry: string | null
          initiative_type: string | null
          integration_requirements: Json | null
          linkedin_url: string | null
          migration_scope: Json | null
          name: string
          overall_goal: string | null
          pain_points: Json | null
          poc_status: string | null
          portnox_owner: string | null
          primary_country: string | null
          primary_region: string | null
          progress_percentage: number | null
          project_manager: string | null
          project_owner: string | null
          project_owners: Json
          project_type: string | null
          region_name: string | null
          security_level: string | null
          start_date: string | null
          status: string | null
          success_criteria: Json | null
          target_completion: string | null
          technical_owner: string | null
          technical_owners: Json
          template_id: string | null
          timezone: string | null
          total_endpoints: number | null
          total_sites: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          actual_completion?: string | null
          additional_stakeholders?: Json | null
          ai_recommendations?: string | null
          budget?: number | null
          bulk_sites_data?: Json | null
          business_domain?: string | null
          business_summary?: string | null
          business_website?: string | null
          client_name?: string | null
          compliance_frameworks?: string[] | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          customer_access_expires_at?: string | null
          customer_organization?: string | null
          customer_portal_enabled?: boolean | null
          customer_portal_id?: string | null
          deployment_type?: string | null
          description?: string | null
          enable_auto_vendors?: boolean | null
          enable_bulk_sites?: boolean | null
          enable_bulk_users?: boolean | null
          id?: string
          industry?: string | null
          initiative_type?: string | null
          integration_requirements?: Json | null
          linkedin_url?: string | null
          migration_scope?: Json | null
          name: string
          overall_goal?: string | null
          pain_points?: Json | null
          poc_status?: string | null
          portnox_owner?: string | null
          primary_country?: string | null
          primary_region?: string | null
          progress_percentage?: number | null
          project_manager?: string | null
          project_owner?: string | null
          project_owners?: Json
          project_type?: string | null
          region_name?: string | null
          security_level?: string | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          technical_owner?: string | null
          technical_owners?: Json
          template_id?: string | null
          timezone?: string | null
          total_endpoints?: number | null
          total_sites?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          actual_completion?: string | null
          additional_stakeholders?: Json | null
          ai_recommendations?: string | null
          budget?: number | null
          bulk_sites_data?: Json | null
          business_domain?: string | null
          business_summary?: string | null
          business_website?: string | null
          client_name?: string | null
          compliance_frameworks?: string[] | null
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          customer_access_expires_at?: string | null
          customer_organization?: string | null
          customer_portal_enabled?: boolean | null
          customer_portal_id?: string | null
          deployment_type?: string | null
          description?: string | null
          enable_auto_vendors?: boolean | null
          enable_bulk_sites?: boolean | null
          enable_bulk_users?: boolean | null
          id?: string
          industry?: string | null
          initiative_type?: string | null
          integration_requirements?: Json | null
          linkedin_url?: string | null
          migration_scope?: Json | null
          name?: string
          overall_goal?: string | null
          pain_points?: Json | null
          poc_status?: string | null
          portnox_owner?: string | null
          primary_country?: string | null
          primary_region?: string | null
          progress_percentage?: number | null
          project_manager?: string | null
          project_owner?: string | null
          project_owners?: Json
          project_type?: string | null
          region_name?: string | null
          security_level?: string | null
          start_date?: string | null
          status?: string | null
          success_criteria?: Json | null
          target_completion?: string | null
          technical_owner?: string | null
          technical_owners?: Json
          template_id?: string | null
          timezone?: string | null
          total_endpoints?: number | null
          total_sites?: number | null
          updated_at?: string
          website_url?: string | null
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
      questionnaire_responses: {
        Row: {
          approved_at: string | null
          completion_percentage: number | null
          completion_status: string | null
          complexity_score: number | null
          created_at: string | null
          created_by: string | null
          estimated_timeline: string | null
          id: string
          project_id: string | null
          questionnaire_id: string | null
          recommendations: Json | null
          response_metadata: Json | null
          responses: Json
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          risk_assessment: Json | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          completion_percentage?: number | null
          completion_status?: string | null
          complexity_score?: number | null
          created_at?: string | null
          created_by?: string | null
          estimated_timeline?: string | null
          id?: string
          project_id?: string | null
          questionnaire_id?: string | null
          recommendations?: Json | null
          response_metadata?: Json | null
          responses?: Json
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          risk_assessment?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          completion_percentage?: number | null
          completion_status?: string | null
          complexity_score?: number | null
          created_at?: string | null
          created_by?: string | null
          estimated_timeline?: string | null
          id?: string
          project_id?: string | null
          questionnaire_id?: string | null
          recommendations?: Json | null
          response_metadata?: Json | null
          responses?: Json
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          risk_assessment?: Json | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_responses_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          completion_requirements: Json | null
          conditional_logic: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          questionnaire_type: string | null
          questions: Json
          scoring_criteria: Json | null
          sections: Json | null
          tags: Json | null
          title: string
          updated_at: string | null
          validation_rules: Json | null
          version: string | null
        }
        Insert: {
          completion_requirements?: Json | null
          conditional_logic?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          questionnaire_type?: string | null
          questions?: Json
          scoring_criteria?: Json | null
          sections?: Json | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          validation_rules?: Json | null
          version?: string | null
        }
        Update: {
          completion_requirements?: Json | null
          conditional_logic?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          questionnaire_type?: string | null
          questions?: Json
          scoring_criteria?: Json | null
          sections?: Json | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          validation_rules?: Json | null
          version?: string | null
        }
        Relationships: []
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
      report_generation_history: {
        Row: {
          ai_model_used: string | null
          cost_cents: number | null
          created_at: string | null
          error_message: string | null
          generation_trigger: string | null
          id: string
          input_parameters: Json | null
          processing_time_ms: number | null
          report_id: string | null
          success: boolean | null
          template_id: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          ai_model_used?: string | null
          cost_cents?: number | null
          created_at?: string | null
          error_message?: string | null
          generation_trigger?: string | null
          id?: string
          input_parameters?: Json | null
          processing_time_ms?: number | null
          report_id?: string | null
          success?: boolean | null
          template_id?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          ai_model_used?: string | null
          cost_cents?: number | null
          created_at?: string | null
          error_message?: string | null
          generation_trigger?: string | null
          id?: string
          input_parameters?: Json | null
          processing_time_ms?: number | null
          report_id?: string | null
          success?: boolean | null
          template_id?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_generation_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "generated_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      report_generation_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          generated_report_id: string | null
          id: string
          max_retries: number
          priority: number
          processing_time_ms: number | null
          project_id: string | null
          report_type: string
          request_data: Json
          requested_by: string | null
          retry_count: number
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          generated_report_id?: string | null
          id?: string
          max_retries?: number
          priority?: number
          processing_time_ms?: number | null
          project_id?: string | null
          report_type: string
          request_data?: Json
          requested_by?: string | null
          retry_count?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          generated_report_id?: string | null
          id?: string
          max_retries?: number
          priority?: number
          processing_time_ms?: number | null
          project_id?: string | null
          report_type?: string
          request_data?: Json
          requested_by?: string | null
          retry_count?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_generation_queue_generated_report_id_fkey"
            columns: ["generated_report_id"]
            isOneToOne: false
            referencedRelation: "enterprise_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_generation_queue_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          ai_prompt_template: string | null
          category: string | null
          complexity_level: string | null
          content_template: string
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_time_minutes: number | null
          formatting_rules: Json | null
          id: string
          industry: string | null
          is_active: boolean | null
          is_default: boolean
          is_public: boolean | null
          name: string
          rating: number | null
          tags: Json | null
          template_type: string
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          ai_prompt_template?: string | null
          category?: string | null
          complexity_level?: string | null
          content_template: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time_minutes?: number | null
          formatting_rules?: Json | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_default?: boolean
          is_public?: boolean | null
          name: string
          rating?: number | null
          tags?: Json | null
          template_type: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          ai_prompt_template?: string | null
          category?: string | null
          complexity_level?: string | null
          content_template?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_time_minutes?: number | null
          formatting_rules?: Json | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_default?: boolean
          is_public?: boolean | null
          name?: string
          rating?: number | null
          tags?: Json | null
          template_type?: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      requirements: {
        Row: {
          acceptance_criteria: Json | null
          category: string
          complexity: string | null
          compliance_frameworks: Json | null
          conflicts_with: string[] | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          depends_on: string[] | null
          description: string
          estimated_effort_hours: number | null
          id: string
          impact: string | null
          implementation_approach: string | null
          is_active: boolean | null
          prerequisites: Json | null
          priority: string | null
          rationale: string | null
          regulatory_requirement: boolean | null
          requirement_type: string | null
          source_document: string | null
          stakeholder_type: string | null
          tags: Json | null
          test_scenarios: Json | null
          testable: boolean | null
          title: string
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          acceptance_criteria?: Json | null
          category: string
          complexity?: string | null
          compliance_frameworks?: Json | null
          conflicts_with?: string[] | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          depends_on?: string[] | null
          description: string
          estimated_effort_hours?: number | null
          id?: string
          impact?: string | null
          implementation_approach?: string | null
          is_active?: boolean | null
          prerequisites?: Json | null
          priority?: string | null
          rationale?: string | null
          regulatory_requirement?: boolean | null
          requirement_type?: string | null
          source_document?: string | null
          stakeholder_type?: string | null
          tags?: Json | null
          test_scenarios?: Json | null
          testable?: boolean | null
          title: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          acceptance_criteria?: Json | null
          category?: string
          complexity?: string | null
          compliance_frameworks?: Json | null
          conflicts_with?: string[] | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          depends_on?: string[] | null
          description?: string
          estimated_effort_hours?: number | null
          id?: string
          impact?: string | null
          implementation_approach?: string | null
          is_active?: boolean | null
          prerequisites?: Json | null
          priority?: string | null
          rationale?: string | null
          regulatory_requirement?: boolean | null
          requirement_type?: string | null
          source_document?: string | null
          stakeholder_type?: string | null
          tags?: Json | null
          test_scenarios?: Json | null
          testable?: boolean | null
          title?: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      requirements_library: {
        Row: {
          acceptance_criteria: Json | null
          associated_projects: Json | null
          associated_sites: Json | null
          assumptions: Json | null
          category: string
          complexity_level: string | null
          compliance_frameworks: string[] | null
          constraints: Json | null
          created_at: string
          created_by: string | null
          custom_categories: Json | null
          dependencies: Json | null
          deployment_phases: string[] | null
          description: string | null
          documentation_references: Json | null
          id: string
          industry_relevance: string[] | null
          last_modified_by: string | null
          maturity_level: string | null
          portnox_features: Json | null
          priority: string
          quality_score: number | null
          rationale: string | null
          related_use_cases: Json | null
          requirement_type: string
          status: string | null
          subcategory: string | null
          tags: string[] | null
          test_cases: Json | null
          title: string
          updated_at: string
          validation_status: string | null
          vendor_requirements: Json | null
          verification_methods: Json | null
          version: string | null
        }
        Insert: {
          acceptance_criteria?: Json | null
          associated_projects?: Json | null
          associated_sites?: Json | null
          assumptions?: Json | null
          category: string
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          dependencies?: Json | null
          deployment_phases?: string[] | null
          description?: string | null
          documentation_references?: Json | null
          id?: string
          industry_relevance?: string[] | null
          last_modified_by?: string | null
          maturity_level?: string | null
          portnox_features?: Json | null
          priority: string
          quality_score?: number | null
          rationale?: string | null
          related_use_cases?: Json | null
          requirement_type: string
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          title: string
          updated_at?: string
          validation_status?: string | null
          vendor_requirements?: Json | null
          verification_methods?: Json | null
          version?: string | null
        }
        Update: {
          acceptance_criteria?: Json | null
          associated_projects?: Json | null
          associated_sites?: Json | null
          assumptions?: Json | null
          category?: string
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          dependencies?: Json | null
          deployment_phases?: string[] | null
          description?: string | null
          documentation_references?: Json | null
          id?: string
          industry_relevance?: string[] | null
          last_modified_by?: string | null
          maturity_level?: string | null
          portnox_features?: Json | null
          priority?: string
          quality_score?: number | null
          rationale?: string | null
          related_use_cases?: Json | null
          requirement_type?: string
          status?: string | null
          subcategory?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          title?: string
          updated_at?: string
          validation_status?: string | null
          vendor_requirements?: Json | null
          verification_methods?: Json | null
          version?: string | null
        }
        Relationships: []
      }
      resource_categories: {
        Row: {
          color_code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          parent_category_id: string | null
          resource_type: string
          updated_at: string | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
          resource_type: string
          updated_at?: string | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
          resource_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "resource_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_enrichment_log: {
        Row: {
          ai_generated_content: Json
          created_at: string
          created_by: string | null
          enrichment_data: Json
          enrichment_status: string
          enrichment_type: string
          error_message: string | null
          external_links: Json
          id: string
          portnox_links: Json
          processing_time_ms: number | null
          resource_id: string
          resource_type: string
        }
        Insert: {
          ai_generated_content?: Json
          created_at?: string
          created_by?: string | null
          enrichment_data?: Json
          enrichment_status?: string
          enrichment_type: string
          error_message?: string | null
          external_links?: Json
          id?: string
          portnox_links?: Json
          processing_time_ms?: number | null
          resource_id: string
          resource_type: string
        }
        Update: {
          ai_generated_content?: Json
          created_at?: string
          created_by?: string | null
          enrichment_data?: Json
          enrichment_status?: string
          enrichment_type?: string
          error_message?: string | null
          external_links?: Json
          id?: string
          portnox_links?: Json
          processing_time_ms?: number | null
          resource_id?: string
          resource_type?: string
        }
        Relationships: []
      }
      resource_labels: {
        Row: {
          applies_to: string[]
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_system_label: boolean
          name: string
          type: string
          value: string
        }
        Insert: {
          applies_to?: string[]
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system_label?: boolean
          name: string
          type: string
          value: string
        }
        Update: {
          applies_to?: string[]
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_system_label?: boolean
          name?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      resource_labels_mapping: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          label_id: string
          resource_id: string
          resource_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          label_id: string
          resource_id: string
          resource_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          label_id?: string
          resource_id?: string
          resource_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_labels_mapping_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "resource_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_relationships: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_bidirectional: boolean
          relationship_type: string
          source_resource_id: string
          source_resource_type: string
          strength: number
          target_resource_id: string
          target_resource_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_bidirectional?: boolean
          relationship_type: string
          source_resource_id: string
          source_resource_type: string
          strength?: number
          target_resource_id: string
          target_resource_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_bidirectional?: boolean
          relationship_type?: string
          source_resource_id?: string
          source_resource_type?: string
          strength?: number
          target_resource_id?: string
          target_resource_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_sharing_settings: {
        Row: {
          created_at: string
          created_by: string
          id: string
          permissions: Json
          resource_id: string
          resource_type: string
          shared_with: Json
          sharing_level: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          permissions?: Json
          resource_id: string
          resource_type: string
          shared_with?: Json
          sharing_level?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          permissions?: Json
          resource_id?: string
          resource_type?: string
          shared_with?: Json
          sharing_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_tags: {
        Row: {
          category: string | null
          color: string
          color_code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_system_tag: boolean
          name: string
          updated_at: string | null
          usage_count: number
        }
        Insert: {
          category?: string | null
          color?: string
          color_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_tag?: boolean
          name: string
          updated_at?: string | null
          usage_count?: number
        }
        Update: {
          category?: string | null
          color?: string
          color_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_tag?: boolean
          name?: string
          updated_at?: string | null
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "resource_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_tags_mapping: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          resource_id: string
          resource_type: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          resource_id: string
          resource_type: string
          tag_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          resource_id?: string
          resource_type?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_tags_mapping_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "resource_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_usage_statistics: {
        Row: {
          average_implementation_time_hours: number | null
          complexity_rating: number | null
          created_at: string
          failure_count: number
          id: string
          last_used: string | null
          project_usage_count: number
          resource_id: string
          resource_type: string
          satisfaction_rating: number | null
          selection_count: number
          success_count: number
          success_rate: number | null
          updated_at: string
        }
        Insert: {
          average_implementation_time_hours?: number | null
          complexity_rating?: number | null
          created_at?: string
          failure_count?: number
          id?: string
          last_used?: string | null
          project_usage_count?: number
          resource_id: string
          resource_type: string
          satisfaction_rating?: number | null
          selection_count?: number
          success_count?: number
          success_rate?: number | null
          updated_at?: string
        }
        Update: {
          average_implementation_time_hours?: number | null
          complexity_rating?: number | null
          created_at?: string
          failure_count?: number
          id?: string
          last_used?: string | null
          project_usage_count?: number
          resource_id?: string
          resource_type?: string
          satisfaction_rating?: number | null
          selection_count?: number
          success_count?: number
          success_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      role_audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          performed_at: string | null
          performed_by: string | null
          role_id: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by?: string | null
          role_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string | null
          performed_by?: string | null
          role_id?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_audit_log_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_hierarchy: {
        Row: {
          child_role_id: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          inheritance_type: string | null
          parent_role_id: string
        }
        Insert: {
          child_role_id: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          inheritance_type?: string | null
          parent_role_id: string
        }
        Update: {
          child_role_id?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          inheritance_type?: string | null
          parent_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_hierarchy_child_role_id_fkey"
            columns: ["child_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_hierarchy_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_customer_portal_role: boolean | null
          is_system_role: boolean | null
          name: string
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_customer_portal_role?: boolean | null
          is_system_role?: boolean | null
          name: string
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_customer_portal_role?: boolean | null
          is_system_role?: boolean | null
          name?: string
          priority?: number | null
          updated_at?: string | null
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
      scoping_session_items: {
        Row: {
          attributes: Json
          category_key: string
          created_at: string
          custom_name: string | null
          id: string
          item_id: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          attributes?: Json
          category_key: string
          created_at?: string
          custom_name?: string | null
          id?: string
          item_id?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          attributes?: Json
          category_key?: string
          created_at?: string
          custom_name?: string | null
          id?: string
          item_id?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scoping_session_items_category_key_fkey"
            columns: ["category_key"]
            isOneToOne: false
            referencedRelation: "catalog_categories"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "scoping_session_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scoping_session_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "scoping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      scoping_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          data: Json
          id: string
          name: string
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          data?: Json
          id?: string
          name: string
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          data?: Json
          id?: string
          name?: string
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      security_compliance_assessments: {
        Row: {
          assessed_by: string
          assessment_data: Json
          compliance_score: number | null
          created_at: string
          findings: Json | null
          framework_type: string
          id: string
          project_id: string | null
          recommendations: Json | null
          reviewed_by: string | null
          site_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assessed_by: string
          assessment_data?: Json
          compliance_score?: number | null
          created_at?: string
          findings?: Json | null
          framework_type: string
          id?: string
          project_id?: string | null
          recommendations?: Json | null
          reviewed_by?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assessed_by?: string
          assessment_data?: Json
          compliance_score?: number | null
          created_at?: string
          findings?: Json | null
          framework_type?: string
          id?: string
          project_id?: string | null
          recommendations?: Json | null
          reviewed_by?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_compliance_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_compliance_assessments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_compliance_assessments_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_compliance_assessments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
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
      site_files: {
        Row: {
          access_level: string | null
          ai_analysis_status: string | null
          ai_extracted_content: Json | null
          ai_summary: string | null
          ai_tags: Json | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          is_deleted: boolean | null
          metadata: Json | null
          mime_type: string | null
          site_id: string
          storage_path: string
          upload_date: string
          uploaded_by: string
          version_number: number | null
        }
        Insert: {
          access_level?: string | null
          ai_analysis_status?: string | null
          ai_extracted_content?: Json | null
          ai_summary?: string | null
          ai_tags?: Json | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          site_id: string
          storage_path: string
          upload_date?: string
          uploaded_by: string
          version_number?: number | null
        }
        Update: {
          access_level?: string | null
          ai_analysis_status?: string | null
          ai_extracted_content?: Json | null
          ai_summary?: string | null
          ai_tags?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          site_id?: string
          storage_path?: string
          upload_date?: string
          uploaded_by?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_files_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_permissions: {
        Row: {
          conditions: Json | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          site_id: string
          user_id: string
        }
        Insert: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          site_id: string
          user_id: string
        }
        Update: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          site_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
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
      site_template_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assignment_type: string
          configuration_role: string
          custom_variables: Json | null
          deployed_at: string | null
          deployment_notes: string | null
          deployment_status: string | null
          id: string
          is_active: boolean | null
          site_id: string
          template_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_type?: string
          configuration_role: string
          custom_variables?: Json | null
          deployed_at?: string | null
          deployment_notes?: string | null
          deployment_status?: string | null
          id?: string
          is_active?: boolean | null
          site_id: string
          template_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_type?: string
          configuration_role?: string
          custom_variables?: Json | null
          deployed_at?: string | null
          deployment_notes?: string | null
          deployment_status?: string | null
          id?: string
          is_active?: boolean | null
          site_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_template_assignments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_template_assignments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
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
      smart_template_usage: {
        Row: {
          compliance_validation: Json | null
          configuration_complexity: string | null
          created_at: string
          customizations_applied: Json | null
          deployment_results: Json | null
          deployment_time_minutes: number | null
          feedback_notes: string | null
          id: string
          issues_encountered: Json | null
          performance_metrics: Json | null
          project_id: string | null
          resolution_notes: string | null
          site_id: string | null
          success_indicators: Json | null
          template_id: string
          updated_at: string
          usage_context: Json
          user_id: string
          user_rating: number | null
          vendor_compatibility_score: number | null
        }
        Insert: {
          compliance_validation?: Json | null
          configuration_complexity?: string | null
          created_at?: string
          customizations_applied?: Json | null
          deployment_results?: Json | null
          deployment_time_minutes?: number | null
          feedback_notes?: string | null
          id?: string
          issues_encountered?: Json | null
          performance_metrics?: Json | null
          project_id?: string | null
          resolution_notes?: string | null
          site_id?: string | null
          success_indicators?: Json | null
          template_id: string
          updated_at?: string
          usage_context?: Json
          user_id: string
          user_rating?: number | null
          vendor_compatibility_score?: number | null
        }
        Update: {
          compliance_validation?: Json | null
          configuration_complexity?: string | null
          created_at?: string
          customizations_applied?: Json | null
          deployment_results?: Json | null
          deployment_time_minutes?: number | null
          feedback_notes?: string | null
          id?: string
          issues_encountered?: Json | null
          performance_metrics?: Json | null
          project_id?: string | null
          resolution_notes?: string | null
          site_id?: string | null
          success_indicators?: Json | null
          template_id?: string
          updated_at?: string
          usage_context?: Json
          user_id?: string
          user_rating?: number | null
          vendor_compatibility_score?: number | null
        }
        Relationships: []
      }
      social_providers: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          last_sync: string | null
          linked_at: string | null
          provider: string
          provider_data: Json | null
          provider_email: string | null
          provider_user_id: string
          provider_username: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          last_sync?: string | null
          linked_at?: string | null
          provider: string
          provider_data?: Json | null
          provider_email?: string | null
          provider_user_id: string
          provider_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          last_sync?: string | null
          linked_at?: string | null
          provider?: string
          provider_data?: Json | null
          provider_email?: string | null
          provider_user_id?: string
          provider_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
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
      template_customizations: {
        Row: {
          base_template_id: string
          created_at: string | null
          created_by: string | null
          custom_content: string
          custom_variables: Json | null
          customization_name: string
          customization_type: string
          id: string
          is_active: boolean | null
          modification_notes: string | null
          project_id: string | null
          site_id: string | null
          tags: Json | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          base_template_id: string
          created_at?: string | null
          created_by?: string | null
          custom_content: string
          custom_variables?: Json | null
          customization_name: string
          customization_type?: string
          id?: string
          is_active?: boolean | null
          modification_notes?: string | null
          project_id?: string | null
          site_id?: string | null
          tags?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          base_template_id?: string
          created_at?: string | null
          created_by?: string | null
          custom_content?: string
          custom_variables?: Json | null
          customization_name?: string
          customization_type?: string
          id?: string
          is_active?: boolean | null
          modification_notes?: string | null
          project_id?: string | null
          site_id?: string | null
          tags?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_customizations_base_template_id_fkey"
            columns: ["base_template_id"]
            isOneToOne: false
            referencedRelation: "configuration_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_customizations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_customizations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      template_performance_analytics: {
        Row: {
          complexity_analysis: Json | null
          compliance_coverage: Json | null
          created_at: string
          deployment_time_avg: number | null
          error_patterns: Json | null
          id: string
          last_analyzed: string | null
          optimization_suggestions: Json | null
          performance_metrics: Json
          security_score: number | null
          success_rate: number | null
          template_id: string
          updated_at: string
          usage_statistics: Json
          vendor_compatibility: Json | null
        }
        Insert: {
          complexity_analysis?: Json | null
          compliance_coverage?: Json | null
          created_at?: string
          deployment_time_avg?: number | null
          error_patterns?: Json | null
          id?: string
          last_analyzed?: string | null
          optimization_suggestions?: Json | null
          performance_metrics?: Json
          security_score?: number | null
          success_rate?: number | null
          template_id: string
          updated_at?: string
          usage_statistics?: Json
          vendor_compatibility?: Json | null
        }
        Update: {
          complexity_analysis?: Json | null
          compliance_coverage?: Json | null
          created_at?: string
          deployment_time_avg?: number | null
          error_patterns?: Json | null
          id?: string
          last_analyzed?: string | null
          optimization_suggestions?: Json | null
          performance_metrics?: Json
          security_score?: number | null
          success_rate?: number | null
          template_id?: string
          updated_at?: string
          usage_statistics?: Json
          vendor_compatibility?: Json | null
        }
        Relationships: []
      }
      template_recommendations: {
        Row: {
          applied_filters: Json
          confidence_score: number | null
          context_data: Json
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          project_id: string | null
          recommendation_metadata: Json | null
          recommendation_reason: string | null
          recommendation_scores: Json
          recommendation_type: string
          recommended_templates: Json
          site_id: string | null
          updated_at: string
          user_feedback: Json | null
          user_id: string
        }
        Insert: {
          applied_filters?: Json
          confidence_score?: number | null
          context_data?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          recommendation_metadata?: Json | null
          recommendation_reason?: string | null
          recommendation_scores?: Json
          recommendation_type?: string
          recommended_templates?: Json
          site_id?: string | null
          updated_at?: string
          user_feedback?: Json | null
          user_id: string
        }
        Update: {
          applied_filters?: Json
          confidence_score?: number | null
          context_data?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          project_id?: string | null
          recommendation_metadata?: Json | null
          recommendation_reason?: string | null
          recommendation_scores?: Json
          recommendation_type?: string
          recommended_templates?: Json
          site_id?: string | null
          updated_at?: string
          user_feedback?: Json | null
          user_id?: string
        }
        Relationships: []
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
      test_cases: {
        Row: {
          actual_outcome: string | null
          automation_level: string | null
          category: string
          complexity: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          environment_requirements: Json | null
          execution_history: Json | null
          execution_time_minutes: number | null
          expected_outcome: string
          id: string
          is_active: boolean | null
          last_execution_date: string | null
          last_execution_status: string | null
          name: string
          pass_rate_percentage: number | null
          preconditions: Json | null
          priority: string | null
          requirements_covered: string[] | null
          risk_areas_covered: string[] | null
          tags: Json | null
          test_data: Json | null
          test_steps: Json | null
          test_type: string | null
          updated_at: string | null
          use_cases_covered: string[] | null
        }
        Insert: {
          actual_outcome?: string | null
          automation_level?: string | null
          category: string
          complexity?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          environment_requirements?: Json | null
          execution_history?: Json | null
          execution_time_minutes?: number | null
          expected_outcome: string
          id?: string
          is_active?: boolean | null
          last_execution_date?: string | null
          last_execution_status?: string | null
          name: string
          pass_rate_percentage?: number | null
          preconditions?: Json | null
          priority?: string | null
          requirements_covered?: string[] | null
          risk_areas_covered?: string[] | null
          tags?: Json | null
          test_data?: Json | null
          test_steps?: Json | null
          test_type?: string | null
          updated_at?: string | null
          use_cases_covered?: string[] | null
        }
        Update: {
          actual_outcome?: string | null
          automation_level?: string | null
          category?: string
          complexity?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          environment_requirements?: Json | null
          execution_history?: Json | null
          execution_time_minutes?: number | null
          expected_outcome?: string
          id?: string
          is_active?: boolean | null
          last_execution_date?: string | null
          last_execution_status?: string | null
          name?: string
          pass_rate_percentage?: number | null
          preconditions?: Json | null
          priority?: string | null
          requirements_covered?: string[] | null
          risk_areas_covered?: string[] | null
          tags?: Json | null
          test_data?: Json | null
          test_steps?: Json | null
          test_type?: string | null
          updated_at?: string | null
          use_cases_covered?: string[] | null
        }
        Relationships: []
      }
      tracking_sessions: {
        Row: {
          context_data: Json
          created_at: string
          created_by: string | null
          id: string
          implementation_type: string
          project_id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          context_data?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          implementation_type: string
          project_id: string
          session_id: string
          updated_at?: string
        }
        Update: {
          context_data?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          implementation_type?: string
          project_id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      unified_projects: {
        Row: {
          ai_recommendations: Json | null
          assigned_team: Json | null
          authentication_requirements: Json | null
          budget: string | null
          compliance_frameworks: Json | null
          created_at: string | null
          created_by: string | null
          deployment_type: string | null
          description: string | null
          existing_vendors: Json | null
          id: string
          implementation_checklist: Json | null
          industry: string | null
          name: string
          next_milestone: string | null
          organization_size: number | null
          pain_points: Json | null
          progress_percentage: number | null
          risk_level: string | null
          security_level: string | null
          status: string | null
          timeline: string | null
          updated_at: string | null
        }
        Insert: {
          ai_recommendations?: Json | null
          assigned_team?: Json | null
          authentication_requirements?: Json | null
          budget?: string | null
          compliance_frameworks?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_type?: string | null
          description?: string | null
          existing_vendors?: Json | null
          id?: string
          implementation_checklist?: Json | null
          industry?: string | null
          name: string
          next_milestone?: string | null
          organization_size?: number | null
          pain_points?: Json | null
          progress_percentage?: number | null
          risk_level?: string | null
          security_level?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_recommendations?: Json | null
          assigned_team?: Json | null
          authentication_requirements?: Json | null
          budget?: string | null
          compliance_frameworks?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_type?: string | null
          description?: string | null
          existing_vendors?: Json | null
          id?: string
          implementation_checklist?: Json | null
          industry?: string | null
          name?: string
          next_milestone?: string | null
          organization_size?: number | null
          pain_points?: Json | null
          progress_percentage?: number | null
          risk_level?: string | null
          security_level?: string | null
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          ai_analysis_results: Json | null
          ai_analysis_status: string | null
          created_at: string | null
          created_by: string | null
          extracted_content: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          knowledge_base_id: string | null
          mime_type: string | null
          storage_path: string
          updated_at: string | null
          upload_status: string | null
        }
        Insert: {
          ai_analysis_results?: Json | null
          ai_analysis_status?: string | null
          created_at?: string | null
          created_by?: string | null
          extracted_content?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          knowledge_base_id?: string | null
          mime_type?: string | null
          storage_path: string
          updated_at?: string | null
          upload_status?: string | null
        }
        Update: {
          ai_analysis_results?: Json | null
          ai_analysis_status?: string | null
          created_at?: string | null
          created_by?: string | null
          extracted_content?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          knowledge_base_id?: string | null
          mime_type?: string | null
          storage_path?: string
          updated_at?: string | null
          upload_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "project_knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      use_case_library: {
        Row: {
          associated_projects: Json | null
          associated_sites: Json | null
          authentication_methods: Json | null
          business_value: string | null
          category: string
          complexity: string
          compliance_frameworks: string[] | null
          created_at: string
          created_by: string | null
          custom_categories: Json | null
          dependencies: Json | null
          deployment_phases: string[] | null
          deployment_scenarios: Json | null
          description: string | null
          estimated_effort_weeks: number | null
          id: string
          industry_relevance: string[] | null
          last_modified_by: string | null
          maturity_level: string | null
          name: string
          portnox_features: Json | null
          prerequisites: Json | null
          quality_score: number | null
          status: string | null
          subcategory: string | null
          supported_vendors: Json | null
          tags: string[] | null
          technical_requirements: Json | null
          test_scenarios: Json | null
          updated_at: string
          validation_status: string | null
          version: string | null
        }
        Insert: {
          associated_projects?: Json | null
          associated_sites?: Json | null
          authentication_methods?: Json | null
          business_value?: string | null
          category: string
          complexity: string
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          dependencies?: Json | null
          deployment_phases?: string[] | null
          deployment_scenarios?: Json | null
          description?: string | null
          estimated_effort_weeks?: number | null
          id?: string
          industry_relevance?: string[] | null
          last_modified_by?: string | null
          maturity_level?: string | null
          name: string
          portnox_features?: Json | null
          prerequisites?: Json | null
          quality_score?: number | null
          status?: string | null
          subcategory?: string | null
          supported_vendors?: Json | null
          tags?: string[] | null
          technical_requirements?: Json | null
          test_scenarios?: Json | null
          updated_at?: string
          validation_status?: string | null
          version?: string | null
        }
        Update: {
          associated_projects?: Json | null
          associated_sites?: Json | null
          authentication_methods?: Json | null
          business_value?: string | null
          category?: string
          complexity?: string
          compliance_frameworks?: string[] | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          dependencies?: Json | null
          deployment_phases?: string[] | null
          deployment_scenarios?: Json | null
          description?: string | null
          estimated_effort_weeks?: number | null
          id?: string
          industry_relevance?: string[] | null
          last_modified_by?: string | null
          maturity_level?: string | null
          name?: string
          portnox_features?: Json | null
          prerequisites?: Json | null
          quality_score?: number | null
          status?: string | null
          subcategory?: string | null
          supported_vendors?: Json | null
          tags?: string[] | null
          technical_requirements?: Json | null
          test_scenarios?: Json | null
          updated_at?: string
          validation_status?: string | null
          version?: string | null
        }
        Relationships: []
      }
      use_cases: {
        Row: {
          acceptance_criteria: Json | null
          business_value: string | null
          category: string
          complexity: string | null
          compliance_frameworks: Json | null
          configuration_impact: Json | null
          conflicts_with: string[] | null
          created_at: string | null
          created_by: string | null
          dependencies: Json | null
          description: string | null
          documentation_links: Json | null
          estimated_effort_hours: number | null
          example_configurations: Json | null
          id: string
          implementation_steps: Json | null
          industry_applicability: Json | null
          is_active: boolean | null
          last_used: string | null
          prerequisites: Json | null
          priority: string | null
          regulatory_considerations: string | null
          related_use_cases: string[] | null
          required_integrations: Json | null
          resource_requirements: Json | null
          stakeholder_types: Json | null
          success_metrics: Json | null
          tags: Json | null
          technical_requirements: Json | null
          title: string
          troubleshooting_guide: Json | null
          typical_timeline: string | null
          updated_at: string | null
          usage_count: number | null
          use_case_type: string | null
          validation_steps: Json | null
        }
        Insert: {
          acceptance_criteria?: Json | null
          business_value?: string | null
          category: string
          complexity?: string | null
          compliance_frameworks?: Json | null
          configuration_impact?: Json | null
          conflicts_with?: string[] | null
          created_at?: string | null
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          documentation_links?: Json | null
          estimated_effort_hours?: number | null
          example_configurations?: Json | null
          id?: string
          implementation_steps?: Json | null
          industry_applicability?: Json | null
          is_active?: boolean | null
          last_used?: string | null
          prerequisites?: Json | null
          priority?: string | null
          regulatory_considerations?: string | null
          related_use_cases?: string[] | null
          required_integrations?: Json | null
          resource_requirements?: Json | null
          stakeholder_types?: Json | null
          success_metrics?: Json | null
          tags?: Json | null
          technical_requirements?: Json | null
          title: string
          troubleshooting_guide?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
          usage_count?: number | null
          use_case_type?: string | null
          validation_steps?: Json | null
        }
        Update: {
          acceptance_criteria?: Json | null
          business_value?: string | null
          category?: string
          complexity?: string | null
          compliance_frameworks?: Json | null
          configuration_impact?: Json | null
          conflicts_with?: string[] | null
          created_at?: string | null
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          documentation_links?: Json | null
          estimated_effort_hours?: number | null
          example_configurations?: Json | null
          id?: string
          implementation_steps?: Json | null
          industry_applicability?: Json | null
          is_active?: boolean | null
          last_used?: string | null
          prerequisites?: Json | null
          priority?: string | null
          regulatory_considerations?: string | null
          related_use_cases?: string[] | null
          required_integrations?: Json | null
          resource_requirements?: Json | null
          stakeholder_types?: Json | null
          success_metrics?: Json | null
          tags?: Json | null
          technical_requirements?: Json | null
          title?: string
          troubleshooting_guide?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
          usage_count?: number | null
          use_case_type?: string | null
          validation_steps?: Json | null
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
      user_ai_provider_configs: {
        Row: {
          api_key_encrypted: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          model_preferences: Json | null
          provider_id: string
          updated_at: string
          usage_limits: Json | null
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          model_preferences?: Json | null
          provider_id: string
          updated_at?: string
          usage_limits?: Json | null
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          model_preferences?: Json | null
          provider_id?: string
          updated_at?: string
          usage_limits?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ai_provider_configs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "ai_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_ai_provider_configs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          created_at: string | null
          encrypted_api_key: string
          id: string
          provider_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encrypted_api_key: string
          id?: string
          provider_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          encrypted_api_key?: string
          id?: string
          provider_name?: string
          updated_at?: string | null
          user_id?: string
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
      user_permissions_cache: {
        Row: {
          cached_at: string | null
          expires_at: string | null
          id: string
          permission_id: string
          scope_id: string | null
          scope_type: string | null
          user_id: string
        }
        Insert: {
          cached_at?: string | null
          expires_at?: string | null
          id?: string
          permission_id: string
          scope_id?: string | null
          scope_type?: string | null
          user_id: string
        }
        Update: {
          cached_at?: string | null
          expires_at?: string | null
          id?: string
          permission_id?: string
          scope_id?: string | null
          scope_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_cache_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          display_name: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          job_title: string | null
          language: string | null
          last_login: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          preferences: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          job_title?: string | null
          language?: string | null
          last_login?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          job_title?: string | null
          language?: string | null
          last_login?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          role_id: string
          scope_data: Json | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role_id: string
          scope_data?: Json | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role_id?: string
          scope_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
      vendor_api_integrations: {
        Row: {
          api_endpoint: string | null
          authentication_method: string | null
          created_at: string
          created_by: string
          credentials_encrypted: string | null
          id: string
          integration_type: string
          last_tested: string | null
          rate_limits: Json | null
          status: string | null
          supported_operations: Json | null
          test_results: Json | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          api_endpoint?: string | null
          authentication_method?: string | null
          created_at?: string
          created_by: string
          credentials_encrypted?: string | null
          id?: string
          integration_type: string
          last_tested?: string | null
          rate_limits?: Json | null
          status?: string | null
          supported_operations?: Json | null
          test_results?: Json | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          api_endpoint?: string | null
          authentication_method?: string | null
          created_at?: string
          created_by?: string
          credentials_encrypted?: string | null
          id?: string
          integration_type?: string
          last_tested?: string | null
          rate_limits?: Json | null
          status?: string | null
          supported_operations?: Json | null
          test_results?: Json | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_api_integrations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_api_integrations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_library: {
        Row: {
          associated_projects: Json | null
          associated_sites: Json | null
          category: string
          certifications: Json | null
          complexity_level: string | null
          compliance_frameworks: string[] | null
          configuration_templates: Json | null
          created_at: string
          created_by: string | null
          custom_categories: Json | null
          deployment_phases: string[] | null
          description: string | null
          documentation_links: Json | null
          firmware_requirements: Json | null
          id: string
          industry_relevance: string[] | null
          integration_methods: Json | null
          is_nac_vendor: boolean
          known_limitations: Json | null
          last_modified_by: string | null
          last_tested_date: string | null
          maturity_level: string | null
          models: Json | null
          portnox_compatibility: Json | null
          portnox_documentation: Json | null
          portnox_integration_level: string | null
          quality_score: number | null
          status: string | null
          support_contact: Json | null
          support_level: string | null
          supported_protocols: Json | null
          tags: Json | null
          updated_at: string
          validation_status: string | null
          vendor_name: string
          vendor_type: string
          version: string | null
          website_url: string | null
        }
        Insert: {
          associated_projects?: Json | null
          associated_sites?: Json | null
          category: string
          certifications?: Json | null
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          deployment_phases?: string[] | null
          description?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          industry_relevance?: string[] | null
          integration_methods?: Json | null
          is_nac_vendor?: boolean
          known_limitations?: Json | null
          last_modified_by?: string | null
          last_tested_date?: string | null
          maturity_level?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          portnox_documentation?: Json | null
          portnox_integration_level?: string | null
          quality_score?: number | null
          status?: string | null
          support_contact?: Json | null
          support_level?: string | null
          supported_protocols?: Json | null
          tags?: Json | null
          updated_at?: string
          validation_status?: string | null
          vendor_name: string
          vendor_type: string
          version?: string | null
          website_url?: string | null
        }
        Update: {
          associated_projects?: Json | null
          associated_sites?: Json | null
          category?: string
          certifications?: Json | null
          complexity_level?: string | null
          compliance_frameworks?: string[] | null
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          custom_categories?: Json | null
          deployment_phases?: string[] | null
          description?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          industry_relevance?: string[] | null
          integration_methods?: Json | null
          is_nac_vendor?: boolean
          known_limitations?: Json | null
          last_modified_by?: string | null
          last_tested_date?: string | null
          maturity_level?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          portnox_documentation?: Json | null
          portnox_integration_level?: string | null
          quality_score?: number | null
          status?: string | null
          support_contact?: Json | null
          support_level?: string | null
          supported_protocols?: Json | null
          tags?: Json | null
          updated_at?: string
          validation_status?: string | null
          vendor_name?: string
          vendor_type?: string
          version?: string | null
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
          tags: Json
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
          tags?: Json
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
          tags?: Json
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
      vendor_permissions: {
        Row: {
          conditions: Json | null
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          user_id: string
          vendor_id: string
        }
        Update: {
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          authentication_standards: Json | null
          configuration_templates: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          documentation_url: string | null
          id: string
          integration_complexity: string | null
          integration_methods: Json | null
          is_active: boolean | null
          licensing_model: string | null
          market_segment: string[] | null
          name: string
          portnox_certified: boolean | null
          support_email: string | null
          support_phone: string | null
          supported_protocols: Json | null
          typical_deployment_size: string | null
          updated_at: string | null
          vendor_type: string
          website_url: string | null
        }
        Insert: {
          authentication_standards?: Json | null
          configuration_templates?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          integration_complexity?: string | null
          integration_methods?: Json | null
          is_active?: boolean | null
          licensing_model?: string | null
          market_segment?: string[] | null
          name: string
          portnox_certified?: boolean | null
          support_email?: string | null
          support_phone?: string | null
          supported_protocols?: Json | null
          typical_deployment_size?: string | null
          updated_at?: string | null
          vendor_type: string
          website_url?: string | null
        }
        Update: {
          authentication_standards?: Json | null
          configuration_templates?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          integration_complexity?: string | null
          integration_methods?: Json | null
          is_active?: boolean | null
          licensing_model?: string | null
          market_segment?: string[] | null
          name?: string
          portnox_certified?: boolean | null
          support_email?: string | null
          support_phone?: string | null
          supported_protocols?: Json | null
          typical_deployment_size?: string | null
          updated_at?: string | null
          vendor_type?: string
          website_url?: string | null
        }
        Relationships: []
      }
      workflow_instances: {
        Row: {
          completed_at: string | null
          current_step: number | null
          execution_log: Json | null
          id: string
          metadata: Json | null
          project_id: string | null
          site_id: string | null
          started_at: string
          started_by: string
          status: string | null
          step_data: Json | null
          template_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          execution_log?: Json | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          site_id?: string | null
          started_at?: string
          started_by: string
          status?: string | null
          step_data?: Json | null
          template_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          execution_log?: Json | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          site_id?: string | null
          started_at?: string
          started_by?: string
          status?: string | null
          step_data?: Json | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_sessions: {
        Row: {
          ai_insights: Json
          context_data: Json
          created_at: string
          created_by: string | null
          current_step: number
          id: string
          resource_mappings: Json
          session_id: string
          updated_at: string
          workflow_type: string
        }
        Insert: {
          ai_insights?: Json
          context_data?: Json
          created_at?: string
          created_by?: string | null
          current_step?: number
          id?: string
          resource_mappings?: Json
          session_id: string
          updated_at?: string
          workflow_type: string
        }
        Update: {
          ai_insights?: Json
          context_data?: Json
          created_at?: string
          created_by?: string | null
          current_step?: number
          id?: string
          resource_mappings?: Json
          session_id?: string
          updated_at?: string
          workflow_type?: string
        }
        Relationships: []
      }
      workflow_templates: {
        Row: {
          automation_rules: Json | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_public: boolean | null
          name: string
          trigger_conditions: Json | null
          updated_at: string
          usage_count: number | null
          workflow_steps: Json
        }
        Insert: {
          automation_rules?: Json | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          name: string
          trigger_conditions?: Json | null
          updated_at?: string
          usage_count?: number | null
          workflow_steps?: Json
        }
        Update: {
          automation_rules?: Json | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          name?: string
          trigger_conditions?: Json | null
          updated_at?: string
          usage_count?: number | null
          workflow_steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_role_to_user: {
        Args: {
          p_assigned_by?: string
          p_expires_at?: string
          p_notes?: string
          p_role_name: string
          p_scope_data?: Json
          p_user_id: string
        }
        Returns: string
      }
      authenticate_customer_user: {
        Args: { p_email: string; p_password: string }
        Returns: {
          customer_organization: string
          project_id: string
          project_name: string
          role: string
          user_id: string
        }[]
      }
      can_manage_roles: {
        Args: { _scope_id?: string; _scope_type?: string; _user_id: string }
        Returns: boolean
      }
      check_permission: {
        Args: {
          p_permission_name: string
          p_scope?: string
          p_scope_id?: string
          p_user_id: string
        }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_initial_admin: {
        Args: { _user_id: string }
        Returns: undefined
      }
      create_user_safely: {
        Args: {
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_password?: string
          p_role?: Database["public"]["Enums"]["app_role"]
          p_scope_id?: string
          p_scope_type?: string
          p_send_invitation?: boolean
        }
        Returns: Json
      }
      decrement_tag_usage: {
        Args: { tag_id: string }
        Returns: undefined
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
          p_secret: string
          p_user_id: string
          p_verification_code: string
        }
        Returns: boolean
      }
      enforce_2fa_for_user: {
        Args: { p_deadline?: string; p_immediate?: boolean; p_user_id: string }
        Returns: boolean
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_project_by_customer_portal_id: {
        Args: { portal_id: string }
        Returns: {
          created_at: string
          current_phase: string
          customer_organization: string
          customer_portal_enabled: boolean
          description: string
          end_date: string
          estimated_budget: number
          id: string
          name: string
          progress_percentage: number
          start_date: string
          status: string
        }[]
      }
      get_super_admin_emails: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_user_roles: {
        Args: { p_user_id: string }
        Returns: {
          role_id: string
        }[]
      }
      has_permission: {
        Args: {
          permission: Database["public"]["Enums"]["permission_type"]
          resource: Database["public"]["Enums"]["resource_type"]
          scope_id?: string
          scope_type?: string
          user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args:
          | {
              _role: Database["public"]["Enums"]["app_role"]
              _scope_id?: string
              _scope_type?: string
              _user_id: string
            }
          | {
              _role: string
              _scope_id?: string
              _scope_type?: string
              _user_id: string
            }
        Returns: boolean
      }
      increment_tag_usage: {
        Args: { tag_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: { _event_details?: Json; _event_type: string; _user_id?: string }
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
      revoke_role_from_user: {
        Args: { p_revoked_by?: string; p_role_name: string; p_user_id: string }
        Returns: boolean
      }
      soft_delete_user: {
        Args: { p_user_id: string }
        Returns: Json
      }
      toggle_user_block: {
        Args: { p_block?: boolean; p_user_id: string }
        Returns: Json
      }
      update_2fa_enforcement: {
        Args: { p_settings: Json }
        Returns: boolean
      }
      update_resource_usage: {
        Args: {
          p_action: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: undefined
      }
      user_owns_project: {
        Args: { project_uuid: string }
        Returns: boolean
      }
      user_owns_scoping_session: {
        Args: { session_uuid: string }
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
      validate_session_token: {
        Args: { p_token: string }
        Returns: {
          is_valid: boolean
          session_id: string
          user_id: string
        }[]
      }
      verify_totp_code: {
        Args: { p_code: string; p_user_id: string }
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
