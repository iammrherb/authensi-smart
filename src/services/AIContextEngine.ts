import { supabase } from '@/integrations/supabase/client';

export interface ConversationMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  aiModel?: string;
  contextData?: Record<string, any>;
}

export interface ContextPattern {
  id?: string;
  patternType: string;
  patternData: Record<string, any>;
  frequencyCount: number;
  confidenceScore: number;
  contextTags: string[];
}

export interface UserPreferences {
  communicationStyle: Record<string, any>;
  technicalExpertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredVendors: string[];
  preferredMethodologies: string[];
  domainExpertise: Record<string, any>;
  learningPreferences: Record<string, any>;
  contextRetentionDays: number;
  autoContextBuilding: boolean;
}

export interface AIContextSession {
  id?: string;
  sessionToken: string;
  sessionType: string;
  projectContext: Record<string, any>;
  accumulatedContext: Record<string, any>;
  contextSummary?: string;
  isActive: boolean;
  expiresAt: Date;
}

export class AIContextEngine {
  private static instance: AIContextEngine;
  private currentSessionToken: string | null = null;

  static getInstance(): AIContextEngine {
    if (!AIContextEngine.instance) {
      AIContextEngine.instance = new AIContextEngine();
    }
    return AIContextEngine.instance;
  }

  // Session Management
  async createContextSession(
    sessionType: string = 'conversation',
    expirationHours: number = 24
  ): Promise<string> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    const { data, error } = await supabase
      .from('ai_context_sessions')
      .insert({
        session_token: sessionToken,
        session_type: sessionType,
        expires_at: expiresAt.toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;

    this.currentSessionToken = sessionToken;
    return sessionToken;
  }

  async getContextSession(sessionToken: string): Promise<AIContextSession | null> {
    const { data, error } = await supabase
      .from('ai_context_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      sessionToken: data.session_token,
      sessionType: data.session_type,
      projectContext: data.project_context || {},
      accumulatedContext: data.accumulated_context || {},
      contextSummary: data.context_summary,
      isActive: data.is_active,
      expiresAt: new Date(data.expires_at)
    };
  }

  async updateSessionContext(
    sessionToken: string,
    contextUpdate: Partial<Record<string, any>>
  ): Promise<void> {
    const session = await this.getContextSession(sessionToken);
    if (!session) throw new Error('Session not found');

    const updatedContext = {
      ...session.accumulatedContext,
      ...contextUpdate,
      lastUpdated: new Date().toISOString()
    };

    await supabase
      .from('ai_context_sessions')
      .update({
        accumulated_context: updatedContext,
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken);
  }

  // Conversation History
  async saveConversationMessage(
    message: ConversationMessage,
    sessionId: string,
    conversationType: string = 'general',
    projectId?: string,
    siteId?: string
  ): Promise<void> {
    await supabase
      .from('ai_conversation_history')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        session_id: sessionId,
        conversation_type: conversationType,
        project_id: projectId,
        site_id: siteId,
        message_role: message.role,
        message_content: message.content,
        message_metadata: message.metadata || {},
        ai_model_used: message.aiModel,
        context_data: message.contextData || {}
      });
  }

  async getConversationHistory(
    sessionId?: string,
    conversationType?: string,
    limit: number = 50
  ): Promise<ConversationMessage[]> {
    let query = supabase
      .from('ai_conversation_history')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (conversationType) {
      query = query.eq('conversation_type', conversationType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      role: item.message_role as 'user' | 'assistant' | 'system',
      content: item.message_content,
      metadata: item.message_metadata,
      aiModel: item.ai_model_used,
      contextData: item.context_data
    }));
  }

  // Pattern Recognition and Learning
  async recordPattern(
    patternType: string,
    patternData: Record<string, any>,
    contextTags: string[] = []
  ): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    // Check if pattern already exists
    const { data: existing } = await supabase
      .from('ai_context_patterns')
      .select('*')
      .eq('user_id', userId)
      .eq('pattern_type', patternType)
      .single();

    if (existing) {
      // Update existing pattern
      await supabase
        .from('ai_context_patterns')
        .update({
          frequency_count: existing.frequency_count + 1,
          confidence_score: Math.min(existing.confidence_score + 0.1, 1.0),
          last_seen: new Date().toISOString(),
          pattern_data: { ...existing.pattern_data, ...patternData },
          context_tags: [...new Set([...existing.context_tags, ...contextTags])]
        })
        .eq('id', existing.id);
    } else {
      // Create new pattern
      await supabase
        .from('ai_context_patterns')
        .insert({
          user_id: userId,
          pattern_type: patternType,
          pattern_data: patternData,
          context_tags: contextTags,
          frequency_count: 1,
          confidence_score: 0.5
        });
    }
  }

  async getUserPatterns(patternType?: string): Promise<ContextPattern[]> {
    let query = supabase
      .from('ai_context_patterns')
      .select('*')
      .order('confidence_score', { ascending: false });

    if (patternType) {
      query = query.eq('pattern_type', patternType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      patternType: item.pattern_type,
      patternData: item.pattern_data,
      frequencyCount: item.frequency_count,
      confidenceScore: item.confidence_score,
      contextTags: item.context_tags
    }));
  }

  // User Preferences
  async getUserPreferences(): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('ai_user_preferences')
      .select('*')
      .single();

    if (error || !data) return null;

    return {
      communicationStyle: data.communication_style || {},
      technicalExpertiseLevel: data.technical_expertise_level || 'intermediate',
      preferredVendors: data.preferred_vendors || [],
      preferredMethodologies: data.preferred_methodologies || [],
      domainExpertise: data.domain_expertise || {},
      learningPreferences: data.learning_preferences || {},
      contextRetentionDays: data.context_retention_days || 90,
      autoContextBuilding: data.auto_context_building || true
    };
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    await supabase
      .from('ai_user_preferences')
      .upsert({
        user_id: userId,
        communication_style: preferences.communicationStyle,
        technical_expertise_level: preferences.technicalExpertiseLevel,
        preferred_vendors: preferences.preferredVendors,
        preferred_methodologies: preferences.preferredMethodologies,
        domain_expertise: preferences.domainExpertise,
        learning_preferences: preferences.learningPreferences,
        context_retention_days: preferences.contextRetentionDays,
        auto_context_building: preferences.autoContextBuilding
      });
  }

  // Context Building
  async buildContextForProject(projectId: string): Promise<Record<string, any>> {
    // Get project details, sites, requirements, etc.
    const context: Record<string, any> = {
      projectId,
      timestamp: new Date().toISOString()
    };

    // Get project data
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (project) {
      context.project = {
        name: project.name,
        description: project.description,
        status: project.status,
        currentPhase: project.current_phase,
        businessContext: project.business_context,
        successCriteria: project.success_criteria,
        painPoints: project.pain_points
      };
    }

    // Get associated sites
    const { data: sites } = await supabase
      .from('sites')
      .select('*')
      .eq('project_id', projectId);

    if (sites) {
      context.sites = sites.map(site => ({
        id: site.id,
        name: site.name,
        location: site.location,
        siteType: site.site_type,
        deviceCount: site.device_count
      }));
    }

    // Get user patterns related to this type of project
    const patterns = await this.getUserPatterns('project_context');
    context.userPatterns = patterns;

    return context;
  }

  async getIntelligentRecommendations(
    currentContext: Record<string, any>
  ): Promise<string[]> {
    const patterns = await this.getUserPatterns();
    const preferences = await this.getUserPreferences();

    const recommendations: string[] = [];

    // Analyze patterns and preferences to generate recommendations
    patterns.forEach(pattern => {
      if (pattern.confidenceScore > 0.7) {
        switch (pattern.patternType) {
          case 'vendor_preference':
            recommendations.push(`Consider ${pattern.patternData.vendor} based on your previous successful implementations`);
            break;
          case 'configuration_pattern':
            recommendations.push(`Apply ${pattern.patternData.configType} configuration pattern that worked well before`);
            break;
          case 'timeline_pattern':
            recommendations.push(`Based on similar projects, allocate ${pattern.patternData.timeEstimate} for this phase`);
            break;
        }
      }
    });

    return recommendations;
  }

  private generateSessionToken(): string {
    return `ai_ctx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Context Cleanup
  async cleanupExpiredSessions(): Promise<void> {
    await supabase
      .from('ai_context_sessions')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString());
  }

  async cleanupOldConversations(retentionDays: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    await supabase
      .from('ai_conversation_history')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
  }
}

export const aiContextEngine = AIContextEngine.getInstance();