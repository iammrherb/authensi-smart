import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Core AI Interfaces
export interface AIContext {
  // Project Context
  projectId?: string;
  projectPhase?: 'discovery' | 'scoping' | 'design' | 'implementation' | 'testing' | 'deployment';
  
  // Organization Context
  industry?: string;
  organizationSize?: 'small' | 'medium' | 'large' | 'enterprise';
  organizationType?: 'public' | 'private' | 'non-profit' | 'government';
  locations?: string[];
  
  // Business Context
  painPoints?: string[];
  businessObjectives?: string[];
  budget?: string;
  timeline?: string;
  complianceRequirements?: string[];
  
  // Technical Context
  existingVendors?: string[];
  networkArchitecture?: string;
  deviceCount?: number;
  securityPosture?: 'basic' | 'intermediate' | 'advanced' | 'enterprise';
  
  // Stakeholder Context
  stakeholderRole?: 'sales' | 'sales_engineer' | 'customer_success' | 'implementation' | 'support';
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  
  // Historical Context
  similarProjects?: any[];
  previousRecommendations?: any[];
  userFeedback?: any[];
}

export interface AIRecommendation {
  id: string;
  type: 'vendor' | 'use_case' | 'requirement' | 'configuration' | 'timeline' | 'approach' | 'risk_mitigation';
  title: string;
  description: string;
  
  // Confidence & Quality
  confidence: number; // 0-1
  reasoning: string;
  evidence: string[];
  
  // Business Impact
  businessValue: string;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedEffort?: string;
  estimatedCost?: string;
  
  // Recommendations
  nextSteps: string[];
  alternatives?: AIRecommendation[];
  dependencies?: string[];
  risks?: string[];
  
  // Metadata
  sources: string[];
  generatedAt: Date;
  contextHash: string;
}

export interface AIResponse {
  recommendations: AIRecommendation[];
  summary: string;
  confidence: number;
  reasoning: string;
  nextSteps: string[];
  metadata: {
    processingTime: number;
    contextFactors: string[];
    modelVersion: string;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'sales' | 'scoping' | 'design' | 'implementation' | 'customer_success';
  systemPrompt: string;
  userPromptTemplate: string;
  responseFormat: ResponseFormat;
  parameters: PromptParameter[];
  version: string;
  isActive: boolean;
}

export interface ResponseFormat {
  structure: 'json' | 'markdown' | 'structured_text';
  sections: ResponseSection[];
  confidenceRequired: boolean;
  evidenceRequired: boolean;
}

export interface ResponseSection {
  name: string;
  required: boolean;
  format: 'text' | 'list' | 'table' | 'json';
  maxLength?: number;
}

export interface PromptParameter {
  name: string;
  type: 'string' | 'number' | 'array' | 'object';
  required: boolean;
  description: string;
  defaultValue?: any;
}

class EnhancedAIService {
  private promptTemplates: Map<string, PromptTemplate> = new Map();
  private contextCorrelations: Map<string, any> = new Map();
  
  constructor() {
    this.initializePromptTemplates();
    this.loadContextCorrelations();
  }

  /**
   * Generate intelligent recommendations based on context
   */
  async generateRecommendations(
    requestType: string,
    context: AIContext,
    customPrompt?: string
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Enrich context with correlations
      const enrichedContext = await this.enrichContext(context);
      
      // Select appropriate prompt template
      const template = this.selectPromptTemplate(requestType, context);
      
      // Build contextual prompt
      const prompt = customPrompt || this.buildContextualPrompt(template, enrichedContext);
      
      // Generate AI response
      const aiResponse = await this.callAIService(template.systemPrompt, prompt);
      
      // Parse and structure response
      const structuredResponse = await this.parseAIResponse(aiResponse, template.responseFormat);
      
      // Calculate confidence and add metadata
      const finalResponse = await this.enhanceResponse(structuredResponse, enrichedContext, startTime);
      
      // Store for learning
      await this.storeInteraction(requestType, context, finalResponse);
      
      return finalResponse;
      
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
  }

  /**
   * Generate vendor recommendations with deep context correlation
   */
  async generateVendorRecommendations(context: AIContext): Promise<AIResponse> {
    const vendorContext = {
      ...context,
      correlatedUseCases: await this.getCorrelatedUseCases(context),
      correlatedRequirements: await this.getCorrelatedRequirements(context),
      industryBenchmarks: await this.getIndustryBenchmarks(context.industry),
      competitorAnalysis: await this.getCompetitorAnalysis(context)
    };

    return this.generateRecommendations('vendor_selection', vendorContext);
  }

  /**
   * Generate use case recommendations based on pain points and context
   */
  async generateUseCaseRecommendations(context: AIContext): Promise<AIResponse> {
    const useCaseContext = {
      ...context,
      correlatedVendors: await this.getCorrelatedVendors(context),
      industryUseCases: await this.getIndustryUseCases(context.industry),
      painPointMappings: await this.getPainPointMappings(context.painPoints),
      successPatterns: await this.getSuccessPatterns(context)
    };

    return this.generateRecommendations('use_case_selection', useCaseContext);
  }

  /**
   * Generate scoping recommendations for sales engineers
   */
  async generateScopingRecommendations(context: AIContext): Promise<AIResponse> {
    const scopingContext = {
      ...context,
      projectComplexityFactors: await this.analyzeProjectComplexity(context),
      resourceRequirements: await this.estimateResourceRequirements(context),
      timelineFactors: await this.analyzeTimelineFactors(context),
      riskFactors: await this.identifyRiskFactors(context)
    };

    return this.generateRecommendations('project_scoping', scopingContext);
  }

  /**
   * Generate implementation recommendations
   */
  async generateImplementationRecommendations(context: AIContext): Promise<AIResponse> {
    const implementationContext = {
      ...context,
      deploymentPatterns: await this.getDeploymentPatterns(context),
      configurationTemplates: await this.getConfigurationTemplates(context),
      testingStrategies: await this.getTestingStrategies(context),
      rolloutPlans: await this.getRolloutPlans(context)
    };

    return this.generateRecommendations('implementation_planning', implementationContext);
  }

  /**
   * Enrich context with correlations and historical data
   */
  private async enrichContext(context: AIContext): Promise<AIContext> {
    const enriched = { ...context };

    // Add industry-specific context
    if (context.industry) {
      enriched.industryInsights = await this.getIndustryInsights(context.industry);
      enriched.complianceContext = await this.getComplianceContext(context.industry);
    }

    // Add organizational context
    if (context.organizationSize && context.organizationType) {
      enriched.organizationalPatterns = await this.getOrganizationalPatterns(
        context.organizationSize,
        context.organizationType
      );
    }

    // Add historical context
    if (context.projectId) {
      enriched.projectHistory = await this.getProjectHistory(context.projectId);
      enriched.stakeholderFeedback = await this.getStakeholderFeedback(context.projectId);
    }

    // Add correlation context
    enriched.correlations = await this.getContextCorrelations(context);

    return enriched;
  }

  /**
   * Build contextual prompt from template and enriched context
   */
  private buildContextualPrompt(template: PromptTemplate, context: AIContext): string {
    let prompt = template.userPromptTemplate;

    // Replace template variables with context values
    const variables = this.extractTemplateVariables(template.userPromptTemplate);
    
    for (const variable of variables) {
      const value = this.getContextValue(context, variable);
      prompt = prompt.replace(`{{${variable}}}`, value || 'Not specified');
    }

    // Add dynamic context sections
    prompt += this.buildDynamicContextSections(context);

    return prompt;
  }

  /**
   * Parse AI response according to specified format
   */
  private async parseAIResponse(aiResponse: string, format: ResponseFormat): Promise<any> {
    try {
      if (format.structure === 'json') {
        return JSON.parse(aiResponse);
      } else if (format.structure === 'structured_text') {
        return this.parseStructuredText(aiResponse, format.sections);
      } else {
        return { content: aiResponse };
      }
    } catch (error) {
      // Fallback to text parsing if JSON parsing fails
      return this.parseAsStructuredText(aiResponse, format);
    }
  }

  /**
   * Enhance response with confidence scoring and metadata
   */
  private async enhanceResponse(
    response: any,
    context: AIContext,
    startTime: number
  ): Promise<AIResponse> {
    const processingTime = Date.now() - startTime;
    
    // Calculate confidence based on context completeness and correlation strength
    const confidence = this.calculateConfidence(response, context);
    
    // Extract and enhance recommendations
    const recommendations = await this.enhanceRecommendations(response.recommendations || [], context);
    
    return {
      recommendations,
      summary: response.summary || 'AI analysis completed',
      confidence,
      reasoning: response.reasoning || 'Based on provided context and industry best practices',
      nextSteps: response.nextSteps || [],
      metadata: {
        processingTime,
        contextFactors: this.getContextFactors(context),
        modelVersion: '1.0.0'
      }
    };
  }

  /**
   * Calculate confidence score based on various factors
   */
  private calculateConfidence(response: any, context: AIContext): number {
    let confidence = 0.5; // Base confidence
    
    // Context completeness factor (0-0.3)
    const contextCompleteness = this.calculateContextCompleteness(context);
    confidence += contextCompleteness * 0.3;
    
    // Response quality factor (0-0.2)
    const responseQuality = this.calculateResponseQuality(response);
    confidence += responseQuality * 0.2;
    
    // Historical accuracy factor (0-0.3)
    const historicalAccuracy = 0.8; // Would be calculated from past interactions
    confidence += historicalAccuracy * 0.3;
    
    // Correlation strength factor (0-0.2)
    const correlationStrength = this.calculateCorrelationStrength(context);
    confidence += correlationStrength * 0.2;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Enhance individual recommendations with additional context
   */
  private async enhanceRecommendations(
    recommendations: any[],
    context: AIContext
  ): Promise<AIRecommendation[]> {
    return Promise.all(recommendations.map(async (rec, index) => ({
      id: `rec_${Date.now()}_${index}`,
      type: rec.type || 'general',
      title: rec.title || 'Recommendation',
      description: rec.description || '',
      confidence: rec.confidence || this.calculateRecommendationConfidence(rec, context),
      reasoning: rec.reasoning || 'Based on context analysis',
      evidence: rec.evidence || [],
      businessValue: rec.businessValue || await this.calculateBusinessValue(rec, context),
      implementationComplexity: rec.implementationComplexity || 'medium',
      estimatedEffort: rec.estimatedEffort,
      estimatedCost: rec.estimatedCost,
      nextSteps: rec.nextSteps || [],
      alternatives: rec.alternatives || [],
      dependencies: rec.dependencies || [],
      risks: rec.risks || [],
      sources: rec.sources || ['AI Analysis'],
      generatedAt: new Date(),
      contextHash: this.generateContextHash(context)
    })));
  }

  /**
   * Initialize prompt templates for different use cases
   */
  private initializePromptTemplates(): void {
    // Sales-focused templates
    this.promptTemplates.set('vendor_selection', {
      id: 'vendor_selection',
      name: 'Vendor Selection Recommendations',
      category: 'sales',
      systemPrompt: `You are an expert NAC (Network Access Control) consultant with deep knowledge of vendor capabilities, industry requirements, and implementation best practices. You provide specific, actionable vendor recommendations with clear business justification and confidence levels.

Key principles:
- Always provide confidence levels (0-1) with clear reasoning
- Consider total cost of ownership, not just licensing
- Factor in integration complexity and organizational readiness
- Highlight potential risks and mitigation strategies
- Provide specific next steps for evaluation`,
      userPromptTemplate: `Analyze the following context and provide vendor recommendations:

Organization Context:
- Industry: {{industry}}
- Size: {{organizationSize}}
- Type: {{organizationType}}
- Locations: {{locations}}

Business Requirements:
- Pain Points: {{painPoints}}
- Objectives: {{businessObjectives}}
- Budget: {{budget}}
- Timeline: {{timeline}}
- Compliance: {{complianceRequirements}}

Technical Context:
- Existing Vendors: {{existingVendors}}
- Network Architecture: {{networkArchitecture}}
- Device Count: {{deviceCount}}
- Security Posture: {{securityPosture}}

Provide recommendations in the following format:
1. Primary vendor recommendations (top 3) with confidence scores
2. Business justification for each recommendation
3. Integration considerations and complexity assessment
4. Total cost of ownership estimates
5. Implementation timeline estimates
6. Risk factors and mitigation strategies
7. Specific next steps for evaluation`,
      responseFormat: {
        structure: 'json',
        sections: [
          { name: 'recommendations', required: true, format: 'json' },
          { name: 'summary', required: true, format: 'text' },
          { name: 'nextSteps', required: true, format: 'list' }
        ],
        confidenceRequired: true,
        evidenceRequired: true
      },
      parameters: [],
      version: '1.0',
      isActive: true
    });

    // Scoping-focused templates
    this.promptTemplates.set('project_scoping', {
      id: 'project_scoping',
      name: 'Project Scoping Recommendations',
      category: 'scoping',
      systemPrompt: `You are an expert NAC project scoping specialist who helps sales engineers and technical consultants create comprehensive, accurate project scopes. You consider all technical, business, and organizational factors to provide realistic estimates and identify potential challenges early.

Key principles:
- Provide realistic timelines based on organizational complexity
- Identify hidden requirements and potential scope creep
- Consider change management and user adoption challenges
- Factor in testing, training, and documentation requirements
- Highlight critical success factors and risk mitigation strategies`,
      userPromptTemplate: `Analyze the following project context and provide comprehensive scoping recommendations:

{{contextSections}}

Provide detailed scoping analysis including:
1. Project complexity assessment with confidence level
2. Recommended project phases and timeline
3. Resource requirements (internal and external)
4. Hidden requirements and potential scope additions
5. Risk factors and mitigation strategies
6. Success criteria and key milestones
7. Change management considerations`,
      responseFormat: {
        structure: 'json',
        sections: [
          { name: 'complexityAssessment', required: true, format: 'json' },
          { name: 'timeline', required: true, format: 'json' },
          { name: 'resources', required: true, format: 'json' },
          { name: 'risks', required: true, format: 'list' },
          { name: 'successFactors', required: true, format: 'list' }
        ],
        confidenceRequired: true,
        evidenceRequired: true
      },
      parameters: [],
      version: '1.0',
      isActive: true
    });

    // Add more templates for other use cases...
  }

  /**
   * Select appropriate prompt template based on request type and context
   */
  private selectPromptTemplate(requestType: string, context: AIContext): PromptTemplate {
    const template = this.promptTemplates.get(requestType);
    if (!template) {
      throw new Error(`No prompt template found for request type: ${requestType}`);
    }
    return template;
  }

  /**
   * Call the actual AI service (OpenAI, etc.)
   */
  private async callAIService(systemPrompt: string, userPrompt: string): Promise<string> {
    // This would integrate with your existing AI service
    // For now, using a placeholder that would call OpenAI API
    const response = await fetch('/api/ai/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        maxTokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error('AI service request failed');
    }

    const data = await response.json();
    return data.content;
  }

  /**
   * Store interaction for learning and improvement
   */
  private async storeInteraction(
    requestType: string,
    context: AIContext,
    response: AIResponse
  ): Promise<void> {
    try {
      await supabase.from('ai_interactions').insert([{
        request_type: requestType,
        context: context,
        response: response,
        confidence: response.confidence,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.warn('Failed to store AI interaction:', error);
    }
  }

  // Utility methods for context correlation and analysis
  private async getCorrelatedUseCases(context: AIContext): Promise<any[]> {
    // Implementation would query use case correlations
    return [];
  }

  private async getCorrelatedVendors(context: AIContext): Promise<any[]> {
    // Implementation would query vendor correlations
    return [];
  }

  private async getCorrelatedRequirements(context: AIContext): Promise<any[]> {
    // Implementation would query requirement correlations
    return [];
  }

  private async getIndustryBenchmarks(industry?: string): Promise<any> {
    // Implementation would fetch industry benchmarks
    return {};
  }

  private async getCompetitorAnalysis(context: AIContext): Promise<any> {
    // Implementation would analyze competitive landscape
    return {};
  }

  private calculateContextCompleteness(context: AIContext): number {
    const requiredFields = ['industry', 'organizationSize', 'painPoints', 'businessObjectives'];
    const completedFields = requiredFields.filter(field => context[field as keyof AIContext]);
    return completedFields.length / requiredFields.length;
  }

  private calculateResponseQuality(response: any): number {
    // Analyze response structure, completeness, specificity
    return 0.8; // Placeholder
  }

  private calculateCorrelationStrength(context: AIContext): number {
    // Calculate how well context elements correlate with known patterns
    return 0.7; // Placeholder
  }

  private calculateRecommendationConfidence(rec: any, context: AIContext): number {
    // Calculate confidence for individual recommendation
    return 0.8; // Placeholder
  }

  private async calculateBusinessValue(rec: any, context: AIContext): Promise<string> {
    // Calculate and format business value proposition
    return 'High business value expected'; // Placeholder
  }

  private generateContextHash(context: AIContext): string {
    return btoa(JSON.stringify(context)).substring(0, 16);
  }

  private getContextFactors(context: AIContext): string[] {
    const factors = [];
    if (context.industry) factors.push(`Industry: ${context.industry}`);
    if (context.organizationSize) factors.push(`Size: ${context.organizationSize}`);
    if (context.painPoints?.length) factors.push(`Pain Points: ${context.painPoints.length}`);
    return factors;
  }

  private extractTemplateVariables(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g) || [];
    return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
  }

  private getContextValue(context: AIContext, variable: string): string {
    const value = context[variable as keyof AIContext];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value || '');
  }

  private buildDynamicContextSections(context: AIContext): string {
    let sections = '\n\nAdditional Context:\n';
    
    if (context.correlations) {
      sections += `- Correlated patterns identified\n`;
    }
    
    if (context.industryInsights) {
      sections += `- Industry-specific insights available\n`;
    }
    
    return sections;
  }

  private parseStructuredText(text: string, sections: ResponseSection[]): any {
    // Parse structured text response based on section definitions
    const result: any = {};
    
    for (const section of sections) {
      const regex = new RegExp(`${section.name}:([\\s\\S]*?)(?=\\n\\w+:|$)`, 'i');
      const match = text.match(regex);
      
      if (match) {
        result[section.name] = match[1].trim();
      }
    }
    
    return result;
  }

  private parseAsStructuredText(text: string, format: ResponseFormat): any {
    // Fallback parsing when JSON parsing fails
    return {
      content: text,
      confidence: 0.7,
      reasoning: 'Parsed as structured text due to format issues'
    };
  }

  private async loadContextCorrelations(): Promise<void> {
    // Load pre-computed correlations between different context elements
    // This would be populated from historical data and expert knowledge
  }

  private async getContextCorrelations(context: AIContext): Promise<any> {
    // Get relevant correlations for the current context
    return {};
  }

  // Additional helper methods would be implemented here...
  private async getIndustryInsights(industry: string): Promise<any> { return {}; }
  private async getComplianceContext(industry: string): Promise<any> { return {}; }
  private async getOrganizationalPatterns(size: string, type: string): Promise<any> { return {}; }
  private async getProjectHistory(projectId: string): Promise<any> { return {}; }
  private async getStakeholderFeedback(projectId: string): Promise<any> { return {}; }
  private async getIndustryUseCases(industry?: string): Promise<any[]> { return []; }
  private async getPainPointMappings(painPoints?: string[]): Promise<any> { return {}; }
  private async getSuccessPatterns(context: AIContext): Promise<any> { return {}; }
  private async analyzeProjectComplexity(context: AIContext): Promise<any> { return {}; }
  private async estimateResourceRequirements(context: AIContext): Promise<any> { return {}; }
  private async analyzeTimelineFactors(context: AIContext): Promise<any> { return {}; }
  private async identifyRiskFactors(context: AIContext): Promise<any> { return {}; }
  private async getDeploymentPatterns(context: AIContext): Promise<any> { return {}; }
  private async getConfigurationTemplates(context: AIContext): Promise<any> { return {}; }
  private async getTestingStrategies(context: AIContext): Promise<any> { return {}; }
  private async getRolloutPlans(context: AIContext): Promise<any> { return {}; }
}

export const enhancedAIService = new EnhancedAIService();
export default EnhancedAIService;
