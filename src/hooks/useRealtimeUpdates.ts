import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Projects realtime subscription
    const projectsChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
          queryClient.invalidateQueries({ queryKey: ['unified-projects'] });
        }
      )
      .subscribe();

    // Sites realtime subscription
    const sitesChannel = supabase
      .channel('sites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sites'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['sites'] });
          queryClient.invalidateQueries({ queryKey: ['project-sites'] });
        }
      )
      .subscribe();

    // Scoping sessions realtime subscription
    const scopingChannel = supabase
      .channel('scoping-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scoping_sessions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scoping-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['scoping-management'] });
        }
      )
      .subscribe();

    // Workflow sessions realtime subscription
    const workflowChannel = supabase
      .channel('workflow-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_sessions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['workflow-sessions'] });
        }
      )
      .subscribe();

    // Tracking sessions realtime subscription
    const trackingChannel = supabase
      .channel('tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tracking_sessions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tracking-sessions'] });
        }
      )
      .subscribe();

    // POC activities realtime subscription
    const pocChannel = supabase
      .channel('poc-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'poc_activities'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['poc-activities'] });
        }
      )
      .subscribe();

    // Implementation checklists realtime subscription
    const checklistsChannel = supabase
      .channel('checklists-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'implementation_checklists'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['implementation-checklists'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(sitesChannel);
      supabase.removeChannel(scopingChannel);
      supabase.removeChannel(workflowChannel);
      supabase.removeChannel(trackingChannel);
      supabase.removeChannel(pocChannel);
      supabase.removeChannel(checklistsChannel);
    };
  }, [queryClient]);
};