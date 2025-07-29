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
          first_name: string | null
          id: string
          is_active: boolean | null
          job_title: string | null
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_name?: string | null
          phone?: string | null
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
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
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
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          scope_id?: string | null
          scope_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_library: {
        Row: {
          category: string
          configuration_templates: Json | null
          created_at: string
          created_by: string | null
          documentation_links: Json | null
          firmware_requirements: Json | null
          id: string
          integration_methods: Json | null
          known_limitations: Json | null
          last_tested_date: string | null
          models: Json | null
          portnox_compatibility: Json | null
          status: string | null
          support_level: string | null
          supported_protocols: Json | null
          updated_at: string
          vendor_name: string
          vendor_type: string
        }
        Insert: {
          category: string
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          integration_methods?: Json | null
          known_limitations?: Json | null
          last_tested_date?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          status?: string | null
          support_level?: string | null
          supported_protocols?: Json | null
          updated_at?: string
          vendor_name: string
          vendor_type: string
        }
        Update: {
          category?: string
          configuration_templates?: Json | null
          created_at?: string
          created_by?: string | null
          documentation_links?: Json | null
          firmware_requirements?: Json | null
          id?: string
          integration_methods?: Json | null
          known_limitations?: Json | null
          last_tested_date?: string | null
          models?: Json | null
          portnox_compatibility?: Json | null
          status?: string | null
          support_level?: string | null
          supported_protocols?: Json | null
          updated_at?: string
          vendor_name?: string
          vendor_type?: string
        }
        Relationships: []
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
    },
  },
} as const
