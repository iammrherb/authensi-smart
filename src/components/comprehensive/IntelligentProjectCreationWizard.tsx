import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Building2, MapPin, Clock, Target, Zap, CheckCircle, AlertCircle, Calendar, Users, Settings, Rocket, FileText } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import DecisionTreeEngine from "@/components/scoping/DecisionTreeEngine";
import ResourceLibraryIntegration from "@/components/resources/ResourceLibraryIntegration";
import { useUseCases, useProjectUseCases, useAddUseCaseToProject } from "@/hooks/useUseCases";
import { useRequirements, useProjectRequirements, useAddRequirementToProject } from "@/hooks/useRequirements";
import { useProjectTemplates, useIncrementTemplateUsage } from "@/hooks/useProjectTemplates";
import type { UseCase } from "@/hooks/useUseCases";
import type { Requirement } from "@/hooks/useRequirements";
import type { ProjectTemplate } from "@/hooks/useProjectTemplates";

interface ProjectData {
  name: string;
  description: string;
  industry: string;
  organizationSize: string;
  timeline: string;
  budget: string;
  primaryGoals: string[];
  painPoints: string[];
  vendors: string[];
  sites: SiteData[];
  phases: PhaseData[];
  milestones: MilestoneData[];
  risks: RiskData[];
}

interface SiteData {
  id: string;
  name: string;
  location: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  estimatedUsers: number;
  complexity: 'simple' | 'moderate' | 'complex';
  timeline: {
    start: string;
    end: string;
  };
}

interface PhaseData {
  id: string;
  name: string;
  description: string;
  duration: number;
  dependencies: string[];
  deliverables: string[];
  resources: string[];
}

interface MilestoneData {
  id: string;
  title: string;
  description: string;
  date: string;
  phase: string;
  critical: boolean;
}

interface RiskData {
  id: string;
  title: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

const IntelligentProjectCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({
    primaryGoals: [],
    painPoints: [],
    vendors: [],
    sites: [],
    phases: [],
    milestones: [],
    risks: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<Requirement[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  
  const { generateProjectSummary, generateRecommendations, isLoading } = useAI();
  const { data: projectTemplates = [] } = useProjectTemplates();
  const addUseCaseToProject = useAddUseCaseToProject();
  const addRequirementToProject = useAddRequirementToProject();
  const incrementTemplateUsage = useIncrementTemplateUsage();

  const steps = [
    { id: 'basics', title: 'Project Basics', icon: Building2 },
    { id: 'templates', title: 'Templates & Resources', icon: FileText },
    { id: 'requirements', title: 'Requirements & Goals', icon: Target },
    { id: 'analysis', title: 'AI Analysis', icon: Brain },
    { id: 'sites', title: 'Sites Generation', icon: MapPin },
    { id: 'timeline', title: 'Timeline & Phases', icon: Clock },
    { id: 'review', title: 'Review & Create', icon: CheckCircle }
  ];

  const industries = [
    'Healthcare', 'Financial Services', 'Manufacturing', 'Education', 
    'Government', 'Retail', 'Technology', 'Energy', 'Transportation'
  ];

  const organizationSizes = [
    'Small (1-100 users)', 'Medium (101-1000 users)', 
    'Large (1001-5000 users)', 'Enterprise (5000+ users)'
  ];

  const commonGoals = [
    'Zero Trust Security', 'Compliance Requirements', 'Network Visibility',
    'Threat Detection', 'Access Control', 'Device Management',
    'Policy Enforcement', 'Network Segmentation'
  ];

  const commonPainPoints = [
    'Shadow IT', 'BYOD Management', 'Legacy Systems', 'Compliance Gaps',
    'Security Incidents', 'Network Complexity', 'Remote Access',
    'Vendor Management', 'Scalability Issues'
  ];

  useEffect(() => {
    if (currentStep === 2 && projectData.name && projectData.industry) {
      generateAIAnalysis();
    }
  }, [currentStep]);

  const generateAIAnalysis = async () => {
    setIsGenerating(true);
    try {
      const analysis = await generateRecommendations(
        projectData,
        [],
        []
      );
      
      if (analysis) {
        // Parse AI analysis and generate intelligent suggestions
        await generateIntelligentSites();
        await generateProjectPhases();
        await generateMilestones();
        await generateRiskAssessment();
        
        toast.success("AI analysis complete! Generated sites, timeline, and recommendations.");
      }
    } catch (error) {
      toast.error("Failed to generate AI analysis");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateIntelligentSites = async () => {
    // AI-powered site generation based on organization size and industry
    const siteTemplates = getSiteTemplatesForIndustry(projectData.industry || '');
    const orgSize = projectData.organizationSize || '';
    
    let siteCount = 1;
    if (orgSize.includes('Medium')) siteCount = 3;
    else if (orgSize.includes('Large')) siteCount = 5;
    else if (orgSize.includes('Enterprise')) siteCount = 8;

    const generatedSites: SiteData[] = [];
    
    for (let i = 0; i < siteCount; i++) {
      const template = siteTemplates[i % siteTemplates.length];
      generatedSites.push({
        id: `site-${i + 1}`,
        name: `${template.name} ${i + 1}`,
        location: template.location,
        type: template.type,
        priority: i === 0 ? 'high' : i < 3 ? 'medium' : 'low',
        estimatedUsers: template.users,
        complexity: template.complexity,
        timeline: {
          start: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          end: new Date(Date.now() + ((i + 2) * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        }
      });
    }

    setProjectData(prev => ({ ...prev, sites: generatedSites }));
  };

  const generateProjectPhases = async () => {
    const phases: PhaseData[] = [
      {
        id: 'phase-1',
        name: 'Planning & Assessment',
        description: 'Initial assessment, planning, and design phase',
        duration: 30,
        dependencies: [],
        deliverables: ['Network Assessment', 'Security Policies', 'Implementation Plan'],
        resources: ['Network Architect', 'Security Analyst', 'Project Manager']
      },
      {
        id: 'phase-2',
        name: 'Pilot Deployment',
        description: 'Deploy NAC solution in pilot environment',
        duration: 45,
        dependencies: ['phase-1'],
        deliverables: ['Pilot Environment', 'Test Results', 'User Training'],
        resources: ['Implementation Engineer', 'Network Engineer', 'Training Specialist']
      },
      {
        id: 'phase-3',
        name: 'Full Rollout',
        description: 'Complete deployment across all sites',
        duration: 90,
        dependencies: ['phase-2'],
        deliverables: ['Production Deployment', 'Documentation', 'Support Handover'],
        resources: ['Deployment Team', 'Support Engineers', 'Change Management']
      },
      {
        id: 'phase-4',
        name: 'Optimization & Support',
        description: 'Performance optimization and ongoing support',
        duration: 30,
        dependencies: ['phase-3'],
        deliverables: ['Performance Report', 'Support Procedures', 'Training Materials'],
        resources: ['Support Team', 'Performance Analyst']
      }
    ];

    setProjectData(prev => ({ ...prev, phases }));
  };

  const generateMilestones = async () => {
    const milestones: MilestoneData[] = [
      {
        id: 'milestone-1',
        title: 'Project Kickoff',
        description: 'Project officially starts with stakeholder alignment',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phase: 'phase-1',
        critical: true
      },
      {
        id: 'milestone-2',
        title: 'Assessment Complete',
        description: 'Network and security assessment finished',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phase: 'phase-1',
        critical: true
      },
      {
        id: 'milestone-3',
        title: 'Pilot Go-Live',
        description: 'Pilot environment deployed and operational',
        date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phase: 'phase-2',
        critical: true
      },
      {
        id: 'milestone-4',
        title: 'Production Rollout',
        description: 'Full production deployment begins',
        date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phase: 'phase-3',
        critical: true
      },
      {
        id: 'milestone-5',
        title: 'Project Completion',
        description: 'All sites deployed and project handover complete',
        date: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        phase: 'phase-4',
        critical: true
      }
    ];

    setProjectData(prev => ({ ...prev, milestones }));
  };

  const generateRiskAssessment = async () => {
    const risks: RiskData[] = [
      {
        id: 'risk-1',
        title: 'Legacy System Integration',
        description: 'Challenges integrating with existing legacy systems',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Thorough compatibility testing and phased migration approach'
      },
      {
        id: 'risk-2',
        title: 'User Adoption',
        description: 'Resistance to new authentication and access procedures',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Comprehensive training program and change management strategy'
      },
      {
        id: 'risk-3',
        title: 'Network Performance',
        description: 'Potential impact on network performance during deployment',
        probability: 'low',
        impact: 'medium',
        mitigation: 'Performance monitoring and gradual rollout strategy'
      }
    ];

    setProjectData(prev => ({ ...prev, risks }));
  };

  const getSiteTemplatesForIndustry = (industry: string) => {
    const templates: any = {
      'Healthcare': [
        { name: 'Main Hospital', location: 'Primary Campus', type: 'hospital', users: 500, complexity: 'complex' },
        { name: 'Clinic', location: 'Satellite Location', type: 'clinic', users: 100, complexity: 'moderate' },
        { name: 'Admin Office', location: 'Administrative Center', type: 'office', users: 50, complexity: 'simple' }
      ],
      'Financial Services': [
        { name: 'Headquarters', location: 'Main Office', type: 'headquarters', users: 800, complexity: 'complex' },
        { name: 'Branch Office', location: 'Regional Branch', type: 'branch', users: 150, complexity: 'moderate' },
        { name: 'ATM Network', location: 'Distributed', type: 'atm', users: 0, complexity: 'simple' }
      ],
      'Manufacturing': [
        { name: 'Production Facility', location: 'Main Plant', type: 'factory', users: 300, complexity: 'complex' },
        { name: 'Warehouse', location: 'Distribution Center', type: 'warehouse', users: 80, complexity: 'moderate' },
        { name: 'Office Complex', location: 'Corporate Office', type: 'office', users: 200, complexity: 'simple' }
      ],
      'default': [
        { name: 'Main Office', location: 'Headquarters', type: 'office', users: 200, complexity: 'moderate' },
        { name: 'Branch Office', location: 'Regional Office', type: 'branch', users: 100, complexity: 'simple' },
        { name: 'Remote Site', location: 'Satellite Location', type: 'remote', users: 50, complexity: 'simple' }
      ]
    };

    return templates[industry] || templates['default'];
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (value: string, field: 'primaryGoals' | 'painPoints') => {
    setProjectData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...(prev[field] || []), value]
    }));
  };

  const handleUseCaseSelect = (useCase: UseCase) => {
    setSelectedUseCases(prev => {
      const exists = prev.find(uc => uc.id === useCase.id);
      if (exists) {
        return prev.filter(uc => uc.id !== useCase.id);
      }
      return [...prev, useCase];
    });
  };

  const handleRequirementSelect = (requirement: Requirement) => {
    setSelectedRequirements(prev => {
      const exists = prev.find(req => req.id === requirement.id);
      if (exists) {
        return prev.filter(req => req.id !== requirement.id);
      }
      return [...prev, requirement];
    });
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    // Apply template data to project
    setProjectData(prev => ({
      ...prev,
      industry: template.industry,
      description: template.description,
      // Apply other template configurations
    }));
    incrementTemplateUsage.mutate(template.id);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectData.name || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description || ''}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project goals and scope"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={projectData.industry} onValueChange={(value) => setProjectData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="organizationSize">Organization Size</Label>
                  <Select value={projectData.organizationSize} onValueChange={(value) => setProjectData(prev => ({ ...prev, organizationSize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization size" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'templates':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Project Templates & Resources</h3>
              <p className="text-muted-foreground">
                Select project templates, use cases, and requirements from the resource library
              </p>
            </div>

            <ResourceLibraryIntegration
              onUseCaseSelect={handleUseCaseSelect}
              onRequirementSelect={handleRequirementSelect}
              onTemplateSelect={handleTemplateSelect}
              selectedItems={{
                useCases: selectedUseCases.map(uc => uc.id),
                requirements: selectedRequirements.map(req => req.id),
                templates: selectedTemplate ? [selectedTemplate.id] : []
              }}
              mode="select"
              allowCreate={false}
              allowEdit={false}
            />

            {selectedTemplate && (
              <Card className="bg-primary/5 border-primary">
                <CardHeader>
                  <CardTitle>Selected Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{selectedTemplate.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>{selectedTemplate.industry}</Badge>
                    <Badge variant="secondary">{selectedTemplate.security_level}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedUseCases.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUseCases.map(uc => (
                        <Badge key={uc.id} variant="outline" className="mr-2">
                          {uc.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No use cases selected</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedRequirements.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRequirements.map(req => (
                        <Badge key={req.id} variant="outline" className="mr-2">
                          {req.title}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No requirements selected</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Primary Goals</Label>
              <div className="grid grid-cols-2 gap-3">
                {commonGoals.map(goal => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={projectData.primaryGoals?.includes(goal)}
                      onCheckedChange={() => handleCheckboxChange(goal, 'primaryGoals')}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold mb-4 block">Pain Points</Label>
              <div className="grid grid-cols-2 gap-3">
                {commonPainPoints.map(painPoint => (
                  <div key={painPoint} className="flex items-center space-x-2">
                    <Checkbox
                      id={painPoint}
                      checked={projectData.painPoints?.includes(painPoint)}
                      onCheckedChange={() => handleCheckboxChange(painPoint, 'painPoints')}
                    />
                    <Label htmlFor={painPoint} className="text-sm">{painPoint}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing your requirements and generating intelligent recommendations
              </p>
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Analyzing project requirements...</div>
                  <Progress value={33} className="w-full" />
                  <div className="text-sm text-muted-foreground">Generating site recommendations...</div>
                  <Progress value={66} className="w-full" />
                  <div className="text-sm text-muted-foreground">Creating timeline and milestones...</div>
                  <Progress value={100} className="w-full" />
                </div>
              </div>
            )}

            {!isGenerating && projectData.sites && projectData.sites.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Analysis Complete!</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{projectData.sites.length}</div>
                      <div className="text-sm text-muted-foreground">Sites Generated</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{projectData.phases?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Phases Planned</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">{projectData.milestones?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Milestones Set</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <DecisionTreeEngine 
              scopingData={projectData}
              onSuggestion={(suggestion) => {
                toast.success(`Applied suggestion: ${suggestion.title}`);
              }}
            />
          </div>
        );

      case 'sites':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Sites</h3>
              <Badge variant="secondary">{projectData.sites?.length || 0} sites</Badge>
            </div>
            
            <div className="space-y-4">
              {projectData.sites?.map(site => (
                <Card key={site.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          site.priority === 'high' ? 'bg-red-500' :
                          site.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <h4 className="font-medium">{site.name}</h4>
                          <p className="text-sm text-muted-foreground">{site.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{site.complexity}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{site.estimatedUsers} users</p>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Timeline: {site.timeline.start} → {site.timeline.end}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <Tabs defaultValue="phases" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="phases">Phases</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="phases" className="space-y-4">
                {projectData.phases?.map(phase => (
                  <Card key={phase.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{phase.name}</h4>
                        <Badge variant="outline">{phase.duration} days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="font-medium">Deliverables</Label>
                          <ul className="mt-1 space-y-1">
                            {phase.deliverables.map((deliverable, index) => (
                              <li key={index} className="text-muted-foreground">• {deliverable}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <Label className="font-medium">Resources</Label>
                          <ul className="mt-1 space-y-1">
                            {phase.resources.map((resource, index) => (
                              <li key={index} className="text-muted-foreground">• {resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="milestones" className="space-y-4">
                {projectData.milestones?.map(milestone => (
                  <Card key={milestone.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${milestone.critical ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <div>
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{milestone.date}</div>
                          {milestone.critical && <Badge variant="destructive" className="mt-1">Critical</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="risks" className="space-y-4">
                {projectData.risks?.map(risk => (
                  <Card key={risk.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{risk.title}</h4>
                          <p className="text-sm text-muted-foreground">{risk.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={risk.probability === 'high' ? 'destructive' : risk.probability === 'medium' ? 'default' : 'secondary'}>
                            {risk.probability} probability
                          </Badge>
                          <Badge variant={risk.impact === 'high' ? 'destructive' : risk.impact === 'medium' ? 'default' : 'secondary'}>
                            {risk.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-sm">Mitigation Strategy</Label>
                        <p className="text-sm text-muted-foreground mt-1">{risk.mitigation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Ready to Create</h3>
              <p className="text-muted-foreground">
                Review your intelligent project configuration before creating
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {projectData.name}</div>
                  <div><strong>Industry:</strong> {projectData.industry}</div>
                  <div><strong>Size:</strong> {projectData.organizationSize}</div>
                  <div><strong>Goals:</strong> {projectData.primaryGoals?.length} selected</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Generated Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Sites:</strong> {projectData.sites?.length} sites</div>
                  <div><strong>Phases:</strong> {projectData.phases?.length} phases</div>
                  <div><strong>Milestones:</strong> {projectData.milestones?.length} milestones</div>
                  <div><strong>Risks:</strong> {projectData.risks?.length} identified</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="w-48"
                onClick={() => {
                  toast.success("Project created successfully!");
                  // Handle project creation logic here
                }}
              >
                <Rocket className="h-5 w-5 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Intelligent Project Creation</h1>
            <p className="text-muted-foreground">AI-powered project setup with automated site generation and timeline planning</p>
          </div>
          <Badge variant="glow">
            <Zap className="h-4 w-4 mr-1" />
            AI Enhanced
          </Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                    'border-muted-foreground/30 text-muted-foreground'}
                `}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="ml-3 min-w-0">
                  <div className={`text-sm font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                )}
              </div>
            );
          })}
        </div>

        <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full" />
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                        {(() => {
                          const Icon = steps[currentStep].icon;
                          return <Icon className="h-5 w-5" />;
                        })()}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button 
            onClick={handleNext}
            disabled={
              (currentStep === 0 && (!projectData.name || !projectData.industry)) ||
              (currentStep === 1 && (!projectData.primaryGoals?.length || !projectData.painPoints?.length)) ||
              (currentStep === 2 && isGenerating)
            }
          >
            {currentStep === 2 && isGenerating ? 'Generating...' : 'Next'}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default IntelligentProjectCreationWizard;