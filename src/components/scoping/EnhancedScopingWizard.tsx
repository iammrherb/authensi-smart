import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Building2, AlertTriangle, Target, FileCheck, Users,
  ArrowRight, ArrowLeft, CheckCircle, Brain, Map, Settings
} from 'lucide-react';

import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import { useUseCases, UseCase } from '@/hooks/useUseCases';
import { useRequirements, Requirement } from '@/hooks/useRequirements';
import { usePainPoints, PainPoint } from '@/hooks/usePainPoints';
import { useIndustryOptions, useBusinessDomains } from '@/hooks/useResourceLibrary';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useDataEnhancement } from '@/hooks/useDataEnhancement';
import AIRecommendationPanel from '@/components/ai/AIRecommendationPanel';
import { AIContext, AIRecommendation } from '@/services/ai/EnhancedAIService';

interface EnhancedScopingWizardProps {
  onComplete: (projectId: string) => void;
  onCancel: () => void;
  mode?: 'full' | 'quick' | 'bulk-sites';
}

interface ScopingData {
  // Organization
  organization: {
    name: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    description: string;
    businessGoals: string;
    businessDomains: string[];
  };
  // Pain Points
  painPoints: PainPoint[];
  painPointImpacts: Array<{
    painPointId: string;
    impact: 'critical' | 'high' | 'medium' | 'low';
    urgency: 'immediate' | 'within_month' | 'within_quarter' | 'within_year';
  }>;
  // Use Cases
  useCases: UseCase[];
  useCasePriorities: Array<{
    useCaseId: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    businessValue: string;
  }>;
  // Requirements
  requirements: Requirement[];
  // Vendors
  preferredVendors: string[];
  existingVendors: string[];
  // Sites & Deployment
  totalSites: number;
  siteDetails: Array<{
    name: string;
    location: string;
    users: number;
    complexity: 'low' | 'medium' | 'high';
  }>;
  // Budget & Timeline
  budgetRange: string;
  timeline: string;
}

type WizardStep = 'organization' | 'pain-points' | 'use-cases' | 'requirements' | 'vendors' | 'sites' | 'review';

const EnhancedScopingWizard: React.FC<EnhancedScopingWizardProps> = ({
  onComplete,
  onCancel,
  mode = 'full'
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('organization');
  const [scopingData, setScopingData] = useState<ScopingData>({
    organization: {
      name: '',
      industry: '',
      size: 'medium',
      description: '',
      businessGoals: '',
      businessDomains: []
    },
    painPoints: [],
    painPointImpacts: [],
    useCases: [],
    useCasePriorities: [],
    requirements: [],
    preferredVendors: [],
    existingVendors: [],
    totalSites: 1,
    siteDetails: [],
    budgetRange: '',
    timeline: ''
  });

  const { toast } = useToast();

  // Resource hooks
  const { data: vendors = [] } = useUnifiedVendors({});
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { data: painPoints = [] } = usePainPoints();
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: businessDomains = [] } = useBusinessDomains();

  // AI hooks
  const { generateRecommendations, isLoading: isGeneratingRecommendations, recommendations } = useEnhancedAI();
  const { recordInteraction, recordSelection } = useDataEnhancement();

  // Project hook
  const createProject = useCreateProject();

  const getStepsForMode = (): WizardStep[] => {
    switch (mode) {
      case 'quick':
        return ['organization', 'pain-points', 'use-cases', 'vendors', 'review'];
      case 'bulk-sites':
        return ['organization', 'use-cases', 'vendors', 'sites', 'review'];
      case 'full':
      default:
        return ['organization', 'pain-points', 'use-cases', 'requirements', 'vendors', 'sites', 'review'];
    }
  };

  const steps = getStepsForMode();
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const getAIContext = (): AIContext => ({
    industry: scopingData.organization.industry,
    organizationSize: scopingData.organization.size,
    painPoints: scopingData.painPoints.map(pp => pp.id),
    projectType: 'NAC Deployment',
    currentPhase: 'scoping',
    userRole: 'Sales Engineer'
  });

  const triggerAIRecommendations = async (step: WizardStep) => {
    const context = getAIContext();
    
    try {
      let type: AIRecommendation['type'] = 'general';
      
      switch (step) {
        case 'pain-points':
          type = 'pain_point';
          break;
        case 'use-cases':
          type = 'use_case';
          break;
        case 'requirements':
          type = 'requirement';
          break;
        case 'vendors':
          type = 'vendor';
          break;
      }

      await generateRecommendations({ type, context });
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
    }
  };

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setCurrentStep(nextStep);
      
      // Record step completion
      recordInteraction({
        action: 'wizard_step_completed',
        details: { 
          wizard: 'EnhancedScopingWizard', 
          step: currentStep, 
          mode 
        }
      });

      // Trigger AI recommendations for next step
      triggerAIRecommendations(nextStep);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const updateScopingData = <K extends keyof ScopingData>(
    key: K,
    value: ScopingData[K]
  ) => {
    setScopingData(prev => ({ ...prev, [key]: value }));
  };

  const handleAcceptAIRecommendation = (rec: AIRecommendation) => {
    switch (rec.type) {
      case 'pain_point':
        const painPoint = painPoints.find(pp => pp.id === rec.entityId);
        if (painPoint && !scopingData.painPoints.some(pp => pp.id === painPoint.id)) {
          updateScopingData('painPoints', [...scopingData.painPoints, painPoint]);
        }
        break;
      case 'use_case':
        const useCase = useCases.find(uc => uc.id === rec.entityId);
        if (useCase && !scopingData.useCases.some(uc => uc.id === useCase.id)) {
          updateScopingData('useCases', [...scopingData.useCases, useCase]);
        }
        break;
      case 'requirement':
        const requirement = requirements.find(req => req.id === rec.entityId);
        if (requirement && !scopingData.requirements.some(req => req.id === requirement.id)) {
          updateScopingData('requirements', [...scopingData.requirements, requirement]);
        }
        break;
      case 'vendor':
        if (!scopingData.preferredVendors.includes(rec.entityId)) {
          updateScopingData('preferredVendors', [...scopingData.preferredVendors, rec.entityId]);
        }
        break;
    }

    toast({
      title: "AI Recommendation Applied",
      description: `"${rec.entityName}" has been added to your selection.`,
    });
  };

  const handleSubmit = async () => {
    try {
      const projectData = {
        name: scopingData.organization.name + ' NAC Deployment',
        description: scopingData.organization.description,
        client_name: scopingData.organization.name,
        industry: scopingData.organization.industry,
        total_sites: scopingData.totalSites,
        status: 'scoping-complete',
        progress_percentage: 15,
        scoping_data: scopingData
      };

      const newProject = await createProject.mutateAsync(projectData);
      
      toast({ 
        title: "Project Created", 
        description: "Project has been successfully created with comprehensive scoping data." 
      });

      recordInteraction({
        action: 'wizard_completed',
        entityType: 'project',
        entityId: newProject.id,
        details: { 
          wizard: 'EnhancedScopingWizard', 
          mode,
          totalSteps: steps.length,
          scopingData 
        }
      });

      onComplete(newProject.id);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create project: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'organization':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Organization Profile</h3>
                <p className="text-muted-foreground">Tell us about the organization</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name *</Label>
                      <Input
                        id="orgName"
                        value={scopingData.organization.name}
                        onChange={(e) => updateScopingData('organization', { 
                          ...scopingData.organization, 
                          name: e.target.value 
                        })}
                        placeholder="e.g., Acme Healthcare System"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        value={scopingData.organization.industry}
                        onValueChange={(value) => updateScopingData('organization', { 
                          ...scopingData.organization, 
                          industry: value 
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry.id} value={industry.name}>
                              <div className="flex items-center space-x-2">
                                <span>{industry.name}</span>
                                <Badge variant="outline" className="text-xs">{industry.category}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgSize">Organization Size *</Label>
                    <Select
                      value={scopingData.organization.size}
                      onValueChange={(value) => updateScopingData('organization', { 
                        ...scopingData.organization, 
                        size: value as any 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                        <SelectItem value="small">Small (51-200 employees)</SelectItem>
                        <SelectItem value="medium">Medium (201-1000 employees)</SelectItem>
                        <SelectItem value="large">Large (1001-5000 employees)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Organization Description *</Label>
                    <Textarea
                      id="description"
                      value={scopingData.organization.description}
                      onChange={(e) => updateScopingData('organization', { 
                        ...scopingData.organization, 
                        description: e.target.value 
                      })}
                      placeholder="Brief description of the organization..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessGoals">Key Business Goals for NAC</Label>
                    <Textarea
                      id="businessGoals"
                      value={scopingData.organization.businessGoals}
                      onChange={(e) => updateScopingData('organization', { 
                        ...scopingData.organization, 
                        businessGoals: e.target.value 
                      })}
                      placeholder="e.g., Improve security posture, achieve compliance..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Business Domains</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {businessDomains.map((domain) => (
                        <div key={domain.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`domain-${domain.id}`}
                            checked={scopingData.organization.businessDomains.includes(domain.name)}
                            onCheckedChange={(checked) => {
                              const domains = checked
                                ? [...scopingData.organization.businessDomains, domain.name]
                                : scopingData.organization.businessDomains.filter(d => d !== domain.name);
                              updateScopingData('organization', { 
                                ...scopingData.organization, 
                                businessDomains: domains 
                              });
                            }}
                          />
                          <Label htmlFor={`domain-${domain.id}`} className="text-sm cursor-pointer">
                            {domain.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <AIRecommendationPanel
              title="Organization Insights"
              description="AI-powered insights based on your organization profile."
              recommendations={recommendations?.filter(rec => rec.type === 'general') || []}
              onAcceptRecommendation={handleAcceptAIRecommendation}
              isLoading={isGeneratingRecommendations}
            />
          </div>
        );

      case 'pain-points':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-6">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-2xl font-bold mb-2">Pain Points Analysis</h3>
                <p className="text-muted-foreground">Identify current challenges</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Primary Pain Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {painPoints.map((pp) => (
                      <div key={pp.id} className="flex items-start space-x-3 border p-3 rounded-md hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`pain-point-${pp.id}`}
                          checked={scopingData.painPoints.some(selectedPp => selectedPp.id === pp.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...scopingData.painPoints, pp]
                              : scopingData.painPoints.filter(selectedPp => selectedPp.id !== pp.id);
                            updateScopingData('painPoints', updated);
                            
                            recordSelection('pain_point', pp.id, checked ? 'add' : 'remove', {
                              wizard: 'EnhancedScopingWizard',
                              step: currentStep,
                              context: getAIContext()
                            });
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`pain-point-${pp.id}`} className="cursor-pointer font-medium">
                            {pp.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{pp.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">{pp.category}</Badge>
                            <Badge variant="outline" className="text-xs">{pp.priority}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <AIRecommendationPanel
              title="Pain Point Recommendations"
              description="AI-suggested pain points based on your industry."
              recommendations={recommendations?.filter(rec => rec.type === 'pain_point') || []}
              onAcceptRecommendation={handleAcceptAIRecommendation}
              isLoading={isGeneratingRecommendations}
            />
          </div>
        );

      case 'use-cases':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-6">
                <Target className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold mb-2">Use Cases & Scenarios</h3>
                <p className="text-muted-foreground">Define primary objectives</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Primary Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCases.map((uc) => (
                      <div key={uc.id} className="flex items-start space-x-3 border p-3 rounded-md hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`use-case-${uc.id}`}
                          checked={scopingData.useCases.some(selectedUc => selectedUc.id === uc.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...scopingData.useCases, uc]
                              : scopingData.useCases.filter(selectedUc => selectedUc.id !== uc.id);
                            updateScopingData('useCases', updated);
                            
                            recordSelection('use_case', uc.id, checked ? 'add' : 'remove', {
                              wizard: 'EnhancedScopingWizard',
                              step: currentStep,
                              context: getAIContext()
                            });
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`use-case-${uc.id}`} className="cursor-pointer font-medium">
                            {uc.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{uc.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">{uc.category}</Badge>
                            <Badge variant="outline" className="text-xs">{uc.complexity}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <AIRecommendationPanel
              title="Use Case Recommendations"
              description="AI-suggested use cases based on your pain points."
              recommendations={recommendations?.filter(rec => rec.type === 'use_case') || []}
              onAcceptRecommendation={handleAcceptAIRecommendation}
              isLoading={isGeneratingRecommendations}
            />
          </div>
        );

      case 'vendors':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-6">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-2xl font-bold mb-2">Vendor Selection</h3>
                <p className="text-muted-foreground">Identify preferred vendors</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Preferred NAC Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendors.filter(v => v.category === 'Network Access Control').map((vendor) => (
                      <div key={vendor.id} className="flex items-start space-x-3 border p-3 rounded-md hover:bg-accent/50 transition-colors">
                        <Checkbox
                          id={`vendor-${vendor.id}`}
                          checked={scopingData.preferredVendors.includes(vendor.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...scopingData.preferredVendors, vendor.id]
                              : scopingData.preferredVendors.filter(id => id !== vendor.id);
                            updateScopingData('preferredVendors', updated);
                            
                            recordSelection('vendor', vendor.id, checked ? 'add' : 'remove', {
                              wizard: 'EnhancedScopingWizard',
                              step: currentStep,
                              context: getAIContext()
                            });
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`vendor-${vendor.id}`} className="cursor-pointer font-medium">
                            {vendor.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">{vendor.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">{vendor.supportLevel}</Badge>
                            <Badge variant="outline" className="text-xs">{vendor.portnoxCompatibility}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <AIRecommendationPanel
              title="Vendor Recommendations"
              description="AI-suggested vendors based on your requirements."
              recommendations={recommendations?.filter(rec => rec.type === 'vendor') || []}
              onAcceptRecommendation={handleAcceptAIRecommendation}
              isLoading={isGeneratingRecommendations}
            />
          </div>
        );

      case 'sites':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Map className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
              <h3 className="text-2xl font-bold mb-2">Site Planning</h3>
              <p className="text-muted-foreground">Define deployment sites</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalSites">Total Number of Sites</Label>
                    <Input
                      id="totalSites"
                      type="number"
                      value={scopingData.totalSites}
                      onChange={(e) => updateScopingData('totalSites', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <Select
                      value={scopingData.budgetRange}
                      onValueChange={(value) => updateScopingData('budgetRange', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-50k">Under $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                        <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                        <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                        <SelectItem value="over-1m">Over $1,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline</Label>
                  <Select
                    value={scopingData.timeline}
                    onValueChange={(value) => updateScopingData('timeline', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6-12-months">6-12 months</SelectItem>
                      <SelectItem value="over-12-months">Over 12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold mb-2">Review & Finalize</h3>
              <p className="text-muted-foreground">Review your scoping selections</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scoping Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Organization
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Name:</span> {scopingData.organization.name}</p>
                      <p><span className="font-medium">Industry:</span> {scopingData.organization.industry}</p>
                      <p><span className="font-medium">Size:</span> {scopingData.organization.size}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Pain Points
                    </h4>
                    <div className="text-sm">
                      <p><span className="font-medium">Selected:</span> {scopingData.painPoints.length}</p>
                      {scopingData.painPoints.slice(0, 3).map(pp => (
                        <p key={pp.id} className="text-xs text-muted-foreground">• {pp.name}</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Use Cases
                    </h4>
                    <div className="text-sm">
                      <p><span className="font-medium">Selected:</span> {scopingData.useCases.length}</p>
                      {scopingData.useCases.slice(0, 3).map(uc => (
                        <p key={uc.id} className="text-xs text-muted-foreground">• {uc.name}</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Vendors
                    </h4>
                    <div className="text-sm">
                      <p><span className="font-medium">Preferred:</span> {scopingData.preferredVendors.length}</p>
                      {scopingData.preferredVendors.slice(0, 3).map(vendorId => {
                        const vendor = vendors.find(v => v.id === vendorId);
                        return vendor ? (
                          <p key={vendorId} className="text-xs text-muted-foreground">• {vendor.name}</p>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Map className="h-4 w-4 mr-2" />
                      Deployment
                    </h4>
                    <div className="text-sm">
                      <p><span className="font-medium">Sites:</span> {scopingData.totalSites}</p>
                      <p><span className="font-medium">Budget:</span> {scopingData.budgetRange}</p>
                      <p><span className="font-medium">Timeline:</span> {scopingData.timeline}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Step not implemented</div>;
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Enhanced AI Scoping Wizard
                {mode !== 'full' && <Badge className="ml-2 capitalize">{mode}</Badge>}
              </CardTitle>
              <p className="text-muted-foreground">
                Intelligent scoping with comprehensive resource library integration
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {currentStep.replace('-', ' ')}
              </p>
            </div>
          </div>
          <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
      </Card>

      <div className="mb-6">
        {renderStepContent()}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button 
              onClick={handleBack} 
              disabled={isFirstStep} 
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
              
              {isLastStep ? (
                <EnhancedButton
                  onClick={handleSubmit}
                  loading={createProject.isPending}
                  className="flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Project
                </EnhancedButton>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedScopingWizard;
