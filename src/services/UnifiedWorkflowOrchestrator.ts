import { supabase } from '@/integrations/supabase/client';
import { IntelligentStepOrchestrator, IntelligentStep, StepType, ResourceType } from './IntelligentStepOrchestrator';
import { IntelligentStepTemplates } from './IntelligentStepTemplates';


// Core Workflow Context Interface - Enhanced for AI and Resource Library Integration
export interface WorkflowContext {
  project_id?: string;
  session_id: string;
  current_step: number;
  total_steps: number;
  workflow_type: 'project_genesis' | 'site_creation' | 'implementation_planning' | 'deployment_tracking';
  context_data: Record<string, any>;
  ai_insights: AIInsight[];
  resource_library_mappings: ResourceMapping[];
  decision_tree_state: DecisionState;
  progression_rules: ProgressionRule[];
  intelligent_steps: IntelligentStep[]; // New: AI-powered steps
  ai_orchestrator: IntelligentStepOrchestrator; // New: AI orchestrator
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'optimization' | 'prediction';
  title: string;
  description: string;
  confidence_score: number;
  action_required: boolean;
  resource_references: string[];
  impact_assessment: {
    timeline: 'low' | 'medium' | 'high';
    cost: 'low' | 'medium' | 'high';
    complexity: 'low' | 'medium' | 'high';
    risk: 'low' | 'medium' | 'high';
  };
}

export interface ResourceMapping {
  resource_type: 'industry_option' | 'compliance_framework' | 'deployment_type' | 'use_case' | 'requirement';
  resource_id: string;
  relevance_score: number;
  auto_selected: boolean;
  user_confirmed: boolean;
  ai_reasoning: string;
}

export interface DecisionState {
  current_path: string[];
  available_paths: string[];
  decision_points: DecisionPoint[];
  branch_logic: Record<string, any>;
}

export interface DecisionPoint {
  id: string;
  question: string;
  options: DecisionOption[];
  current_selection?: string;
  impact_on_flow: string[];
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  next_steps: string[];
  resource_implications: ResourceMapping[];
}

export interface ProgressionRule {
  step_id: string;
  completion_criteria: CompletionCriteria[];
  auto_advancement: boolean;
  validation_required: boolean;
  ai_guidance_enabled: boolean;
}

export interface CompletionCriteria {
  type: 'required_data' | 'user_confirmation' | 'ai_validation' | 'resource_selection';
  field_name?: string;
  validation_function?: string;
  minimum_confidence?: number;
}

// Main Workflow Orchestrator Class - Enhanced with Intelligent Steps
export class UnifiedWorkflowOrchestrator {
  private context: WorkflowContext;
  private resourceLibrary: ResourceLibraryCache;
  private aiOrchestrator: IntelligentStepOrchestrator;
  
  constructor(workflowType: WorkflowContext['workflow_type'], existingContext?: Partial<WorkflowContext>) {
    this.aiOrchestrator = new IntelligentStepOrchestrator();
    
    this.context = {
      session_id: existingContext?.session_id || this.generateSessionId(),
      current_step: existingContext?.current_step || 0,
      total_steps: 0, // Will be set after generating intelligent steps
      workflow_type: workflowType,
      context_data: existingContext?.context_data || {},
      ai_insights: existingContext?.ai_insights || [],
      resource_library_mappings: existingContext?.resource_library_mappings || [],
      decision_tree_state: existingContext?.decision_tree_state || this.initializeDecisionState(),
      progression_rules: this.getProgressionRules(workflowType),
      intelligent_steps: [], // Will be populated with AI-powered steps
      ai_orchestrator: this.aiOrchestrator,
      ...existingContext
    };
    
    this.resourceLibrary = new ResourceLibraryCache();
  }

  // Initialize workflow with AI-driven intelligent steps
  async initializeWorkflow(): Promise<IntelligentStep[]> {
    await this.resourceLibrary.initialize();
    await this.aiOrchestrator.initializeResourceLibrary();
    
    // Generate AI-powered intelligent steps from templates
    this.context.intelligent_steps = await this.generateIntelligentSteps();
    this.context.total_steps = this.context.intelligent_steps.length;
    
    // Generate initial AI insights with full Resource Library context
    await this.generateContextualInsights();
    
    // Save initial context
    await this.saveContext();
    
    return this.context.intelligent_steps;
  }

  // Generate intelligent steps from templates
  async generateIntelligentSteps(): Promise<IntelligentStep[]> {
    const templates = IntelligentStepTemplates.getTemplatesForWorkflow(this.context.workflow_type);
    const intelligentSteps: IntelligentStep[] = [];
    
    for (const template of templates) {
      const stepConfig = IntelligentStepTemplates.createStepFromTemplate(template, this.context.context_data);
      const intelligentStep = await this.aiOrchestrator.createIntelligentStep(stepConfig, this.context.context_data);
      intelligentSteps.push(intelligentStep);
    }
    
    return intelligentSteps;
  }

  // Dynamic step progression with AI guidance for intelligent steps
  async advanceToStep(stepIndex: number, userInputs?: Record<string, any>): Promise<IntelligentStep> {
    if (userInputs) {
      this.updateContextData(userInputs);
    }

    // Validate current step completion using intelligent validation
    const canAdvance = await this.validateIntelligentStepCompletion(this.context.current_step, userInputs || {});
    if (!canAdvance) {
      throw new Error('Current step requirements not met');
    }

    this.context.current_step = stepIndex;
    
    // Generate AI insights for new step using intelligent orchestrator
    await this.generateStepSpecificInsights(stepIndex, userInputs || {});
    
    // Update resource mappings based on new context
    await this.updateResourceMappings();
    
    // Save context to database
    await this.saveContext();
    
    return this.getCurrentIntelligentStep();
  }

  // AI-powered resource recommendation engine - enhanced
  async generateResourceRecommendations(): Promise<ResourceMapping[]> {
    const currentStep = this.getCurrentIntelligentStep();
    
    if (!currentStep || !currentStep.resource_mappings) {
      return [];
    }
    
    // Use the intelligent step's pre-generated resource mappings
    // and enhance them with additional context
    const enhancedMappings = currentStep.resource_mappings.map(mapping => ({
      resource_type: this.mapResourceTypeToLegacy(mapping.resource_type),
      resource_id: mapping.resource_id,
      relevance_score: mapping.relevance_score,
      auto_selected: mapping.auto_selected,
      user_confirmed: mapping.user_confirmed,
      ai_reasoning: mapping.ai_reasoning
    }));

    this.context.resource_library_mappings = enhancedMappings;
    return enhancedMappings;
  }

  // Smart checklist generation based on intelligent steps
  async generateImplementationChecklist(): Promise<ChecklistItem[]> {
    const checklist: ChecklistItem[] = [];
    
    for (const step of this.context.intelligent_steps) {
      if (step.ai_recommendations) {
        for (const recommendation of step.ai_recommendations) {
          for (const actionItem of recommendation.action_items || []) {
            checklist.push({
              id: actionItem.id,
              title: actionItem.description,
              description: `Generated from ${step.title}: ${recommendation.description}`,
              phase: this.mapStepTypeToPhase(step.type),
              priority: actionItem.priority,
              estimated_duration: actionItem.estimated_effort,
              dependencies: actionItem.dependencies,
              ai_generated: true,
              resource_references: actionItem.resource_requirements,
              status: 'not_started'
            });
          }
        }
      }
    }
    
    return checklist;
  }

  // Predictive analytics and insights - enhanced with intelligent steps
  async generatePredictiveInsights(): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    
    // Aggregate insights from all intelligent steps
    for (const step of this.context.intelligent_steps) {
      if (step.dynamic_content?.risk_assessments) {
        for (const risk of step.dynamic_content.risk_assessments) {
          insights.push({
            type: 'risk_assessment',
            title: `Risk Assessment: ${risk.description}`,
            prediction: {
              risk_level: risk.risk_level,
              mitigation_strategies: risk.mitigation_strategies,
              affected_resources: risk.affected_resources
            },
            confidence: 0.85,
            factors: ['AI Analysis', 'Resource Library', 'Historical Data'],
            recommendations: risk.mitigation_strategies
          });
        }
      }
    }
    
    // Add general timeline prediction
    const timelinePrediction = await this.predictProjectTimeline();
    insights.push({
      type: 'timeline_prediction',
      title: 'Intelligent Timeline Forecast',
      prediction: timelinePrediction,
      confidence: 0.90,
      factors: ['AI Step Analysis', 'Resource Optimization', 'Complexity Assessment'],
      recommendations: ['Follow AI-recommended path', 'Monitor step completion rates']
    });
    
    return insights;
  }

  // Private helper methods
  private generateSessionId(): string {
    // Generate a unique session ID with timestamp and random parts
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 12);
    const additionalRandom = Math.random().toString(36).substr(2, 8);
    return `wf_session_${timestamp}_${randomPart}_${additionalRandom}`;
  }

  private initializeDecisionState(): DecisionState {
    return {
      current_path: [],
      available_paths: [],
      decision_points: [],
      branch_logic: {}
    };
  }

  private getProgressionRules(workflowType: WorkflowContext['workflow_type']): ProgressionRule[] {
    // Enhanced progression rules for intelligent steps
    return [
      {
        step_id: 'business_context_discovery',
        completion_criteria: [
          { type: 'required_data', field_name: 'industry' },
          { type: 'required_data', field_name: 'organization_size' },
          { type: 'ai_validation', minimum_confidence: 0.8 },
          { type: 'resource_selection' }
        ],
        auto_advancement: false,
        validation_required: true,
        ai_guidance_enabled: true
      }
    ];
  }

  private async validateIntelligentStepCompletion(stepIndex: number, userInputs: Record<string, any>): Promise<boolean> {
    const step = this.context.intelligent_steps[stepIndex];
    if (!step) return true;
    
    // Use the intelligent step orchestrator for validation
    const executionResult = await this.aiOrchestrator.processStepExecution(step, userInputs);
    return executionResult.success;
  }

  private getCurrentIntelligentStep(): IntelligentStep {
    return this.context.intelligent_steps[this.context.current_step] || this.context.intelligent_steps[0];
  }

  private async generateStepSpecificInsights(stepIndex: number, userInputs: Record<string, any>): Promise<void> {
    const step = this.context.intelligent_steps[stepIndex];
    if (!step) return;
    
    // Execute the intelligent step to get insights
    const executionResult = await this.aiOrchestrator.processStepExecution(step, userInputs);
    
    // Convert execution insights to AI insights with proper type mapping
    if (executionResult.insights) {
      const convertedInsights: AIInsight[] = executionResult.insights.map(insight => ({
        id: `insight_${insight.id}`,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence_score: insight.confidence_score,
        action_required: insight.action_required,
        resource_references: insight.resource_references,
        impact_assessment: {
          timeline: this.mapTimelineImpact(insight.impact_assessment?.timeline),
          cost: this.mapCostImpact(insight.impact_assessment?.cost),
          complexity: this.mapComplexityImpact(insight.impact_assessment?.complexity),
          risk: insight.impact_assessment?.risk || 'medium'
        }
      }));
      this.context.ai_insights.push(...convertedInsights);
    }
  }

  private generateContextualInsights(): Promise<void> {
    // Generate AI insights based on current context and intelligent steps
    const insights: AIInsight[] = [];
    
    for (const step of this.context.intelligent_steps) {
      if (step.ai_recommendations) {
        for (const recommendation of step.ai_recommendations) {
          insights.push({
            id: `insight_${recommendation.id}`,
            type: recommendation.type as any,
            title: recommendation.title,
            description: recommendation.description,
            confidence_score: recommendation.confidence,
            action_required: recommendation.type === 'warning',
            resource_references: recommendation.resource_references,
            impact_assessment: {
              timeline: this.mapTimelineImpact(recommendation.impact?.timeline),
              cost: this.mapCostImpact(recommendation.impact?.cost),
              complexity: this.mapComplexityImpact(recommendation.impact?.complexity),
              risk: recommendation.impact?.risk || 'medium'
            }
          });
        }
      }
    }
    
    this.context.ai_insights.push(...insights);
    return Promise.resolve();
  }

  private updateContextData(inputs: Record<string, any>): void {
    this.context.context_data = { ...this.context.context_data, ...inputs };
    
    // Update intelligent steps with new context
    this.context.intelligent_steps.forEach(step => {
      if (step.dynamic_content) {
        step.dynamic_content.ai_generated_guidance = 
          step.dynamic_content.ai_generated_guidance.replace(/\{(\w+)\}/g, (match, key) => 
            inputs[key] ? String(inputs[key]) : match
          );
      }
    });
  }
  
  // Helper methods for impact assessment mapping
  private mapTimelineImpact(timeline?: string): 'low' | 'medium' | 'high' {
    switch (timeline) {
      case 'positive': return 'low';
      case 'neutral': return 'medium';
      case 'negative': return 'high';
      default: return 'medium';
    }
  }

  private mapCostImpact(cost?: string): 'low' | 'medium' | 'high' {
    switch (cost) {
      case 'reduce': return 'low';
      case 'neutral': return 'medium';
      case 'increase': return 'high';
      default: return 'medium';
    }
  }

  private mapComplexityImpact(complexity?: string): 'low' | 'medium' | 'high' {
    switch (complexity) {
      case 'simplify': return 'low';
      case 'neutral': return 'medium';
      case 'complicate': return 'high';
      default: return 'medium';
    }
  }
  private async updateResourceMappings(): Promise<void> {
    const newMappings = await this.generateResourceRecommendations();
    this.context.resource_library_mappings = newMappings;
  }

  private async saveContext(): Promise<void> {
    try {
      // First try to update existing session
      const { data: existingSession } = await (supabase as any)
        .from('workflow_sessions')
        .select('session_id')
        .eq('session_id', this.context.session_id)
        .single();

      if (existingSession) {
        // Update existing session
        const { error } = await (supabase as any)
          .from('workflow_sessions')
          .update({
            workflow_type: this.context.workflow_type,
            current_step: this.context.current_step,
            context_data: this.context.context_data,
            ai_insights: this.context.ai_insights,
            resource_library_mappings: this.context.resource_library_mappings,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', this.context.session_id);

        if (error) {
          console.error('Error updating workflow session:', error);
          throw error;
        }
      } else {
        // Insert new session
        const { error } = await (supabase as any)
          .from('workflow_sessions')
          .insert({
            session_id: this.context.session_id,
            workflow_type: this.context.workflow_type,
            current_step: this.context.current_step,
            context_data: this.context.context_data,
            ai_insights: this.context.ai_insights,
            resource_library_mappings: this.context.resource_library_mappings,
            created_by: (await supabase.auth.getUser()).data.user?.id,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error inserting workflow session:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error saving workflow context:', error);
      throw error;
    }
  }

  private mapResourceTypeToLegacy(resourceType: ResourceType): 'industry_option' | 'compliance_framework' | 'deployment_type' | 'use_case' | 'requirement' {
    const mapping: Record<ResourceType, 'industry_option' | 'compliance_framework' | 'deployment_type' | 'use_case' | 'requirement'> = {
      'industry_options': 'industry_option',
      'compliance_frameworks': 'compliance_framework',
      'deployment_types': 'deployment_type',
      'business_domains': 'use_case',
      'network_segments': 'requirement',
      'authentication_methods': 'requirement',
      'device_types': 'requirement',
      'pain_points_library': 'requirement',
      'use_cases': 'use_case',
      'requirements': 'requirement'
    };
    
    return mapping[resourceType] || 'requirement';
  }

  private mapStepTypeToPhase(stepType: StepType): 'pre_deployment' | 'deployment' | 'post_deployment' | 'implementation_tracking' {
    const mapping: Record<StepType, 'pre_deployment' | 'deployment' | 'post_deployment' | 'implementation_tracking'> = {
      'ai_data_collection': 'pre_deployment',
      'intelligent_discovery': 'pre_deployment',
      'decision_matrix': 'pre_deployment',
      'resource_selection': 'pre_deployment',
      'ai_analysis': 'deployment',
      'solution_generation': 'deployment',
      'validation_engine': 'post_deployment',
      'implementation_planning': 'deployment',
      'smart_configuration': 'deployment',
      'predictive_assessment': 'implementation_tracking'
    };
    
    return mapping[stepType] || 'deployment';
  }

  private async predictProjectTimeline(): Promise<any> {
    const context = this.context.context_data;
    const intelligentStepsCount = this.context.intelligent_steps.length;
    
    // AI-based timeline prediction using intelligent steps
    let baselineWeeks = intelligentStepsCount * 2; // 2 weeks per intelligent step baseline
    
    if (context.organization_size?.includes('Enterprise')) {
      baselineWeeks += 8;
    } else if (context.organization_size?.includes('Large')) {
      baselineWeeks += 4;
    }
    
    if (context.compliance_requirements?.length > 2) {
      baselineWeeks += 4;
    }
    
    return {
      estimated_weeks: baselineWeeks,
      confidence_range: [baselineWeeks * 0.8, baselineWeeks * 1.3],
      critical_path_items: this.context.intelligent_steps.map(step => step.title),
      ai_optimization_factor: 0.15 // 15% improvement from AI assistance
    };
  }
}

// Legacy WorkflowStep interface for backward compatibility
export interface WorkflowStep {
  id: string;
  title: string;
  type: 'data_collection' | 'ai_recommendation' | 'ai_processing' | 'design' | 'planning' | 'validation';
  description?: string;
  ai_enhanced?: boolean;
  dynamic_content?: any;
  guidance?: string;
  completion_percentage?: number;
  estimated_duration?: string;
  dependencies?: string[];
}

// Supporting interfaces
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  phase: 'pre_deployment' | 'deployment' | 'post_deployment' | 'implementation_tracking';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimated_duration: string;
  dependencies: string[];
  ai_generated: boolean;
  resource_references: string[];
  status?: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  assigned_to?: string;
  completion_notes?: string;
}

export interface PredictiveInsight {
  type: 'timeline_prediction' | 'risk_assessment' | 'resource_optimization' | 'success_probability';
  title: string;
  prediction: any;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

// Resource Library Cache for performance optimization
class ResourceLibraryCache {
  private cache: Map<string, any> = new Map();
  private lastUpdate: Date = new Date(0);
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async initialize(): Promise<void> {
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
  }

  async getIndustryOptions(): Promise<any[]> {
    return this.cache.get('industry_options') || [];
  }

  async getComplianceFrameworks(): Promise<any[]> {
    return this.cache.get('compliance_frameworks') || [];
  }

  async getDeploymentTypes(): Promise<any[]> {
    return this.cache.get('deployment_types') || [];
  }

  async getUseCases(): Promise<any[]> {
    return this.cache.get('use_cases') || [];
  }

  async getRequirements(): Promise<any[]> {
    return this.cache.get('requirements') || [];
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastUpdate.getTime() > this.cacheTimeout;
  }

  private async refreshCache(): Promise<void> {
    try {
      // Fetch all resource library data in parallel
      const [industryOptions, complianceFrameworks, deploymentTypes, useCases, requirements] = await Promise.all([
        supabase.from('industry_options').select('*').eq('is_active', true),
        supabase.from('compliance_frameworks').select('*').eq('is_active', true),
        supabase.from('deployment_types').select('*').eq('is_active', true),
        supabase.from('use_cases').select('*').eq('is_active', true),
        supabase.from('requirements').select('*').eq('is_active', true)
      ]);

      this.cache.set('industry_options', industryOptions.data || []);
      this.cache.set('compliance_frameworks', complianceFrameworks.data || []);
      this.cache.set('deployment_types', deploymentTypes.data || []);
      this.cache.set('use_cases', useCases.data || []);
      this.cache.set('requirements', requirements.data || []);

      this.lastUpdate = new Date();
    } catch (error) {
      console.error('Failed to refresh resource library cache:', error);
    }
  }
}