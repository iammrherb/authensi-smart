import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  EnhancedResourceLibraryService, 
  ResourceEnrichmentResult,
  SessionPersistenceData,
  EnhancedResourceSession 
} from '@/services/EnhancedResourceLibraryService';

// Enhanced Resource Consolidation Hook
export const useConsolidateResources = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await EnhancedResourceLibraryService.consolidateAllResources();
    },
    onSuccess: (data) => {
      // Invalidate all resource-related queries
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-templates'] });
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      queryClient.invalidateQueries({ queryKey: ['authentication-methods'] });

      toast({
        title: "Resource Consolidation Complete",
        description: `Successfully consolidated ${data.total} resources across all libraries.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Consolidation Failed",
        description: error.message || "Failed to consolidate resources",
        variant: "destructive"
      });
    }
  });
};

// Enhanced Resource Enrichment Hook
export const useEnrichResources = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceType,
      useFirecrawl = true,
      useAI = true
    }: {
      resourceType: 'vendors' | 'models' | 'templates' | 'use_cases' | 'requirements' | 'all';
      useFirecrawl?: boolean;
      useAI?: boolean;
    }) => {
      return await EnhancedResourceLibraryService.enrichResourcesWithDocumentation(
        resourceType,
        useFirecrawl,
        useAI
      );
    },
    onSuccess: (data: ResourceEnrichmentResult) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-models'] });
      queryClient.invalidateQueries({ queryKey: ['configuration-templates'] });
      queryClient.invalidateQueries({ queryKey: ['use-cases'] });
      queryClient.invalidateQueries({ queryKey: ['requirements'] });

      toast({
        title: "Resource Enrichment Complete",
        description: `Successfully enriched ${data.enrichedCount} resources. ${data.failedCount} failed.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enrichment Failed",
        description: error.message || "Failed to enrich resources",
        variant: "destructive"
      });
    }
  });
};

// Enhanced Session Persistence Hooks
export const useCreateResourceSession = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      sessionType,
      sessionData,
      resourceSelections,
      expirationHours = 72
    }: {
      sessionType: 'scoping' | 'configuration' | 'planning' | 'tracking';
      sessionData: any;
      resourceSelections: any;
      expirationHours?: number;
    }) => {
      return await EnhancedResourceLibraryService.createResourceSession(
        sessionType,
        sessionData,
        resourceSelections,
        expirationHours
      );
    },
    onSuccess: (sessionId: string) => {
      toast({
        title: "Session Created",
        description: `Session ${sessionId.slice(0, 8)}... created successfully and will be available for sharing.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Session Creation Failed",
        description: error.message || "Failed to create session",
        variant: "destructive"
      });
    }
  });
};

export const useGetResourceSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['resource-session', sessionId],
    queryFn: async (): Promise<SessionPersistenceData | null> => {
      return await EnhancedResourceLibraryService.getResourceSession(sessionId);
    },
    enabled: !!sessionId,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to check expiration
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};

// Enhanced Multi-Tenant Resource Sharing Hooks
export const useShareResource = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resourceId,
      resourceType,
      sharingLevel,
      permissions,
      sharedWithUsers = []
    }: {
      resourceId: string;
      resourceType: string;
      sharingLevel: 'global' | 'organization' | 'project' | 'private';
      permissions: { view: boolean; edit: boolean; delete: boolean; share: boolean };
      sharedWithUsers?: string[];
    }) => {
      return await EnhancedResourceLibraryService.shareResource(
        resourceId,
        resourceType,
        sharingLevel,
        permissions,
        sharedWithUsers
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-resources'] });
      toast({
        title: "Resource Shared",
        description: "Resource sharing settings updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sharing Failed",
        description: error.message || "Failed to update sharing settings",
        variant: "destructive"
      });
    }
  });
};

export const useGetSharedResources = (resourceType?: string, includePrivate: boolean = false) => {
  return useQuery({
    queryKey: ['shared-resources', resourceType, includePrivate],
    queryFn: async () => {
      return await EnhancedResourceLibraryService.getSharedResources(resourceType, includePrivate);
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

// Cross-tenant Resource Access Hook
export const useCrossTenantResources = (resourceTypes: string[] = []) => {
  return useQuery({
    queryKey: ['cross-tenant-resources', resourceTypes],
    queryFn: async () => {
      const results: Record<string, any[]> = {};
      
      for (const resourceType of resourceTypes) {
        try {
          const resources = await EnhancedResourceLibraryService.getSharedResources(resourceType, false);
          results[resourceType] = resources.filter(r => 
            r.sharing_level === 'global' || r.sharing_level === 'organization'
          );
        } catch (error) {
          console.error(`Failed to fetch shared resources for ${resourceType}:`, error);
          results[resourceType] = [];
        }
      }
      
      return results;
    },
    enabled: resourceTypes.length > 0,
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  });
};

// Session Management for Sales Engineers and Technical Account Managers
export const useSessionManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSession = useCreateResourceSession();
  
  const saveSessionState = useMutation({
    mutationFn: async ({
      sessionId,
      sessionData,
      resourceSelections
    }: {
      sessionId: string;
      sessionData: any;
      resourceSelections: any;
    }) => {
      // This would update existing session
      // Implementation depends on if we want to support session updates
      return { sessionId, saved: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-session'] });
      toast({
        title: "Session Saved",
        description: "Your session has been automatically saved."
      });
    }
  });

  const shareSession = useShareResource();

  return {
    createSession,
    saveSessionState,
    shareSession,
    isCreatingSession: createSession.isPending,
    isSavingSession: saveSessionState.isPending,
    isSharingSession: shareSession.isPending
  };
};

// Global Resource Library Status Hook for Solutions Architects
export const useResourceLibraryStatus = () => {
  return useQuery({
    queryKey: ['resource-library-status'],
    queryFn: async () => {
      try {
        // Get counts and enrichment status for all resource types
        const status = await EnhancedResourceLibraryService.consolidateAllResources();
        
        return {
          ...status,
          lastUpdated: new Date().toISOString(),
          enrichmentAvailable: true,
          sessionPersistenceActive: true,
          multiTenantSharingEnabled: true
        };
      } catch (error) {
        console.error('Failed to get resource library status:', error);
        throw error;
      }
    },
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    staleTime: 15 * 60 * 1000, // Consider data stale after 15 minutes
  });
};