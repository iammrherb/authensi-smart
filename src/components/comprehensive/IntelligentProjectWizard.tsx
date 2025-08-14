import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Building,
  Shield,
  Network,
  Settings,
  FileText,
  Users,
  Zap
} from 'lucide-react';
import { UnifiedDecisionEngine, DecisionContext, DecisionRecommendation, DecisionPath } from '@/services/UnifiedDecisionEngine';
import { useIndustryOptions, useComplianceFrameworks, useDeploymentTypes, useAuthenticationMethods } from '@/hooks/useResourceLibrary';
import { useVendors } from '@/hooks/useVendors';
import { useToast } from '@/hooks/use-toast';

interface ProjectData {
  name: string;
  description: string;
  organizationSize: number;
  industry: string;
  complianceFrameworks: string[];
  painPoints: string[];
  existingVendors: {
    wired: string[];
    wireless: string[];
    mdm: string[];
    idp: string[];
    edr: string[];
    radius: string[];
    nac: string[];
  };
  authenticationRequirements: string[];
  securityLevel: string;
  deploymentType: string;
  timeline: string;
  budget: string;
}

interface IntelligentProjectWizardProps {
  onComplete: (projectData: ProjectData, recommendations: DecisionRecommendation[], checklist: any[]) => void;
  onCancel: () => void;
}

const IntelligentProjectWizard: React.FC<IntelligentProjectWizardProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    organizationSize: 0,
    industry: '',
    complianceFrameworks: [],
    painPoints: [],
    existingVendors: {
      wired: [],
      wireless: [],
      mdm: [],
      idp: [],
      edr: [],
      radius: [],
      nac: []
    },
    authenticationRequirements: [],
    securityLevel: '',
    deploymentType: '',
    timeline: '',
    budget: ''
  });

  const [decisionPath, setDecisionPath] = useState<DecisionPath | null>(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState<DecisionRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedChecklist, setGeneratedChecklist] = useState<any[]>([]);

  const { data: industries } = useIndustryOptions();
  const { data: complianceFrameworks } = useComplianceFrameworks();
  const { data: deploymentTypes } = useDeploymentTypes();
  const { data: authMethods } = useAuthenticationMethods();
  const { data: vendors } = useVendors();
  const { toast } = useToast();

  const steps = [
    { id: 'basic', title: 'Project Basics', icon: FileText },
    { id: 'organization', title: 'Organization', icon: Building },
    { id: 'compliance', title: 'Compliance & Security', icon: Shield },
    { id: 'vendors', title: 'Existing Infrastructure', icon: Network },
    { id: 'requirements', title: 'Requirements', icon: Settings },
    { id: 'analysis', title: 'AI Analysis', icon: Brain },
    { id: 'recommendations', title: 'Recommendations', icon: Zap },
    { id: 'planning', title: 'Implementation Planning', icon: Users }
  ];

  useEffect(() => {
    if (currentStep === 5) { // AI Analysis step
      performAIAnalysis();
    }
  }, [currentStep]);

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const context: DecisionContext = {
        industry: projectData.industry,
        organizationSize: projectData.organizationSize,
        complianceFrameworks: projectData.complianceFrameworks,
        painPoints: projectData.painPoints,
        existingVendors: projectData.existingVendors,
        authenticationRequirements: projectData.authenticationRequirements,
        securityLevel: projectData.securityLevel,
        deploymentType: projectData.deploymentType
      };

      const analysisResult = await UnifiedDecisionEngine.analyzeContext(context);
      setDecisionPath(analysisResult);
      
      // Pre-select high and critical priority recommendations
      const autoSelected = analysisResult.recommendations.filter(r => 
        r.priority === 'critical' || r.priority === 'high'
      );
      setSelectedRecommendations(autoSelected);

      toast({
        title: "AI Analysis Complete",
        description: `Found ${analysisResult.recommendations.length} recommendations based on your context`,
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze project context. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateImplementationPlan = async () => {
    try {
      const context: DecisionContext = {
        industry: projectData.industry,
        organizationSize: projectData.organizationSize,
        complianceFrameworks: projectData.complianceFrameworks,
        existingVendors: projectData.existingVendors
      };

      const checklist = await UnifiedDecisionEngine.generateImplementationChecklist(
        context, 
        selectedRecommendations
      );
      setGeneratedChecklist(checklist);
      
      toast({
        title: "Implementation Plan Generated",
        description: `Created ${checklist.length} implementation phases with detailed tasks`,
      });
    } catch (error) {
      toast({
        title: "Planning Error",
        description: "Failed to generate implementation plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (currentStep === 6) { // After recommendations
      generateImplementationPlan();
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(projectData, selectedRecommendations, generatedChecklist);
  };

  const toggleRecommendation = (recommendation: DecisionRecommendation) => {
    setSelectedRecommendations(prev => {
      const exists = prev.find(r => r.id === recommendation.id);
      if (exists) {
        return prev.filter(r => r.id !== recommendation.id);
      } else {
        return [...prev, recommendation];
      }
    });
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectData.name}
                onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
              />
            </div>
            <div>
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea
                id="project-description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project goals and scope"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeline">Expected Timeline</Label>
                <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, timeline: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3 months">1-3 months</SelectItem>
                    <SelectItem value="3-6 months">3-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12+ months">12+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, budget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< $50K">Less than $50K</SelectItem>
                    <SelectItem value="$50K - $250K">$50K - $250K</SelectItem>
                    <SelectItem value="$250K - $1M">$250K - $1M</SelectItem>
                    <SelectItem value="$1M+">$1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="org-size">Organization Size (Number of Users)</Label>
              <Input
                id="org-size"
                type="number"
                value={projectData.organizationSize || ''}
                onChange={(e) => setProjectData(prev => ({ ...prev, organizationSize: parseInt(e.target.value) || 0 }))}
                placeholder="Enter total number of users"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries?.map(industry => (
                    <SelectItem key={industry.id} value={industry.name}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pain Points (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'Network Visibility',
                  'Security Compliance',
                  'User Management',
                  'Device Control',
                  'Performance Issues',
                  'Integration Complexity',
                  'Scalability Concerns',
                  'Cost Management'
                ].map(painPoint => (
                  <div key={painPoint} className="flex items-center space-x-2">
                    <Checkbox
                      id={painPoint}
                      checked={projectData.painPoints.includes(painPoint)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProjectData(prev => ({
                            ...prev,
                            painPoints: [...prev.painPoints, painPoint]
                          }));
                        } else {
                          setProjectData(prev => ({
                            ...prev,
                            painPoints: prev.painPoints.filter(p => p !== painPoint)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={painPoint}>{painPoint}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'compliance':
        return (
          <div className="space-y-4">
            <div>
              <Label>Compliance Frameworks (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {complianceFrameworks?.map(framework => (
                  <div key={framework.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={framework.id}
                      checked={projectData.complianceFrameworks.includes(framework.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProjectData(prev => ({
                            ...prev,
                            complianceFrameworks: [...prev.complianceFrameworks, framework.name]
                          }));
                        } else {
                          setProjectData(prev => ({
                            ...prev,
                            complianceFrameworks: prev.complianceFrameworks.filter(f => f !== framework.name)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={framework.id}>{framework.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="security-level">Security Level</Label>
                <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, securityLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Enhanced</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deployment-type">Deployment Type</Label>
                <Select onValueChange={(value) => setProjectData(prev => ({ ...prev, deploymentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deployment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deploymentTypes?.map(type => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'vendors':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Select your existing vendor infrastructure to help us recommend compatible solutions.
            </p>
            
            {Object.entries(projectData.existingVendors).map(([category, selectedVendors]) => (
              <div key={category}>
                <Label className="capitalize">{category.replace(/([A-Z])/g, ' $1')} Vendors</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {vendors?.filter(v => 
                    v.category.toLowerCase().includes(category.toLowerCase()) ||
                    v.vendor_type.toLowerCase().includes(category.toLowerCase())
                  ).map(vendor => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${vendor.id}`}
                        checked={selectedVendors.includes(vendor.vendor_name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setProjectData(prev => ({
                              ...prev,
                              existingVendors: {
                                ...prev.existingVendors,
                                [category]: [...selectedVendors, vendor.vendor_name]
                              }
                            }));
                          } else {
                            setProjectData(prev => ({
                              ...prev,
                              existingVendors: {
                                ...prev.existingVendors,
                                [category]: selectedVendors.filter(v => v !== vendor.vendor_name)
                              }
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`${category}-${vendor.id}`} className="text-sm">
                        {vendor.vendor_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-4">
            <div>
              <Label>Authentication Requirements (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {authMethods?.map(method => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={method.id}
                      checked={projectData.authenticationRequirements.includes(method.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProjectData(prev => ({
                            ...prev,
                            authenticationRequirements: [...prev.authenticationRequirements, method.name]
                          }));
                        } else {
                          setProjectData(prev => ({
                            ...prev,
                            authenticationRequirements: prev.authenticationRequirements.filter(r => r !== method.name)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={method.id}>{method.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
              <p className="text-muted-foreground">
                Our AI engine is analyzing your project context and generating intelligent recommendations...
              </p>
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing industry requirements...</span>
                  <span>🔍</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mapping vendor compatibility...</span>
                  <span>🔗</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Generating recommendations...</span>
                  <span>💡</span>
                </div>
              </div>
            )}

            {decisionPath && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Analysis complete! Found {decisionPath.recommendations.length} recommendations
                  {decisionPath.blockers.length > 0 && ` and ${decisionPath.blockers.length} potential blockers`}.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI-Generated Recommendations</h3>
              <Badge variant="secondary">
                {selectedRecommendations.length} selected
              </Badge>
            </div>

            {decisionPath?.blockers && decisionPath.blockers.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Potential Blockers:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {decisionPath.blockers.map((blocker, index) => (
                      <li key={index}>{blocker}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="use_case">Use Cases</TabsTrigger>
                <TabsTrigger value="vendor">Vendors</TabsTrigger>
                <TabsTrigger value="requirement">Requirements</TabsTrigger>
                <TabsTrigger value="authentication_method">Auth Methods</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-2">
                {decisionPath?.recommendations.map((recommendation) => (
                  <Card key={recommendation.id} className={`cursor-pointer transition-colors ${
                    selectedRecommendations.find(r => r.id === recommendation.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1" onClick={() => toggleRecommendation(recommendation)}>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={recommendation.priority === 'critical' ? 'destructive' : 
                                          recommendation.priority === 'high' ? 'default' : 'secondary'}>
                              {recommendation.priority}
                            </Badge>
                            <Badge variant="outline">{recommendation.type.replace('_', ' ')}</Badge>
                          </div>
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <strong>Reasoning:</strong> {recommendation.reasoning}
                          </p>
                        </div>
                        <Checkbox
                          checked={!!selectedRecommendations.find(r => r.id === recommendation.id)}
                          onCheckedChange={() => toggleRecommendation(recommendation)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {['use_case', 'vendor', 'requirement', 'authentication_method'].map(type => (
                <TabsContent key={type} value={type} className="space-y-2">
                  {decisionPath?.recommendations
                    .filter(r => r.type === type)
                    .map((recommendation) => (
                      <Card key={recommendation.id} className={`cursor-pointer transition-colors ${
                        selectedRecommendations.find(r => r.id === recommendation.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1" onClick={() => toggleRecommendation(recommendation)}>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={recommendation.priority === 'critical' ? 'destructive' : 
                                              recommendation.priority === 'high' ? 'default' : 'secondary'}>
                                  {recommendation.priority}
                                </Badge>
                              </div>
                              <h4 className="font-semibold">{recommendation.title}</h4>
                              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <strong>Reasoning:</strong> {recommendation.reasoning}
                              </p>
                            </div>
                            <Checkbox
                              checked={!!selectedRecommendations.find(r => r.id === recommendation.id)}
                              onCheckedChange={() => toggleRecommendation(recommendation)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  }
                </TabsContent>
              ))}
            </Tabs>
          </div>
        );

      case 'planning':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Implementation Plan</h3>
              <Badge variant="secondary">
                {generatedChecklist.length} phases
              </Badge>
            </div>

            <div className="grid gap-4">
              {generatedChecklist.map((phase, phaseIndex) => (
                <Card key={phaseIndex}>
                  <CardHeader>
                    <CardTitle className="text-base">{phase.phase}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {phase.tasks.map((task: any, taskIndex: number) => (
                        <div key={taskIndex} className="flex items-start gap-3 p-2 rounded border">
                          <div className="w-4 h-4 rounded-full border-2 border-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{task.title}</h5>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {task.estimatedHours}h
                              </Badge>
                              {task.prerequisites?.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Prereq: {task.prerequisites.length} items
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
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
          <h1 className="text-2xl font-bold">Intelligent Project Wizard</h1>
          <Badge variant="secondary">Step {currentStep + 1} of {steps.length}</Badge>
        </div>
        
        <Progress value={calculateProgress()} className="mb-4" />
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${
                  isCompleted ? 'bg-primary text-primary-foreground' :
                  isCurrent ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.title}</span>
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleComplete}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Project Setup
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentProjectWizard;