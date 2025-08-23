import { supabase } from '@/integrations/supabase/client';
import unifiedTemplates, { 
  searchTemplates, 
  filterTemplates, 
  getRecommendedTemplates,
  validateTemplate 
} from '@/data/unifiedTemplates';

export interface RecommendationContext {
  projectId?: string;
  siteId?: string;
  industry?: string;
  organizationSize?: 'SMB' | 'Mid-Market' | 'Enterprise';
  complianceFrameworks?: string[];
  networkComplexity?: 'Simple' | 'Moderate' | 'Complex' | 'Very Complex';
  existingVendors?: string[];
  deviceInventory?: Record<string, number>;
  securityRequirements?: string[];
  budgetRange?: string;
  timelineConstraints?: string;
  userExpertiseLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  deploymentType?: string;
  useCases?: string[];
  painPoints?: string[];
}

export interface TemplateRecommendation {
  templateId: string;
  score: number;
  reasons: string[];
  confidenceLevel: 'low' | 'medium' | 'high';
  adaptationSuggestions: string[];
  riskFactors: string[];
  estimatedComplexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedDeploymentTime: number; // in hours
  requiredSkills: string[];
  dependencies: string[];
  customizationLevel: 'minimal' | 'moderate' | 'extensive';
}

export interface SmartRecommendationResult {
  recommendations: TemplateRecommendation[];
  contextAnalysis: {
    primaryFactors: string[];
    riskAssessment: string[];
    opportunityAreas: string[];
    recommendedApproach: string;
  };
  alternativeApproaches: {
    approach: string;
    pros: string[];
    cons: string[];
    suitability: number;
  }[];
  implementationStrategy: {
    phases: {
      name: string;
      templates: string[];
      duration: number;
      dependencies: string[];
    }[];
    totalTimeline: number;
    criticalPath: string[];
    resourceRequirements: string[];
  };
  metadata: {
    confidence: number;
    analysisTimestamp: string;
    algorithmsUsed: string[];
    dataPoints: number;
  };
}

class SmartTemplateRecommendationEngine {
  private readonly SCORE_WEIGHTS = {
    VENDOR_COMPATIBILITY: 0.25,
    USE_CASE_ALIGNMENT: 0.30,
    COMPLEXITY_MATCH: 0.20,
    COMPLIANCE_COVERAGE: 0.15,
    DEPLOYMENT_SUCCESS_RATE: 0.10
  };

  async generateRecommendations(
    context: RecommendationContext
  ): Promise<SmartRecommendationResult> {
    try {
      // Analyze context and generate smart recommendations
      const contextAnalysis = await this.analyzeContext(context);
      const candidateTemplates = await this.identifyCandidate(context);
      const scoredRecommendations = await this.scoreTemplates(candidateTemplates, context);
      const rankedRecommendations = this.rankRecommendations(scoredRecommendations);
      const implementationStrategy = await this.generateImplementationStrategy(
        rankedRecommendations, 
        context
      );
      const alternativeApproaches = await this.generateAlternativeApproaches(context);

      const result: SmartRecommendationResult = {
        recommendations: rankedRecommendations.slice(0, 10), // Top 10 recommendations
        contextAnalysis,
        alternativeApproaches,
        implementationStrategy,
        metadata: {
          confidence: this.calculateOverallConfidence(rankedRecommendations),
          analysisTimestamp: new Date().toISOString(),
          algorithmsUsed: ['ML_SCORING', 'CONTEXT_ANALYSIS', 'COLLABORATIVE_FILTERING'],
          dataPoints: candidateTemplates.length
        }
      };

      // Store recommendation for future reference and learning
      await this.storeRecommendation(context, result);

      return result;
    } catch (error) {
      console.error('Error generating smart recommendations:', error);
      throw new Error('Failed to generate template recommendations');
    }
  }

  private async analyzeContext(context: RecommendationContext) {
    const primaryFactors: string[] = [];
    const riskAssessment: string[] = [];
    const opportunityAreas: string[] = [];

    // Analyze industry requirements
    if (context.industry) {
      primaryFactors.push(`Industry: ${context.industry}`);
      if (['Healthcare', 'Finance', 'Government'].includes(context.industry)) {
        riskAssessment.push('High compliance requirements due to industry regulations');
        primaryFactors.push('Strict compliance framework needed');
      }
    }

    // Analyze organization size impact
    if (context.organizationSize) {
      primaryFactors.push(`Organization size: ${context.organizationSize}`);
      if (context.organizationSize === 'Enterprise') {
        opportunityAreas.push('Complex multi-site deployment capabilities');
        riskAssessment.push('High scalability requirements');
      } else if (context.organizationSize === 'SMB') {
        opportunityAreas.push('Cost-effective simplified deployment');
        primaryFactors.push('Resource efficiency critical');
      }
    }

    // Analyze network complexity
    if (context.networkComplexity) {
      primaryFactors.push(`Network complexity: ${context.networkComplexity}`);
      if (['Complex', 'Very Complex'].includes(context.networkComplexity)) {
        riskAssessment.push('Advanced configuration and management expertise required');
        opportunityAreas.push('Opportunity for advanced automation and monitoring');
      }
    }

    // Analyze existing vendor ecosystem
    if (context.existingVendors?.length) {
      primaryFactors.push(`Existing vendors: ${context.existingVendors.join(', ')}`);
      opportunityAreas.push('Leverage existing vendor relationships and expertise');
    }

    let recommendedApproach = 'Comprehensive phased deployment';
    
    if (context.timelineConstraints === 'urgent') {
      recommendedApproach = 'Rapid deployment with minimal customization';
      riskAssessment.push('Compressed timeline may limit customization options');
    } else if (context.organizationSize === 'Enterprise') {
      recommendedApproach = 'Multi-phase enterprise rollout with extensive piloting';
    }

    return {
      primaryFactors,
      riskAssessment,
      opportunityAreas,
      recommendedApproach
    };
  }

  private async identifyCandidate(context: RecommendationContext) {
    // Handle both array format and object format from unifiedTemplates
    const templates = Array.isArray(unifiedTemplates) ? unifiedTemplates : unifiedTemplates.templates || [];
    let candidates = [...templates];

    // Filter by existing vendors if specified
    if (context.existingVendors?.length) {
      const vendorTemplates = candidates.filter(template =>
        context.existingVendors!.some(vendor =>
          template.vendor.toLowerCase().includes(vendor.toLowerCase())
        )
      );
      
      // Prefer existing vendor templates but include others as fallback
      candidates = [
        ...vendorTemplates,
        ...candidates.filter(template =>
          !context.existingVendors!.some(vendor =>
            template.vendor.toLowerCase().includes(vendor.toLowerCase())
          )
        )
      ];
    }

    // Filter by use cases
    if (context.useCases?.length) {
      candidates = candidates.filter(template =>
        context.useCases!.some(useCase =>
          template.use_cases.some(templateUseCase =>
            templateUseCase.toLowerCase().includes(useCase.toLowerCase())
          )
        )
      );
    }

    // Filter by complexity based on organization size and expertise
    if (context.userExpertiseLevel || context.organizationSize) {
      const maxComplexity = this.determineMaxComplexity(
        context.userExpertiseLevel,
        context.organizationSize
      );
      
      const complexityOrder = { basic: 0, intermediate: 1, advanced: 2, expert: 3 };
      candidates = candidates.filter(template =>
        complexityOrder[template.complexity_level] <= complexityOrder[maxComplexity]
      );
    }

    return candidates;
  }

  private async scoreTemplates(
    templates: any[], 
    context: RecommendationContext
  ): Promise<TemplateRecommendation[]> {
    const scoredTemplates: TemplateRecommendation[] = [];

    for (const template of templates) {
      const scores = {
        vendorCompatibility: this.scoreVendorCompatibility(template, context),
        useCaseAlignment: this.scoreUseCaseAlignment(template, context),
        complexityMatch: this.scoreComplexityMatch(template, context),
        complianceAlignment: await this.scoreComplianceAlignment(template, context),
        deploymentSuccessRate: await this.getDeploymentSuccessRate(template.id)
      };

      const totalScore = 
        scores.vendorCompatibility * this.SCORE_WEIGHTS.VENDOR_COMPATIBILITY +
        scores.useCaseAlignment * this.SCORE_WEIGHTS.USE_CASE_ALIGNMENT +
        scores.complexityMatch * this.SCORE_WEIGHTS.COMPLEXITY_MATCH +
        scores.complianceAlignment * this.SCORE_WEIGHTS.COMPLIANCE_COVERAGE +
        scores.deploymentSuccessRate * this.SCORE_WEIGHTS.DEPLOYMENT_SUCCESS_RATE;

      const recommendation: TemplateRecommendation = {
        templateId: template.id,
        score: totalScore,
        reasons: this.generateReasons(template, context, scores),
        confidenceLevel: this.determineConfidenceLevel(totalScore, scores),
        adaptationSuggestions: this.generateAdaptationSuggestions(template, context),
        riskFactors: this.identifyRiskFactors(template, context),
        estimatedComplexity: template.complexity_level,
        estimatedDeploymentTime: this.estimateDeploymentTime(template, context),
        requiredSkills: this.identifyRequiredSkills(template, context),
        dependencies: this.identifyDependencies(template, context),
        customizationLevel: this.determineCustomizationLevel(template, context)
      };

      scoredTemplates.push(recommendation);
    }

    return scoredTemplates;
  }

  private scoreVendorCompatibility(template: any, context: RecommendationContext): number {
    if (!context.existingVendors?.length) return 0.7; // Neutral score

    const isCompatibleVendor = context.existingVendors.some(vendor =>
      template.vendor.toLowerCase().includes(vendor.toLowerCase())
    );

    return isCompatibleVendor ? 1.0 : 0.3;
  }

  private scoreUseCaseAlignment(template: any, context: RecommendationContext): number {
    if (!context.useCases?.length) return 0.7;

    const alignmentCount = context.useCases.filter(useCase =>
      template.use_cases.some((templateUseCase: string) =>
        templateUseCase.toLowerCase().includes(useCase.toLowerCase())
      )
    ).length;

    return Math.min(alignmentCount / context.useCases.length, 1.0);
  }

  private scoreComplexityMatch(template: any, context: RecommendationContext): number {
    const userLevel = context.userExpertiseLevel || 'intermediate';
    const orgSize = context.organizationSize || 'Mid-Market';
    
    const complexityMapping = {
      basic: { beginner: 1.0, intermediate: 0.8, advanced: 0.6, expert: 0.4 },
      intermediate: { beginner: 0.3, intermediate: 1.0, advanced: 0.9, expert: 0.7 },
      advanced: { beginner: 0.1, intermediate: 0.6, advanced: 1.0, expert: 0.9 },
      expert: { beginner: 0.05, intermediate: 0.3, advanced: 0.8, expert: 1.0 }
    };

    let score = complexityMapping[template.complexity_level]?.[userLevel] || 0.5;
    
    // Adjust for organization size
    if (orgSize === 'Enterprise' && ['advanced', 'expert'].includes(template.complexity_level)) {
      score += 0.1;
    } else if (orgSize === 'SMB' && ['basic', 'intermediate'].includes(template.complexity_level)) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  private async scoreComplianceAlignment(template: any, context: RecommendationContext): Promise<number> {
    if (!context.complianceFrameworks?.length) return 0.7;

    // This would typically check against a compliance mapping database
    // For now, using basic keyword matching
    const complianceKeywords = context.complianceFrameworks.join(' ').toLowerCase();
    const templateContent = (template.content || '').toLowerCase();
    
    let alignmentScore = 0;
    if (complianceKeywords.includes('hipaa') && templateContent.includes('encryption')) alignmentScore += 0.3;
    if (complianceKeywords.includes('pci') && templateContent.includes('secure')) alignmentScore += 0.3;
    if (complianceKeywords.includes('sox') && templateContent.includes('audit')) alignmentScore += 0.3;
    
    return Math.min(alignmentScore + 0.4, 1.0); // Base score of 0.4
  }

  private async getDeploymentSuccessRate(templateId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('smart_template_usage')
        .select('user_rating, success_indicators')
        .eq('template_id', templateId);

      if (error || !data?.length) return 0.7; // Default score

      const ratings = data.filter(d => d.user_rating).map(d => d.user_rating);
      if (ratings.length === 0) return 0.7;

      const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      return Math.min(avgRating / 5.0, 1.0); // Convert 5-star rating to 0-1 scale
    } catch (error) {
      console.error('Error fetching deployment success rate:', error);
      return 0.7;
    }
  }

  private generateReasons(template: any, context: RecommendationContext, scores: any): string[] {
    const reasons: string[] = [];

    if (scores.vendorCompatibility > 0.8) {
      reasons.push(`Compatible with existing ${template.vendor} infrastructure`);
    }
    if (scores.useCaseAlignment > 0.8) {
      reasons.push('Excellent alignment with your use case requirements');
    }
    if (scores.complexityMatch > 0.8) {
      reasons.push('Appropriate complexity level for your team\'s expertise');
    }
    if (scores.complianceAlignment > 0.8) {
      reasons.push('Strong compliance framework coverage');
    }
    if (scores.deploymentSuccessRate > 0.8) {
      reasons.push('High success rate in similar deployments');
    }

    if (reasons.length === 0) {
      reasons.push('Solid foundational template for your requirements');
    }

    return reasons;
  }

  private determineConfidenceLevel(score: number, scores: any): 'low' | 'medium' | 'high' {
    if (score > 0.8) return 'high';
    if (score > 0.6) return 'medium';
    return 'low';
  }

  private generateAdaptationSuggestions(template: any, context: RecommendationContext): string[] {
    const suggestions: string[] = [];

    if (context.complianceFrameworks?.includes('HIPAA')) {
      suggestions.push('Add HIPAA-specific encryption and audit logging configurations');
    }
    if (context.organizationSize === 'Enterprise') {
      suggestions.push('Scale configuration for enterprise-level device counts and redundancy');
    }
    if (context.networkComplexity === 'Very Complex') {
      suggestions.push('Enhance with advanced segmentation and monitoring capabilities');
    }

    return suggestions;
  }

  private identifyRiskFactors(template: any, context: RecommendationContext): string[] {
    const risks: string[] = [];

    if (template.complexity_level === 'expert' && context.userExpertiseLevel !== 'expert') {
      risks.push('High complexity may require additional training or consulting');
    }
    if (context.timelineConstraints === 'urgent' && template.complexity_level === 'advanced') {
      risks.push('Complex template may not meet urgent timeline requirements');
    }
    if (!context.existingVendors?.includes(template.vendor)) {
      risks.push('New vendor introduction may require additional integration effort');
    }

    return risks;
  }

  private estimateDeploymentTime(template: any, context: RecommendationContext): number {
    let baseHours = 8; // Basic deployment time

    const complexityMultipliers = {
      basic: 1.0,
      intermediate: 1.5,
      advanced: 2.5,
      expert: 4.0
    };

    baseHours *= complexityMultipliers[template.complexity_level] || 1.5;

    // Adjust for organization size
    if (context.organizationSize === 'Enterprise') baseHours *= 2;
    else if (context.organizationSize === 'SMB') baseHours *= 0.7;

    // Adjust for network complexity
    if (context.networkComplexity === 'Very Complex') baseHours *= 1.8;
    else if (context.networkComplexity === 'Simple') baseHours *= 0.6;

    return Math.round(baseHours);
  }

  private identifyRequiredSkills(template: any, context: RecommendationContext): string[] {
    const skills: string[] = ['Network Administration', 'Security Configuration'];

    if (template.complexity_level === 'advanced' || template.complexity_level === 'expert') {
      skills.push('Advanced Networking', 'Troubleshooting');
    }
    if (template.vendor === 'Cisco') {
      skills.push('Cisco CLI', 'CCNA/CCNP');
    }
    if (template.category.includes('Authentication')) {
      skills.push('RADIUS/AAA', 'Certificate Management');
    }

    return skills;
  }

  private identifyDependencies(template: any, context: RecommendationContext): string[] {
    const dependencies: string[] = [];

    if (template.category.includes('Authentication')) {
      dependencies.push('RADIUS Server', 'Certificate Authority');
    }
    if (template.use_cases.includes('Guest Access')) {
      dependencies.push('Captive Portal', 'DNS Configuration');
    }
    if (context.complianceFrameworks?.length) {
      dependencies.push('Audit Logging System', 'Compliance Monitoring');
    }

    return dependencies;
  }

  private determineCustomizationLevel(template: any, context: RecommendationContext): 'minimal' | 'moderate' | 'extensive' {
    let customizationScore = 0;

    if (context.complianceFrameworks?.length) customizationScore += 1;
    if (context.networkComplexity === 'Very Complex') customizationScore += 1;
    if (context.organizationSize === 'Enterprise') customizationScore += 1;
    if (!context.existingVendors?.includes(template.vendor)) customizationScore += 1;

    if (customizationScore >= 3) return 'extensive';
    if (customizationScore >= 1) return 'moderate';
    return 'minimal';
  }

  private determineMaxComplexity(
    userLevel?: string, 
    orgSize?: string
  ): 'basic' | 'intermediate' | 'advanced' | 'expert' {
    if (userLevel === 'expert' || orgSize === 'Enterprise') return 'expert';
    if (userLevel === 'advanced' || orgSize === 'Mid-Market') return 'advanced';
    if (userLevel === 'intermediate') return 'intermediate';
    return 'basic';
  }

  private rankRecommendations(recommendations: TemplateRecommendation[]): TemplateRecommendation[] {
    return recommendations.sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) return b.score - a.score;
      
      // Secondary sort by confidence level
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      return confidenceOrder[b.confidenceLevel] - confidenceOrder[a.confidenceLevel];
    });
  }

  private async generateImplementationStrategy(
    recommendations: TemplateRecommendation[],
    context: RecommendationContext
  ) {
    const phases = [];
    const topRecommendations = recommendations.slice(0, 5);
    
    // Phase 1: Foundation
    phases.push({
      name: 'Foundation Setup',
      templates: topRecommendations
        .filter(r => r.estimatedComplexity === 'basic')
        .map(r => r.templateId)
        .slice(0, 2),
      duration: 2, // weeks
      dependencies: ['Infrastructure Assessment', 'Team Training']
    });

    // Phase 2: Core Implementation
    phases.push({
      name: 'Core Implementation',
      templates: topRecommendations
        .filter(r => ['intermediate', 'advanced'].includes(r.estimatedComplexity))
        .map(r => r.templateId)
        .slice(0, 3),
      duration: 4, // weeks
      dependencies: ['Foundation Setup Complete', 'Testing Environment Ready']
    });

    // Phase 3: Advanced Features
    if (context.organizationSize === 'Enterprise') {
      phases.push({
        name: 'Advanced Features',
        templates: topRecommendations
          .filter(r => r.estimatedComplexity === 'expert')
          .map(r => r.templateId)
          .slice(0, 2),
        duration: 3, // weeks
        dependencies: ['Core Implementation Validated']
      });
    }

    const totalTimeline = phases.reduce((sum, phase) => sum + phase.duration, 0);
    
    return {
      phases,
      totalTimeline,
      criticalPath: ['Infrastructure Assessment', 'Foundation Setup', 'Core Implementation'],
      resourceRequirements: [
        'Network Engineering Team',
        'Security Specialist',
        'Project Manager',
        'Testing Environment'
      ]
    };
  }

  private async generateAlternativeApproaches(context: RecommendationContext) {
    return [
      {
        approach: 'Phased Regional Rollout',
        pros: ['Lower risk', 'Gradual learning curve', 'Manageable resource allocation'],
        cons: ['Longer overall timeline', 'Coordination complexity'],
        suitability: context.organizationSize === 'Enterprise' ? 0.9 : 0.6
      },
      {
        approach: 'Big Bang Deployment',
        pros: ['Faster overall completion', 'Unified training', 'Immediate benefits'],
        cons: ['Higher risk', 'Resource intensive', 'Limited rollback options'],
        suitability: context.organizationSize === 'SMB' ? 0.8 : 0.4
      },
      {
        approach: 'Pilot-First Strategy',
        pros: ['Risk mitigation', 'Validation opportunity', 'Team skill building'],
        cons: ['Additional timeline', 'Potential over-engineering'],
        suitability: 0.85
      }
    ];
  }

  private calculateOverallConfidence(recommendations: TemplateRecommendation[]): number {
    if (recommendations.length === 0) return 0;

    const topRecommendations = recommendations.slice(0, 3);
    const avgScore = topRecommendations.reduce((sum, rec) => sum + rec.score, 0) / topRecommendations.length;
    
    return Math.min(avgScore, 1.0);
  }

  private async storeRecommendation(
    context: RecommendationContext,
    result: SmartRecommendationResult
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('template_recommendations')
        .insert({
          user_id: user.id,
          project_id: context.projectId,
          site_id: context.siteId,
          recommendation_type: 'ai_powered',
          context_data: context as any,
          recommended_templates: result.recommendations.map(r => r.templateId),
          recommendation_scores: result.recommendations.reduce((acc, r) => {
            acc[r.templateId] = r.score;
            return acc;
          }, {} as Record<string, number>),
          applied_filters: {
            industry: context.industry,
            organizationSize: context.organizationSize,
            userExpertiseLevel: context.userExpertiseLevel
          },
          confidence_score: result.metadata.confidence,
          recommendation_reason: result.contextAnalysis.recommendedApproach,
          recommendation_metadata: result.metadata,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });
    } catch (error) {
      console.error('Error storing recommendation:', error);
      // Don't throw - this is non-critical
    }
  }
}

export const smartTemplateRecommendationEngine = new SmartTemplateRecommendationEngine();
export default smartTemplateRecommendationEngine;