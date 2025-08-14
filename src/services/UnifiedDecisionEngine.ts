import { supabase } from "@/integrations/supabase/client";

export interface DecisionContext {
  industry?: string;
  organizationSize?: number;
  complianceFrameworks?: string[];
  painPoints?: string[];
  existingVendors?: {
    wired?: string[];
    wireless?: string[];
    mdm?: string[];
    idp?: string[];
    edr?: string[];
    radius?: string[];
    nac?: string[];
  };
  authenticationRequirements?: string[];
  securityLevel?: string;
  deploymentType?: string;
  networkSegments?: string[];
  businessDomains?: string[];
}

export interface DecisionRecommendation {
  type: 'use_case' | 'requirement' | 'vendor' | 'authentication_method' | 'pain_point' | 'compliance_framework';
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reasoning: string;
  prerequisites?: string[];
  dependencies?: string[];
  conflictsWith?: string[];
  metadata: any;
}

export interface DecisionPath {
  currentStep: string;
  nextSteps: string[];
  completedSteps: string[];
  recommendations: DecisionRecommendation[];
  blockers: string[];
  warnings: string[];
}

export class UnifiedDecisionEngine {
  private static async getResourceLibraryData() {
    const [
      industryOptions,
      complianceFrameworks,
      deploymentTypes,
      businessDomains,
      authenticationMethods,
      networkSegments,
      vendors,
      useCases,
      requirements
    ] = await Promise.all([
      supabase.from('industry_options').select('*').eq('is_active', true),
      supabase.from('compliance_frameworks').select('*').eq('is_active', true),
      supabase.from('deployment_types').select('*').eq('is_active', true),
      supabase.from('business_domains').select('*').eq('is_active', true),
      supabase.from('authentication_methods').select('*').eq('is_active', true),
      supabase.from('network_segments').select('*').eq('is_active', true),
      supabase.from('vendor_library').select('*').eq('status', 'active'),
      supabase.from('use_case_library').select('*').eq('status', 'active'),
      supabase.from('requirements_library').select('*').eq('status', 'approved')
    ]);

    return {
      industries: industryOptions.data || [],
      complianceFrameworks: complianceFrameworks.data || [],
      deploymentTypes: deploymentTypes.data || [],
      businessDomains: businessDomains.data || [],
      authenticationMethods: authenticationMethods.data || [],
      networkSegments: networkSegments.data || [],
      vendors: vendors.data || [],
      useCases: useCases.data || [],
      requirements: requirements.data || []
    };
  }

  static async analyzeContext(context: DecisionContext): Promise<DecisionPath> {
    const resourceData = await this.getResourceLibraryData();
    const recommendations: DecisionRecommendation[] = [];
    const warnings: string[] = [];
    const blockers: string[] = [];

    // Industry-specific recommendations
    if (context.industry) {
      const industry = resourceData.industries.find(i => i.name === context.industry);
      if (industry) {
        // Recommend compliance frameworks for industry
        const industryCompliance = resourceData.complianceFrameworks.filter(cf => 
          cf.industry_specific?.includes(context.industry)
        );
        
        industryCompliance.forEach(framework => {
          recommendations.push({
            type: 'compliance_framework',
            id: framework.id,
            title: framework.name,
            description: framework.description,
            priority: 'high',
            reasoning: `Required for ${context.industry} industry compliance`,
            metadata: framework
          });
        });

        // Recommend industry-specific use cases
        const industryUseCases = resourceData.useCases.filter(uc => 
          uc.compliance_frameworks?.some(cf => industryCompliance.map(ic => ic.name).includes(cf))
        );
        
        industryUseCases.forEach(useCase => {
          recommendations.push({
            type: 'use_case',
            id: useCase.id,
            title: useCase.name,
            description: useCase.description || '',
            priority: useCase.complexity === 'high' ? 'high' : 'medium',
            reasoning: `Critical for ${context.industry} industry operations`,
            metadata: useCase
          });
        });
      }
    }

    // Organization size-based recommendations
    if (context.organizationSize) {
      if (context.organizationSize > 1000) {
        // Enterprise recommendations
        const enterpriseUseCases = resourceData.useCases.filter(uc => 
          uc.technical_requirements?.some(req => 
            req.toString().toLowerCase().includes('enterprise') ||
            req.toString().toLowerCase().includes('scale')
          )
        );
        
        enterpriseUseCases.forEach(useCase => {
          recommendations.push({
            type: 'use_case',
            id: useCase.id,
            title: useCase.name,
            description: useCase.description || '',
            priority: 'high',
            reasoning: `Essential for enterprise-scale deployments (${context.organizationSize} users)`,
            metadata: useCase
          });
        });
      }
    }

    // Existing vendor ecosystem analysis
    if (context.existingVendors) {
      Object.entries(context.existingVendors).forEach(([category, vendorNames]) => {
        if (vendorNames && vendorNames.length > 0) {
          vendorNames.forEach(vendorName => {
            const vendor = resourceData.vendors.find(v => 
              v.vendor_name.toLowerCase() === vendorName.toLowerCase()
            );
            
            if (vendor) {
              // Recommend compatible vendors and integration methods
              const compatibleVendors = resourceData.vendors.filter(v => 
                v.category !== vendor.category &&
                v.integration_methods?.some(method => 
                  vendor.integration_methods?.includes(method)
                )
              );
              
              compatibleVendors.forEach(compatibleVendor => {
                recommendations.push({
                  type: 'vendor',
                  id: compatibleVendor.id,
                  title: compatibleVendor.vendor_name,
                  description: `Compatible with existing ${vendorName}`,
                  priority: 'medium',
                  reasoning: `Proven integration with ${vendorName} in ${category} category`,
                  metadata: compatibleVendor
                });
              });

              // Recommend use cases supported by this vendor
              const vendorUseCases = resourceData.useCases.filter(uc => 
                uc.supported_vendors?.some(sv => 
                  sv.toString().toLowerCase().includes(vendorName.toLowerCase())
                )
              );
              
              vendorUseCases.forEach(useCase => {
                recommendations.push({
                  type: 'use_case',
                  id: useCase.id,
                  title: useCase.name,
                  description: useCase.description || '',
                  priority: 'medium',
                  reasoning: `Optimized for ${vendorName} integration`,
                  metadata: useCase
                });
              });
            }
          });
        }
      });
    }

    // Compliance framework requirements
    if (context.complianceFrameworks && context.complianceFrameworks.length > 0) {
      context.complianceFrameworks.forEach(frameworkName => {
        const framework = resourceData.complianceFrameworks.find(cf => 
          cf.name === frameworkName
        );
        
        if (framework) {
          // Recommend requirements for this compliance framework
          const complianceRequirements = resourceData.requirements.filter(req => 
            req.compliance_frameworks?.includes(frameworkName)
          );
          
          complianceRequirements.forEach(requirement => {
            recommendations.push({
              type: 'requirement',
              id: requirement.id,
              title: requirement.title,
              description: requirement.description || '',
              priority: requirement.priority,
              reasoning: `Required for ${frameworkName} compliance`,
              metadata: requirement
            });
          });

          // Recommend authentication methods for compliance
          const complianceAuthMethods = resourceData.authenticationMethods.filter(am => 
            framework.requirements?.some(req => 
              req.toString().toLowerCase().includes(am.method_type.toLowerCase())
            )
          );
          
          complianceAuthMethods.forEach(authMethod => {
            recommendations.push({
              type: 'authentication_method',
              id: authMethod.id,
              title: authMethod.name,
              description: authMethod.description || '',
              priority: authMethod.security_level === 'high' ? 'high' : 'medium',
              reasoning: `Required for ${frameworkName} security standards`,
              metadata: authMethod
            });
          });
        }
      });
    }

    // Determine next steps based on current context
    const nextSteps: string[] = [];
    const completedSteps: string[] = [];

    if (!context.industry) {
      nextSteps.push('select_industry');
    } else {
      completedSteps.push('select_industry');
    }

    if (!context.complianceFrameworks || context.complianceFrameworks.length === 0) {
      nextSteps.push('select_compliance_frameworks');
    } else {
      completedSteps.push('select_compliance_frameworks');
    }

    if (!context.existingVendors || Object.keys(context.existingVendors).length === 0) {
      nextSteps.push('map_existing_vendors');
    } else {
      completedSteps.push('map_existing_vendors');
    }

    if (!context.painPoints || context.painPoints.length === 0) {
      nextSteps.push('identify_pain_points');
    } else {
      completedSteps.push('identify_pain_points');
    }

    // Check for blockers
    if (context.complianceFrameworks && context.complianceFrameworks.length > 0) {
      const conflictingFrameworks = context.complianceFrameworks.filter((framework, index) => 
        context.complianceFrameworks!.slice(index + 1).some(otherFramework => {
          const fw1 = resourceData.complianceFrameworks.find(cf => cf.name === framework);
          const fw2 = resourceData.complianceFrameworks.find(cf => cf.name === otherFramework);
          return fw1 && fw2 && this.hasConflictingRequirements(fw1, fw2);
        })
      );
      
      if (conflictingFrameworks.length > 0) {
        blockers.push(`Conflicting compliance requirements detected: ${conflictingFrameworks.join(', ')}`);
      }
    }

    // Sort recommendations by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return {
      currentStep: nextSteps[0] || 'review_recommendations',
      nextSteps,
      completedSteps,
      recommendations: recommendations.slice(0, 10), // Limit to top 10
      blockers,
      warnings
    };
  }

  private static hasConflictingRequirements(framework1: any, framework2: any): boolean {
    // Simple conflict detection - can be enhanced
    const req1 = framework1.requirements?.map((r: any) => r.toString().toLowerCase()) || [];
    const req2 = framework2.requirements?.map((r: any) => r.toString().toLowerCase()) || [];
    
    const conflictKeywords = [
      ['encryption', 'no-encryption'],
      ['mfa-required', 'single-factor'],
      ['audit-all', 'minimal-audit']
    ];
    
    return conflictKeywords.some(([keyword1, keyword2]) => 
      req1.some((r: string) => r.includes(keyword1)) && 
      req2.some((r: string) => r.includes(keyword2))
    );
  }

  static async generateImplementationChecklist(
    context: DecisionContext,
    selectedRecommendations: DecisionRecommendation[]
  ): Promise<any[]> {
    const resourceData = await this.getResourceLibraryData();
    const checklist: any[] = [];

    // Phase 1: Planning & Preparation
    checklist.push({
      phase: 'Planning & Preparation',
      tasks: [
        {
          id: 'stakeholder-alignment',
          title: 'Stakeholder Alignment',
          description: 'Confirm project scope and requirements with all stakeholders',
          estimatedHours: 8,
          prerequisites: [],
          deliverables: ['Stakeholder sign-off document']
        },
        {
          id: 'resource-allocation',
          title: 'Resource Allocation',
          description: 'Assign team members and allocate necessary resources',
          estimatedHours: 4,
          prerequisites: ['stakeholder-alignment'],
          deliverables: ['Resource allocation plan']
        }
      ]
    });

    // Generate phase-specific tasks based on selected recommendations
    const useCaseRecommendations = selectedRecommendations.filter(r => r.type === 'use_case');
    const vendorRecommendations = selectedRecommendations.filter(r => r.type === 'vendor');
    const requirementRecommendations = selectedRecommendations.filter(r => r.type === 'requirement');

    // Phase 2: Configuration & Setup
    if (useCaseRecommendations.length > 0 || vendorRecommendations.length > 0) {
      const configTasks: any[] = [];

      vendorRecommendations.forEach(vendor => {
        configTasks.push({
          id: `config-${vendor.id}`,
          title: `Configure ${vendor.title}`,
          description: `Set up and configure ${vendor.title} according to requirements`,
          estimatedHours: vendor.metadata.configuration_complexity === 'high' ? 16 : 8,
          prerequisites: ['resource-allocation'],
          deliverables: [`${vendor.title} configuration document`]
        });
      });

      useCaseRecommendations.forEach(useCase => {
        configTasks.push({
          id: `implement-${useCase.id}`,
          title: `Implement ${useCase.title}`,
          description: useCase.description,
          estimatedHours: (useCase.metadata.estimated_effort_weeks || 1) * 40,
          prerequisites: useCase.dependencies || [],
          deliverables: [`${useCase.title} implementation guide`]
        });
      });

      checklist.push({
        phase: 'Configuration & Setup',
        tasks: configTasks
      });
    }

    // Phase 3: Testing & Validation
    checklist.push({
      phase: 'Testing & Validation',
      tasks: [
        {
          id: 'unit-testing',
          title: 'Unit Testing',
          description: 'Test individual components and configurations',
          estimatedHours: 16,
          prerequisites: configTasks?.map(t => t.id) || [],
          deliverables: ['Unit test results']
        },
        {
          id: 'integration-testing',
          title: 'Integration Testing',
          description: 'Test end-to-end workflows and integrations',
          estimatedHours: 24,
          prerequisites: ['unit-testing'],
          deliverables: ['Integration test results']
        }
      ]
    });

    // Phase 4: Deployment & Go-Live
    checklist.push({
      phase: 'Deployment & Go-Live',
      tasks: [
        {
          id: 'pilot-deployment',
          title: 'Pilot Deployment',
          description: 'Deploy to pilot group for validation',
          estimatedHours: 12,
          prerequisites: ['integration-testing'],
          deliverables: ['Pilot deployment report']
        },
        {
          id: 'production-deployment',
          title: 'Production Deployment',
          description: 'Full production rollout',
          estimatedHours: 20,
          prerequisites: ['pilot-deployment'],
          deliverables: ['Production deployment report']
        }
      ]
    });

    return checklist;
  }
}
