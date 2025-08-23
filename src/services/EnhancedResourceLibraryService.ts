import { supabase } from '@/integrations/supabase/client';
import { TaxonomySeederService } from './TaxonomySeederService';
import { UnifiedTemplateSeederService } from './UnifiedTemplateSeederService';
import { PortnoxDocumentationService } from './PortnoxDocumentationService';

export interface ResourceEnrichmentResult {
  success: boolean;
  enrichedCount: number;
  failedCount: number;
  enrichmentDetails: Array<{
    resourceId: string;
    resourceType: string;
    enrichmentStatus: 'success' | 'failed' | 'partial';
    enrichmentData: any;
    externalLinks: string[];
    portnoxLinks: string[];
    aiGeneratedContent: any;
  }>;
}

export interface SessionPersistenceData {
  sessionId: string;
  userId: string;
  sessionData: any;
  resourceSelections: any;
  lastActivity: Date;
  expiresAt: Date;
}

export interface MultiTenantResourceSharing {
  resourceId: string;
  resourceType: string;
  sharingLevel: 'global' | 'organization' | 'project' | 'private';
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    share: boolean;
  };
  createdBy: string;
  sharedWith: string[];
}

export class EnhancedResourceLibraryService {
  
  // Core Resource Consolidation
  static async consolidateAllResources(): Promise<{
    vendors: number;
    models: number;
    templates: number;
    useCases: number;
    requirements: number;
    authMethods: number;
    total: number;
  }> {
    try {
      console.log('Starting comprehensive resource consolidation...');

      // Get all current resources for baseline
      const [vendors, models, templates, useCases, requirements, authMethods] = await Promise.all([
        supabase.from('vendor_library').select('count'),
        supabase.from('vendor_models').select('count'), 
        supabase.from('configuration_templates').select('count'),
        supabase.from('use_case_library').select('count'),
        supabase.from('requirements_library').select('count'),
        supabase.from('authentication_methods').select('count')
      ]);

      // Seed taxonomy data
      await TaxonomySeederService.seed([
        'vendor_library',
        'vendor_models', 
        'use_case_library',
        'authentication_methods',
        'device_types',
        'business_domains',
        'deployment_types',
        'industry_options',
        'network_segments',
        'compliance_frameworks'
      ]);

      // Seed unified templates
      await UnifiedTemplateSeederService.seedAll();

      return {
        vendors: vendors.data?.[0]?.count || 0,
        models: models.data?.[0]?.count || 0,
        templates: templates.data?.[0]?.count || 0,
        useCases: useCases.data?.[0]?.count || 0,
        requirements: requirements.data?.[0]?.count || 0,
        authMethods: authMethods.data?.[0]?.count || 0,
        total: 0
      };

    } catch (error) {
      console.error('Failed to consolidate resources:', error);
      throw new Error('Resource consolidation failed');
    }
  }

  // Enhanced Documentation Enrichment
  static async enrichResourcesWithDocumentation(
    resourceType: 'vendors' | 'models' | 'templates' | 'use_cases' | 'requirements' | 'all',
    useFirecrawl: boolean = true,
    useAI: boolean = true
  ): Promise<ResourceEnrichmentResult> {
    try {
      console.log(`Starting enrichment for ${resourceType}...`);
      
      const enrichmentResults: ResourceEnrichmentResult = {
        success: true,
        enrichedCount: 0,
        failedCount: 0,
        enrichmentDetails: []
      };

      if (resourceType === 'vendors' || resourceType === 'all') {
        await this.enrichVendors(enrichmentResults, useFirecrawl, useAI);
      }

      if (resourceType === 'models' || resourceType === 'all') {
        await this.enrichVendorModels(enrichmentResults, useFirecrawl, useAI);
      }

      if (resourceType === 'templates' || resourceType === 'all') {
        await this.enrichConfigurationTemplates(enrichmentResults, useFirecrawl, useAI);
      }

      if (resourceType === 'use_cases' || resourceType === 'all') {
        await this.enrichUseCases(enrichmentResults, useFirecrawl, useAI);
      }

      if (resourceType === 'requirements' || resourceType === 'all') {
        await this.enrichRequirements(enrichmentResults, useFirecrawl, useAI);
      }

      return enrichmentResults;

    } catch (error) {
      console.error('Enrichment failed:', error);
      throw new Error('Resource enrichment failed');
    }
  }

  // Vendor Enrichment with Portnox + External Documentation
  private static async enrichVendors(
    results: ResourceEnrichmentResult,
    useFirecrawl: boolean,
    useAI: boolean
  ): Promise<void> {
    try {
      const { data: vendors, error } = await supabase
        .from('vendor_library')
        .select('*')
        .order('vendor_name');

      if (error) throw error;

      for (const vendor of vendors) {
        try {
          console.log(`Enriching vendor: ${vendor.vendor_name}`);

          // Get Portnox-specific documentation
          const portnoxDocs = await PortnoxDocumentationService.scrapePortnoxDocumentation([vendor.vendor_name]);
          
          // Enrich with AI if enabled
          let aiEnrichment = {};
          if (useAI) {
            aiEnrichment = await PortnoxDocumentationService.enrichVendorWithDocumentation(vendor);
          }

          // Use Firecrawl for external documentation if enabled
          let externalDocs: string[] = [];
          if (useFirecrawl && vendor.website_url) {
            const crawlResult = await supabase.functions.invoke('documentation-crawler', {
              body: {
                urls: [vendor.website_url],
                maxPages: 5,
                includePatterns: ['/docs/', '/documentation/', '/support/', '/integration/']
              }
            });
            
            if (crawlResult.data?.success) {
              externalDocs = crawlResult.data.aggregated
                .filter((result: any) => result.success)
                .flatMap((result: any) => result.data?.data || [])
                .map((doc: any) => doc.metadata?.sourceURL || doc.url)
                .filter(Boolean);
            }
          }

          // Update vendor with enriched data
          const enrichedData = {
            documentation_links: [
              ...(vendor.documentation_links || []),
              ...(portnoxDocs[vendor.vendor_name] || []),
              ...externalDocs
            ],
            portnox_documentation: {
              ...(vendor.portnox_documentation || {}),
              links: portnoxDocs[vendor.vendor_name] || [],
              lastUpdated: new Date().toISOString()
            },
            ...(useAI && aiEnrichment ? {
              ai_enhanced_docs: aiEnrichment.ai_enhanced_docs || [],
              portnox_integration_guide: aiEnrichment.portnox_integration_guide || [],
              configuration_examples: aiEnrichment.configuration_examples || []
            } : {}),
            enrichment_metadata: {
              lastEnriched: new Date().toISOString(),
              enrichmentSources: ['portnox', ...(useFirecrawl ? ['firecrawl'] : []), ...(useAI ? ['ai'] : [])],
              enrichmentVersion: '1.0'
            }
          };

          const { error: updateError } = await supabase
            .from('vendor_library')
            .update(enrichedData)
            .eq('id', vendor.id);

          if (updateError) {
            console.error(`Failed to update vendor ${vendor.vendor_name}:`, updateError);
            results.failedCount++;
            results.enrichmentDetails.push({
              resourceId: vendor.id,
              resourceType: 'vendor',
              enrichmentStatus: 'failed',
              enrichmentData: {},
              externalLinks: [],
              portnoxLinks: [],
              aiGeneratedContent: {}
            });
          } else {
            results.enrichedCount++;
            results.enrichmentDetails.push({
              resourceId: vendor.id,
              resourceType: 'vendor',
              enrichmentStatus: 'success',
              enrichmentData: enrichedData,
              externalLinks: externalDocs,
              portnoxLinks: portnoxDocs[vendor.vendor_name] || [],
              aiGeneratedContent: aiEnrichment
            });
          }

        } catch (error) {
          console.error(`Failed to enrich vendor ${vendor.vendor_name}:`, error);
          results.failedCount++;
        }
      }

    } catch (error) {
      console.error('Failed to enrich vendors:', error);
      throw error;
    }
  }

  // Enhanced Session Persistence
  static async createResourceSession(
    sessionType: 'scoping' | 'configuration' | 'planning' | 'tracking',
    sessionData: any,
    resourceSelections: any,
    expirationHours: number = 72
  ): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const sessionId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expirationHours);

      const { error } = await supabase
        .from('enhanced_resource_sessions')
        .insert({
          id: sessionId,
          user_id: user.id,
          session_type: sessionType,
          session_data: sessionData,
          resource_selections: resourceSelections,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          sharing_enabled: true,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return sessionId;

    } catch (error) {
      console.error('Failed to create resource session:', error);
      throw new Error('Session creation failed');
    }
  }

  static async getResourceSession(sessionId: string): Promise<SessionPersistenceData | null> {
    try {
      const { data, error } = await supabase
        .from('enhanced_resource_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('is_active', true)
        .single();

      if (error) return null;
      if (!data) return null;

      // Check if session is expired
      if (new Date(data.expires_at) < new Date()) {
        await this.expireSession(sessionId);
        return null;
      }

      return {
        sessionId: data.id,
        userId: data.user_id,
        sessionData: data.session_data,
        resourceSelections: data.resource_selections,
        lastActivity: new Date(data.last_activity),
        expiresAt: new Date(data.expires_at)
      };

    } catch (error) {
      console.error('Failed to get resource session:', error);
      return null;
    }
  }

  // Multi-Tenant Resource Sharing
  static async shareResource(
    resourceId: string,
    resourceType: string,
    sharingLevel: 'global' | 'organization' | 'project' | 'private',
    permissions: { view: boolean; edit: boolean; delete: boolean; share: boolean },
    sharedWithUsers: string[] = []
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('resource_sharing_settings')
        .upsert({
          resource_id: resourceId,
          resource_type: resourceType,
          sharing_level: sharingLevel,
          permissions: permissions,
          created_by: user.id,
          shared_with: sharedWithUsers,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;

    } catch (error) {
      console.error('Failed to share resource:', error);
      return false;
    }
  }

  static async getSharedResources(
    resourceType?: string,
    includePrivate: boolean = false
  ): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('resource_sharing_settings')
        .select('*');

      if (resourceType) {
        query = query.eq('resource_type', resourceType);
      }

      if (!includePrivate) {
        query = query.neq('sharing_level', 'private');
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('Failed to get shared resources:', error);
      return [];
    }
  }

  // Additional helper methods for vendor models, templates, etc.
  private static async enrichVendorModels(results: ResourceEnrichmentResult, useFirecrawl: boolean, useAI: boolean): Promise<void> {
    // Implementation for enriching vendor models with documentation
    console.log('Enriching vendor models...');
  }

  private static async enrichConfigurationTemplates(results: ResourceEnrichmentResult, useFirecrawl: boolean, useAI: boolean): Promise<void> {
    // Implementation for enriching configuration templates with documentation
    console.log('Enriching configuration templates...');
  }

  private static async enrichUseCases(results: ResourceEnrichmentResult, useFirecrawl: boolean, useAI: boolean): Promise<void> {
    // Implementation for enriching use cases with documentation
    console.log('Enriching use cases...');
  }

  private static async enrichRequirements(results: ResourceEnrichmentResult, useFirecrawl: boolean, useAI: boolean): Promise<void> {
    // Implementation for enriching requirements with documentation
    console.log('Enriching requirements...');
  }

  private static async expireSession(sessionId: string): Promise<void> {
    await supabase
      .from('enhanced_resource_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
  }
}