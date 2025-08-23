import { supabase } from '@/integrations/supabase/client';
import smartTemplateRecommendationEngine, { RecommendationContext } from './SmartTemplateRecommendationEngine';

export interface EnhancedScopingContext {
  sessionId: string;
  projectId?: string;
  siteId?: string;
  organizationProfile: {
    name: string;
    industry: string;
    size: 'SMB' | 'Mid-Market' | 'Enterprise';
    locations: number;
    totalUsers: number;
    budget: string;
    timeline: string;
    complianceNeeds: string[];
    existingSolutions: string[];
    painPoints: string[];
  };
  networkInfrastructure: {
    topology: string;
    complexity: string;
    existingVendors: string[];
    deviceInventory: Record<string, number>;
    securityRequirements: string[];
    integrationPoints: string[];
  };
  businessRequirements: {
    useCases: string[];
    criticalFeatures: string[];
    performanceTargets: string[];
    scalabilityNeeds: string[];
    maintenancePreferences: string[];
  };
  stakeholders: {
    decisionMakers: any[];
    technicalContacts: any[];
    endUsers: any[];
    vendors: any[];
  };
  constraints: {
    budgetLimitations: string[];
    timeConstraints: string[];
    technicalConstraints: string[];
    politicalConstraints: string[];
    complianceConstraints: string[];
  };
}

export interface ScopingAnalysisResult {
  contextAnalysis: {
    primaryDrivers: string[];
    riskFactors: string[];
    successFactors: string[];
    complexityAssessment: {
      technical: number;
      organizational: number;
      timeline: number;
      budget: number;
      overall: number;
    };
  };
  recommendedApproach: {
    strategy: string;
    phases: {
      name: string;
      duration: number;
      objectives: string[];
      deliverables: string[];
      resources: string[];
      risks: string[];
    }[];
    criticalPath: string[];
    alternativeOptions: string[];
  };
  templateRecommendations: {
    primary: any[];
    alternative: any[];
    customization: {
      level: 'minimal' | 'moderate' | 'extensive';
      areas: string[];
      effort: number;
    };
  };
  resourceRequirements: {
    personnel: {
      role: string;
      skillLevel: string;
      allocation: number;
      duration: number;
    }[];
    infrastructure: {
      component: string;
      quantity: number;
      specifications: string[];
      cost: number;
    }[];
    external: {
      service: string;
      provider: string;
      cost: number;
      duration: number;
    }[];
  };
  timeline: {
    totalDuration: number;
    phases: {
      name: string;
      startWeek: number;
      endWeek: number;
      dependencies: string[];
      milestones: string[];
    }[];
    criticalMilestones: {
      name: string;
      week: number;
      importance: 'critical' | 'high' | 'medium';
      impact: string;
    }[];
  };
  budgetAnalysis: {
    totalEstimate: number;
    breakdown: {
      category: string;
      amount: number;
      confidence: number;
      notes: string[];
    }[];
    contingency: number;
    riskFactors: string[];
  };
  riskAssessment: {
    risks: {
      category: string;
      description: string;
      probability: number;
      impact: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      mitigation: string[];
    }[];
    overallRiskLevel: number;
    keyMitigations: string[];
  };
  successCriteria: {
    technical: string[];
    business: string[];
    operational: string[];
    strategic: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    contingency: string[];
  };
}

export class EnhancedScopingOrchestrator {
  private readonly COMPLEXITY_WEIGHTS = {
    TECHNICAL: 0.35,
    ORGANIZATIONAL: 0.25,
    TIMELINE: 0.20,
    BUDGET: 0.20
  };

  async analyzeScopingContext(context: EnhancedScopingContext): Promise<ScopingAnalysisResult> {
    try {
      console.log('Starting comprehensive scoping analysis...');
      
      // Parallel analysis for efficiency
      const [
        contextAnalysis,
        templateRecommendations,
        resourceRequirements,
        timeline,
        budgetAnalysis,
        riskAssessment
      ] = await Promise.all([
        this.performContextAnalysis(context),
        this.generateTemplateRecommendations(context),
        this.calculateResourceRequirements(context),
        this.buildProjectTimeline(context),
        this.performBudgetAnalysis(context),
        this.assessProjectRisks(context)
      ]);

      const recommendedApproach = await this.determineRecommendedApproach(
        context, 
        contextAnalysis, 
        riskAssessment
      );

      const successCriteria = this.defineSuccessCriteria(context, contextAnalysis);
      const recommendations = this.generateActionRecommendations(
        context, 
        contextAnalysis, 
        riskAssessment
      );

      const result: ScopingAnalysisResult = {
        contextAnalysis,
        recommendedApproach,
        templateRecommendations,
        resourceRequirements,
        timeline,
        budgetAnalysis,
        riskAssessment,
        successCriteria,
        recommendations
      };

      // Store the analysis for future reference
      await this.storeAnalysisResult(context.sessionId, result);

      return result;
    } catch (error) {
      console.error('Error in scoping analysis:', error);
      throw new Error('Failed to complete scoping analysis');
    }
  }

  private async performContextAnalysis(context: EnhancedScopingContext) {
    const primaryDrivers: string[] = [];
    const riskFactors: string[] = [];
    const successFactors: string[] = [];

    // Analyze primary business drivers
    if (context.organizationProfile.painPoints.length > 3) {
      primaryDrivers.push('Multiple operational pain points driving urgency');
    }
    if (context.organizationProfile.complianceNeeds.length > 0) {
      primaryDrivers.push('Regulatory compliance requirements');
      successFactors.push('Strong compliance framework implementation');
    }
    if (context.organizationProfile.size === 'Enterprise') {
      primaryDrivers.push('Enterprise-scale deployment requirements');
      riskFactors.push('Complex stakeholder management across large organization');
    }

    // Analyze network complexity impact
    if (context.networkInfrastructure.complexity === 'Very Complex') {
      riskFactors.push('High network complexity may extend implementation timeline');
      successFactors.push('Experienced technical team essential for complex infrastructure');
    }
    
    // Analyze vendor ecosystem
    if (context.networkInfrastructure.existingVendors.length > 3) {
      riskFactors.push('Multi-vendor environment increases integration complexity');
      successFactors.push('Leverage existing vendor relationships and expertise');
    }

    // Calculate complexity scores
    const complexityAssessment = {
      technical: this.calculateTechnicalComplexity(context),
      organizational: this.calculateOrganizationalComplexity(context),
      timeline: this.calculateTimelineComplexity(context),
      budget: this.calculateBudgetComplexity(context),
      overall: 0
    };

    complexityAssessment.overall = 
      complexityAssessment.technical * this.COMPLEXITY_WEIGHTS.TECHNICAL +
      complexityAssessment.organizational * this.COMPLEXITY_WEIGHTS.ORGANIZATIONAL +
      complexityAssessment.timeline * this.COMPLEXITY_WEIGHTS.TIMELINE +
      complexityAssessment.budget * this.COMPLEXITY_WEIGHTS.BUDGET;

    return {
      primaryDrivers,
      riskFactors,
      successFactors,
      complexityAssessment
    };
  }

  private async generateTemplateRecommendations(context: EnhancedScopingContext) {
    // Create recommendation context for the template engine
    const recommendationContext: RecommendationContext = {
      projectId: context.projectId,
      siteId: context.siteId,
      industry: context.organizationProfile.industry,
      organizationSize: context.organizationProfile.size,
      complianceFrameworks: context.organizationProfile.complianceNeeds,
      networkComplexity: context.networkInfrastructure.complexity as any,
      existingVendors: context.networkInfrastructure.existingVendors,
      deviceInventory: context.networkInfrastructure.deviceInventory,
      securityRequirements: context.networkInfrastructure.securityRequirements,
      budgetRange: context.organizationProfile.budget,
      timelineConstraints: context.organizationProfile.timeline,
      useCases: context.businessRequirements.useCases,
      painPoints: context.organizationProfile.painPoints
    };

    const smartRecommendations = await smartTemplateRecommendationEngine
      .generateRecommendations(recommendationContext);

    // Categorize recommendations
    const primary = smartRecommendations.recommendations
      .filter(r => r.score > 0.7)
      .slice(0, 5);
    
    const alternative = smartRecommendations.recommendations
      .filter(r => r.score > 0.5 && r.score <= 0.7)
      .slice(0, 3);

    // Assess customization requirements
    const customizationLevel = this.assessCustomizationLevel(context, primary);
    const customizationAreas = this.identifyCustomizationAreas(context);
    const customizationEffort = this.estimateCustomizationEffort(context, customizationLevel);

    return {
      primary,
      alternative,
      customization: {
        level: customizationLevel,
        areas: customizationAreas,
        effort: customizationEffort
      }
    };
  }

  private async calculateResourceRequirements(context: EnhancedScopingContext) {
    const personnel = [];
    const infrastructure = [];
    const external = [];

    // Personnel requirements based on complexity and size
    const complexity = this.calculateTechnicalComplexity(context);
    const orgSize = context.organizationProfile.size;

    // Core team requirements
    personnel.push({
      role: 'Project Manager',
      skillLevel: complexity > 7 ? 'senior' : 'intermediate',
      allocation: 1.0,
      duration: this.estimateProjectDuration(context)
    });

    personnel.push({
      role: 'Network Engineer',
      skillLevel: complexity > 8 ? 'expert' : 'advanced',
      allocation: 1.0,
      duration: this.estimateProjectDuration(context) * 0.8
    });

    personnel.push({
      role: 'Security Specialist',
      skillLevel: context.organizationProfile.complianceNeeds.length > 2 ? 'expert' : 'advanced',
      allocation: 0.5,
      duration: this.estimateProjectDuration(context) * 0.6
    });

    if (orgSize === 'Enterprise') {
      personnel.push({
        role: 'Solution Architect',
        skillLevel: 'expert',
        allocation: 0.7,
        duration: this.estimateProjectDuration(context) * 0.5
      });
    }

    // Infrastructure requirements
    const deviceCount = Object.values(context.networkInfrastructure.deviceInventory)
      .reduce((sum, count) => sum + count, 0);

    infrastructure.push({
      component: 'Test Environment',
      quantity: 1,
      specifications: ['Isolated network segment', 'Representative device mix', 'Monitoring tools'],
      cost: Math.min(deviceCount * 100, 25000)
    });

    if (complexity > 7) {
      infrastructure.push({
        component: 'Professional Services',
        quantity: 1,
        specifications: ['Expert consulting', 'Custom development', 'Training'],
        cost: complexity * 5000
      });
    }

    return { personnel, infrastructure, external };
  }

  private async buildProjectTimeline(context: EnhancedScopingContext) {
    const baseDuration = this.estimateProjectDuration(context);
    const complexity = this.calculateTechnicalComplexity(context);
    
    const phases = [
      {
        name: 'Planning & Discovery',
        startWeek: 0,
        endWeek: Math.ceil(baseDuration * 0.2),
        dependencies: [],
        milestones: ['Requirements finalized', 'Team assembled', 'Environment prepared']
      },
      {
        name: 'Design & Architecture',
        startWeek: Math.ceil(baseDuration * 0.15),
        endWeek: Math.ceil(baseDuration * 0.4),
        dependencies: ['Planning & Discovery'],
        milestones: ['Architecture approved', 'Templates customized', 'Test plan ready']
      },
      {
        name: 'Implementation',
        startWeek: Math.ceil(baseDuration * 0.35),
        endWeek: Math.ceil(baseDuration * 0.8),
        dependencies: ['Design & Architecture'],
        milestones: ['Core deployment complete', 'Integration testing passed']
      },
      {
        name: 'Testing & Validation',
        startWeek: Math.ceil(baseDuration * 0.7),
        endWeek: Math.ceil(baseDuration * 0.95),
        dependencies: ['Implementation'],
        milestones: ['All tests passed', 'Performance validated', 'Security verified']
      },
      {
        name: 'Rollout & Handover',
        startWeek: Math.ceil(baseDuration * 0.9),
        endWeek: baseDuration,
        dependencies: ['Testing & Validation'],
        milestones: ['Production deployment', 'Team trained', 'Documentation complete']
      }
    ];

    const criticalMilestones = [
      {
        name: 'Architecture Sign-off',
        week: Math.ceil(baseDuration * 0.35),
        importance: 'critical' as const,
        impact: 'Prevents implementation delays and scope creep'
      },
      {
        name: 'Integration Testing Complete',
        week: Math.ceil(baseDuration * 0.75),
        importance: 'high' as const,
        impact: 'Ensures seamless production deployment'
      },
      {
        name: 'Go-Live Readiness',
        week: Math.ceil(baseDuration * 0.95),
        importance: 'critical' as const,
        impact: 'Confirms all systems ready for production use'
      }
    ];

    return {
      totalDuration: baseDuration,
      phases,
      criticalMilestones
    };
  }

  private async performBudgetAnalysis(context: EnhancedScopingContext) {
    const baseBudget = this.extractBudgetAmount(context.organizationProfile.budget);
    const complexity = this.calculateTechnicalComplexity(context);
    
    const breakdown = [
      {
        category: 'Professional Services',
        amount: baseBudget * 0.4,
        confidence: 0.8,
        notes: ['Project management', 'Implementation services', 'Training']
      },
      {
        category: 'Software Licensing',
        amount: baseBudget * 0.25,
        confidence: 0.9,
        notes: ['NAC platform licensing', 'Additional security modules']
      },
      {
        category: 'Hardware/Infrastructure',
        amount: baseBudget * 0.2,
        confidence: 0.7,
        notes: ['Server hardware', 'Network equipment upgrades', 'Testing environment']
      },
      {
        category: 'Integration & Customization',
        amount: baseBudget * 0.1,
        confidence: 0.6,
        notes: ['Custom development', 'Third-party integrations', 'API development']
      },
      {
        category: 'Training & Support',
        amount: baseBudget * 0.05,
        confidence: 0.9,
        notes: ['User training', 'Administrator certification', 'Documentation']
      }
    ];

    const contingency = baseBudget * (complexity > 7 ? 0.2 : 0.15);
    const riskFactors = [];

    if (context.organizationProfile.size === 'Enterprise') {
      riskFactors.push('Large organization complexity may increase costs');
    }
    if (context.networkInfrastructure.existingVendors.length > 3) {
      riskFactors.push('Multi-vendor integration may require additional effort');
    }

    return {
      totalEstimate: baseBudget,
      breakdown,
      contingency,
      riskFactors
    };
  }

  private async assessProjectRisks(context: EnhancedScopingContext) {
    const risks = [];

    // Technical risks
    if (context.networkInfrastructure.complexity === 'Very Complex') {
      risks.push({
        category: 'Technical',
        description: 'Complex network topology may cause integration challenges',
        probability: 0.7,
        impact: 0.8,
        severity: 'high' as const,
        mitigation: ['Comprehensive discovery phase', 'Proof of concept deployment', 'Expert consulting']
      });
    }

    // Organizational risks
    if (context.organizationProfile.size === 'Enterprise') {
      risks.push({
        category: 'Organizational',
        description: 'Large organization change management complexity',
        probability: 0.6,
        impact: 0.7,
        severity: 'medium' as const,
        mitigation: ['Executive sponsorship', 'Change management program', 'Phased rollout approach']
      });
    }

    // Timeline risks
    if (context.organizationProfile.timeline === 'urgent') {
      risks.push({
        category: 'Timeline',
        description: 'Compressed timeline may impact quality or scope',
        probability: 0.8,
        impact: 0.6,
        severity: 'medium' as const,
        mitigation: ['Scope prioritization', 'Additional resources', 'Parallel work streams']
      });
    }

    // Compliance risks
    if (context.organizationProfile.complianceNeeds.length > 2) {
      risks.push({
        category: 'Compliance',
        description: 'Multiple compliance requirements may slow implementation',
        probability: 0.5,
        impact: 0.9,
        severity: 'high' as const,
        mitigation: ['Compliance specialist involvement', 'Regular audit checkpoints', 'Documentation emphasis']
      });
    }

    const overallRiskLevel = risks.reduce((sum, risk) => 
      sum + (risk.probability * risk.impact), 0) / risks.length;

    const keyMitigations = risks
      .filter(risk => risk.severity === 'high' || risk.severity === 'critical')
      .flatMap(risk => risk.mitigation)
      .slice(0, 5);

    return {
      risks,
      overallRiskLevel,
      keyMitigations
    };
  }

  private async determineRecommendedApproach(
    context: EnhancedScopingContext, 
    analysis: any, 
    riskAssessment: any
  ) {
    let strategy = 'Phased Implementation';
    
    if (context.organizationProfile.timeline === 'urgent') {
      strategy = 'Rapid Deployment';
    } else if (context.organizationProfile.size === 'Enterprise') {
      strategy = 'Enterprise Rollout';
    } else if (analysis.complexityAssessment.overall > 8) {
      strategy = 'Methodical Implementation';
    }

    const phases = this.generateImplementationPhases(context, strategy);
    const criticalPath = this.identifyCriticalPath(phases);
    const alternativeOptions = this.generateAlternativeOptions(context, analysis);

    return {
      strategy,
      phases,
      criticalPath,
      alternativeOptions
    };
  }

  private defineSuccessCriteria(context: EnhancedScopingContext, analysis: any) {
    return {
      technical: [
        'All network devices successfully integrated with NAC solution',
        'Authentication policies enforced across all access points',
        'Monitoring and reporting systems operational'
      ],
      business: [
        'Improved security posture measurable within 30 days',
        'Reduced manual provisioning by 80%',
        'User satisfaction score above 85%'
      ],
      operational: [
        'Support team trained and certified',
        'Documentation complete and accessible',
        'Incident response procedures established'
      ],
      strategic: [
        'Foundation for future security initiatives',
        'Compliance requirements fully addressed',
        'Scalable platform for organizational growth'
      ]
    };
  }

  private generateActionRecommendations(
    context: EnhancedScopingContext, 
    analysis: any, 
    riskAssessment: any
  ) {
    return {
      immediate: [
        'Secure executive sponsorship and project charter',
        'Assemble core project team with required expertise',
        'Conduct detailed network discovery and documentation'
      ],
      shortTerm: [
        'Establish test environment and proof of concept',
        'Finalize vendor selection and contract negotiations',
        'Develop detailed implementation timeline'
      ],
      longTerm: [
        'Plan for ongoing maintenance and optimization',
        'Establish center of excellence for network security',
        'Develop roadmap for additional security capabilities'
      ],
      contingency: [
        'Identify alternative vendors in case of issues',
        'Prepare rollback procedures for critical systems',
        'Establish escalation paths for decision making'
      ]
    };
  }

  // Helper methods for calculations
  private calculateTechnicalComplexity(context: EnhancedScopingContext): number {
    let complexity = 5; // Base complexity

    // Network factors
    if (context.networkInfrastructure.complexity === 'Very Complex') complexity += 3;
    else if (context.networkInfrastructure.complexity === 'Complex') complexity += 2;
    else if (context.networkInfrastructure.complexity === 'Moderate') complexity += 1;

    // Vendor diversity
    complexity += Math.min(context.networkInfrastructure.existingVendors.length * 0.5, 2);

    // Device count
    const deviceCount = Object.values(context.networkInfrastructure.deviceInventory)
      .reduce((sum, count) => sum + count, 0);
    complexity += Math.min(deviceCount / 100, 2);

    // Compliance requirements
    complexity += Math.min(context.organizationProfile.complianceNeeds.length * 0.3, 1.5);

    return Math.min(complexity, 10);
  }

  private calculateOrganizationalComplexity(context: EnhancedScopingContext): number {
    let complexity = 3; // Base complexity

    if (context.organizationProfile.size === 'Enterprise') complexity += 3;
    else if (context.organizationProfile.size === 'Mid-Market') complexity += 2;
    else complexity += 1;

    complexity += Math.min(context.organizationProfile.locations * 0.2, 2);
    complexity += Math.min(context.stakeholders.decisionMakers.length * 0.3, 2);

    return Math.min(complexity, 10);
  }

  private calculateTimelineComplexity(context: EnhancedScopingContext): number {
    const timelineMap = {
      'urgent': 8,
      'fast': 6,
      'normal': 4,
      'extended': 2
    };
    return timelineMap[context.organizationProfile.timeline as keyof typeof timelineMap] || 5;
  }

  private calculateBudgetComplexity(context: EnhancedScopingContext): number {
    const budgetAmount = this.extractBudgetAmount(context.organizationProfile.budget);
    if (budgetAmount < 50000) return 7;
    if (budgetAmount < 100000) return 5;
    if (budgetAmount < 250000) return 3;
    return 2;
  }

  private extractBudgetAmount(budgetRange: string): number {
    const budgetMap: Record<string, number> = {
      'under-50k': 40000,
      '50k-100k': 75000,
      '100k-250k': 175000,
      '250k-500k': 375000,
      'over-500k': 750000
    };
    return budgetMap[budgetRange] || 100000;
  }

  private estimateProjectDuration(context: EnhancedScopingContext): number {
    let weeks = 12; // Base duration

    const complexity = this.calculateTechnicalComplexity(context);
    weeks += complexity * 2;

    if (context.organizationProfile.size === 'Enterprise') weeks += 8;
    else if (context.organizationProfile.size === 'Mid-Market') weeks += 4;

    if (context.organizationProfile.timeline === 'urgent') weeks *= 0.7;
    else if (context.organizationProfile.timeline === 'extended') weeks *= 1.3;

    return Math.round(weeks);
  }

  private assessCustomizationLevel(context: EnhancedScopingContext, templates: any[]): 'minimal' | 'moderate' | 'extensive' {
    let customizationScore = 0;

    if (context.organizationProfile.complianceNeeds.length > 2) customizationScore += 2;
    if (context.networkInfrastructure.complexity === 'Very Complex') customizationScore += 2;
    if (context.organizationProfile.size === 'Enterprise') customizationScore += 1;
    if (context.networkInfrastructure.existingVendors.length > 3) customizationScore += 1;

    if (customizationScore >= 4) return 'extensive';
    if (customizationScore >= 2) return 'moderate';
    return 'minimal';
  }

  private identifyCustomizationAreas(context: EnhancedScopingContext): string[] {
    const areas = [];
    
    if (context.organizationProfile.complianceNeeds.length > 0) {
      areas.push('Compliance and audit reporting');
    }
    if (context.networkInfrastructure.existingVendors.length > 2) {
      areas.push('Multi-vendor integration');
    }
    if (context.organizationProfile.size === 'Enterprise') {
      areas.push('Scalability and performance optimization');
    }
    if (context.businessRequirements.useCases.includes('Guest Access')) {
      areas.push('Guest access workflows');
    }

    return areas;
  }

  private estimateCustomizationEffort(context: EnhancedScopingContext, level: string): number {
    const baseEffort = { minimal: 40, moderate: 120, extensive: 280 };
    let effort = baseEffort[level as keyof typeof baseEffort] || 80;

    const complexity = this.calculateTechnicalComplexity(context);
    effort += complexity * 10;

    return effort; // hours
  }

  private generateImplementationPhases(context: EnhancedScopingContext, strategy: string) {
    // Implementation varies by strategy - simplified example
    const basePhases = [
      {
        name: 'Foundation',
        duration: 4,
        objectives: ['Environment setup', 'Team preparation', 'Initial configuration'],
        deliverables: ['Test environment', 'Base configuration', 'Team training'],
        resources: ['Project Manager', 'Network Engineer'],
        risks: ['Environment delays', 'Resource availability']
      },
      {
        name: 'Core Implementation',
        duration: 8,
        objectives: ['Primary deployment', 'Integration', 'Testing'],
        deliverables: ['Production deployment', 'Integration complete', 'Test results'],
        resources: ['Full team', 'Vendor support'],
        risks: ['Integration issues', 'Performance problems']
      },
      {
        name: 'Optimization',
        duration: 4,
        objectives: ['Performance tuning', 'User training', 'Documentation'],
        deliverables: ['Optimized system', 'Trained users', 'Complete documentation'],
        resources: ['Technical team', 'Training coordinator'],
        risks: ['User adoption', 'Performance targets']
      }
    ];

    if (strategy === 'Rapid Deployment') {
      basePhases.forEach(phase => phase.duration *= 0.7);
    } else if (strategy === 'Enterprise Rollout') {
      basePhases.forEach(phase => phase.duration *= 1.5);
    }

    return basePhases;
  }

  private identifyCriticalPath(phases: any[]): string[] {
    return [
      'Executive approval',
      'Team assembly',
      'Environment preparation',
      'Core deployment',
      'Integration testing',
      'Production validation'
    ];
  }

  private generateAlternativeOptions(context: EnhancedScopingContext, analysis: any): string[] {
    const options = [];
    
    if (context.organizationProfile.size === 'Enterprise') {
      options.push('Regional phased rollout approach');
      options.push('Cloud-first deployment strategy');
    }
    
    if (analysis.complexityAssessment.overall > 7) {
      options.push('Proof of concept first approach');
      options.push('Managed services partnership');
    }
    
    if (context.organizationProfile.timeline === 'urgent') {
      options.push('Hybrid implementation with staged features');
    }

    return options;
  }

  private async storeAnalysisResult(sessionId: string, result: ScopingAnalysisResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('enhanced_scoping_sessions')
        .update({
          ai_analysis: result.contextAnalysis,
          requirements_analysis: result.templateRecommendations,
          risk_assessment: result.riskAssessment,
          timeline_estimates: result.timeline,
          cost_estimates: result.budgetAnalysis,
          recommended_approach: result.recommendedApproach,
          resource_requirements: result.resourceRequirements,
          success_criteria: result.successCriteria,
          completion_percentage: 85,
          status: 'analyzed'
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error storing analysis result:', error);
      // Non-critical error - don't throw
    }
  }
}

export const enhancedScopingOrchestrator = new EnhancedScopingOrchestrator();
export default enhancedScopingOrchestrator;