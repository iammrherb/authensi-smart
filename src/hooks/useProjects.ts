import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
export interface Project {
  id: string;
  name: string;
  description?: string;
  client_name?: string;
  status: 'planning' | 'scoping' | 'designing' | 'implementing' | 'testing' | 'deployed' | 'maintenance';
  current_phase: 'discovery' | 'scoping' | 'design' | 'implementation' | 'testing' | 'deployment' | 'maintenance';
  start_date?: string;
  target_completion?: string;
  actual_completion?: string;
  budget?: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  project_manager?: string;
  
  // Enhanced project fields
  project_type?: string;
  primary_country?: string;
  primary_region?: string;
  timezone?: string;
  business_summary?: string;
  business_domain?: string;
  business_website?: string;
  project_owner?: string;
  technical_owner?: string;
  portnox_owner?: string;
  additional_stakeholders?: any[];
  enable_bulk_sites?: boolean;
  bulk_sites_data?: any[];
  enable_bulk_users?: boolean;
  enable_auto_vendors?: boolean;
  industry?: string;
  deployment_type?: string;
  security_level?: string;
  total_sites?: number;
  total_endpoints?: number;
  compliance_frameworks?: string[];
  pain_points?: any[];
  success_criteria?: any[];
  integration_requirements?: any[];
  migration_scope?: any;
  template_id?: string;
  poc_status?: string;

  // Newly added fields for enhanced basics
  website_url?: string;
  linkedin_url?: string;
  project_owners?: { name: string; email: string }[];
  technical_owners?: { name: string; email: string }[];
  country_code?: string;
  region_name?: string;
  overall_goal?: string;
  initiative_type?: 'greenfield' | 'migration' | 'expansion' | 'other' | string;
  ai_recommendations?: string;
}

export interface ProjectSite {
  id: string;
  project_id: string;
  site_id: string;
  deployment_order: number;
  site_specific_notes?: string;
  created_at: string;
}

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, client_name, business_domain, business_website, business_summary, project_type, industry, primary_country, primary_region, timezone, deployment_type, security_level, total_sites, total_endpoints, budget, project_manager, project_owner, technical_owner, portnox_owner, additional_stakeholders, compliance_frameworks, pain_points, success_criteria, integration_requirements, enable_bulk_sites, enable_bulk_users, enable_auto_vendors, start_date, target_completion, status, current_phase, progress_percentage, created_by, bulk_sites_data, migration_scope, created_at, updated_at, actual_completion, template_id, poc_status, website_url, linkedin_url, project_owners, technical_owners, country_code, region_name, overall_goal, initiative_type, ai_recommendations')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data as Project[];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      // Validate that id is a UUID format, not a route like "create"
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return null; // Return null for invalid UUIDs instead of throwing an error
      }

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description, client_name, business_domain, business_website, business_summary, project_type, industry, primary_country, primary_region, timezone, deployment_type, security_level, total_sites, total_endpoints, budget, project_manager, project_owner, technical_owner, portnox_owner, additional_stakeholders, compliance_frameworks, pain_points, success_criteria, integration_requirements, enable_bulk_sites, enable_bulk_users, enable_auto_vendors, start_date, target_completion, status, current_phase, progress_percentage, created_by, bulk_sites_data, migration_scope, created_at, updated_at, actual_completion, template_id, poc_status, website_url, linkedin_url, project_owners, technical_owners, country_code, region_name, overall_goal, initiative_type, ai_recommendations')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
      return data as Project | null;
    },
    enabled: !!id && id !== 'create', // Don't run query for route paths like "create"
  });
};

export const useProjectSites = (projectId: string) => {
  return useQuery({
    queryKey: ['project-sites', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_sites')
        .select(`
          *,
          sites (*)
        `)
        .eq('project_id', projectId)
        .order('deployment_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create projects');
      }

      // Whitelist only DB columns to avoid 400 errors from unknown fields
      const {
        name,
        description,
        client_name,
        business_domain,
        business_website,
        business_summary,
        project_type,
        industry,
        primary_country,
        primary_region,
        timezone,
        deployment_type,
        security_level,
        total_sites,
        total_endpoints,
        budget,
        project_manager,
        project_owner,
        technical_owner,
        portnox_owner,
        additional_stakeholders,
        compliance_frameworks,
        pain_points,
        success_criteria,
        integration_requirements,
        enable_bulk_sites,
        enable_bulk_users,
        enable_auto_vendors,
        start_date,
        target_completion,
        status,
        current_phase,
        progress_percentage,
        bulk_sites_data,
        migration_scope,
        actual_completion,
        template_id,
        poc_status,
        website_url,
        linkedin_url,
        project_owners,
        technical_owners,
        country_code,
        region_name,
        overall_goal,
        initiative_type,
        ai_recommendations,
      } = projectData as any;

      type ProjectInsert = Database['public']['Tables']['projects']['Insert'];

      const cleanedData: ProjectInsert = {
        name,
        description,
        client_name,
        business_domain,
        business_website,
        business_summary,
        project_type: project_type as any,
        industry,
        primary_country,
        primary_region,
        timezone,
        deployment_type,
        security_level,
        total_sites,
        total_endpoints,
        budget,
        project_manager,
        project_owner,
        technical_owner,
        portnox_owner,
        additional_stakeholders: Array.isArray(additional_stakeholders) ? (additional_stakeholders as any) : [],
        compliance_frameworks: Array.isArray(compliance_frameworks) ? compliance_frameworks : [],
        pain_points: Array.isArray(pain_points) ? (pain_points as any) : [],
        success_criteria: Array.isArray(success_criteria) ? (success_criteria as any) : [],
        integration_requirements: Array.isArray(integration_requirements) ? (integration_requirements as any) : [],
        enable_bulk_sites,
        enable_bulk_users,
        enable_auto_vendors,
        start_date,
        target_completion,
        status,
        current_phase,
        progress_percentage: typeof progress_percentage === 'number' ? progress_percentage : 0,
        created_by: user.id,
        bulk_sites_data: Array.isArray(bulk_sites_data) ? (bulk_sites_data as any) : [],
        migration_scope: (migration_scope as any) || {},
        actual_completion,
        template_id,
        poc_status,
        website_url,
        linkedin_url,
        project_owners: project_owners as any,
        technical_owners: technical_owners as any,
        country_code,
        region_name,
        overall_goal,
        initiative_type,
        ai_recommendations,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(cleanedData)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Project creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddSiteToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, siteId, deploymentOrder, notes }: {
      projectId: string;
      siteId: string;
      deploymentOrder: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_sites')
        .insert([{
          project_id: projectId,
          site_id: siteId,
          deployment_order: deploymentOrder,
          site_specific_notes: notes,
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error adding site to project:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-sites'] });
      toast({
        title: "Success",
        description: "Site added to project successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add site to project: " + error.message,
        variant: "destructive",
      });
    },
  });
};