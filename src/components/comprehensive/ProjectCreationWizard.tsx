import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, ArrowRight, CheckCircle, Briefcase, Building2, Users, Shield, Target, Calendar as CalendarIconOutline, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import InlineSelectCreate from '@/components/common/InlineSelectCreate';
import { useScopingSessions } from '@/hooks/useScopingSessionsDb';
import { useCatalogItems, type CatalogItem } from '@/hooks/useCatalog';
import { useIndustryOptions, useComplianceFrameworks } from '@/hooks/useResourceLibrary';

interface ProjectFormData {
  // Basic Information
  name: string;
  description: string;
  client_name: string;
  industry: string;
  deployment_type: string;
  security_level: string;
  
  // Scope & Timeline
  start_date?: Date;
  target_completion?: Date;
  total_sites: number;
  total_endpoints: number;
  budget?: number;
  
  // Framework & Compliance
  compliance_frameworks: string[];
  
  // Project Details
  pain_points: string[];
  success_criteria: string[];
}

interface ProjectCreationWizardProps {
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
}

const ProjectCreationWizard: React.FC<ProjectCreationWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    client_name: '',
    industry: '',
    deployment_type: '',
    security_level: '',
    total_sites: 1,
    total_endpoints: 100,
    compliance_frameworks: [],
    pain_points: [],
    success_criteria: []
  });

  const { mutate: createProject, isPending } = useCreateProject();
  const { toast } = useToast();
  const { data: scopingSessions = [] } = useScopingSessions();
  const { data: industryData = [] } = useIndustryOptions();
  const { data: complianceData = [] } = useComplianceFrameworks();

  // Catalog items for vendor selection
  const [selectedVendors, setSelectedVendors] = useState<CatalogItem[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<CatalogItem[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<CatalogItem[]>([]);
  const [selectedSiem, setSelectedSiem] = useState<CatalogItem[]>([]);
  const [selectedMdm, setSelectedMdm] = useState<CatalogItem[]>([]);
  const [selectedFirewall, setSelectedFirewall] = useState<CatalogItem[]>([]);
  const [importedFrom, setImportedFrom] = useState<string>('');

  // Import from scoping session
  const importFromScoping = (sessionId: string) => {
    const session = scopingSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const data = session.data;
    setFormData(prev => ({
      ...prev,
      name: data.organization?.name || '',
      client_name: data.organization?.name || '',
      industry: data.organization?.industry || '',
      total_sites: data.network_infrastructure?.site_count || 1,
      total_endpoints: data.organization?.total_users || 100,
      compliance_frameworks: data.integration_compliance?.compliance_frameworks || [],
      pain_points: (data.organization?.pain_points || []).map((p: any) => p.title || p),
      success_criteria: data.use_cases_requirements?.success_criteria || []
    }));
    setImportedFrom(sessionId);
    toast({ title: "Imported from scoping session", description: "Project data populated from scoping" });
  };

  const steps = [
    {
      id: 1,
      title: "Project Basics",
      description: "Core project information and client details",
      icon: Briefcase
    },
    {
      id: 2,
      title: "Scope & Scale",
      description: "Define project scope, timeline, and scale",
      icon: Target
    },
    {
      id: 3,
      title: "Security & Compliance",
      description: "Security requirements and compliance frameworks",
      icon: Shield
    },
    {
      id: 4,
      title: "Vendor Selection",
      description: "Select vendors, use cases and requirements",
      icon: Building2
    },
    {
      id: 5,
      title: "Requirements",
      description: "Pain points and success criteria",
      icon: CheckCircle
    }
  ];

  const industries = [
    "Financial Services", "Healthcare", "Government", "Education", "Manufacturing",
    "Retail", "Technology", "Energy", "Transportation", "Telecommunications"
  ];

  const deploymentTypes = [
    "greenfield", "brownfield", "hybrid", "cloud-first", "on-premises"
  ];

  const securityLevels = [
    "basic", "standard", "enhanced", "maximum"
  ];

  const complianceOptions = [
    "SOX", "HIPAA", "PCI-DSS", "GDPR", "SOC2", "ISO27001", "NIST", "FISMA", "FedRAMP"
  ];

  const calculateProgress = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateProject = async () => {
    const projectData = {
      ...formData,
      start_date: formData.start_date?.toISOString().split('T')[0],
      target_completion: formData.target_completion?.toISOString().split('T')[0],
      status: 'planning' as const,
      current_phase: 'discovery' as const,
      progress_percentage: 0
    };

    createProject(projectData, {
      onSuccess: (project) => {
        toast({
          title: "Project Created Successfully",
          description: `${formData.name} has been created and is ready for scoping.`,
        });
        onComplete?.(project.id);
      },
      onError: (error) => {
        toast({
          title: "Failed to Create Project",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const addItem = (field: 'pain_points' | 'success_criteria', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeItem = (field: 'pain_points' | 'success_criteria', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleCompliance = (framework: string) => {
    setFormData(prev => ({
      ...prev,
      compliance_frameworks: prev.compliance_frameworks.includes(framework)
        ? prev.compliance_frameworks.filter(f => f !== framework)
        : [...prev.compliance_frameworks, framework]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Import from Scoping Session */}
            {scopingSessions.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Import from Scoping Session
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={importFromScoping}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scoping session to import" />
                    </SelectTrigger>
                    <SelectContent>
                      {scopingSessions.map(session => (
                        <SelectItem key={session.id} value={session.id}>
                          {session.name} ({session.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {importedFrom && (
                    <Badge variant="outline" className="mt-2">
                      Imported from: {scopingSessions.find(s => s.id === importedFrom)?.name}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Global HQ NAC Deployment"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="client_name">Client/Organization *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="e.g., Acme Corporation"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {(industryData.length > 0 ? industryData : industries).map((industry: any) => (
                      <SelectItem key={typeof industry === 'string' ? industry : industry.name} value={typeof industry === 'string' ? industry.toLowerCase().replace(/\s+/g, '-') : industry.name}>
                        {typeof industry === 'string' ? industry : industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project objectives, scope, and key requirements..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deployment_type">Deployment Type *</Label>
                <Select value={formData.deployment_type} onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_type: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select deployment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deploymentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="security_level">Security Level *</Label>
                <Select value={formData.security_level} onValueChange={(value) => setFormData(prev => ({ ...prev, security_level: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total_sites">Total Sites</Label>
                <Input
                  id="total_sites"
                  type="number"
                  value={formData.total_sites}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_sites: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="total_endpoints">Estimated Endpoints</Label>
                <Input
                  id="total_endpoints"
                  type="number"
                  value={formData.total_endpoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_endpoints: parseInt(e.target.value) || 100 }))}
                  className="mt-1"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Target Completion</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.target_completion ? format(formData.target_completion, "PPP") : "Select completion date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.target_completion}
                      onSelect={(date) => setFormData(prev => ({ ...prev, target_completion: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Project Budget (Optional)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || undefined }))}
                placeholder="Enter budget amount"
                className="mt-1"
                min="0"
                step="1000"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Compliance Frameworks</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select all applicable compliance frameworks for this project
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {complianceOptions.map((framework) => (
                  <Button
                    key={framework}
                    variant={formData.compliance_frameworks.includes(framework) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCompliance(framework)}
                    className="justify-start"
                  >
                    {framework}
                  </Button>
                ))}
              </div>
              {formData.compliance_frameworks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Frameworks:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.compliance_frameworks.map((framework) => (
                      <Badge key={framework} variant="secondary">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InlineSelectCreate
                categoryKey="wired_wireless"
                label="Network Infrastructure"
                description="Select switches, APs, controllers"
                value={selectedVendors}
                onChange={setSelectedVendors}
              />
              <InlineSelectCreate
                categoryKey="siem"
                label="SIEM Platforms"
                description="Select SIEM solutions"
                value={selectedSiem}
                onChange={setSelectedSiem}
              />
              <InlineSelectCreate
                categoryKey="mdm"
                label="MDM/UEM"
                description="Select mobile device management"
                value={selectedMdm}
                onChange={setSelectedMdm}
              />
              <InlineSelectCreate
                categoryKey="firewall"
                label="Firewalls"
                description="Select firewall platforms"
                value={selectedFirewall}
                onChange={setSelectedFirewall}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Pain Points & Challenges</Label>
              <p className="text-sm text-muted-foreground mb-2">
                What are the key challenges this project aims to address?
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a pain point..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItem('pain_points', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      if (input) {
                        addItem('pain_points', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {formData.pain_points.length > 0 && (
                  <div className="space-y-1">
                    {formData.pain_points.map((point, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{point}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('pain_points', index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label>Success Criteria</Label>
              <p className="text-sm text-muted-foreground mb-2">
                What defines success for this project?
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a success criterion..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItem('success_criteria', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                      if (input) {
                        addItem('success_criteria', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {formData.success_criteria.length > 0 && (
                  <div className="space-y-1">
                    {formData.success_criteria.map((criterion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{criterion}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('success_criteria', index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-border/50">
        <CardHeader className="space-y-6">
          <div className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create New Project
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Set up a comprehensive Portnox ZTAC project with scoping, POC management, and deployment tracking
            </CardDescription>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isActive 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : isCompleted
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-border bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-2 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`} />
                  <h3 className="font-medium text-xs">{step.title}</h3>
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePrevious}
              disabled={isPending}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={isPending}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateProject} 
                disabled={isPending || !formData.name || !formData.client_name || !formData.industry}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationWizard;