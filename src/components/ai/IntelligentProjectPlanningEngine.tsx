import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfessionalMarkdown from '@/components/ui/professional-markdown';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { 
  Brain, 
  Target, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  FileText,
  TrendingUp,
  Calendar,
  Settings,
  Layers,
  Network,
  Shield,
  Building2,
  User,
  Star,
  RefreshCw,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  client_name: string;
  industry: string;
  deployment_type: string;
  security_level: string;
  total_sites: number;
  total_endpoints: number;
  estimated_budget?: number;
  start_date?: string;
  end_date?: string;
  compliance_requirements?: string[];
  pain_points?: any[];
  success_criteria?: any[];
  customer_organization?: string;
  current_phase?: string;
  progress_percentage?: number;
}

interface IntelligentProjectPlanningEngineProps {
  projectData: ProjectData;
  useCases?: any[];
  vendors?: any[];
  sites?: any[];
  requirements?: any[];
  onPlanGenerated?: (plan: any) => void;
  className?: string;
}

const IntelligentProjectPlanningEngine: React.FC<IntelligentProjectPlanningEngineProps> = ({
  projectData,
  useCases = [],
  vendors = [],
  sites = [],
  requirements = [],
  onPlanGenerated,
  className
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'analysis' | 'planning' | 'optimization' | 'finalization'>('analysis');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    generateCompletion, 
    generateProjectSummary,
    generateRecommendations,
    isLoading 
  } = useEnhancedAI();

  const planningPhases = [
    {
      id: 'analysis',
      name: 'Project Analysis',
      description: 'Analyzing project requirements and constraints',
      duration: 2000,
      icon: Brain
    },
    {
      id: 'planning',
      name: 'Strategic Planning',
      description: 'Creating detailed implementation roadmap',
      duration: 3000,
      icon: Target
    },
    {
      id: 'optimization',
      name: 'Plan Optimization',
      description: 'Optimizing timeline and resource allocation',
      duration: 2500,
      icon: TrendingUp
    },
    {
      id: 'finalization',
      name: 'Plan Finalization',
      description: 'Finalizing deliverables and documentation',
      duration: 1500,
      icon: CheckCircle
    }
  ];

  const generateComprehensivePlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Phase 1: Analysis
      setCurrentPhase('analysis');
      await simulateProgress(25, 2000);
      
      const analysisPrompt = `
# COMPREHENSIVE PROJECT ANALYSIS

## PROJECT OVERVIEW
- **Project Name:** ${projectData.name}
- **Client:** ${projectData.client_name}
- **Industry:** ${projectData.industry}
- **Deployment Type:** ${projectData.deployment_type}
- **Security Level:** ${projectData.security_level}
- **Infrastructure Scope:** ${projectData.total_sites} sites, ${projectData.total_endpoints} endpoints
- **Budget:** ${projectData.estimated_budget ? `$${projectData.estimated_budget.toLocaleString()}` : 'To be determined'}

## ANALYSIS REQUIREMENTS

Generate a comprehensive project analysis with the following structure:

### 🎯 Executive Summary [COLLAPSIBLE]
High-level project overview, objectives, and strategic value proposition.

### 📊 Stakeholder Analysis [COLLAPSIBLE]
**Primary Stakeholders:**
- Technical team requirements and responsibilities
- Business stakeholders and decision makers
- End users and their impact considerations

**Communication Plan:**
- Stakeholder engagement strategy
- Reporting cadence and formats
- Escalation procedures

### ⚠️ Risk Assessment [COLLAPSIBLE]
**Critical Risks:**
- [HIGH] Risk description and mitigation strategy
- [MEDIUM] Risk description and mitigation strategy
- [LOW] Risk description and mitigation strategy

**Risk Mitigation Framework:**
- Risk monitoring procedures
- Contingency planning
- Risk escalation matrix

### ✅ Success Criteria [COLLAPSIBLE]
**Technical Success Metrics:**
- [ ] Network uptime > 99.5%
- [ ] Authentication success rate > 98%
- [ ] Security incident reduction > 80%

**Business Success Metrics:**
- [ ] User satisfaction score > 4.5/5
- [ ] Implementation timeline adherence
- [ ] Budget variance < 10%

Provide detailed analysis with actionable insights and professional formatting.
      `;

      const analysisResult = await generateCompletion({
        prompt: analysisPrompt,
        taskType: 'analysis',
        context: 'comprehensive_project_analysis'
      });

      // Phase 2: Planning
      setCurrentPhase('planning');
      await simulateProgress(50, 3000);

      const planningPrompt = `
# STRATEGIC IMPLEMENTATION PLANNING

Based on the project analysis, create a detailed implementation plan:

## PROJECT SPECIFICATIONS
${JSON.stringify(projectData, null, 2)}

## PLANNING REQUIREMENTS

### 📋 Implementation Roadmap [COLLAPSIBLE]
**Phase 1: Planning & Design (Weeks 1-2)**
- [ ] Requirements validation
- [ ] Architecture design
- [ ] Resource allocation
- [ ] Vendor coordination

**Phase 2: Infrastructure Preparation (Weeks 3-4)**
- [ ] Network infrastructure setup
- [ ] Security baseline configuration
- [ ] Testing environment preparation

**Phase 3: Pilot Deployment (Weeks 5-6)**
- [ ] Pilot site selection
- [ ] Initial deployment
- [ ] Testing and validation
- [ ] Issue resolution

**Phase 4: Full Deployment (Weeks 7-10)**
- [ ] Phased rollout across all sites
- [ ] User training and adoption
- [ ] Performance monitoring
- [ ] Documentation completion

### ⏰ Detailed Timeline [COLLAPSIBLE]
Create a comprehensive timeline with:
- Milestone dependencies
- Critical path analysis
- Resource allocation
- Buffer time for risk mitigation

### 🚀 Resource Requirements [COLLAPSIBLE]
**Technical Resources:**
- Network engineers: X FTE
- Security specialists: X FTE
- Project managers: X FTE

**Infrastructure Requirements:**
- Hardware specifications
- Software licensing
- Third-party services

### 📈 Quality Assurance Plan [COLLAPSIBLE]
- Testing methodologies
- Acceptance criteria
- Performance benchmarks
- Compliance validation

Ensure all content uses professional markdown formatting with collapsible sections and priority indicators.
      `;

      const planningResult = await generateCompletion({
        prompt: planningPrompt,
        taskType: 'project_insights',
        context: 'strategic_implementation_planning'
      });

      // Phase 3: Optimization
      setCurrentPhase('optimization');
      await simulateProgress(75, 2500);

      const optimizationPrompt = `
# PLAN OPTIMIZATION & EFFICIENCY ANALYSIS

Optimize the implementation plan for maximum efficiency and success:

### 💡 Optimization Recommendations [COLLAPSIBLE]
**Timeline Optimization:**
- Parallel execution opportunities
- Resource leveling strategies
- Critical path optimization

**Cost Optimization:**
- Resource sharing opportunities
- Vendor negotiation strategies
- Technology consolidation options

**Risk Optimization:**
- Risk reduction strategies
- Contingency plan refinement
- Quality assurance enhancement

### 📊 Performance Metrics & KPIs [COLLAPSIBLE]
**Real-time Tracking Metrics:**
- Implementation progress percentage
- Budget utilization tracking
- Resource efficiency metrics
- Quality score indicators

**Reporting Dashboard:**
- Executive summary views
- Technical progress tracking
- Risk and issue monitoring
- Stakeholder communication logs

### 🔄 Continuous Improvement Plan [COLLAPSIBLE]
- Lessons learned capture process
- Plan adjustment procedures
- Performance optimization cycles
- Knowledge transfer protocols

Provide actionable optimization strategies with measurable outcomes.
      `;

      const optimizationResult = await generateCompletion({
        prompt: optimizationPrompt,
        taskType: 'project_insights',
        context: 'plan_optimization'
      });

      // Phase 4: Finalization
      setCurrentPhase('finalization');
      await simulateProgress(100, 1500);

      const plan = {
        id: `plan-${Date.now()}`,
        projectId: projectData.id,
        generatedAt: new Date().toISOString(),
        analysis: analysisResult?.content || 'Analysis completed',
        planning: planningResult?.content || 'Planning completed',
        optimization: optimizationResult?.content || 'Optimization completed',
        metadata: {
          title: `${projectData.name} - Implementation Plan`,
          author: 'AI Project Planning Engine',
          date: new Date().toLocaleDateString(),
          version: '1.0',
          status: 'Active',
          priority: projectData.security_level === 'high' ? 'high' : 'medium'
        },
        phases: planningPhases,
        estimatedDuration: calculateEstimatedDuration(),
        resourceRequirements: calculateResourceRequirements(),
        riskLevel: assessRiskLevel(),
        successProbability: calculateSuccessProbability()
      };

      setGeneratedPlan(plan);
      onPlanGenerated?.(plan);

    } catch (error) {
      console.error('Plan generation failed:', error);
      
      // Provide fallback plan
      const fallbackPlan = {
        id: `fallback-plan-${Date.now()}`,
        projectId: projectData.id,
        generatedAt: new Date().toISOString(),
        analysis: generateFallbackAnalysis(),
        planning: generateFallbackPlanning(),
        optimization: generateFallbackOptimization(),
        metadata: {
          title: `${projectData.name} - Implementation Plan`,
          author: 'AI Project Planning Engine',
          date: new Date().toLocaleDateString(),
          version: '1.0',
          status: 'Draft',
          priority: 'medium'
        }
      };
      
      setGeneratedPlan(fallbackPlan);
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateProgress = (targetProgress: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const startProgress = generationProgress;
      const progressDiff = targetProgress - startProgress;
      const steps = 20;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = startProgress + (progressDiff * currentStep / steps);
        setGenerationProgress(Math.min(progress, targetProgress));
        
        if (currentStep >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const calculateEstimatedDuration = (): string => {
    const baseWeeks = Math.max(8, Math.ceil(projectData.total_sites * 0.5));
    const complexityMultiplier = projectData.security_level === 'high' ? 1.3 : 1.0;
    const totalWeeks = Math.ceil(baseWeeks * complexityMultiplier);
    return `${totalWeeks} weeks`;
  };

  const calculateResourceRequirements = (): any => {
    return {
      technical: Math.ceil(projectData.total_sites / 10),
      project_management: Math.ceil(projectData.total_sites / 20),
      security: projectData.security_level === 'high' ? 2 : 1
    };
  };

  const assessRiskLevel = (): 'low' | 'medium' | 'high' => {
    if (projectData.total_sites > 50 || projectData.security_level === 'high') return 'high';
    if (projectData.total_sites > 20 || projectData.total_endpoints > 1000) return 'medium';
    return 'low';
  };

  const calculateSuccessProbability = (): number => {
    let probability = 85; // Base probability
    
    if (projectData.security_level === 'high') probability -= 10;
    if (projectData.total_sites > 50) probability -= 15;
    if (projectData.total_endpoints > 5000) probability -= 10;
    
    return Math.max(probability, 60);
  };

  const generateFallbackAnalysis = (): string => {
    return `
# 🎯 Executive Summary
This ${projectData.deployment_type} deployment for ${projectData.client_name} represents a strategic initiative to enhance network security across ${projectData.total_sites} sites with ${projectData.total_endpoints} endpoints.

## Key Objectives
- Implement enterprise-grade NAC solution
- Achieve ${projectData.security_level} security posture
- Ensure ${projectData.industry} compliance requirements

# ⚠️ Risk Assessment
**[HIGH]** Large-scale deployment complexity requires careful phasing
**[MEDIUM]** User adoption challenges may impact timeline
**[LOW]** Technology integration risks are manageable with proper testing

# ✅ Success Criteria
- [ ] 99.5% network uptime achievement
- [ ] 98% authentication success rate
- [ ] 80% reduction in security incidents
- [ ] User satisfaction score > 4.5/5
    `;
  };

  const generateFallbackPlanning = (): string => {
    return `
# 📋 Implementation Roadmap

## Phase 1: Planning & Design (Weeks 1-2)
- [ ] Requirements validation and stakeholder alignment
- [ ] Network architecture design and documentation
- [ ] Resource allocation and team formation

## Phase 2: Infrastructure Preparation (Weeks 3-4)
- [ ] Network infrastructure setup and validation
- [ ] Security baseline configuration
- [ ] Testing environment preparation

## Phase 3: Pilot Deployment (Weeks 5-6)
- [ ] Pilot site selection and preparation
- [ ] Initial deployment and testing
- [ ] Issue identification and resolution

## Phase 4: Full Deployment (Weeks 7-10)
- [ ] Phased rollout across all sites
- [ ] User training and support
- [ ] Performance monitoring and optimization

# ⏰ Timeline
**Total Duration:** ${calculateEstimatedDuration()}
**Critical Path:** Infrastructure → Pilot → Deployment → Optimization
    `;
  };

  const generateFallbackOptimization = (): string => {
    return `
# 💡 Optimization Recommendations

## Timeline Optimization
- Parallel deployment across multiple sites
- Automated configuration deployment
- Pre-staged hardware and software

## Resource Optimization
- Cross-training team members for flexibility
- Vendor partnership for extended support
- Centralized project management and coordination

# 📊 Performance Metrics
- **Progress Tracking:** Weekly milestone reviews
- **Quality Metrics:** Automated testing and validation
- **Risk Monitoring:** Daily risk assessment updates
    `;
  };

  const downloadPlan = () => {
    if (!generatedPlan) return;
    
    const planContent = `
# ${generatedPlan.metadata.title}

${generatedPlan.analysis}

${generatedPlan.planning}

${generatedPlan.optimization}
    `;
    
    const blob = new Blob([planContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.name}-implementation-plan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Intelligent Project Planning Engine</CardTitle>
                <CardDescription>
                  AI-powered comprehensive project planning and optimization
                </CardDescription>
              </div>
            </div>
            <Badge variant="glow" className="animate-pulse">
              AI Enhanced
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Project Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border">
              <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{projectData.total_sites}</div>
              <div className="text-sm text-muted-foreground">Sites</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Network className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{projectData.total_endpoints}</div>
              <div className="text-sm text-muted-foreground">Endpoints</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Shield className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-lg font-bold capitalize">{projectData.security_level}</div>
              <div className="text-sm text-muted-foreground">Security</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <Clock className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-lg font-bold">
                {generatedPlan ? calculateEstimatedDuration() : 'TBD'}
              </div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>

          {/* Generation Controls */}
          {!generatedPlan && (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">Ready to Generate Comprehensive Plan</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our AI will analyze your project requirements and create a detailed implementation plan
                    with risk assessment, timeline optimization, and resource allocation.
                  </p>
                </div>
                
                <Button
                  onClick={generateComprehensivePlan}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate AI Project Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plan Generation Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {planningPhases.map((phase, index) => {
                  const isActive = phase.id === currentPhase;
                  const isCompleted = planningPhases.findIndex(p => p.id === currentPhase) > index;
                  
                  return (
                    <div
                      key={phase.id}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        isActive && "border-primary bg-primary/5",
                        isCompleted && "border-green-500 bg-green-50 dark:bg-green-950/20",
                        !isActive && !isCompleted && "border-muted bg-muted/20"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <phase.icon className={cn(
                          "h-4 w-4",
                          isActive && "text-primary animate-pulse",
                          isCompleted && "text-green-500",
                          !isActive && !isCompleted && "text-muted-foreground"
                        )} />
                        <span className="text-sm font-medium">{phase.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{phase.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Plan Display */}
          {generatedPlan && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Plan Generated Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive implementation plan ready for execution
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={downloadPlan}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setGeneratedPlan(null)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                  <TabsTrigger value="optimization">Optimization</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Success Probability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {generatedPlan.successProbability}%
                        </div>
                        <Progress value={generatedPlan.successProbability} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Risk Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge 
                          variant={generatedPlan.riskLevel === 'high' ? 'destructive' : 
                                  generatedPlan.riskLevel === 'medium' ? 'default' : 'secondary'}
                          className="text-sm"
                        >
                          {generatedPlan.riskLevel.toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Team Size</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Object.values(generatedPlan.resourceRequirements).reduce((a: any, b: any) => a + b, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Resources</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analysis">
                  <ProfessionalMarkdown
                    content={generatedPlan.analysis}
                    documentType="analysis"
                    metadata={generatedPlan.metadata}
                    className="max-h-[600px] overflow-y-auto"
                  />
                </TabsContent>

                <TabsContent value="planning">
                  <ProfessionalMarkdown
                    content={generatedPlan.planning}
                    documentType="plan"
                    metadata={generatedPlan.metadata}
                    className="max-h-[600px] overflow-y-auto"
                  />
                </TabsContent>

                <TabsContent value="optimization">
                  <ProfessionalMarkdown
                    content={generatedPlan.optimization}
                    documentType="report"
                    metadata={generatedPlan.metadata}
                    className="max-h-[600px] overflow-y-auto"
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentProjectPlanningEngine;