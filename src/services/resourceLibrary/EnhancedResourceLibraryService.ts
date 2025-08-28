import { supabase } from '@/integrations/supabase/client';

export interface ResourceTag {
  id: string;
  name: string;
  category: string;
  color: string;
  description?: string;
  usage_count: number;
  created_at: string;
  created_by: string;
}

export interface ResourceLabel {
  id: string;
  name: string;
  type: 'classification' | 'priority' | 'status' | 'custom';
  value: string;
  description?: string;
  applies_to: string[]; // Array of resource types this label can apply to
  created_at: string;
}

export interface ExternalResourceLink {
  id: string;
  resource_type: string; // 'vendor', 'use_case', 'requirement', 'pain_point'
  resource_id: string;
  link_title: string;
  link_url: string;
  link_type: 'documentation' | 'kb_article' | 'troubleshooting' | 'configuration' | 'best_practices' | 'vendor_guide' | 'community' | 'api_docs';
  description?: string;
  relevance_score: number; // 1-10
  is_verified: boolean;
  is_active: boolean;
  last_checked_at?: string;
  metadata: any; // JSONB for additional link metadata
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ResourceRelationship {
  id: string;
  source_resource_id: string;
  source_resource_type: string;
  source_resource_name?: string;
  target_resource_id: string;
  target_resource_type: string;
  target_resource_name?: string;
  relationship_type: string;
  description?: string;
  metadata?: any;
}

export interface EnhancedResourceItem {
  id: string;
  type: 'vendor' | 'use_case' | 'requirement' | 'pain_point' | 'test_case' | 'project_template';
  name: string;
  description: string;
  category?: string;
  subcategory?: string;
  
  // Enhanced metadata
  tags: ResourceTag[];
  labels: ResourceLabel[];
  external_links: ExternalResourceLink[];
  
  // Relationships
  relationships: ResourceRelationship[];
  
  // Classification and organization
  industry_relevance: string[];
  compliance_frameworks: string[];
  deployment_phases: string[];
  complexity_level: 'low' | 'medium' | 'high';
  maturity_level: 'experimental' | 'beta' | 'stable' | 'deprecated';
  
  // Quality and validation
  validation_status: 'pending' | 'validated' | 'needs_review' | 'deprecated';
  quality_score: number; // 1-10
  usage_statistics: {
    selection_count: number;
    project_usage_count: number;
    last_used: string;
    success_rate: number;
  };
  
  // Audit and versioning
  version: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  last_modified_by: string;
}

export interface ResourceSearchFilters {
  types?: string[];
  tags?: string[];
  labels?: string[];
  categories?: string[];
  industries?: string[];
  complexity_levels?: string[];
  maturity_levels?: string[];
  validation_status?: string[];
  has_external_links?: boolean;
  quality_score_min?: number;
  usage_count_min?: number;
  text_search?: string;
}

export interface ResourceBulkOperation {
  operation: 'add_tag' | 'remove_tag' | 'add_label' | 'remove_label' | 'update_category' | 'update_status' | 'add_link' | 'remove_link';
  resource_ids: string[];
  data: any;
}

class EnhancedResourceLibraryService {
  
  // =========================================================================
  // RESOURCE MANAGEMENT
  // =========================================================================
  
  /**
   * Get enhanced resource with all related data
   */
  async getEnhancedResource(type: string, id: string): Promise<EnhancedResourceItem | null> {
    try {
      // Get base resource data
      const { data: resource, error: resourceError } = await supabase
        .from(`${type}_library`)
        .select('*')
        .eq('id', id)
        .single();

      if (resourceError || !resource) {
        console.error(`Error fetching ${type} resource:`, resourceError);
        return null;
      }

      // Get tags
      const { data: tags = [] } = await supabase
        .from('resource_tags_mapping')
        .select(`
          resource_tags (
            id, name, category, color, description, usage_count, created_at, created_by
          )
        `)
        .eq('resource_type', type)
        .eq('resource_id', id);

      // Get labels
      const { data: labels = [] } = await supabase
        .from('resource_labels_mapping')
        .select(`
          resource_labels (
            id, name, type, value, description, applies_to, created_at
          )
        `)
        .eq('resource_type', type)
        .eq('resource_id', id);

      // Get external links
      const { data: externalLinks = [] } = await supabase
        .from('external_resource_links')
        .select('*')
        .eq('resource_type', type)
        .eq('resource_id', id)
        .eq('is_active', true);

      // Get related resources with names
      const { data: relationships = [] } = await supabase
        .from('resource_relationships')
        .select('*')
        .or(`source_resource_id.eq.${id},target_resource_id.eq.${id}`);

      // Enrich relationships with resource names
      const enrichedRelationships = await this.enrichRelationshipsWithNames(relationships, id);

      // Get usage statistics
      const { data: usageStats } = await supabase
        .from('resource_usage_statistics')
        .select('*')
        .eq('resource_type', type)
        .eq('resource_id', id)
        .single();

      // Construct enhanced resource
      const enhancedResource: EnhancedResourceItem = {
        id: resource.id,
        type: type as any,
        name: resource.name,
        description: resource.description || '',
        category: resource.category,
        subcategory: resource.subcategory,
        tags: tags.map((t: any) => t.resource_tags).filter(Boolean),
        labels: labels.map((l: any) => l.resource_labels).filter(Boolean),
        external_links: externalLinks,
        relationships: enrichedRelationships,
        industry_relevance: resource.industry_relevance || [],
        compliance_frameworks: resource.compliance_frameworks || [],
        deployment_phases: resource.deployment_phases || [],
        complexity_level: resource.complexity_level || 'medium',
        maturity_level: resource.maturity_level || 'stable',
        validation_status: resource.validation_status || 'pending',
        quality_score: resource.quality_score || 5,
        usage_statistics: usageStats || {
          selection_count: 0,
          project_usage_count: 0,
          last_used: new Date().toISOString(),
          success_rate: 0
        },
        version: resource.version || '1.0',
        created_at: resource.created_at,
        updated_at: resource.updated_at,
        created_by: resource.created_by,
        last_modified_by: resource.last_modified_by || resource.created_by
      };

      return enhancedResource;
    } catch (error) {
      console.error('Error getting enhanced resource:', error);
      return null;
    }
  }

  /**
   * Search resources with advanced filtering
   */
  async searchResources(filters: ResourceSearchFilters): Promise<EnhancedResourceItem[]> {
    try {
      const results: EnhancedResourceItem[] = [];
      const resourceTypes = filters.types || ['vendor', 'use_case', 'requirement', 'pain_point', 'test_case'];

      for (const type of resourceTypes) {
        let query = supabase.from(`${type}_library`).select('*');

        // Apply filters
        if (filters.categories?.length) {
          query = query.in('category', filters.categories);
        }

        if (filters.complexity_levels?.length) {
          query = query.in('complexity_level', filters.complexity_levels);
        }

        if (filters.maturity_levels?.length) {
          query = query.in('maturity_level', filters.maturity_levels);
        }

        if (filters.validation_status?.length) {
          query = query.in('validation_status', filters.validation_status);
        }

        if (filters.quality_score_min) {
          query = query.gte('quality_score', filters.quality_score_min);
        }

        if (filters.text_search) {
          query = query.or(`name.ilike.%${filters.text_search}%,description.ilike.%${filters.text_search}%`);
        }

        const { data: resources = [] } = await query.limit(100);

        // Get enhanced data for each resource
        for (const resource of resources) {
          const enhanced = await this.getEnhancedResource(type, resource.id);
          if (enhanced) {
            // Apply additional filters that require enhanced data
            let includeResource = true;

            if (filters.tags?.length) {
              const resourceTagNames = enhanced.tags.map(t => t.name);
              includeResource = filters.tags.some(tag => resourceTagNames.includes(tag));
            }

            if (filters.labels?.length && includeResource) {
              const resourceLabelNames = enhanced.labels.map(l => l.name);
              includeResource = filters.labels.some(label => resourceLabelNames.includes(label));
            }

            if (filters.has_external_links !== undefined && includeResource) {
              const hasLinks = enhanced.external_links.length > 0;
              includeResource = filters.has_external_links === hasLinks;
            }

            if (filters.usage_count_min && includeResource) {
              includeResource = enhanced.usage_statistics.selection_count >= filters.usage_count_min;
            }

            if (includeResource) {
              results.push(enhanced);
            }
          }
        }
      }

      // Sort by relevance/quality
      return results.sort((a, b) => {
        const scoreA = a.quality_score + (a.usage_statistics.selection_count / 100);
        const scoreB = b.quality_score + (b.usage_statistics.selection_count / 100);
        return scoreB - scoreA;
      });

    } catch (error) {
      console.error('Error searching resources:', error);
      return [];
    }
  }

  // =========================================================================
  // TAG MANAGEMENT
  // =========================================================================

  /**
   * Get all available tags with usage statistics
   */
  async getAllTags(): Promise<ResourceTag[]> {
    const { data, error } = await supabase
      .from('resource_tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data as ResourceTag[];
  }

  /**
   * Create new tag
   */
  async createTag(tag: Omit<ResourceTag, 'id' | 'usage_count' | 'created_at' | 'created_by'>): Promise<ResourceTag> {
    const { data: user } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('resource_tags')
      .insert({
        ...tag,
        usage_count: 0,
        created_by: user.user?.id || 'system'
      })
      .select()
      .single();

    if (error) throw error;
    return data as ResourceTag;
  }

  /**
   * Add tag to resource
   */
  async addTagToResource(resourceType: string, resourceId: string, tagId: string): Promise<void> {
    // Check if mapping already exists
    const { data: existing } = await supabase
      .from('resource_tags_mapping')
      .select('id')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .eq('tag_id', tagId)
      .single();

    if (existing) {
      return; // Already exists
    }

    // Create mapping
    const { error: mappingError } = await supabase
      .from('resource_tags_mapping')
      .insert({
        resource_type: resourceType,
        resource_id: resourceId,
        tag_id: tagId
      });

    if (mappingError) throw mappingError;

    // Update tag usage count
    const { error: updateError } = await supabase.rpc('increment_tag_usage', { tag_id: tagId });
    if (updateError) console.error('Error updating tag usage:', updateError);
  }

  /**
   * Remove tag from resource
   */
  async removeTagFromResource(resourceType: string, resourceId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('resource_tags_mapping')
      .delete()
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .eq('tag_id', tagId);

    if (error) throw error;

    // Decrement tag usage count
    const { error: updateError } = await supabase.rpc('decrement_tag_usage', { tag_id: tagId });
    if (updateError) console.error('Error updating tag usage:', updateError);
  }

  // =========================================================================
  // RELATIONSHIP MANAGEMENT
  // =========================================================================

  /**
   * Create a new relationship between two resources
   */
  async createRelationship(relationshipData: Omit<ResourceRelationship, 'id'>): Promise<ResourceRelationship> {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('resource_relationships')
      .insert({
        ...relationshipData,
        created_by: user.user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating relationship:', error);
      throw error;
    }
    return data as ResourceRelationship;
  }

  /**
   * Delete a relationship between two resources
   */
  async deleteRelationship(relationshipId: string): Promise<void> {
    const { error } = await supabase
      .from('resource_relationships')
      .delete()
      .eq('id', relationshipId);

    if (error) {
      console.error('Error deleting relationship:', error);
      throw error;
    }
  }

  // =========================================================================
  // LABEL MANAGEMENT
  // =========================================================================

  /**
   * Get all available labels
   */
  async getAllLabels(): Promise<ResourceLabel[]> {
    const { data, error } = await supabase
      .from('resource_labels')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as ResourceLabel[];
  }

  /**
   * Create new label
   */
  async createLabel(label: Omit<ResourceLabel, 'id' | 'created_at'>): Promise<ResourceLabel> {
    const { data, error } = await supabase
      .from('resource_labels')
      .insert(label)
      .select()
      .single();

    if (error) throw error;
    return data as ResourceLabel;
  }

  /**
   * Add label to resource
   */
  async addLabelToResource(resourceType: string, resourceId: string, labelId: string): Promise<void> {
    const { error } = await supabase
      .from('resource_labels_mapping')
      .insert({
        resource_type: resourceType,
        resource_id: resourceId,
        label_id: labelId
      });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error;
    }
  }

  // =========================================================================
  // EXTERNAL LINK MANAGEMENT
  // =========================================================================

  /**
   * Add external link to resource
   */
  async addExternalLink(link: Omit<ExternalResourceLink, 'id' | 'created_at' | 'updated_at'>): Promise<ExternalResourceLink> {
    const { data, error } = await supabase
      .from('external_resource_links')
      .insert({
        ...link,
        is_verified: false,
        is_active: true,
        last_checked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as ExternalResourceLink;
  }

  /**
   * Update external link
   */
  async updateExternalLink(linkId: string, updates: Partial<ExternalResourceLink>): Promise<ExternalResourceLink> {
    const { data, error } = await supabase
      .from('external_resource_links')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', linkId)
      .select()
      .single();

    if (error) throw error;
    return data as ExternalResourceLink;
  }

  /**
   * Verify external link (check if URL is accessible)
   */
  async verifyExternalLink(linkId: string): Promise<boolean> {
    try {
      const { data: link } = await supabase
        .from('external_resource_links')
        .select('link_url')
        .eq('id', linkId)
        .single();

      if (!link) return false;

      // Simple URL accessibility check (in production, this would be done server-side)
      const response = await fetch(link.link_url, { method: 'HEAD', mode: 'no-cors' });
      const isAccessible = response.ok;

      // Update verification status
      await this.updateExternalLink(linkId, {
        is_verified: isAccessible,
        last_checked_at: new Date().toISOString()
      });

      return isAccessible;
    } catch (error) {
      console.error('Error verifying link:', error);
      
      // Mark as unverified
      await this.updateExternalLink(linkId, {
        is_verified: false,
        last_checked_at: new Date().toISOString()
      });
      
      return false;
    }
  }

  // =========================================================================
  // BULK OPERATIONS
  // =========================================================================

  /**
   * Perform bulk operation on multiple resources
   */
  async performBulkOperation(operation: ResourceBulkOperation): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const resourceId of operation.resource_ids) {
      try {
        switch (operation.operation) {
          case 'add_tag':
            await this.addTagToResource(operation.data.resourceType, resourceId, operation.data.tagId);
            break;
          case 'remove_tag':
            await this.removeTagFromResource(operation.data.resourceType, resourceId, operation.data.tagId);
            break;
          case 'add_label':
            await this.addLabelToResource(operation.data.resourceType, resourceId, operation.data.labelId);
            break;
          case 'add_link':
            await this.addExternalLink({
              resource_type: operation.data.resourceType,
              resource_id: resourceId,
              ...operation.data.linkData
            });
            break;
          default:
            throw new Error(`Unknown operation: ${operation.operation}`);
        }
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Resource ${resourceId}: ${error.message}`);
      }
    }

    return results;
  }

  // =========================================================================
  // ANALYTICS AND INSIGHTS
  // =========================================================================

  /**
   * Get resource library analytics
   */
  async getResourceAnalytics(): Promise<{
    totalResources: number;
    resourcesByType: Record<string, number>;
    topTags: ResourceTag[];
    mostUsedResources: any[];
    qualityDistribution: Record<string, number>;
    linkCoverage: { total: number; withLinks: number; percentage: number };
  }> {
    try {
      // Get total counts by type
      const resourceTypes = ['vendor', 'use_case', 'requirement', 'pain_point', 'test_case'];
      const resourcesByType: Record<string, number> = {};
      let totalResources = 0;

      for (const type of resourceTypes) {
        const { count } = await supabase
          .from(`${type}_library`)
          .select('*', { count: 'exact', head: true });
        resourcesByType[type] = count || 0;
        totalResources += count || 0;
      }

      // Get top tags
      const { data: topTags = [] } = await supabase
        .from('resource_tags')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(10);

      // Get most used resources
      const { data: mostUsedResources = [] } = await supabase
        .from('resource_usage_statistics')
        .select('*')
        .order('selection_count', { ascending: false })
        .limit(10);

      // Get quality distribution
      const qualityDistribution: Record<string, number> = {};
      // This would need to be implemented with proper aggregation queries

      // Get link coverage
      const { data: linksData } = await supabase
        .from('external_resource_links')
        .select('resource_type, resource_id')
        .eq('is_active', true);

      const uniqueResourcesWithLinks = new Set(
        (linksData || []).map(link => `${link.resource_type}:${link.resource_id}`)
      ).size;

      const linkCoverage = {
        total: totalResources,
        withLinks: uniqueResourcesWithLinks,
        percentage: totalResources > 0 ? (uniqueResourcesWithLinks / totalResources) * 100 : 0
      };

      return {
        totalResources,
        resourcesByType,
        topTags,
        mostUsedResources,
        qualityDistribution,
        linkCoverage
      };
    } catch (error) {
      console.error('Error getting resource analytics:', error);
      throw error;
    }
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  /**
   * Enrich relationships with resource names for better UI display
   */
  private async enrichRelationshipsWithNames(relationships: any[], currentResourceId: string): Promise<ResourceRelationship[]> {
    const enriched: ResourceRelationship[] = [];
    
    for (const rel of relationships) {
      const enrichedRel: ResourceRelationship = { ...rel };
      
      // Get source resource name if we don't already have it
      if (rel.source_resource_type && rel.source_resource_id) {
        const { data: sourceResource } = await supabase
          .from(`${rel.source_resource_type}_library`)
          .select('name')
          .eq('id', rel.source_resource_id)
          .single();
        
        if (sourceResource) {
          enrichedRel.source_resource_name = sourceResource.name;
        }
      }
      
      // Get target resource name if we don't already have it
      if (rel.target_resource_type && rel.target_resource_id) {
        const { data: targetResource } = await supabase
          .from(`${rel.target_resource_type}_library`)
          .select('name')
          .eq('id', rel.target_resource_id)
          .single();
        
        if (targetResource) {
          enrichedRel.target_resource_name = targetResource.name;
        }
      }
      
      enriched.push(enrichedRel);
    }
    
    return enriched;
  }

  private async processRelationships(relationships: any[], currentResourceId: string): Promise<EnhancedResourceItem['related_resources']> {
    const processed = [];
    
    for (const rel of relationships) {
      const isSource = rel.source_resource_id === currentResourceId;
      const relatedId = isSource ? rel.target_resource_id : rel.source_resource_id;
      const relatedType = isSource ? rel.target_resource_type : rel.source_resource_type;

      if (!relatedType || !relatedId) continue;

      // Get related resource name
      const { data: relatedResource } = await supabase
        .from(`${relatedType}_library`)
        .select('name')
        .eq('id', relatedId)
        .single();

      if (relatedResource) {
        processed.push({
          type: relatedType,
          id: relatedId,
          name: relatedResource.name,
          relationship_type: rel.relationship_type,
          strength: rel.strength || 5
        });
      }
    }

    return processed;
  }

  /**
   * Update resource usage statistics
   */
  async updateResourceUsage(resourceType: string, resourceId: string, action: 'select' | 'project_add' | 'success' | 'failure'): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_resource_usage', {
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_action: action
      });

      if (error) {
        console.error('Error updating resource usage:', error);
      }
    } catch (error) {
      console.error('Error updating resource usage:', error);
    }
  }

  /**
   * Get resource recommendations based on current selection
   */
  async getResourceRecommendations(
    currentResources: { type: string; id: string }[],
    context: { industry?: string; useCase?: string; complexity?: string } = {}
  ): Promise<EnhancedResourceItem[]> {
    try {
      // This would implement AI-driven recommendations based on:
      // - Current resource selection
      // - Historical usage patterns
      // - Resource relationships
      // - Context (industry, use case, etc.)
      
      // For now, return a simple implementation
      const recommendations: EnhancedResourceItem[] = [];
      
      // Get related resources based on relationships
      for (const resource of currentResources) {
        const { data: relationships } = await supabase
          .from('resource_relationships')
          .select('*')
          .eq('source_resource_type', resource.type)
          .eq('source_resource_id', resource.id)
          .eq('relationship_type', 'enhances')
          .order('strength', { ascending: false })
          .limit(3);

        if (relationships) {
          for (const rel of relationships) {
            const enhanced = await this.getEnhancedResource(rel.target_resource_type, rel.target_resource_id);
            if (enhanced) {
              recommendations.push(enhanced);
            }
          }
        }
      }

      return recommendations.slice(0, 10); // Limit to top 10 recommendations
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}

export const enhancedResourceLibraryService = new EnhancedResourceLibraryService();
export default EnhancedResourceLibraryService;
