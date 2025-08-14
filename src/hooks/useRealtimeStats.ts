import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeUpdates } from './useRealtimeUpdates';

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

interface SiteStats {
  total: number;
  planning: number;
  implementing: number;
  deployed: number;
}

interface ScopingStats {
  total: number;
  draft: number;
  completed: number;
  archived: number;
}

interface DashboardStats {
  projects: ProjectStats;
  sites: SiteStats;
  scoping: ScopingStats;
  totalImplementations: number;
  averageProgress: number;
}

export const useRealtimeStats = () => {
  useRealtimeUpdates(); // Enable real-time updates

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('status')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch sites stats
      const { data: sites, error: sitesError } = await supabase
        .from('sites')
        .select('status, progress_percentage')
        .order('created_at', { ascending: false });

      if (sitesError) throw sitesError;

      // Fetch scoping sessions stats
      const { data: scopingSessions, error: scopingError } = await supabase
        .from('scoping_sessions')
        .select('status')
        .order('created_at', { ascending: false });

      if (scopingError) throw scopingError;

      // Calculate project stats
      const projectStats: ProjectStats = {
        total: projects?.length || 0,
        active: projects?.filter(p => p.status === 'active').length || 0,
        completed: projects?.filter(p => p.status === 'completed').length || 0,
        pending: projects?.filter(p => p.status === 'planning').length || 0,
      };

      // Calculate site stats
      const siteStats: SiteStats = {
        total: sites?.length || 0,
        planning: sites?.filter(s => s.status === 'planning').length || 0,
        implementing: sites?.filter(s => ['implementing', 'testing'].includes(s.status)).length || 0,
        deployed: sites?.filter(s => s.status === 'deployed').length || 0,
      };

      // Calculate scoping stats
      const scopingStats: ScopingStats = {
        total: scopingSessions?.length || 0,
        draft: scopingSessions?.filter(s => s.status === 'draft').length || 0,
        completed: scopingSessions?.filter(s => s.status === 'completed').length || 0,
        archived: scopingSessions?.filter(s => s.status === 'archived').length || 0,
      };

      // Calculate average progress
      const progressValues = sites?.map(s => s.progress_percentage || 0) || [];
      const averageProgress = progressValues.length > 0 
        ? progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length 
        : 0;

      return {
        projects: projectStats,
        sites: siteStats,
        scoping: scopingStats,
        totalImplementations: siteStats.implementing + siteStats.deployed,
        averageProgress: Math.round(averageProgress),
      };
    },
    refetchInterval: 30000, // Fallback polling every 30 seconds
  });
};