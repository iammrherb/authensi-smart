import { StepType, IntelligentStep, ResourceType } from './IntelligentStepOrchestrator';

// AI-Powered Step Templates for Different Workflow Types
export interface StepTemplate {
  id: string;
  title: string;
  type: StepType;
  description: string;
  resource_types: ResourceType[];
  ai_prompt_template: string;
  decision_factors: string[];
  required_context: string[];
  outcomes: string[];
}

export class IntelligentStepTemplates {
  // Project Genesis Workflow Templates
  static getProjectGenesisTemplates(): StepTemplate[] {
    return [
      {
        id: 'business_context_discovery',
        title: 'Business Context Discovery',
        type: 'ai_data_collection',
        description: 'AI-powered discovery of business requirements and organizational context',
        resource_types: ['industry_options', 'business_domains', 'compliance_frameworks'],
        ai_prompt_template: 'Analyze the organization context and recommend relevant business domains and compliance requirements based on industry: {industry}, size: {size}, and goals: {goals}',
        decision_factors: ['industry_type', 'organization_size', 'compliance_requirements', 'business_goals'],
        required_context: ['industry', 'organization_size'],
        outcomes: ['industry_classification', 'business_domain_selection', 'compliance_framework_mapping']
      },
      {
        id: 'pain_point_analysis',
        title: 'Intelligent Pain Point Analysis',
        type: 'intelligent_discovery',
        description: 'AI-driven identification and prioritization of organizational pain points',
        resource_types: ['pain_points_library', 'use_cases'],
        ai_prompt_template: 'Based on the business context {business_context}, identify and prioritize pain points from the library that are most relevant to {industry} organizations of {size} size',
        decision_factors: ['business_impact', 'implementation_complexity', 'resource_requirements'],
        required_context: ['business_context', 'industry', 'organization_size'],
        outcomes: ['prioritized_pain_points', 'impact_assessment', 'solution_mapping']
      },
      {
        id: 'solution_architecture_matrix',
        title: 'Solution Architecture Decision Matrix',
        type: 'decision_matrix',
        description: 'AI-powered decision matrix for optimal solution architecture',
        resource_types: ['deployment_types', 'authentication_methods', 'network_segments'],
        ai_prompt_template: 'Given pain points {pain_points} and requirements {requirements}, evaluate deployment types and authentication methods using decision matrix analysis',
        decision_factors: ['scalability', 'security_level', 'implementation_timeline', 'budget_constraints'],
        required_context: ['pain_points', 'requirements', 'constraints'],
        outcomes: ['deployment_strategy', 'authentication_architecture', 'network_design']
      },
      {
        id: 'resource_optimization_engine',
        title: 'Resource Optimization Engine',
        type: 'resource_selection',
        description: 'Intelligent selection and optimization of resources from the library',
        resource_types: ['device_types', 'authentication_methods', 'deployment_types'],
        ai_prompt_template: 'Optimize resource selection for architecture {architecture} considering constraints {constraints} and performance requirements {performance_requirements}',
        decision_factors: ['cost_optimization', 'performance_impact', 'maintenance_overhead', 'future_scalability'],
        required_context: ['architecture', 'constraints', 'performance_requirements'],
        outcomes: ['optimized_resource_list', 'cost_analysis', 'performance_projection']
      },
      {
        id: 'predictive_implementation_analysis',
        title: 'Predictive Implementation Analysis',
        type: 'predictive_assessment',
        description: 'AI-driven prediction of implementation success factors and risks',
        resource_types: ['compliance_frameworks', 'deployment_types', 'pain_points_library'],
        ai_prompt_template: 'Analyze implementation probability and predict success factors for project with resources {resources} and timeline {timeline}',
        decision_factors: ['risk_probability', 'resource_availability', 'complexity_assessment', 'stakeholder_readiness'],
        required_context: ['resources', 'timeline', 'team_capabilities'],
        outcomes: ['risk_assessment', 'success_probability', 'mitigation_strategies']
      },
      {
        id: 'intelligent_validation_engine',
        title: 'Intelligent Validation Engine',
        type: 'validation_engine',
        description: 'AI-powered validation of solution completeness and viability',
        resource_types: ['compliance_frameworks', 'industry_options', 'business_domains'],
        ai_prompt_template: 'Validate solution completeness for {solution} against compliance requirements {compliance} and industry standards {standards}',
        decision_factors: ['compliance_coverage', 'gap_analysis', 'implementation_readiness'],
        required_context: ['solution', 'compliance', 'standards'],
        outcomes: ['validation_report', 'gap_analysis', 'readiness_assessment']
      }
    ];
  }

  // Site Creation Workflow Templates
  static getSiteCreationTemplates(): StepTemplate[] {
    return [
      {
        id: 'site_context_analysis',
        title: 'Site Context Analysis',
        type: 'ai_data_collection',
        description: 'AI-driven analysis of site-specific requirements and constraints',
        resource_types: ['network_segments', 'device_types', 'deployment_types'],
        ai_prompt_template: 'Analyze site requirements for location {location} with size {size} and identify optimal network segments and device types',
        decision_factors: ['site_size', 'user_density', 'security_requirements', 'infrastructure_constraints'],
        required_context: ['location', 'size', 'user_count'],
        outcomes: ['site_classification', 'network_requirements', 'device_recommendations']
      },
      {
        id: 'infrastructure_discovery',
        title: 'Infrastructure Discovery Engine',
        type: 'intelligent_discovery',
        description: 'Smart discovery and mapping of existing infrastructure',
        resource_types: ['device_types', 'network_segments', 'authentication_methods'],
        ai_prompt_template: 'Map existing infrastructure {infrastructure} and recommend integration approaches with new deployment {deployment}',
        decision_factors: ['integration_complexity', 'migration_requirements', 'compatibility_assessment'],
        required_context: ['infrastructure', 'deployment'],
        outcomes: ['infrastructure_map', 'integration_plan', 'migration_strategy']
      },
      {
        id: 'deployment_strategy_matrix',
        title: 'Deployment Strategy Matrix',
        type: 'decision_matrix',
        description: 'AI-powered decision matrix for optimal deployment strategy',
        resource_types: ['deployment_types', 'device_types', 'network_segments'],
        ai_prompt_template: 'Create deployment strategy matrix for site {site} considering constraints {constraints} and requirements {requirements}',
        decision_factors: ['deployment_speed', 'minimal_disruption', 'cost_effectiveness', 'future_flexibility'],
        required_context: ['site', 'constraints', 'requirements'],
        outcomes: ['deployment_strategy', 'phasing_plan', 'resource_allocation']
      },
      {
        id: 'smart_configuration_engine',
        title: 'Smart Configuration Engine',
        type: 'smart_configuration',
        description: 'AI-driven configuration generation and optimization',
        resource_types: ['device_types', 'authentication_methods', 'network_segments'],
        ai_prompt_template: 'Generate optimal configuration for devices {devices} with authentication {auth} and network segments {segments}',
        decision_factors: ['security_optimization', 'performance_tuning', 'management_simplicity'],
        required_context: ['devices', 'auth', 'segments'],
        outcomes: ['device_configurations', 'security_policies', 'management_templates']
      }
    ];
  }

  // Implementation Planning Workflow Templates
  static getImplementationPlanningTemplates(): StepTemplate[] {
    return [
      {
        id: 'timeline_optimization_engine',
        title: 'Timeline Optimization Engine',
        type: 'ai_analysis',
        description: 'AI-powered timeline optimization and critical path analysis',
        resource_types: ['deployment_types', 'compliance_frameworks', 'device_types'],
        ai_prompt_template: 'Optimize implementation timeline for project {project} with resources {resources} and constraints {constraints}',
        decision_factors: ['critical_path_optimization', 'resource_dependencies', 'risk_mitigation', 'milestone_prioritization'],
        required_context: ['project', 'resources', 'constraints'],
        outcomes: ['optimized_timeline', 'critical_path', 'milestone_schedule']
      },
      {
        id: 'resource_allocation_matrix',
        title: 'Resource Allocation Matrix',
        type: 'solution_generation',
        description: 'Intelligent resource allocation and capacity planning',
        resource_types: ['device_types', 'authentication_methods', 'deployment_types'],
        ai_prompt_template: 'Optimize resource allocation for phases {phases} considering availability {availability} and dependencies {dependencies}',
        decision_factors: ['resource_efficiency', 'cost_optimization', 'timeline_adherence', 'quality_assurance'],
        required_context: ['phases', 'availability', 'dependencies'],
        outcomes: ['resource_plan', 'capacity_requirements', 'allocation_schedule']
      },
      {
        id: 'risk_assessment_engine',
        title: 'Risk Assessment Engine',
        type: 'predictive_assessment',
        description: 'AI-driven risk assessment and mitigation planning',
        resource_types: ['compliance_frameworks', 'deployment_types', 'pain_points_library'],
        ai_prompt_template: 'Assess risks for implementation {implementation} and generate mitigation strategies for identified risks {risks}',
        decision_factors: ['risk_probability', 'impact_severity', 'mitigation_cost', 'contingency_planning'],
        required_context: ['implementation', 'risks'],
        outcomes: ['risk_matrix', 'mitigation_plans', 'contingency_strategies']
      }
    ];
  }

  // Deployment Tracking Workflow Templates
  static getDeploymentTrackingTemplates(): StepTemplate[] {
    return [
      {
        id: 'progress_analytics_engine',
        title: 'Progress Analytics Engine',
        type: 'ai_analysis',
        description: 'Real-time progress analysis and performance tracking',
        resource_types: ['deployment_types', 'device_types', 'compliance_frameworks'],
        ai_prompt_template: 'Analyze deployment progress {progress} and predict completion timeline with current velocity {velocity}',
        decision_factors: ['velocity_analysis', 'bottleneck_identification', 'quality_metrics', 'stakeholder_satisfaction'],
        required_context: ['progress', 'velocity'],
        outcomes: ['progress_analysis', 'completion_prediction', 'optimization_recommendations']
      },
      {
        id: 'quality_assurance_matrix',
        title: 'Quality Assurance Matrix',
        type: 'validation_engine',
        description: 'Intelligent quality validation and compliance checking',
        resource_types: ['compliance_frameworks', 'authentication_methods', 'network_segments'],
        ai_prompt_template: 'Validate deployment quality {deployment} against standards {standards} and identify compliance gaps',
        decision_factors: ['compliance_adherence', 'performance_standards', 'security_validation', 'operational_readiness'],
        required_context: ['deployment', 'standards'],
        outcomes: ['quality_report', 'compliance_status', 'remediation_plan']
      },
      {
        id: 'optimization_recommendation_engine',
        title: 'Optimization Recommendation Engine',
        type: 'solution_generation',
        description: 'AI-powered optimization recommendations for ongoing deployment',
        resource_types: ['device_types', 'network_segments', 'authentication_methods'],
        ai_prompt_template: 'Generate optimization recommendations for deployment {deployment} based on performance data {performance}',
        decision_factors: ['performance_optimization', 'cost_reduction', 'security_enhancement', 'scalability_improvement'],
        required_context: ['deployment', 'performance'],
        outcomes: ['optimization_plan', 'performance_improvements', 'cost_savings']
      }
    ];
  }

  // Get templates for specific workflow type
  static getTemplatesForWorkflow(workflowType: string): StepTemplate[] {
    switch (workflowType) {
      case 'project_genesis':
        return this.getProjectGenesisTemplates();
      case 'site_creation':
        return this.getSiteCreationTemplates();
      case 'implementation_planning':
        return this.getImplementationPlanningTemplates();
      case 'deployment_tracking':
        return this.getDeploymentTrackingTemplates();
      default:
        return this.getProjectGenesisTemplates(); // Default fallback
    }
  }

  // Create intelligent step from template
  static createStepFromTemplate(template: StepTemplate, context: Record<string, any> = {}): Partial<IntelligentStep> {
    return {
      id: template.id,
      title: template.title,
      type: template.type,
      description: template.description,
      ai_powered: true,
      decision_driven: true,
      resource_integration: {
        enabled: true,
        resource_types: template.resource_types,
        filtering_strategy: 'hybrid',
        auto_selection_threshold: 0.8,
        context_mapping: this.generateContextMappingForTemplate(template, context)
      },
      ai_context: {
        system_prompt: this.interpolatePromptTemplate(template.ai_prompt_template, context),
        context_variables: template.required_context,
        decision_factors: template.decision_factors,
        learning_objectives: template.outcomes,
        output_format: 'structured'
      }
    };
  }

  // Helper method to interpolate prompt templates
  private static interpolatePromptTemplate(template: string, context: Record<string, any>): string {
    let interpolated = template;
    
    // Replace placeholders with context values
    for (const [key, value] of Object.entries(context)) {
      const placeholder = `{${key}}`;
      interpolated = interpolated.replace(new RegExp(placeholder, 'g'), String(value));
    }
    
    return interpolated;
  }

  // Generate context mapping for template
  private static generateContextMappingForTemplate(template: StepTemplate, context: Record<string, any>): Record<string, string> {
    const mapping: Record<string, string> = {};
    
    // Map required context to resource fields
    template.required_context.forEach(contextKey => {
      if (context[contextKey]) {
        // Map to appropriate resource field based on context key
        if (contextKey === 'industry') mapping['industry'] = 'industry_options.name';
        if (contextKey === 'compliance') mapping['compliance'] = 'compliance_frameworks.name';
        if (contextKey === 'deployment') mapping['deployment'] = 'deployment_types.name';
        if (contextKey === 'business_context') mapping['domain'] = 'business_domains.name';
      }
    });
    
    return mapping;
  }
}