import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  enhancedResourceLibraryService,
  EnhancedResourceItem,
  ResourceTag,
  ResourceLabel,
  ExternalResourceLink,
  ResourceSearchFilters,
  ResourceBulkOperation
} from '@/services/resourceLibrary/EnhancedResourceLibraryService';

export const useEnhancedResourceLibrary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get enhanced resource with all related data
  const useEnhancedResource = (type: string, id: string) => {
    return useQuery<EnhancedResourceItem | null>({
      queryKey: ['enhanced-resource', type, id],
      queryFn: () => enhancedResourceLibraryService.getEnhancedResource(type, id),
      enabled: !!type && !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Search resources with advanced filtering
  const useSearchResources = (filters: ResourceSearchFilters) => {
    return useQuery<EnhancedResourceItem[]>({
      queryKey: ['search-resources', filters],
      queryFn: () => enhancedResourceLibraryService.searchResources(filters),
      enabled: Object.keys(filters).length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Get all tags
  const useResourceTags = () => {
    return useQuery<ResourceTag[]>({
      queryKey: ['resource-tags'],
      queryFn: () => enhancedResourceLibraryService.getAllTags(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get all labels
  const useResourceLabels = () => {
    return useQuery<ResourceLabel[]>({
      queryKey: ['resource-labels'],
      queryFn: () => enhancedResourceLibraryService.getAllLabels(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get resource analytics
  const useResourceAnalytics = () => {
    return useQuery({
      queryKey: ['resource-analytics'],
      queryFn: () => enhancedResourceLibraryService.getResourceAnalytics(),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  };

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (tag: Omit<ResourceTag, 'id' | 'usage_count' | 'created_at' | 'created_by'>) =>
      enhancedResourceLibraryService.createTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Tag Created",
        description: "New resource tag has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create Tag Failed",
        description: error.message || "Failed to create tag.",
        variant: "destructive",
      });
    },
  });

  // Create label mutation
  const createLabelMutation = useMutation({
    mutationFn: (label: Omit<ResourceLabel, 'id' | 'created_at'>) =>
      enhancedResourceLibraryService.createLabel(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-labels'] });
      toast({
        title: "Label Created",
        description: "New resource label has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create Label Failed",
        description: error.message || "Failed to create label.",
        variant: "destructive",
      });
    },
  });

  // Add tag to resource mutation
  const addTagToResourceMutation = useMutation({
    mutationFn: ({ resourceType, resourceId, tagId }: { resourceType: string; resourceId: string; tagId: string }) =>
      enhancedResourceLibraryService.addTagToResource(resourceType, resourceId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource', variables.resourceType, variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Tag Added",
        description: "Tag has been added to the resource.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Tag Failed",
        description: error.message || "Failed to add tag to resource.",
        variant: "destructive",
      });
    },
  });

  // Remove tag from resource mutation
  const removeTagFromResourceMutation = useMutation({
    mutationFn: ({ resourceType, resourceId, tagId }: { resourceType: string; resourceId: string; tagId: string }) =>
      enhancedResourceLibraryService.removeTagFromResource(resourceType, resourceId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource', variables.resourceType, variables.resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Tag Removed",
        description: "Tag has been removed from the resource.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Tag Failed",
        description: error.message || "Failed to remove tag from resource.",
        variant: "destructive",
      });
    },
  });

  // Add label to resource mutation
  const addLabelToResourceMutation = useMutation({
    mutationFn: ({ resourceType, resourceId, labelId }: { resourceType: string; resourceId: string; labelId: string }) =>
      enhancedResourceLibraryService.addLabelToResource(resourceType, resourceId, labelId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource', variables.resourceType, variables.resourceId] });
      toast({
        title: "Label Added",
        description: "Label has been added to the resource.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Label Failed",
        description: error.message || "Failed to add label to resource.",
        variant: "destructive",
      });
    },
  });

  // Add external link mutation
  const addExternalLinkMutation = useMutation({
    mutationFn: (link: Omit<ExternalResourceLink, 'id' | 'created_at' | 'updated_at'>) =>
      enhancedResourceLibraryService.addExternalLink(link),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource', variables.resource_type, variables.resource_id] });
      toast({
        title: "External Link Added",
        description: "External link has been added to the resource.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Link Failed",
        description: error.message || "Failed to add external link.",
        variant: "destructive",
      });
    },
  });

  // Update external link mutation
  const updateExternalLinkMutation = useMutation({
    mutationFn: ({ linkId, updates }: { linkId: string; updates: Partial<ExternalResourceLink> }) =>
      enhancedResourceLibraryService.updateExternalLink(linkId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource'] });
      toast({
        title: "Link Updated",
        description: "External link has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Link Failed",
        description: error.message || "Failed to update external link.",
        variant: "destructive",
      });
    },
  });

  // Verify external link mutation
  const verifyExternalLinkMutation = useMutation({
    mutationFn: (linkId: string) => enhancedResourceLibraryService.verifyExternalLink(linkId),
    onSuccess: (isAccessible, linkId) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource'] });
      toast({
        title: "Link Verified",
        description: isAccessible ? "Link is accessible." : "Link appears to be inaccessible.",
        variant: isAccessible ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify external link.",
        variant: "destructive",
      });
    },
  });

  // Bulk operations mutation
  const performBulkOperationMutation = useMutation({
    mutationFn: (operation: ResourceBulkOperation) =>
      enhancedResourceLibraryService.performBulkOperation(operation),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-resource'] });
      queryClient.invalidateQueries({ queryKey: ['resource-tags'] });
      toast({
        title: "Bulk Operation Completed",
        description: `Successfully processed ${result.success} items. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
        variant: result.failed > 0 ? "destructive" : "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Operation Failed",
        description: error.message || "Failed to perform bulk operation.",
        variant: "destructive",
      });
    },
  });

  // Update resource usage mutation
  const updateResourceUsageMutation = useMutation({
    mutationFn: ({ resourceType, resourceId, action }: { resourceType: string; resourceId: string; action: 'select' | 'project_add' | 'success' | 'failure' }) =>
      enhancedResourceLibraryService.updateResourceUsage(resourceType, resourceId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-analytics'] });
    },
    onError: (error: any) => {
      console.error('Failed to update resource usage:', error);
    },
  });

  // Get resource recommendations
  const useResourceRecommendations = (
    currentResources: { type: string; id: string }[],
    context: { industry?: string; useCase?: string; complexity?: string } = {}
  ) => {
    return useQuery<EnhancedResourceItem[]>({
      queryKey: ['resource-recommendations', currentResources, context],
      queryFn: () => enhancedResourceLibraryService.getResourceRecommendations(currentResources, context),
      enabled: currentResources.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    // Query hooks
    useEnhancedResource,
    useSearchResources,
    useResourceTags,
    useResourceLabels,
    useResourceAnalytics,
    useResourceRecommendations,

    // Mutations
    createTag: createTagMutation.mutateAsync,
    isCreatingTag: createTagMutation.isPending,
    
    createLabel: createLabelMutation.mutateAsync,
    isCreatingLabel: createLabelMutation.isPending,
    
    addTagToResource: addTagToResourceMutation.mutateAsync,
    isAddingTag: addTagToResourceMutation.isPending,
    
    removeTagFromResource: removeTagFromResourceMutation.mutateAsync,
    isRemovingTag: removeTagFromResourceMutation.isPending,
    
    addLabelToResource: addLabelToResourceMutation.mutateAsync,
    isAddingLabel: addLabelToResourceMutation.isPending,
    
    addExternalLink: addExternalLinkMutation.mutateAsync,
    isAddingLink: addExternalLinkMutation.isPending,
    
    updateExternalLink: updateExternalLinkMutation.mutateAsync,
    isUpdatingLink: updateExternalLinkMutation.isPending,
    
    verifyExternalLink: verifyExternalLinkMutation.mutateAsync,
    isVerifyingLink: verifyExternalLinkMutation.isPending,
    
    performBulkOperation: performBulkOperationMutation.mutateAsync,
    isPerformingBulkOperation: performBulkOperationMutation.isPending,
    
    updateResourceUsage: updateResourceUsageMutation.mutate,
  };
};

export default useEnhancedResourceLibrary;