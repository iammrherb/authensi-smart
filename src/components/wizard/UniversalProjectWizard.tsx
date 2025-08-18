import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfessionalMarkdown from "@/components/ui/professional-markdown";
import { 
  Target, Building2, MapPin, Zap, Settings, CheckCircle, Users, Network, Shield, 
  Brain, Cpu, Rocket, FileText, Clock, Star, Lightbulb, TrendingUp, BarChart3,
  Workflow, GitBranch, TestTube, Eye, Download, Save, Copy, RefreshCw, Play,
  ArrowRight, ArrowLeft, Plus, Minus, Info, AlertTriangle, Check, X
} from 'lucide-react';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useToast } from '@/hooks/use-toast';

interface UniversalProjectWizardProps {
  onComplete?: (projectData: any) => void;
  onCancel?: () => void;
  initialData?: any;
  mode?: 'create' | 'edit' | 'clone';
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  category: 'planning' | 'design' | 'implementation' | 'optimization';
  required: boolean;
  estimatedTime: number;
  dependencies?: string[];
  aiEnhanced: boolean;
}

interface ProjectData {
  // Core Project Information
  basic: {
    name: string;
    description: string;
    client_name: string;
    industry: string;
    organization_size: string;
    project_type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeline: string;
    budget_range: string;
  };
  
  // Stakeholder Management
  stakeholders: {
    project_sponsor: string;
    technical_lead: string;
    business_owner: string;
    security_lead: string;
    team_members: Array<{
      name: string;
      role: string;
      email: string;
      responsibilities: string[];
    }>;
    external_contacts: Array<{
      organization: string;
      contact_name: string;
      role: string;
      email: string;
    }>;
  };
  
  // Requirements & Scope
  requirements: {
    business_objectives: string[];
    technical_requirements: string[];
    compliance_frameworks: string[];
    security_requirements: string[];
    performance_requirements: string[];
    integration_requirements: string[];
    user_requirements: string[];
    custom_requirements: Array<{
      category: string;
      requirement: string;
      priority: string;
      source: string;
    }>;
  };
  
  // Infrastructure & Environment
  infrastructure: {
    current_state: {
      network_topology: string;
      device_inventory: Array<{
        type: string;
        vendor: string;
        model: string;
        quantity: number;
        location: string;
      }>;
      user_count: number;
      site_count: number;
      existing_security_tools: string[];
    };
    target_state: {
      deployment_model: string;
      scalability_requirements: string;
      redundancy_model: string;
      integration_architecture: string;
      performance_targets: {
        availability: string;
        response_time: string;
        throughput: string;
        capacity: string;
      };
    };
  };
  
  // Risk & Compliance
  governance: {
    risk_assessment: {
      business_risks: Array<{
        risk: string;
        probability: 'low' | 'medium' | 'high';
        impact: 'low' | 'medium' | 'high';
        mitigation: string;
      }>;
      technical_risks: Array<{
        risk: string;
        probability: 'low' | 'medium' | 'high';
        impact: 'low' | 'medium' | 'high';
        mitigation: string;
      }>;
      security_risks: Array<{
        risk: string;
        probability: 'low' | 'medium' | 'high';
        impact: 'low' | 'medium' | 'high';
        mitigation: string;
      }>;
    };
    compliance_mapping: {
      applicable_standards: string[];
      gap_analysis: Array<{
        standard: string;
        requirement: string;
        current_state: string;
        target_state: string;
        gap: string;
        remediation_plan: string;
      }>;
    };
  };
  
  // Implementation Planning
  implementation: {
    methodology: string;
    phases: Array<{
      name: string;
      description: string;
      duration: string;
      dependencies: string[];
      deliverables: string[];
      success_criteria: string[];
      resources_required: Array<{
        type: string;
        quantity: number;
        duration: string;
      }>;
    }>;
    milestones: Array<{
      name: string;
      description: string;
      target_date: string;
      dependencies: string[];
      success_criteria: string[];
    }>;
    resource_plan: {
      team_structure: any[];
      skill_requirements: string[];
      training_needs: string[];
      vendor_resources: string[];
    };
  };
  
  // Quality & Testing
  quality: {
    testing_strategy: {
      test_types: string[];
      test_environments: string[];
      acceptance_criteria: string[];
      performance_benchmarks: any[];
    };
    quality_gates: Array<{
      phase: string;
      criteria: string[];
      approval_required: boolean;
      stakeholders: string[];
    }>;
  };
  
  // AI Configuration
  ai_settings: {
    enable_ai_insights: boolean;
    enable_predictive_analytics: boolean;
    enable_automated_reporting: boolean;
    ai_optimization_level: 'basic' | 'advanced' | 'comprehensive';
    custom_ai_prompts: Array<{
      trigger: string;
      prompt: string;
      frequency: string;
    }>;
  };
}

const UniversalProjectWizard: React.FC<UniversalProjectWizardProps> = ({
  onComplete,
  onCancel,
  initialData,
  mode = 'create'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  
  const { generateCompletion, isLoading } = useEnhancedAI();
  const { data: projects } = useProjects();
  const { toast } = useToast();

  // Comprehensive wizard steps
  const wizardSteps: WizardStep[] = [
    {
      id: 'project_foundation',
      title: 'Project Foundation',
      description: 'Define core project information, objectives, and stakeholder structure',
      icon: Building2,
      category: 'planning',
      required: true,
      estimatedTime: 10,
      aiEnhanced: true
    },
    {
      id: 'requirements_analysis',
      title: 'Requirements Analysis',
      description: 'Comprehensive requirements gathering and analysis with AI assistance',
      icon: FileText,
      category: 'planning',
      required: true,
      estimatedTime: 15,
      dependencies: ['project_foundation'],
      aiEnhanced: true
    },
    {
      id: 'infrastructure_assessment',
      title: 'Infrastructure Assessment',
      description: 'Current state analysis and target architecture definition',
      icon: Network,
      category: 'design',
      required: true,
      estimatedTime: 20,
      dependencies: ['requirements_analysis'],
      aiEnhanced: true
    },
    {
      id: 'risk_governance',
      title: 'Risk & Governance Framework',
      description: 'Risk assessment, compliance mapping, and governance structure',
      icon: Shield,
      category: 'design',
      required: true,
      estimatedTime: 12,
      dependencies: ['infrastructure_assessment'],
      aiEnhanced: true
    },
    {
      id: 'implementation_strategy',
      title: 'Implementation Strategy',
      description: 'Detailed implementation planning with phases, milestones, and resources',
      icon: Workflow,
      category: 'implementation',
      required: true,
      estimatedTime: 18,
      dependencies: ['risk_governance'],
      aiEnhanced: true
    },
    {
      id: 'quality_assurance',
      title: 'Quality Assurance Framework',
      description: 'Testing strategy, quality gates, and success criteria definition',
      icon: TestTube,
      category: 'implementation',
      required: true,
      estimatedTime: 10,
      dependencies: ['implementation_strategy'],
      aiEnhanced: true
    },
    {
      id: 'ai_optimization',
      title: 'AI Optimization & Insights',
      description: 'Configure AI-powered project optimization and predictive analytics',
      icon: Brain,
      category: 'optimization',
      required: false,
      estimatedTime: 8,
      dependencies: ['quality_assurance'],
      aiEnhanced: true
    },
    {
      id: 'finalization',
      title: 'Project Plan Finalization',
      description: 'Generate comprehensive project documentation and implementation plan',
      icon: CheckCircle,
      category: 'optimization',
      required: true,
      estimatedTime: 5,
      dependencies: ['ai_optimization'],
      aiEnhanced: true
    }
  ];

  // Initialize project data
  const [projectData, setProjectData] = useState<ProjectData>({
    basic: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      client_name: initialData?.client_name || '',
      industry: initialData?.industry || '',
      organization_size: initialData?.organization_size || '',
      project_type: 'network_access_control',
      priority: 'medium',
      timeline: '',
      budget_range: ''
    },
    stakeholders: {
      project_sponsor: '',
      technical_lead: '',
      business_owner: '',
      security_lead: '',
      team_members: [],
      external_contacts: []
    },
    requirements: {
      business_objectives: [],
      technical_requirements: [],
      compliance_frameworks: [],
      security_requirements: [],
      performance_requirements: [],
      integration_requirements: [],
      user_requirements: [],
      custom_requirements: []
    },
    infrastructure: {
      current_state: {
        network_topology: '',
        device_inventory: [],
        user_count: 0,
        site_count: 0,
        existing_security_tools: []
      },
      target_state: {
        deployment_model: '',
        scalability_requirements: '',
        redundancy_model: '',
        integration_architecture: '',
        performance_targets: {
          availability: '',
          response_time: '',
          throughput: '',
          capacity: ''
        }
      }
    },
    governance: {
      risk_assessment: {
        business_risks: [],
        technical_risks: [],
        security_risks: []
      },
      compliance_mapping: {
        applicable_standards: [],
        gap_analysis: []
      }
    },
    implementation: {
      methodology: '',
      phases: [],
      milestones: [],
      resource_plan: {
        team_structure: [],
        skill_requirements: [],
        training_needs: [],
        vendor_resources: []
      }
    },
    quality: {
      testing_strategy: {
        test_types: [],
        test_environments: [],
        acceptance_criteria: [],
        performance_benchmarks: []
      },
      quality_gates: []
    },
    ai_settings: {
      enable_ai_insights: true,
      enable_predictive_analytics: true,
      enable_automated_reporting: true,
      ai_optimization_level: 'advanced',
      custom_ai_prompts: []
    }
  });

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const completedSteps = currentStep + 1;
    const totalSteps = wizardSteps.length;
    return (completedSteps / totalSteps) * 100;
  }, [currentStep, wizardSteps.length]);

  // Update project data
  const updateProjectData = (section: keyof ProjectData, data: any) => {
    setProjectData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < wizardSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Generate comprehensive project plan with AI
  const generateComprehensiveProjectPlan = async () => {
    setIsGeneratingPlan(true);
    setGenerationProgress(0);

    try {
      // Phase 1: Project Analysis and Foundation
      setGenerationProgress(20);
      
      const foundationPrompt = `
# COMPREHENSIVE PROJECT ANALYSIS & FOUNDATION

## PROJECT OVERVIEW
- **Project Name:** ${projectData.basic.name}
- **Client:** ${projectData.basic.client_name}
- **Industry:** ${projectData.basic.industry}
- **Organization Size:** ${projectData.basic.organization_size}
- **Priority Level:** ${projectData.basic.priority}

## ANALYSIS REQUIREMENTS

Generate a comprehensive project foundation document that includes:

### 🎯 EXECUTIVE SUMMARY [COLLAPSIBLE]
**Strategic Overview:**
- Project vision and strategic alignment
- Business value proposition
- Key success factors
- Executive stakeholder summary

**Investment Justification:**
- ROI analysis and business case
- Cost-benefit breakdown
- Risk-adjusted returns
- Implementation timeline impact

### 📊 STAKEHOLDER ECOSYSTEM [COLLAPSIBLE]
**Primary Stakeholders:**
- Executive sponsors and decision makers
- Technical team leads and architects
- Business process owners
- End user representatives

**Engagement Strategy:**
- Communication plan and cadence
- Decision-making authority matrix
- Escalation procedures and protocols
- Change management approach

### 🏗️ PROJECT ARCHITECTURE [COLLAPSIBLE]
**Organizational Structure:**
- Project governance model
- Team structure and responsibilities
- Reporting relationships
- Communication channels

**Delivery Framework:**
- Methodology selection rationale
- Phase gate definitions
- Quality checkpoints
- Success criteria framework

### 📋 SCOPE DEFINITION [COLLAPSIBLE]
**Included Scope:**
- Core deliverables and outcomes
- Technical implementation scope
- Integration and testing scope
- Training and change management

**Excluded Scope:**
- Out-of-scope items and rationale
- Future phase considerations
- Boundary conditions
- Assumption documentation

Provide detailed analysis with professional markdown formatting and actionable insights.
      `;

      const foundationResult = await generateCompletion({
        prompt: foundationPrompt,
        taskType: 'project_insights',
        context: 'comprehensive_foundation'
      });

      // Phase 2: Risk Assessment and Mitigation Strategy
      setGenerationProgress(40);

      const riskPrompt = `
# COMPREHENSIVE RISK ASSESSMENT & MITIGATION STRATEGY

## RISK ANALYSIS FRAMEWORK

Generate a detailed risk assessment covering:

### ⚠️ BUSINESS RISK ANALYSIS [COLLAPSIBLE]
**Strategic Risks:**
- [ ] **[HIGH]** Stakeholder alignment and buy-in risks
  - *Probability:* Medium | *Impact:* High
  - *Mitigation:* Executive sponsorship program and regular stakeholder updates
  
- [ ] **[MEDIUM]** Budget and timeline constraints
  - *Probability:* Medium | *Impact:* Medium  
  - *Mitigation:* Phased delivery approach with early value realization

- [ ] **[LOW]** Organizational change resistance
  - *Probability:* Low | *Impact:* Medium
  - *Mitigation:* Comprehensive change management and training program

**Financial Risks:**
- Budget overrun scenarios and controls
- Resource cost escalation mitigation
- ROI realization timeline risks
- Contingency planning and reserves

### 🔧 TECHNICAL RISK ANALYSIS [COLLAPSIBLE]
**Infrastructure Risks:**
- [ ] **[HIGH]** Integration complexity with existing systems
  - *Assessment:* Critical path dependency analysis required
  - *Mitigation:* Proof of concept and pilot deployment strategy

- [ ] **[MEDIUM]** Performance and scalability concerns
  - *Assessment:* Load testing and capacity planning required
  - *Mitigation:* Phased rollout with performance monitoring

**Security Risks:**
- [ ] **[CRITICAL]** Data security and privacy compliance
  - *Assessment:* Security audit and compliance review required
  - *Mitigation:* Security-by-design approach and regular audits

### 🛡️ OPERATIONAL RISK FRAMEWORK [COLLAPSIBLE]
**Continuity Planning:**
- Business continuity impact assessment
- Disaster recovery planning requirements
- Service level agreement definitions
- Vendor dependency risk management

**Quality Assurance:**
- Testing strategy risk mitigation
- User acceptance criteria validation
- Performance benchmark achievement
- Compliance verification procedures

### 📈 RISK MONITORING & RESPONSE [COLLAPSIBLE]
**Risk Dashboard:**
- Real-time risk indicator tracking
- Escalation trigger definitions
- Response procedure automation
- Stakeholder notification protocols

**Continuous Improvement:**
- Risk assessment review cycles
- Lessons learned integration
- Risk mitigation effectiveness measurement
- Strategic risk realignment processes

Provide comprehensive risk analysis with quantified impact assessments and detailed mitigation strategies.
      `;

      const riskResult = await generateCompletion({
        prompt: riskPrompt,
        taskType: 'project_insights',
        context: 'comprehensive_risk_assessment'
      });

      // Phase 3: Implementation Strategy and Roadmap
      setGenerationProgress(60);

      const implementationPrompt = `
# STRATEGIC IMPLEMENTATION ROADMAP

## IMPLEMENTATION FRAMEWORK

Create a detailed implementation strategy:

### 🚀 PHASED DELIVERY STRATEGY [COLLAPSIBLE]
**Phase 1: Foundation & Planning (Weeks 1-3)**
- [ ] **Week 1:** Project initiation and stakeholder alignment
  - Project charter finalization
  - Team onboarding and role definition
  - Communication plan activation
  - Risk management framework setup

- [ ] **Week 2:** Requirements validation and architecture design
  - Detailed requirements gathering
  - Current state assessment
  - Target architecture definition
  - Integration planning

- [ ] **Week 3:** Solution design and procurement
  - Vendor selection and contracting
  - Detailed design documentation
  - Implementation planning
  - Resource allocation

**Phase 2: Infrastructure Preparation (Weeks 4-6)**
- [ ] **Week 4:** Infrastructure assessment and preparation
- [ ] **Week 5:** Security baseline establishment
- [ ] **Week 6:** Testing environment setup

**Phase 3: Pilot Implementation (Weeks 7-10)**
- [ ] **Week 7-8:** Pilot site deployment
- [ ] **Week 9:** Testing and validation
- [ ] **Week 10:** Issue resolution and optimization

**Phase 4: Production Rollout (Weeks 11-16)**
- [ ] **Week 11-14:** Phased production deployment
- [ ] **Week 15:** User training and adoption
- [ ] **Week 16:** Go-live and stabilization

### ⏰ MILESTONE FRAMEWORK [COLLAPSIBLE]
**Critical Milestones:**
- 🎯 **M1:** Project Charter Approval (Week 1)
  - Stakeholder sign-off achieved
  - Budget and timeline confirmed
  - Team structure established

- 🎯 **M2:** Architecture Design Approval (Week 3)
  - Technical architecture validated
  - Security requirements confirmed
  - Integration approach approved

- 🎯 **M3:** Pilot Success Validation (Week 10)
  - Pilot deployment completed
  - Success criteria met
  - Production readiness confirmed

- 🎯 **M4:** Production Go-Live (Week 16)
  - Full deployment completed
  - User adoption achieved
  - Success metrics validated

### 👥 RESOURCE OPTIMIZATION [COLLAPSIBLE]
**Team Structure:**
- **Project Management Office (PMO)**
  - Project Manager: 1.0 FTE
  - Business Analyst: 0.5 FTE
  - Quality Assurance Lead: 0.5 FTE

- **Technical Implementation Team**
  - Solution Architect: 1.0 FTE
  - Network Engineers: 2.0 FTE
  - Security Specialists: 1.5 FTE
  - Integration Specialists: 1.0 FTE

- **Business Enablement Team**
  - Change Management Lead: 0.5 FTE
  - Training Coordinator: 0.3 FTE
  - User Experience Designer: 0.3 FTE

**Skill Development Plan:**
- Technical certification requirements
- Training program development
- Knowledge transfer protocols
- Vendor support coordination

### 📊 SUCCESS MEASUREMENT [COLLAPSIBLE]
**Key Performance Indicators (KPIs):**
- **Technical KPIs**
  - [ ] Network uptime > 99.5%
  - [ ] Authentication success rate > 98%
  - [ ] Response time < 2 seconds
  - [ ] Security incident reduction > 75%

- **Business KPIs**
  - [ ] User satisfaction score > 4.0/5
  - [ ] Help desk ticket reduction > 50%
  - [ ] Compliance audit success rate > 95%
  - [ ] ROI achievement within 12 months

- **Project KPIs**
  - [ ] On-time delivery (±5%)
  - [ ] Budget variance < 10%
  - [ ] Scope creep < 15%
  - [ ] Stakeholder satisfaction > 4.5/5

Provide comprehensive implementation guidance with detailed timelines and resource allocation.
      `;

      const implementationResult = await generateCompletion({
        prompt: implementationPrompt,
        taskType: 'project_insights',
        context: 'strategic_roadmap'
      });

      // Phase 4: Quality Assurance and Testing Strategy
      setGenerationProgress(80);

      const qualityPrompt = `
# COMPREHENSIVE QUALITY ASSURANCE & TESTING STRATEGY

## QUALITY FRAMEWORK

Develop a robust quality assurance framework:

### 🧪 TESTING METHODOLOGY [COLLAPSIBLE]
**Multi-Tier Testing Approach:**

**Unit Testing (Weeks 4-6)**
- [ ] **Component Testing**
  - Individual device configuration validation
  - Authentication method verification
  - Policy rule testing
  - Integration endpoint validation

- [ ] **Security Testing**
  - Vulnerability assessment
  - Penetration testing
  - Configuration security audit
  - Compliance validation

**Integration Testing (Weeks 7-9)**
- [ ] **System Integration**
  - Cross-platform compatibility testing
  - API integration validation
  - Data flow verification
  - Performance baseline establishment

- [ ] **User Acceptance Testing**
  - Business process validation
  - User experience testing
  - Accessibility compliance
  - Training effectiveness validation

**Performance Testing (Weeks 8-10)**
- [ ] **Load Testing**
  - Concurrent user simulation
  - Peak traffic handling
  - Resource utilization monitoring
  - Scalability validation

- [ ] **Stress Testing**
  - System breaking point identification
  - Recovery time measurement
  - Failover mechanism validation
  - Disaster recovery testing

### ✅ QUALITY GATES [COLLAPSIBLE]
**Phase Gate Criteria:**

**Gate 1: Design Review**
- [ ] Architecture review completed
- [ ] Security requirements validated
- [ ] Integration plan approved
- [ ] Risk assessment updated

**Gate 2: Implementation Review**
- [ ] Code quality standards met
- [ ] Security scanning passed
- [ ] Integration testing completed
- [ ] Performance benchmarks achieved

**Gate 3: Production Readiness**
- [ ] User acceptance testing passed
- [ ] Production environment validated
- [ ] Operational procedures documented
- [ ] Go-live checklist completed

### 📋 COMPLIANCE VALIDATION [COLLAPSIBLE]
**Regulatory Compliance:**
- Industry standard compliance verification
- Data privacy regulation adherence
- Security framework alignment
- Audit trail documentation

**Operational Compliance:**
- Change management procedure compliance
- Documentation standard adherence
- Training requirement fulfillment
- Service level agreement validation

### 📈 CONTINUOUS IMPROVEMENT [COLLAPSIBLE]
**Quality Metrics Dashboard:**
- Defect detection rate tracking
- Test coverage measurement
- User satisfaction monitoring
- Performance trend analysis

**Process Optimization:**
- Testing efficiency improvement
- Automation opportunity identification
- Resource utilization optimization
- Knowledge sharing enhancement

Provide detailed testing procedures with automation recommendations and quality metrics.
      `;

      const qualityResult = await generateCompletion({
        prompt: qualityPrompt,
        taskType: 'project_insights',
        context: 'comprehensive_testing'
      });

      // Phase 5: Finalization and Documentation
      setGenerationProgress(100);

      const plan = {
        id: `project-plan-${Date.now()}`,
        projectData,
        generatedAt: new Date().toISOString(),
        metadata: {
          title: `${projectData.basic.name} - Comprehensive Project Implementation Plan`,
          version: '1.0.0',
          author: 'Universal Project Wizard AI',
          status: 'Active',
          priority: projectData.basic.priority
        },
        foundation: foundationResult?.content || '',
        riskAssessment: riskResult?.content || '',
        implementationStrategy: implementationResult?.content || '',
        qualityFramework: qualityResult?.content || '',
        estimatedDuration: calculateProjectDuration(),
        estimatedCost: calculateProjectCost(),
        successProbability: calculateSuccessProbability()
      };

      setGeneratedPlan(plan);

      toast({
        title: "Project Plan Generated Successfully!",
        description: "Your comprehensive project implementation plan is ready for review.",
      });

    } catch (error) {
      console.error('Project plan generation failed:', error);
      toast({
        title: "Plan Generation Failed",
        description: "Please review your inputs and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Helper functions
  const calculateProjectDuration = (): string => {
    const baseWeeks = 16;
    const complexityMultiplier = {
      low: 0.8,
      medium: 1.0,
      high: 1.3,
      critical: 1.5
    };
    
    const multiplier = complexityMultiplier[projectData.basic.priority];
    const totalWeeks = Math.ceil(baseWeeks * multiplier);
    
    return `${totalWeeks} weeks`;
  };

  const calculateProjectCost = (): string => {
    // Simplified cost calculation
    const baseCost = 250000;
    const sizeMultiplier = {
      small: 0.6,
      medium: 1.0,
      large: 1.8,
      enterprise: 2.5
    };
    
    const multiplier = sizeMultiplier[projectData.basic.organization_size as keyof typeof sizeMultiplier] || 1.0;
    const totalCost = Math.ceil(baseCost * multiplier);
    
    return `$${totalCost.toLocaleString()}`;
  };

  const calculateSuccessProbability = (): number => {
    let probability = 85;
    
    if (projectData.basic.priority === 'critical') probability -= 15;
    if (projectData.basic.organization_size === 'enterprise') probability -= 10;
    if (projectData.requirements.compliance_frameworks.length > 3) probability -= 5;
    
    return Math.max(probability, 60);
  };

  // Step content renderers
  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case 'project_foundation':
        return renderProjectFoundationStep();
      case 'requirements_analysis':
        return renderRequirementsAnalysisStep();
      case 'infrastructure_assessment':
        return renderInfrastructureAssessmentStep();
      case 'risk_governance':
        return renderRiskGovernanceStep();
      case 'implementation_strategy':
        return renderImplementationStrategyStep();
      case 'quality_assurance':
        return renderQualityAssuranceStep();
      case 'ai_optimization':
        return renderAIOptimizationStep();
      case 'finalization':
        return renderFinalizationStep();
      default:
        return <div>Step content not implemented</div>;
    }
  };

  const renderProjectFoundationStep = () => (
    <div className="space-y-6">
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          This step establishes the foundation for your project with AI-powered analysis and recommendations.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                value={projectData.basic.name}
                onChange={(e) => updateProjectData('basic', { name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div>
              <Label htmlFor="client_name">Client/Organization *</Label>
              <Input
                id="client_name"
                value={projectData.basic.client_name}
                onChange={(e) => updateProjectData('basic', { client_name: e.target.value })}
                placeholder="Enter client or organization name"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={projectData.basic.description}
                onChange={(e) => updateProjectData('basic', { description: e.target.value })}
                placeholder="Describe the project objectives and scope"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={projectData.basic.industry} 
                  onValueChange={(value) => updateProjectData('basic', { industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial_services">Financial Services</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="energy">Energy & Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="org_size">Organization Size *</Label>
                <Select 
                  value={projectData.basic.organization_size} 
                  onValueChange={(value) => updateProjectData('basic', { organization_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-100 users)</SelectItem>
                    <SelectItem value="medium">Medium (101-1000 users)</SelectItem>
                    <SelectItem value="large">Large (1001-5000 users)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (5000+ users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Project Priority *</Label>
                <Select 
                  value={projectData.basic.priority} 
                  onValueChange={(value) => updateProjectData('basic', { priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="critical">Critical/Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="timeline">Expected Timeline</Label>
                <Select 
                  value={projectData.basic.timeline} 
                  onValueChange={(value) => updateProjectData('basic', { timeline: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (under 1 month)</SelectItem>
                    <SelectItem value="short">Short Term (1-3 months)</SelectItem>
                    <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
                    <SelectItem value="long">Long Term (6+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="budget_range">Budget Range</Label>
              <Select 
                value={projectData.basic.budget_range} 
                onValueChange={(value) => updateProjectData('basic', { budget_range: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_100k">Under $100K</SelectItem>
                  <SelectItem value="100k_250k">$100K - $250K</SelectItem>
                  <SelectItem value="250k_500k">$250K - $500K</SelectItem>
                  <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                  <SelectItem value="over_1m">Over $1M</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      {projectData.basic.name && projectData.basic.industry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Project Insights
            </CardTitle>
            <CardDescription>
              AI-powered recommendations based on your project characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Success Probability</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{calculateSuccessProbability()}%</div>
                <p className="text-sm text-blue-600">Based on similar projects</p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">Estimated Duration</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{calculateProjectDuration()}</div>
                <p className="text-sm text-green-600">Industry average timeline</p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-600">Estimated Investment</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">{calculateProjectCost()}</div>
                <p className="text-sm text-purple-600">Estimated project cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRequirementsAnalysisStep = () => (
    <div className="space-y-6">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Comprehensive requirements gathering with AI-powered analysis and validation.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Requirements Analysis</CardTitle>
          <CardDescription>
            This step will be fully implemented with comprehensive requirements gathering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Requirements analysis step implementation in progress...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderInfrastructureAssessmentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Assessment</CardTitle>
          <CardDescription>
            Current state analysis and target architecture definition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Infrastructure assessment step implementation in progress...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderRiskGovernanceStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk & Governance Framework</CardTitle>
          <CardDescription>
            Risk assessment, compliance mapping, and governance structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Risk and governance step implementation in progress...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderImplementationStrategyStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Implementation Strategy</CardTitle>
          <CardDescription>
            Detailed implementation planning with phases, milestones, and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Implementation strategy step implementation in progress...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderQualityAssuranceStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality Assurance Framework</CardTitle>
          <CardDescription>
            Testing strategy, quality gates, and success criteria definition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Quality assurance step implementation in progress...
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAIOptimizationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Optimization & Insights</CardTitle>
          <CardDescription>
            Configure AI-powered project optimization and predictive analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai_insights">Enable AI Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered project insights and recommendations
                </p>
              </div>
              <Switch
                id="ai_insights"
                checked={projectData.ai_settings.enable_ai_insights}
                onCheckedChange={(checked) => 
                  updateProjectData('ai_settings', { enable_ai_insights: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="predictive_analytics">Predictive Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Enable predictive project analytics and risk assessment
                </p>
              </div>
              <Switch
                id="predictive_analytics"
                checked={projectData.ai_settings.enable_predictive_analytics}
                onCheckedChange={(checked) => 
                  updateProjectData('ai_settings', { enable_predictive_analytics: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="automated_reporting">Automated Reporting</Label>
                <p className="text-sm text-muted-foreground">
                  Generate automated project reports and status updates
                </p>
              </div>
              <Switch
                id="automated_reporting"
                checked={projectData.ai_settings.enable_automated_reporting}
                onCheckedChange={(checked) => 
                  updateProjectData('ai_settings', { enable_automated_reporting: checked })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="optimization_level">AI Optimization Level</Label>
              <Select 
                value={projectData.ai_settings.ai_optimization_level} 
                onValueChange={(value) => 
                  updateProjectData('ai_settings', { ai_optimization_level: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select optimization level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic - Essential insights only</SelectItem>
                  <SelectItem value="advanced">Advanced - Comprehensive analysis</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive - Full AI optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinalizationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Plan Finalization</CardTitle>
          <CardDescription>
            Generate comprehensive project documentation and implementation plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            {!generatedPlan ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to generate your comprehensive project implementation plan with AI optimization.
                </p>
                
                <Button 
                  onClick={generateComprehensiveProjectPlan} 
                  disabled={isGeneratingPlan}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Brain className="h-5 w-5 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Rocket className="h-5 w-5 mr-2" />
                      Generate Comprehensive Project Plan
                    </>
                  )}
                </Button>
                
                {isGeneratingPlan && (
                  <div className="space-y-2">
                    <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {generationProgress < 25 ? 'Analyzing project foundation...' :
                       generationProgress < 50 ? 'Assessing risks and mitigation strategies...' :
                       generationProgress < 75 ? 'Creating implementation roadmap...' :
                       generationProgress < 100 ? 'Developing quality framework...' :
                       'Finalizing comprehensive plan...'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                <h3 className="text-xl font-semibold">Project Plan Generated Successfully!</h3>
                <p className="text-muted-foreground">
                  Your comprehensive project implementation plan is ready for review and deployment.
                </p>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Plan
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Plan
                  </Button>
                  <Button variant="outline" onClick={() => onComplete?.(generatedPlan)}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {generatedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{generatedPlan.estimatedDuration}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{generatedPlan.estimatedCost}</div>
                  <div className="text-sm text-muted-foreground">Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{generatedPlan.successProbability}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Plan Contents:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Project Foundation & Strategic Analysis</li>
                  <li>• Comprehensive Risk Assessment & Mitigation</li>
                  <li>• Implementation Strategy & Roadmap</li>
                  <li>• Quality Assurance & Testing Framework</li>
                  <li>• Resource Planning & Team Structure</li>
                  <li>• Success Metrics & KPI Framework</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Universal Project Wizard</h1>
                <p className="text-muted-foreground">
                  Comprehensive AI-powered project planning and implementation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">Progress: {Math.round(completionPercentage)}%</div>
                <Progress value={completionPercentage} className="w-32" />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Wizard</CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {wizardSteps.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {wizardSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          index === currentStep
                            ? 'bg-primary text-primary-foreground'
                            : index < currentStep
                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => jumpToStep(index)}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          index === currentStep
                            ? 'border-primary-foreground bg-primary-foreground text-primary'
                            : index < currentStep
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-muted-foreground'
                        }`}>
                         {index < currentStep ? (
                           <Check className="h-4 w-4" />
                         ) : (
                           <div className="h-4 w-4">
                             {(() => {
                               const IconComponent = step.icon;
                               return <IconComponent />;
                             })()}
                           </div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{step.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {step.category}
                          </Badge>
                          {step.aiEnhanced && (
                            <Badge variant="secondary" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-5 w-5">
                        {(() => {
                          const IconComponent = wizardSteps[currentStep].icon;
                          return <IconComponent />;
                        })()}
                      </div>
                      {wizardSteps[currentStep].title}
                    </CardTitle>
                    <CardDescription>
                      {wizardSteps[currentStep].description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {wizardSteps[currentStep].category}
                    </Badge>
                    {wizardSteps[currentStep].aiEnhanced && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        AI Enhanced
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {renderStepContent()}
                </ScrollArea>
              </CardContent>
              
              <div className="flex items-center justify-between p-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Est. {wizardSteps[currentStep].estimatedTime} minutes
                </div>
                
                <Button
                  onClick={nextStep}
                  disabled={currentStep === wizardSteps.length - 1}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalProjectWizard;