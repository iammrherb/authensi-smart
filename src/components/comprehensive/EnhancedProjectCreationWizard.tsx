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
  Sparkles, Brain, FileText, Settings, Zap, RefreshCw, ArrowUpRight, Layers, Network
} from 'lucide-react';
import BulkSiteCreator from '@/components/sites/BulkSiteCreator';
import BulkUserCreator from '@/components/users/BulkUserCreator';
import { format } from 'date-fns';
import { useCreateProject } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';
import { useBulkSiteTemplates } from '@/hooks/useBulkSiteTemplates';
import { useRequirements } from '@/hooks/useRequirements';
import { usePainPoints, useCreatePainPoint } from '@/hooks/usePainPoints';
import { useRecommendations, useCreateRecommendation } from '@/hooks/useRecommendations';
import { useIndustryOptions, useComplianceFrameworks } from '@/hooks/useResourceLibrary';
import { AppRole } from '@/hooks/useUserRoles';
import { useAI } from '@/hooks/useAI';
import InfrastructureSelector, { InfrastructureSelection } from "@/components/resources/InfrastructureSelector";
import { jsPDF } from 'jspdf';

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
      timeline: "2-4 months",
      sites: "Current deployment",
      endpoints: "Existing count",
      requirements: ["Current State Assessment", "Upgrade Planning", "Testing & Validation", "Training Updates"],
      painPoints: ["Minimal downtime required", "Feature compatibility", "Training updates needed"]
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
  pain_points: string[];
  success_criteria: string[];
  integration_requirements: string[];
  enable_bulk_sites: boolean;
  enable_bulk_users: boolean;
  enable_auto_vendors: boolean;
  enable_portnox_automation: boolean;
  bulk_sites_data?: any[];
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
    pain_points: [],
    success_criteria: [],
    integration_requirements: [],
    enable_bulk_sites: false,
    enable_bulk_users: false,
    enable_auto_vendors: false,
    enable_portnox_automation: false
  });
  const [infrastructure, setInfrastructure] = useState<InfrastructureSelection>({
    nac_vendors: [],
    network: { wired_vendors: [], wired_models: {}, wireless_vendors: [], wireless_models: {} },
    security: { firewalls: [], vpn: [], idp_sso: [], edr: [], siem: [] },
    device_inventory: []
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
  const { data: industryOptions = [] } = useIndustryOptions();
  const { data: complianceFrameworksData = [] } = useComplianceFrameworks();
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
  const [reportMarkdown, setReportMarkdown] = useState<string>("");
  // Bulk operations state
  const [showBulkSiteCreator, setShowBulkSiteCreator] = useState(false);
  const [showBulkUserCreator, setShowBulkUserCreator] = useState(false);
  const [bulkSiteLoading, setBulkSiteLoading] = useState(false);
  const [bulkUserLoading, setBulkUserLoading] = useState(false);

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

  const industries = industryOptions.map(option => option.name);
  const complianceOptions = complianceFrameworksData.map(framework => framework.name);

  const deploymentTypes = [
    "greenfield", "brownfield", "hybrid", "cloud-first", "on-premises", "multi-cloud"
  ];

  const securityLevels = [
    "basic", "standard", "enhanced", "maximum", "government", "defense"
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
      name: formData.name,
      description: formData.description,
      client_name: formData.client_name,
      business_domain: formData.business_domain,
      business_website: formData.business_website,
      business_summary: formData.business_summary,
      project_type: formData.project_type,
      industry: formData.industry,
      primary_country: formData.primary_country,
      primary_region: formData.primary_region,
      timezone: formData.timezone,
      deployment_type: formData.deployment_type,
      security_level: formData.security_level,
      total_sites: formData.total_sites,
      total_endpoints: formData.total_endpoints,
      budget: formData.budget,
      project_manager: formData.project_manager,
      project_owner: formData.project_owner,
      technical_owner: formData.technical_owner,
      portnox_owner: formData.portnox_owner,
      additional_stakeholders: formData.additional_stakeholders,
      compliance_frameworks: formData.compliance_frameworks,
      pain_points: formData.pain_points,
      success_criteria: formData.success_criteria,
      integration_requirements: formData.integration_requirements,
      enable_bulk_sites: formData.enable_bulk_sites,
      enable_bulk_users: formData.enable_bulk_users,
      enable_auto_vendors: formData.enable_auto_vendors,
      start_date: formData.start_date?.toISOString().split('T')[0],
      target_completion: formData.target_completion?.toISOString().split('T')[0],
      status: 'planning' as const,
      current_phase: 'discovery' as const,
      progress_percentage: 0,
      migration_scope: { infrastructure }
    };

    createProject(projectData, {
      onSuccess: (project) => {
        toast({
          title: "Project Created Successfully",
          description: `${formData.name} has been created with comprehensive settings.`,
        });
        onComplete?.(project.id);
        if (formData.enable_portnox_automation) {
          setTimeout(() => {
            window.location.assign(`/project/${project.id}/tracking`);
          }, 150);
        }
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

  const addItem = (field: 'pain_points' | 'integration_requirements', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeItem = (field: 'pain_points' | 'integration_requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addRequirementFromLibrary = (requirementId: string) => {
    const requirement = requirements?.find(r => r.id === requirementId);
    if (requirement && !formData.integration_requirements.includes(requirement.title)) {
      setFormData(prev => ({
        ...prev,
        integration_requirements: [...prev.integration_requirements, requirement.title]
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
      integration_requirements: [...prev.integration_requirements, ...template.defaultValues.requirements]
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
      const context = `Generate a brief business summary (2-3 sentences) for:
        - Client: ${formData.client_name}
        - Industry: ${formData.industry}
        - Business Domain: ${formData.business_domain || 'Not specified'}
        - Website: ${formData.business_website || 'Not specified'}
        - Project Type: ${formData.project_type || 'Not specified'}
        
        Focus on business operations, industry context, and relevant compliance/security needs for NAC deployment.`;

      const summary = await enhanceNotes(
        `${formData.client_name} - ${formData.industry} organization`,
        context
      );

      if (summary) {
        setFormData(prev => ({ ...prev, business_summary: summary }));
        toast({
          title: "Business Summary Generated",
          description: "AI has created a brief business summary for your project."
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

  const generateReport = () => {
    const lines: string[] = [];
    lines.push(`# Scoping & Deployment Summary: ${formData.name || 'Project'}`);
    lines.push(`\n## Organization`);
    lines.push(`- Client: ${formData.client_name || 'N/A'}`);
    lines.push(`- Industry: ${formData.industry || 'N/A'}`);
    lines.push(`- Type: ${formData.project_type ? projectTemplates[formData.project_type].title : 'N/A'}`);
    lines.push(`\n## Compliance & Requirements`);
    lines.push(`- Frameworks: ${(formData.compliance_frameworks || []).join(', ') || 'None'}`);
    lines.push(`- Requirements:\n${(formData.integration_requirements || []).map(r => `  - ${r}`).join('\n') || '  - Standard best practices'}`);
    lines.push(`- Pain Points:\n${(formData.pain_points || []).map(p => `  - ${p}`).join('\n') || '  - None provided'}`);
    lines.push(`\n## Infrastructure`);
    lines.push(`- NAC Vendors: ${infrastructure.nac_vendors.length}`);
    lines.push(`- Wired Vendors: ${infrastructure.network.wired_vendors.length}`);
    lines.push(`- Wireless Vendors: ${infrastructure.network.wireless_vendors.length}`);
    lines.push(`- Security Stack: Firewalls(${infrastructure.security.firewalls.length}), VPN(${infrastructure.security.vpn.length}), IDP/SSO(${infrastructure.security.idp_sso.length}), EDR(${infrastructure.security.edr.length}), SIEM(${infrastructure.security.siem.length})`);
    lines.push(`- Device Inventory:`);
    if (infrastructure.device_inventory.length) {
      infrastructure.device_inventory.forEach(d => lines.push(`  - ${d.type} (${d.brand} ${d.model}): ${d.quantity}`));
    } else {
      lines.push('  - Not specified');
    }
    lines.push(`\n## Scale & Timeline`);
    lines.push(`- Sites: ${formData.total_sites || 0}`);
    lines.push(`- Endpoints: ${formData.total_endpoints || 0}`);
    lines.push(`- Start: ${formData.start_date ? format(formData.start_date, 'PPP') : 'N/A'}`);
    lines.push(`- Target Completion: ${formData.target_completion ? format(formData.target_completion, 'PPP') : 'N/A'}`);
    lines.push(`\n## AI Recommendations`);
    lines.push(`- Business Summary: ${formData.business_summary || 'Pending'}`);
    setReportMarkdown(lines.join('\n'));
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const maxWidth = 515; // A4 width 595 - margins
    const text = reportMarkdown || 'No report generated yet.';
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, margin);
    doc.save(`${(formData.name || 'project').replace(/\s+/g, '-')}-scoping-summary.pdf`);
  };
  // Generate sites automatically based on count
  const generateSitesFromCount = () => {
    if (!formData.total_sites || formData.total_sites <= 1) return;
    const generatedSites = Array.from({ length: formData.total_sites }, (_, index) => ({
      name: `Site ${index + 1}`,
      location: `Location ${index + 1}`,
      device_count: Math.floor(formData.total_endpoints! / formData.total_sites!),
      site_type: 'office'
    }));
    setFormData(prev => ({
      ...prev,
      bulk_sites_data: generatedSites
    }));
    toast({
      title: "Sites Generated",
      description: `${formData.total_sites} sites have been auto-generated.`
    });
  };
  const handleBulkSiteSubmit = (sites: any[]) => {
    setFormData(prev => ({
      ...prev,
      bulk_sites_data: sites
    }));
    setShowBulkSiteCreator(false);
    toast({
      title: "Sites Prepared",
      description: `${sites.length} sites are ready for project creation.`
    });
  };

  // Handle bulk user submission
  const handleBulkUserSubmit = (users: any[]) => {
    setFormData(prev => ({
      ...prev,
      additional_stakeholders: [...prev.additional_stakeholders, ...users]
    }));
    setShowBulkUserCreator(false);
    toast({
      title: "Users Added",
      description: `${users.length} users have been added to the project team.`
    });
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
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.target_completion ? format(formData.target_completion, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_manager">Project Manager</Label>
                <Input
                  id="project_manager"
                  value={formData.project_manager || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_manager: e.target.value }))}
                  placeholder="Project manager email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project_owner">Project Owner</Label>
                <Input
                  id="project_owner"
                  value={formData.project_owner || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_owner: e.target.value }))}
                  placeholder="Project owner email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="technical_owner">Technical Owner</Label>
                <Input
                  id="technical_owner"
                  value={formData.technical_owner || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, technical_owner: e.target.value }))}
                  placeholder="Technical owner email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="portnox_owner">Portnox Owner</Label>
                <Input
                  id="portnox_owner"
                  value={formData.portnox_owner || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, portnox_owner: e.target.value }))}
                  placeholder="Portnox representative email"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Additional Stakeholders</Label>
              <div className="space-y-3 mt-3">
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    placeholder="Email address"
                    value={newStakeholder.email}
                    onChange={(e) => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-4"
                  />
                  <Select value={newStakeholder.role} onValueChange={(value) => setNewStakeholder(prev => ({ ...prev, role: value as any }))}>
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="product_manager">Product Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox
                      id="createUser"
                      checked={newStakeholder.createUser}
                      onCheckedChange={(checked) => setNewStakeholder(prev => ({ ...prev, createUser: checked as boolean }))}
                    />
                    <Label htmlFor="createUser" className="text-sm">Create User</Label>
                  </div>
                  <div className="flex items-center space-x-2 col-span-2">
                    <Checkbox
                      id="sendInvitation"
                      checked={newStakeholder.sendInvitation}
                      onCheckedChange={(checked) => setNewStakeholder(prev => ({ ...prev, sendInvitation: checked as boolean }))}
                    />
                    <Label htmlFor="sendInvitation" className="text-sm">Send Invitation</Label>
                  </div>
                  <Button onClick={addStakeholder} size="sm" className="col-span-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.additional_stakeholders.length > 0 && (
                  <div className="space-y-2">
                    {formData.additional_stakeholders.map((stakeholder, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{stakeholder.email}</div>
                            <div className="text-sm text-muted-foreground">
                              Role: {stakeholder.role} | 
                              {stakeholder.createUser ? ' Create User' : ' Contact Only'} |
                              {stakeholder.sendInvitation ? ' Send Invitation' : ' No Invitation'}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStakeholder(index)}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
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
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Requirements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhancePainPointsWithAI}
                  disabled={isEnhancingPainPoints}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  AI Enhance
                </Button>
              </div>
              
              <div className="space-y-3 mt-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newRequirement.trim()) {
                        addItem('integration_requirements', newRequirement);
                        setNewRequirement('');
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newRequirement.trim()) {
                        addItem('integration_requirements', newRequirement);
                        setNewRequirement('');
                      }
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {requirements.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">From Requirements Library:</Label>
                    <Select onValueChange={addRequirementFromLibrary}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select from library..." />
                      </SelectTrigger>
                      <SelectContent>
                        {requirements.map((req) => (
                          <SelectItem key={req.id} value={req.id}>
                            {req.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.integration_requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{requirement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('integration_requirements', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Pain Points</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={enhancePainPointsWithAI}
                  disabled={isEnhancingPainPoints || formData.pain_points.length === 0}
                  className="flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {isEnhancingPainPoints ? 'Enhancing...' : 'AI Enhance'}
                </Button>
              </div>
              
              <div className="space-y-3 mt-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new pain point..."
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newPainPoint.trim()) {
                        addItem('pain_points', newPainPoint);
                        setNewPainPoint('');
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newPainPoint.trim()) {
                        addItem('pain_points', newPainPoint);
                        setNewPainPoint('');
                      }
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {painPoints.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">From Pain Points Library:</Label>
                    <Select onValueChange={addPainPointFromLibrary}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select from library..." />
                      </SelectTrigger>
                      <SelectContent>
                        {painPoints.map((point) => (
                          <SelectItem key={point.id} value={point.id}>
                            {point.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  {formData.pain_points.map((painPoint, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{painPoint}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddPainPointToLibrary(painPoint)}
                          title="Add to library"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('pain_points', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddPainPointToLibrary && (
                  <div className="p-3 border rounded-lg bg-card">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Add "{showAddPainPointToLibrary}" to library?</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToLibrary('pain_point', showAddPainPointToLibrary)}
                        >
                          Add
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAddPainPointToLibrary(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Infrastructure & Inventory */}
              <div className="pt-6">
                <Separator className="my-6" />
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">Infrastructure & Inventory</Label>
                  <Badge variant="outline">Multi-select</Badge>
                </div>
                <InfrastructureSelector value={infrastructure} onChange={setInfrastructure} />
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
                <Label htmlFor="enable_bulk_sites" className="font-medium">Enable Bulk Site Creation</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Allow importing multiple sites from CSV files or templates
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_bulk_users"
                  checked={formData.enable_bulk_users}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_bulk_users: checked as boolean }))}
                />
                <Label htmlFor="enable_bulk_users" className="font-medium">Enable Bulk User Creation</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Allow importing multiple users from external systems or CSV files
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable_auto_vendors"
                  checked={formData.enable_auto_vendors}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_auto_vendors: checked as boolean }))}
                />
                <Label htmlFor="enable_auto_vendors" className="font-medium">Enable Auto Vendor Configuration</Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Automatically configure vendor settings based on site requirements
              </p>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Project Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Project Name:</strong> {formData.name || 'Not specified'}
                </div>
                <div>
                  <strong>Client:</strong> {formData.client_name || 'Not specified'}
                </div>
                <div>
                  <strong>Industry:</strong> {formData.industry || 'Not specified'}
                </div>
                <div>
                  <strong>Type:</strong> {formData.project_type ? projectTemplates[formData.project_type].title : 'Not specified'}
                </div>
                <div>
                  <strong>Sites:</strong> {formData.total_sites || 0}
                </div>
                <div>
                  <strong>Endpoints:</strong> {formData.total_endpoints || 0}
                </div>
                <div>
                  <strong>Requirements:</strong> {formData.integration_requirements.length}
                </div>
                <div>
                  <strong>Pain Points:</strong> {formData.pain_points.length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={generateReport} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Generate Markdown Report
                </Button>
                <Button type="button" variant="default" size="sm" onClick={downloadPDF} disabled={!reportMarkdown} className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
              {reportMarkdown && (
                <div className="p-3 bg-card rounded border">
                  <Label className="text-sm mb-2 block">Report (Markdown)</Label>
                  <Textarea className="min-h-[180px]" value={reportMarkdown} readOnly />
                </div>
              )}
            </div>
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
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
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