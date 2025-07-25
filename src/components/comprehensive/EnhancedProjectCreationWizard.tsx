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
  Users, Shield, Target, Globe, MapPin, Plus, X, Upload, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';
import { useBulkSiteTemplates } from '@/hooks/useBulkSiteTemplates';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';

// Industry and compliance options
const industries = [
  'Healthcare', 'Finance', 'Education', 'Government', 'Manufacturing', 
  'Retail', 'Technology', 'Energy', 'Transportation', 'Other'
];

const complianceFrameworks = [
  'SOX', 'HIPAA', 'PCI-DSS', 'ISO 27001', 'NIST', 'GDPR', 'SOC 2', 'FedRAMP', 'Other'
];

const timezones = [
  'UTC', 'EST', 'CST', 'MST', 'PST', 'GMT', 'CET', 'JST', 'AEST', 'IST',
  'PST', 'PDT', 'EDT', 'CDT', 'MDT', 'HST', 'AKST', 'AST', 'NST'
];

interface EnhancedProjectFormData {
  // Basic Information
  name: string;
  description: string;
  client_name: string;
  industry: string;
  project_type: 'poc' | 'implementation' | 'expansion' | 'migration' | 'upgrade' | '';
  deployment_type: string;
  security_level: string;
  
  // Scope & Timeline
  start_date?: Date;
  target_completion?: Date;
  total_sites: number;
  total_endpoints: number;
  budget?: number;
  
  // Geographic & Organizational
  primary_country: string;
  primary_region: string;
  timezone: string;
  
  // Stakeholders & Owners
  project_owner: string;
  technical_owner: string;
  portnox_owner: string;
  additional_stakeholders: string[];
  
  // Framework & Compliance
  compliance_frameworks: string[];
  
  // Project Details
  pain_points: string[];
  success_criteria: string[];
  
  // Bulk Creation Options
  enable_bulk_sites: boolean;
  bulk_sites_data: any[];
  enable_bulk_users: boolean;
  enable_auto_vendors: boolean;
}

interface EnhancedProjectCreationWizardProps {
  onComplete?: (projectId: string) => void;
  onCancel?: () => void;
}

const EnhancedProjectCreationWizard: React.FC<EnhancedProjectCreationWizardProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnhancedProjectFormData>({
    name: '',
    description: '',
    client_name: '',
    industry: '',
    project_type: '',
    deployment_type: '',
    security_level: '',
    total_sites: 1,
    total_endpoints: 100,
    primary_country: '',
    primary_region: '',
    timezone: 'UTC',
    project_owner: '',
    technical_owner: '',
    portnox_owner: '',
    additional_stakeholders: [],
    compliance_frameworks: [],
    pain_points: [],
    success_criteria: [],
    enable_bulk_sites: false,
    bulk_sites_data: [],
    enable_bulk_users: false,
    enable_auto_vendors: false
  });

  // Data hooks
  const { data: countries = [] } = useCountries();
  const { data: regions = [] } = useRegionsByCountry(formData.primary_country);
  const { data: bulkTemplates = [] } = useBulkSiteTemplates();
  
  const { mutate: createProject, isPending } = useCreateProject();
  const { toast } = useToast();

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
      description: "Security, compliance, and success criteria",
      icon: Shield
    },
    {
      id: 5,
      title: "Bulk Operations Setup",
      description: "Configure bulk site/user creation options",
      icon: Building2
    }
  ];

  const projectTypes = [
    { value: 'poc', label: 'Proof of Concept', description: 'Initial validation and testing' },
    { value: 'implementation', label: 'Full Implementation', description: 'Complete deployment across organization' },
    { value: 'expansion', label: 'Expansion', description: 'Extending existing NAC deployment' },
    { value: 'migration', label: 'Migration', description: 'Moving from existing NAC solution' },
    { value: 'upgrade', label: 'Upgrade', description: 'Upgrading current Portnox deployment' }
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

  const addStakeholder = (email: string) => {
    if (email.trim() && !formData.additional_stakeholders.includes(email.trim())) {
      setFormData(prev => ({
        ...prev,
        additional_stakeholders: [...prev.additional_stakeholders, email.trim()]
      }));
    }
  };

  const removeStakeholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_stakeholders: prev.additional_stakeholders.filter((_, i) => i !== index)
    }));
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

  // Remove this line as it's no longer needed

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
                <Label>Project Type *</Label>
                <RadioGroup 
                  value={formData.project_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, project_type: value as any }))}
                  className="mt-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectTypes.map((type) => (
                      <div key={type.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor={type.value} className="text-sm font-medium cursor-pointer">
                            {type.label}
                          </label>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
                Add other team members who should have visibility into this project
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="stakeholder@company.com"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addStakeholder(e.currentTarget.value);
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
                        addStakeholder(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.additional_stakeholders.length > 0 && (
                  <div className="space-y-1">
                    {formData.additional_stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{stakeholder}</span>
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

            <Separator />

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
                    <Plus className="h-4 w-4" />
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

  const calculateProgress = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.name && formData.client_name && formData.industry && formData.project_type;
      case 2:
        return formData.primary_country && formData.timezone && formData.deployment_type && formData.security_level;
      case 3:
        return formData.project_owner && formData.technical_owner && formData.portnox_owner;
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Enhanced Project Creation</h2>
          <Badge variant="outline">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(calculateProgress())}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-1 flex-1 ${
                step.id === currentStep ? 'text-primary' : 
                step.id < currentStep ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step.id === currentStep ? 'border-primary bg-primary/10' :
                step.id < currentStep ? 'border-green-600 bg-green-600/10' : 'border-muted'
              }`}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <div className="text-center">
                <div className="text-xs font-medium">{step.title}</div>
                <div className="text-xs hidden sm:block">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
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
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreateProject}
            disabled={isPending || !canProceed}
            className="flex items-center gap-2"
          >
            {isPending ? 'Creating...' : 'Create Project'}
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedProjectCreationWizard;