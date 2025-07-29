import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CalendarIcon, ArrowLeft, ArrowRight, CheckCircle, Briefcase, Building2, 
  Users, Shield, Target, Globe, MapPin, Plus, X, Upload, Download, UserPlus, Mail,
  Sparkles, Brain, FileText, Settings, Zap, RefreshCw, ArrowUpRight, Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';
import { useBulkSiteTemplates } from '@/hooks/useBulkSiteTemplates';
import { useRequirements } from '@/hooks/useRequirements';
import { usePainPoints, useCreatePainPoint } from '@/hooks/usePainPoints';
import { useRecommendations, useCreateRecommendation } from '@/hooks/useRecommendations';
import { AppRole } from '@/hooks/useUserRoles';
import { useAI } from '@/hooks/useAI';

interface StakeholderEntry {
  email: string;
  role: AppRole | 'contact';
  createUser: boolean;
  sendInvitation: boolean;
}

// Project Templates
const projectTemplates = {
  poc: {
    title: "Proof of Concept",
    description: "Test Portnox NAC capabilities in a controlled environment",
    icon: Sparkles,
    defaultValues: {
      timeline: "3-6 months",
      sites: "1-3",
      endpoints: "50-500",
      requirements: ["Lab Environment Setup", "Basic Policy Testing", "User Acceptance Testing", "Documentation"],
      painPoints: ["Need to validate technology", "Limited budget for testing", "Proof required before full deployment"]
    }
  },
  implementation: {
    title: "Full Implementation",
    description: "Complete NAC deployment across your organization",
    icon: Settings,
    defaultValues: {
      timeline: "6-18 months",
      sites: "Multiple",
      endpoints: "1000+",
      requirements: ["Network Infrastructure Assessment", "Policy Framework Design", "User Training", "Go-Live Support"],
      painPoints: ["Complex network environment", "Multiple stakeholders", "Business continuity requirements"]
    }
  },
  expansion: {
    title: "Network Expansion",
    description: "Extend existing NAC deployment to new sites or segments",
    icon: ArrowUpRight,
    defaultValues: {
      timeline: "3-9 months",
      sites: "New locations",
      endpoints: "Variable",
      requirements: ["Site Assessment", "Configuration Replication", "Testing & Validation", "User Onboarding"],
      painPoints: ["Maintaining consistency", "Remote site challenges", "Resource allocation"]
    }
  },
  migration: {
    title: "Technology Migration",
    description: "Migrate from existing NAC solution to Portnox",
    icon: RefreshCw,
    defaultValues: {
      timeline: "6-12 months",
      sites: "Existing coverage",
      endpoints: "Current deployment",
      requirements: ["Legacy System Analysis", "Migration Planning", "Parallel Testing", "Cutover Planning"],
      painPoints: ["Zero downtime requirement", "Legacy system dependencies", "User impact minimization"]
    }
  },
  upgrade: {
    title: "System Upgrade",
    description: "Upgrade existing Portnox deployment",
    icon: Layers,
    defaultValues: {
      timeline: "2-6 months",
      sites: "Current sites",
      endpoints: "Current endpoints",
      requirements: ["Compatibility Assessment", "Upgrade Planning", "Testing Procedures", "Rollback Planning"],
      painPoints: ["Version compatibility", "Feature migration", "Minimal disruption"]
    }
  }
};

interface EnhancedProjectFormData {
  name: string;
  project_type?: keyof typeof projectTemplates;
  industry?: string;
  description?: string;
  client_name?: string;
  business_domain?: string;
  business_website?: string;
  business_summary?: string;
  primary_country?: string;
  primary_region?: string;
  timezone?: string;
  deployment_type?: string;
  security_level?: string;
  total_sites?: number;
  total_endpoints?: number;
  budget?: number;
  start_date?: Date;
  target_completion?: Date;
  project_manager?: string;
  project_owner?: string;
  technical_owner?: string;
  portnox_owner?: string;
  additional_stakeholders: StakeholderEntry[];
  compliance_frameworks: string[];
  requirements: string[];
  pain_points: string[];
  enable_bulk_sites: boolean;
  enable_bulk_users: boolean;
  enable_auto_vendors: boolean;
}

interface Props {
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
}

const EnhancedProjectCreationWizard: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnhancedProjectFormData>({
    name: '',
    client_name: '',
    business_domain: '',
    business_website: '',
    business_summary: '',
    primary_country: '',
    primary_region: '',
    timezone: '',
    deployment_type: '',
    security_level: '',
    total_sites: 1,
    total_endpoints: 100,
    additional_stakeholders: [],
    compliance_frameworks: [],
    requirements: [],
    pain_points: [],
    enable_bulk_sites: false,
    enable_bulk_users: false,
    enable_auto_vendors: false
  });

  const [newStakeholder, setNewStakeholder] = useState<StakeholderEntry>({
    email: '',
    role: 'contact',
    createUser: false,
    sendInvitation: false
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');

  const { data: countries = [] } = useCountries();
  const { data: regions = [] } = useRegionsByCountry(formData.primary_country);
  const { data: templates = [] } = useBulkSiteTemplates();
  const { data: requirements = [] } = useRequirements();
  const { data: painPoints = [] } = usePainPoints();
  const { data: recommendations = [] } = useRecommendations();
  const { mutate: createProject, isPending } = useCreateProject();
  const { mutate: createPainPoint } = useCreatePainPoint();
  const { mutate: createRecommendation } = useCreateRecommendation();
  const { toast } = useToast();
  const { enhanceNotes, generateProjectSummary, isLoading: aiLoading } = useAI();

  // AI-related state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isEnhancingPainPoints, setIsEnhancingPainPoints] = useState(false);
  const [showAddPainPointToLibrary, setShowAddPainPointToLibrary] = useState<string | null>(null);
  const [showAddRecommendationToLibrary, setShowAddRecommendationToLibrary] = useState<string | null>(null);

  const steps = [
    {
      id: 1,
      title: "Project Basics",
      description: "Core project information and type",
      icon: Briefcase
    },
    {
      id: 2,
      title: "Geographic & Scale",
      description: "Location, scope, and timeline details",
      icon: Globe
    },
    {
      id: 3,
      title: "Stakeholders & Ownership",
      description: "Project owners and key stakeholders",
      icon: Users
    },
    {
      id: 4,
      title: "Compliance & Requirements",
      description: "Security, compliance, and requirements",
      icon: Shield
    },
    {
      id: 5,
      title: "Bulk Operations Setup",
      description: "Configure bulk site/user creation options",
      icon: Building2
    }
  ];

  const industries = [
    "Financial Services", "Healthcare", "Government", "Education", "Manufacturing",
    "Retail", "Technology", "Energy", "Transportation", "Telecommunications",
    "Legal", "Consulting", "Real Estate", "Media", "Non-Profit"
  ];

  const deploymentTypes = [
    "greenfield", "brownfield", "hybrid", "cloud-first", "on-premises", "multi-cloud"
  ];

  const securityLevels = [
    "basic", "standard", "enhanced", "maximum", "government", "defense"
  ];

  const complianceOptions = [
    "SOX", "HIPAA", "PCI-DSS", "GDPR", "SOC2", "ISO27001", "NIST", "FISMA", 
    "FedRAMP", "CCPA", "PIPEDA", "LGPD", "Custom"
  ];

  const timezones = [
    'UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'IST',
    'PST', 'PDT', 'EDT', 'CDT', 'MDT', 'HST', 'AKST', 'AST', 'NST'
  ];

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
      additional_stakeholders: formData.additional_stakeholders.map(s => `${s.email}:${s.role}:${s.createUser}:${s.sendInvitation}`),
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
          description: `${formData.name} has been created with comprehensive settings.`,
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

  const addStakeholder = () => {
    if (newStakeholder.email.trim() && !formData.additional_stakeholders.some(s => s.email === newStakeholder.email.trim())) {
      setFormData(prev => ({
        ...prev,
        additional_stakeholders: [...prev.additional_stakeholders, newStakeholder]
      }));
      setNewStakeholder({ email: '', role: 'contact', createUser: false, sendInvitation: false });
    }
  };

  const removeStakeholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_stakeholders: prev.additional_stakeholders.filter((_, i) => i !== index)
    }));
  };

  const addItem = (field: 'pain_points' | 'requirements', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeItem = (field: 'pain_points' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addRequirementFromLibrary = (requirementId: string) => {
    const requirement = requirements?.find(r => r.id === requirementId);
    if (requirement && !formData.requirements.includes(requirement.title)) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement.title]
      }));
    }
  };

  const addPainPointFromLibrary = (painPointId: string) => {
    const painPoint = painPoints?.find(p => p.id === painPointId);
    if (painPoint && !formData.pain_points.includes(painPoint.title)) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...prev.pain_points, painPoint.title]
      }));
    }
  };

  const addRecommendationFromLibrary = (recommendationId: string) => {
    const recommendation = recommendations?.find(r => r.id === recommendationId);
    if (recommendation && !formData.pain_points.includes(recommendation.title)) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...prev.pain_points, recommendation.title]
      }));
    }
  };

  const handleAddToLibrary = (type: 'pain_point' | 'recommendation', item: string) => {
    if (type === 'pain_point') {
      createPainPoint({
        title: item,
        category: 'general',
        severity: 'medium',
        recommended_solutions: [],
        industry_specific: []
      });
      setShowAddPainPointToLibrary(null);
    } else {
      createRecommendation({
        title: item,
        description: `Recommendation: ${item}`,
        category: 'general',
        priority: 'medium',
        implementation_effort: 'medium',
        prerequisites: [],
        related_pain_points: [],
        portnox_features: [],
        industry_specific: []
      });
      setShowAddRecommendationToLibrary(null);
    }
  };

  // Apply project template
  const applyProjectTemplate = (templateKey: keyof typeof projectTemplates) => {
    const template = projectTemplates[templateKey];
    setFormData(prev => ({
      ...prev,
      project_type: templateKey,
      pain_points: [...prev.pain_points, ...template.defaultValues.painPoints],
      requirements: [...prev.requirements, ...template.defaultValues.requirements]
    }));
  };

  // Generate AI business summary
  const generateBusinessSummary = async () => {
    if (!formData.client_name || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please provide client name and industry first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await generateProjectSummary({
        name: formData.name,
        client_name: formData.client_name,
        industry: formData.industry,
        project_type: formData.project_type,
        deployment_type: formData.deployment_type,
        security_level: formData.security_level,
        total_sites: formData.total_sites,
        total_endpoints: formData.total_endpoints,
        business_domain: formData.business_domain,
        business_website: formData.business_website
      });

      if (summary) {
        setFormData(prev => ({ ...prev, business_summary: summary }));
        toast({
          title: "Business Summary Generated",
          description: "AI has created a comprehensive business summary for your project."
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Generate Summary",
        description: "Unable to generate AI summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Enhance pain points with AI
  const enhancePainPointsWithAI = async () => {
    if (formData.pain_points.length === 0) {
      toast({
        title: "No Pain Points",
        description: "Please add some pain points first.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancingPainPoints(true);
    try {
      const enhanced = await enhanceNotes(
        formData.pain_points.join('\n'),
        `Pain points for ${formData.client_name} in ${formData.industry} industry`
      );

      if (enhanced) {
        const enhancedLines = enhanced.split('\n').filter(line => line.trim());
        setFormData(prev => ({ 
          ...prev, 
          pain_points: enhancedLines 
        }));
        toast({
          title: "Pain Points Enhanced",
          description: "AI has enhanced and organized your pain points."
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Enhance Pain Points",
        description: "Unable to enhance pain points. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancingPainPoints(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="client_name">Client/Organization Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="Enter client or organization name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_domain">Business Domain</Label>
                <Input
                  id="business_domain"
                  value={formData.business_domain || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_domain: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="business_website">Business Website</Label>
                <Input
                  id="business_website"
                  value={formData.business_website || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, business_website: e.target.value }))}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Project Templates */}
            <div>
              <Label>Project Template</Label>
              <p className="text-sm text-muted-foreground mb-3">Choose a template to auto-populate requirements and pain points</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(projectTemplates).map(([key, template]) => {
                  const IconComponent = template.icon;
                  const isSelected = formData.project_type === key;
                  return (
                    <Card 
                      key={key} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => applyProjectTemplate(key as keyof typeof projectTemplates)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{template.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              <div>Timeline: {template.defaultValues.timeline}</div>
                              <div>Scope: {template.defaultValues.sites}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the project objectives, scope, and key requirements..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* AI Business Summary Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>AI Business Summary</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateBusinessSummary}
                  disabled={isGeneratingSummary || !formData.client_name || !formData.industry}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
                </Button>
              </div>
              {formData.business_summary && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{formData.business_summary}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary_country">Primary Country *</Label>
                <Select value={formData.primary_country} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_country: value, primary_region: '' }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.country_code} value={country.country_code}>
                        {country.country_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="primary_region">Primary Region</Label>
                  <Select 
                    value={formData.primary_region} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, primary_region: value }))}
                    disabled={!formData.primary_country}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.region_name} value={region.region_name}>
                          {region.region_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone *</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Label htmlFor="budget">Project Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || undefined }))}
                  placeholder="USD"
                  className="mt-1"
                  min="0"
                  step="1000"
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="project_owner">Project Owner *</Label>
                <Input
                  id="project_owner"
                  value={formData.project_owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_owner: e.target.value }))}
                  placeholder="email@company.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="technical_owner">Technical Owner *</Label>
                <Input
                  id="technical_owner"
                  value={formData.technical_owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, technical_owner: e.target.value }))}
                  placeholder="tech@company.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="portnox_owner">Portnox Owner *</Label>
                <Input
                  id="portnox_owner"
                  value={formData.portnox_owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, portnox_owner: e.target.value }))}
                  placeholder="consultant@portnox.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Additional Stakeholders</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add other team members and specify whether to create user accounts or just add as contacts
              </p>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={newStakeholder.email}
                    onChange={(e) => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <Select value={newStakeholder.role} onValueChange={(value) => setNewStakeholder(prev => ({ ...prev, role: value as any }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="product_manager">Product Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addStakeholder} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.additional_stakeholders.length > 0 && (
                  <div className="space-y-2">
                    {formData.additional_stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stakeholder.email}</span>
                            <Badge variant={stakeholder.role === 'contact' ? 'outline' : 'secondary'} className="text-xs">
                              {stakeholder.role === 'contact' ? 'Contact' : stakeholder.role}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-1">
                            {stakeholder.createUser && (
                              <div className="flex items-center gap-1">
                                <UserPlus className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">Create User</span>
                              </div>
                            )}
                            {stakeholder.sendInvitation && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-blue-600" />
                                <span className="text-xs text-blue-600">Send Invitation</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStakeholder(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
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
                    onClick={() => {
                      const isSelected = formData.compliance_frameworks.includes(framework);
                      setFormData(prev => ({
                        ...prev,
                        compliance_frameworks: isSelected 
                          ? prev.compliance_frameworks.filter(f => f !== framework)
                          : [...prev.compliance_frameworks, framework]
                      }));
                    }}
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

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pain Points & Challenges</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhancePainPointsWithAI}
                  disabled={isEnhancingPainPoints || formData.pain_points.length === 0}
                  className="flex items-center gap-1"
                >
                  {isEnhancingPainPoints ? (
                    <Brain className="h-3 w-3 animate-pulse" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  <span className="text-xs">AI Enhance</span>
                </Button>
              </div>
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
                    <Plus className="h-4 w-4" />
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
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Project Requirements</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Select requirements from the library or add custom ones
              </p>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select onValueChange={(reqId) => addRequirementFromLibrary(reqId)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select from requirements library..." />
                    </SelectTrigger>
                    <SelectContent>
                      {requirements?.map((req) => (
                        <SelectItem key={req.id} value={req.id}>
                          <div className="flex flex-col">
                            <span>{req.title}</span>
                            <span className="text-xs text-muted-foreground">{req.category}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline">
                    Browse Library
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a custom requirement..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addItem('requirements', e.currentTarget.value);
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
                        addItem('requirements', input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.requirements.length > 0 && (
                  <div className="space-y-1">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{requirement}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('requirements', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_bulk_sites"
                  checked={formData.enable_bulk_sites}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bulk_sites: checked as boolean }))}
                />
                <Label htmlFor="enable_bulk_sites" className="text-sm font-medium">
                  Enable Bulk Site Creation
                </Label>
              </div>
              {formData.enable_bulk_sites && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Bulk Site Creation Options</CardTitle>
                    <CardDescription>
                      Configure how sites will be created for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a CSV file with site information or use our auto-generation wizard
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_bulk_users"
                  checked={formData.enable_bulk_users}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bulk_users: checked as boolean }))}
                />
                <Label htmlFor="enable_bulk_users" className="text-sm font-medium">
                  Enable Bulk User Creation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_auto_vendors"
                  checked={formData.enable_auto_vendors}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_auto_vendors: checked as boolean }))}
                />
                <Label htmlFor="enable_auto_vendors" className="text-sm font-medium">
                  Auto-Configure Common Vendors
                </Label>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Post-Creation Actions</CardTitle>
                <CardDescription>
                  What happens after project creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Project will be created with all specified settings</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>You'll be redirected to the AI Scoping Wizard</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Comprehensive questionnaire will be generated</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Project tracking dashboard will be configured</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.client_name.trim() && formData.industry;
      case 2:
        return formData.primary_country && formData.timezone && formData.deployment_type && formData.security_level;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Enhanced Project</h2>
            <p className="text-muted-foreground">Set up a comprehensive project with AI-powered features</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            {currentStep === steps.length && (
              <Button
                onClick={handleCreateProject}
                disabled={isPending || !canProceed()}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                    ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : ''}
                    ${isCurrent ? 'border-primary text-primary' : ''}
                    ${!isCompleted && !isCurrent ? 'border-muted-foreground text-muted-foreground' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <IconComponent className="h-4 w-4" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className={`text-sm font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                  {step.id < steps.length && (
                    <div className={`hidden md:block w-8 h-px ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1]?.icon || Briefcase, { className: "h-5 w-5" })}
            {steps[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedProjectCreationWizard;
