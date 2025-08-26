import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { WebCrawlingEngine, CrawlRequest, CrawledContent, ExternalLink } from '@/services/intelligence/WebCrawlingEngine';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { webCrawlingEngine, CrawlTarget, CrawledContent, BusinessIntelligence, SearchResult, WirelessConfigRecommendation, SecurityAlert } from '@/services/intelligence/WebCrawlingEngine';

interface UseWebIntelligenceOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  showToasts?: boolean;
}

interface UseWebIntelligenceReturn {
  // Content Management
  addCrawlTarget: (target: Omit<CrawlTarget, 'id'>) => Promise<string>;
  crawlTarget: (targetId: string) => Promise<CrawledContent | null>;
  searchContent: (query: string, filters?: any) => Promise<SearchResult[]>;
  
  // Business Intelligence
  generateBusinessProfile: (companyName: string, domain?: string) => Promise<BusinessIntelligence>;
  getBusinessProfile: (companyName: string) => BusinessIntelligence | null;
  updateBusinessProfile: (companyName: string, updates: Partial<BusinessIntelligence>) => Promise<void>;
  
  // Wireless Configuration Intelligence
  getWirelessRecommendations: (vendor: string, model: string, useCase: string, securityLevel?: string) => Promise<WirelessConfigRecommendation[]>;
  addWirelessConfiguration: (config: any) => Promise<void>;
  
  // Security Monitoring
  getSecurityAlerts: (vendors?: string[]) => Promise<SecurityAlert[]>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  
  // External Link Management
  addExternalLink: (entityType: string, entityId: string, link: any) => Promise<void>;
  getExternalLinks: (entityType: string, entityId: string) => Promise<any[]>;
  
  // Analytics and Insights
  getContentAnalytics: () => Promise<any>;
  getSearchAnalytics: (timeRange?: string) => Promise<any>;
  
  // State Management
  isLoading: boolean;
  error: string | null;
  crawlQueue: Map<string, any>;
  businessProfiles: Map<string, BusinessIntelligence>;
  
  // Utility Functions
  clearError: () => void;
  refreshData: () => Promise<void>;
}

export const useWebIntelligence = (options: UseWebIntelligenceOptions = {}): UseWebIntelligenceReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    showToasts = true
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crawlQueue, setCrawlQueue] = useState<Map<string, any>>(new Map());
  const [businessProfiles, setBusinessProfiles] = useState<Map<string, BusinessIntelligence>>(new Map());
  
  const { toast } = useToast();

  const handleError = useCallback((error: Error, context?: string) => {
    const errorMessage = `${context ? context + ': ' : ''}${error.message}`;
    setError(errorMessage);
    
    if (showToasts) {
      toast({
        title: "Intelligence Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    console.error('Web Intelligence Error:', error);
  }, [toast, showToasts]);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error as Error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Content Management Functions
  const addCrawlTarget = useCallback(async (target: Omit<CrawlTarget, 'id'>): Promise<string> => {
    const result = await executeWithErrorHandling(async () => {
      const targetId = await webCrawlingEngine.addCrawlTarget(target);
      
      // Update local state
      setCrawlQueue(prev => new Map(prev).set(targetId, { ...target, id: targetId }));
      
      if (showToasts) {
        toast({
          title: "Crawl Target Added",
          description: `Added ${target.url} for ${target.crawlFrequency} monitoring.`,
          variant: "default",
        });
      }
      
      return targetId;
    }, 'Add Crawl Target');

    return result || '';
  }, [executeWithErrorHandling, showToasts, toast]);

  const crawlTarget = useCallback(async (targetId: string): Promise<CrawledContent | null> => {
    const result = await executeWithErrorHandling(async () => {
      const content = await webCrawlingEngine.crawlTarget(targetId);
      
      if (content && showToasts) {
        toast({
          title: "Content Crawled",
          description: `Successfully crawled "${content.title}" (${content.wordCount} words).`,
          variant: "default",
        });
      }
      
      return content;
    }, 'Crawl Target');

    return result;
  }, [executeWithErrorHandling, showToasts, toast]);

  const searchContent = useCallback(async (query: string, filters?: any): Promise<SearchResult[]> => {
    const result = await executeWithErrorHandling(async () => {
      const results = await webCrawlingEngine.searchContent(query, filters);
      
      // Track search analytics
      await trackSearchQuery(query, results.length, filters);
      
      return results;
    }, 'Search Content');

    return result || [];
  }, [executeWithErrorHandling]);

  // Business Intelligence Functions
  const generateBusinessProfile = useCallback(async (companyName: string, domain?: string): Promise<BusinessIntelligence> => {
    const result = await executeWithErrorHandling(async () => {
      const profile = await webCrawlingEngine.generateBusinessProfile(companyName, domain);
      
      // Update local state
      setBusinessProfiles(prev => new Map(prev).set(companyName, profile));
      
      if (showToasts) {
        toast({
          title: "Business Profile Generated",
          description: `Generated comprehensive profile for ${companyName} with ${Math.round(profile.nacReadiness.readinessScore * 100)}% NAC readiness.`,
          variant: "default",
        });
      }
      
      return profile;
    }, 'Generate Business Profile');

    if (!result) {
      throw new Error('Failed to generate business profile');
    }
    
    return result;
  }, [executeWithErrorHandling, showToasts, toast]);

  const getBusinessProfile = useCallback((companyName: string): BusinessIntelligence | null => {
    return businessProfiles.get(companyName) || null;
  }, [businessProfiles]);

  const updateBusinessProfile = useCallback(async (companyName: string, updates: Partial<BusinessIntelligence>): Promise<void> => {
    await executeWithErrorHandling(async () => {
      const existingProfile = businessProfiles.get(companyName);
      if (!existingProfile) {
        throw new Error(`Business profile not found: ${companyName}`);
      }

      const updatedProfile = { ...existingProfile, ...updates };
      setBusinessProfiles(prev => new Map(prev).set(companyName, updatedProfile));
      
      // Store updated profile
      await storeBusinessProfileUpdate(companyName, updatedProfile);
      
      if (showToasts) {
        toast({
          title: "Profile Updated",
          description: `Updated business profile for ${companyName}.`,
          variant: "default",
        });
      }
    }, 'Update Business Profile');
  }, [executeWithErrorHandling, businessProfiles, showToasts, toast]);

  // Wireless Configuration Functions
  const getWirelessRecommendations = useCallback(async (
    vendor: string, 
    model: string, 
    useCase: string, 
    securityLevel: string = 'standard'
  ): Promise<WirelessConfigRecommendation[]> => {
    const result = await executeWithErrorHandling(async () => {
      const recommendations = await webCrawlingEngine.getWirelessConfigRecommendations(
        vendor, 
        model, 
        useCase, 
        securityLevel as any
      );
      
      if (showToasts && recommendations.length > 0) {
        toast({
          title: "Wireless Recommendations Ready",
          description: `Found ${recommendations.length} configuration recommendations for ${vendor} ${model}.`,
          variant: "default",
        });
      }
      
      return recommendations;
    }, 'Get Wireless Recommendations');

    return result || [];
  }, [executeWithErrorHandling, showToasts, toast]);

  const addWirelessConfiguration = useCallback(async (config: any): Promise<void> => {
    await executeWithErrorHandling(async () => {
      await storeWirelessConfiguration(config);
      
      if (showToasts) {
        toast({
          title: "Configuration Added",
          description: `Added wireless configuration for ${config.vendor} ${config.product}.`,
          variant: "default",
        });
      }
    }, 'Add Wireless Configuration');
  }, [executeWithErrorHandling, showToasts, toast]);

  // Security Monitoring Functions
  const getSecurityAlerts = useCallback(async (vendors?: string[]): Promise<SecurityAlert[]> => {
    const result = await executeWithErrorHandling(async () => {
      const alerts = await webCrawlingEngine.monitorSecurityAlerts(vendors || []);
      
      const criticalAlerts = alerts.filter(alert => alert.severity === 'critical').length;
      if (showToasts && criticalAlerts > 0) {
        toast({
          title: "Critical Security Alerts",
          description: `Found ${criticalAlerts} critical security alerts requiring attention.`,
          variant: "destructive",
        });
      }
      
      return alerts;
    }, 'Get Security Alerts');

    return result || [];
  }, [executeWithErrorHandling, showToasts, toast]);

  const acknowledgeAlert = useCallback(async (alertId: string): Promise<void> => {
    await executeWithErrorHandling(async () => {
      await acknowledgeSecurityAlert(alertId);
      
      if (showToasts) {
        toast({
          title: "Alert Acknowledged",
          description: "Security alert has been acknowledged.",
          variant: "default",
        });
      }
    }, 'Acknowledge Alert');
  }, [executeWithErrorHandling, showToasts, toast]);

  // External Link Management
  const addExternalLink = useCallback(async (entityType: string, entityId: string, link: any): Promise<void> => {
    await executeWithErrorHandling(async () => {
      await storeExternalLink(entityType, entityId, link);
      
      if (showToasts) {
        toast({
          title: "External Link Added",
          description: `Added external link for ${entityType}.`,
          variant: "default",
        });
      }
    }, 'Add External Link');
  }, [executeWithErrorHandling, showToasts, toast]);

  const getExternalLinks = useCallback(async (entityType: string, entityId: string): Promise<any[]> => {
    const result = await executeWithErrorHandling(async () => {
      return await fetchExternalLinks(entityType, entityId);
    }, 'Get External Links');

    return result || [];
  }, [executeWithErrorHandling]);

  // Analytics Functions
  const getContentAnalytics = useCallback(async (): Promise<any> => {
    const result = await executeWithErrorHandling(async () => {
      return await fetchContentAnalytics();
    }, 'Get Content Analytics');

    return result || {};
  }, [executeWithErrorHandling]);

  const getSearchAnalytics = useCallback(async (timeRange: string = '7d'): Promise<any> => {
    const result = await executeWithErrorHandling(async () => {
      return await fetchSearchAnalytics(timeRange);
    }, 'Get Search Analytics');

    return result || {};
  }, [executeWithErrorHandling]);

  // Utility Functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    await executeWithErrorHandling(async () => {
      // Refresh crawl queue
      const targets = await fetchCrawlTargets();
      setCrawlQueue(new Map(targets.map(target => [target.id, target])));
      
      // Refresh business profiles
      const profiles = await fetchBusinessProfiles();
      setBusinessProfiles(new Map(profiles.map(profile => [profile.companyName, profile])));
      
      if (showToasts) {
        toast({
          title: "Data Refreshed",
          description: "Intelligence data has been refreshed.",
          variant: "default",
        });
      }
    }, 'Refresh Data');
  }, [executeWithErrorHandling, showToasts, toast]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshData]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  return {
    // Content Management
    addCrawlTarget,
    crawlTarget,
    searchContent,
    
    // Business Intelligence
    generateBusinessProfile,
    getBusinessProfile,
    updateBusinessProfile,
    
    // Wireless Configuration
    getWirelessRecommendations,
    addWirelessConfiguration,
    
    // Security Monitoring
    getSecurityAlerts,
    acknowledgeAlert,
    
    // External Links
    addExternalLink,
    getExternalLinks,
    
    // Analytics
    getContentAnalytics,
    getSearchAnalytics,
    
    // State
    isLoading,
    error,
    crawlQueue,
    businessProfiles,
    
    // Utilities
    clearError,
    refreshData,
  };
};

// Helper functions for database operations
async function trackSearchQuery(query: string, resultsCount: number, filters?: any): Promise<void> {
  // Implementation would track search analytics
  console.log(`Search: ${query}, Results: ${resultsCount}`);
}

async function storeBusinessProfileUpdate(companyName: string, profile: BusinessIntelligence): Promise<void> {
  // Implementation would store business profile updates
  console.log(`Updated profile for ${companyName}`);
}

async function storeWirelessConfiguration(config: any): Promise<void> {
  // Implementation would store wireless configuration
  console.log(`Stored wireless config for ${config.vendor}`);
}

async function acknowledgeSecurityAlert(alertId: string): Promise<void> {
  // Implementation would acknowledge security alert
  console.log(`Acknowledged alert ${alertId}`);
}

async function storeExternalLink(entityType: string, entityId: string, link: any): Promise<void> {
  // Implementation would store external link
  console.log(`Stored external link for ${entityType}:${entityId}`);
}

async function fetchExternalLinks(entityType: string, entityId: string): Promise<any[]> {
  // Implementation would fetch external links
  return [];
}

async function fetchContentAnalytics(): Promise<any> {
  // Implementation would fetch content analytics
  return {};
}

async function fetchSearchAnalytics(timeRange: string): Promise<any> {
  // Implementation would fetch search analytics
  return {};
}

async function fetchCrawlTargets(): Promise<any[]> {
  // Implementation would fetch crawl targets
  return [];
}

async function fetchBusinessProfiles(): Promise<BusinessIntelligence[]> {
  // Implementation would fetch business profiles
  return [];
}

export default useWebIntelligence;
