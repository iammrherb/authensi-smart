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
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Map, Building2, Users, Network, Settings, Plus, X, Upload, Download,
  ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, FileSpreadsheet,
  Copy, Trash2, Edit, Eye, Filter, Search, RotateCcw, Zap
} from 'lucide-react';

import { useCreateProject } from '@/hooks/useProjects';
import { useCreateSite } from '@/hooks/useSites';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useDataEnhancement } from '@/hooks/useDataEnhancement';
import AIRecommendationPanel from '@/components/ai/AIRecommendationPanel';
import { AIContext } from '@/services/ai/EnhancedAIService';

interface BulkSiteCreationWizardProps {
  projectId?: string;
  onComplete: (projectId: string, sites: SiteData[]) => void;
  onCancel: () => void;
}

interface SiteData {
  id?: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  site_type: 'headquarters' | 'branch' | 'remote' | 'datacenter' | 'warehouse' | 'retail' | 'manufacturing' | 'other';
  total_users: number;
  total_devices: number;
  network_complexity: 'low' | 'medium' | 'high';
  deployment_priority: number;
  deployment_phase: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4';
  special_requirements: string[];
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  business_hours: string;
  timezone: string;
  internet_bandwidth: string;
  existing_infrastructure: string[];
  compliance_requirements: string[];
  security_level: 'basic' | 'standard' | 'high' | 'critical';
  estimated_budget: number;
  notes: string;
}

interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  site_type: string;
  typical_users: number;
  typical_devices: number;
  network_complexity: 'low' | 'medium' | 'high';
  default_requirements: string[];
  estimated_budget_range: string;
}

type WizardStep = 'project-info' | 'site-templates' | 'bulk-entry' | 'site-details' | 'validation' | 'review';

const BulkSiteCreationWizard: React.FC<BulkSiteCreationWizardProps> = ({
  projectId,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('project-info');
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    description: '',
    client_name: '',
    total_sites_planned: 0,
    deployment_strategy: 'phased' as 'big-bang' | 'phased' | 'pilot-first',
    target_completion: '',
    budget_range: ''
  });

  const [sites, setSites] = useState<SiteData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [bulkEntryText, setBulkEntryText] = useState('');
  const [validationErrors, setValidationErrors] = useState<Array<{ siteIndex: number; field: string; message: string }>>([]);

  const { toast } = useToast();
  const createProject = useCreateProject();
  const createSite = useCreateSite();
  const { generateRecommendations, isLoading: isGeneratingRecommendations, recommendations } = useEnhancedAI();
  const { recordInteraction } = useDataEnhancement();

  const steps: WizardStep[] = ['project-info', 'site-templates', 'bulk-entry', 'site-details', 'validation', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Predefined site templates
  const siteTemplates: SiteTemplate[] = [
    {
      id: 'headquarters',
      name: 'Headquarters',
      description: 'Main corporate office with full infrastructure',
      site_type: 'headquarters',
      typical_users: 500,
      typical_devices: 1000,
      network_complexity: 'high',
      default_requirements: ['Full NAC deployment', 'Guest network', 'BYOD support', 'High availability'],
      estimated_budget_range: '$50,000 - $100,000'
    },
    {
      id: 'branch-large',
      name: 'Large Branch Office',
      description: 'Regional office with 100+ employees',
      site_type: 'branch',
      typical_users: 150,
      typical_devices: 300,
      network_complexity: 'medium',
      default_requirements: ['Standard NAC deployment', 'Guest network', 'BYOD support'],
      estimated_budget_range: '$15,000 - $30,000'
    },
    {
      id: 'branch-medium',
      name: 'Medium Branch Office',
      description: 'Branch office with 50-100 employees',
      site_type: 'branch',
      typical_users: 75,
      typical_devices: 150,
      network_complexity: 'medium',
      default_requirements: ['Standard NAC deployment', 'Guest network'],
      estimated_budget_range: '$10,000 - $20,000'
    },
    {
      id: 'branch-small',
      name: 'Small Branch Office',
      description: 'Small office with less than 50 employees',
      site_type: 'branch',
      typical_users: 25,
      typical_devices: 50,
      network_complexity: 'low',
      default_requirements: ['Basic NAC deployment', 'Guest network'],
      estimated_budget_range: '$5,000 - $10,000'
    },
    {
      id: 'remote-office',
      name: 'Remote Office',
      description: 'Small remote location with minimal infrastructure',
      site_type: 'remote',
      typical_users: 10,
      typical_devices: 20,
      network_complexity: 'low',
      default_requirements: ['Cloud-managed NAC', 'Basic security'],
      estimated_budget_range: '$2,000 - $5,000'
    },
    {
      id: 'datacenter',
      name: 'Data Center',
      description: 'Critical infrastructure facility',
      site_type: 'datacenter',
      typical_users: 50,
      typical_devices: 500,
      network_complexity: 'high',
      default_requirements: ['High-security NAC', 'Device profiling', 'Compliance monitoring'],
      estimated_budget_range: '$30,000 - $75,000'
    },
    {
      id: 'retail-store',
      name: 'Retail Store',
      description: 'Customer-facing retail location',
      site_type: 'retail',
      typical_users: 20,
      typical_devices: 100,
      network_complexity: 'medium',
      default_requirements: ['Guest Wi-Fi', 'POS security', 'Customer device isolation'],
      estimated_budget_range: '$3,000 - $8,000'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing Plant',
      description: 'Industrial facility with IoT devices',
      site_type: 'manufacturing',
      typical_users: 100,
      typical_devices: 1000,
      network_complexity: 'high',
      default_requirements: ['IoT device profiling', 'OT/IT segmentation', 'Industrial protocols'],
      estimated_budget_range: '$25,000 - $60,000'
    }
  ];

  const getAIContext = (): AIContext => ({
    industry: 'Multi-site Enterprise',
    organizationSize: 'enterprise',
    projectType: 'Bulk Site Deployment',
    currentPhase: 'site-planning',
    userRole: 'Sales Engineer'
  });

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
      
      recordInteraction({
        action: 'wizard_step_completed',
        details: { 
          wizard: 'BulkSiteCreationWizard', 
          step: currentStep,
          sitesCount: sites.length
        }
      });
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = siteTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newSite: SiteData = {
      name: '',
      location: '',
      address: '',
      city: '',
      state: '',
      country: 'United States',
      postal_code: '',
      site_type: template.site_type as any,
      total_users: template.typical_users,
      total_devices: template.typical_devices,
      network_complexity: template.network_complexity,
      deployment_priority: sites.length + 1,
      deployment_phase: 'phase-1',
      special_requirements: template.default_requirements,
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      business_hours: '8:00 AM - 6:00 PM',
      timezone: 'Eastern',
      internet_bandwidth: '',
      existing_infrastructure: [],
      compliance_requirements: [],
      security_level: 'standard',
      estimated_budget: 0,
      notes: ''
    };

    setSites([...sites, newSite]);
    setSelectedTemplate(templateId);
    toast({
      title: "Site Template Applied",
      description: `${template.name} template has been added to your site list.`
    });
  };

  const processBulkEntry = () => {
    if (!bulkEntryText.trim()) {
      toast({
        title: "No Data Entered",
        description: "Please enter site data to process.",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = bulkEntryText.trim().split('\n');
      const newSites: SiteData[] = [];

      lines.forEach((line, index) => {
        if (!line.trim()) return;

        // Expected format: Name, Location, Users, Devices, Type, Priority
        const parts = line.split(',').map(p => p.trim());
        
        if (parts.length >= 3) {
          const newSite: SiteData = {
            name: parts[0] || `Site ${index + 1}`,
            location: parts[1] || '',
            address: parts[2] || '',
            city: parts[3] || '',
            state: parts[4] || '',
            country: parts[5] || 'United States',
            postal_code: parts[6] || '',
            site_type: (parts[7] as any) || 'branch',
            total_users: parseInt(parts[8]) || 50,
            total_devices: parseInt(parts[9]) || 100,
            network_complexity: (parts[10] as any) || 'medium',
            deployment_priority: parseInt(parts[11]) || index + 1,
            deployment_phase: (parts[12] as any) || 'phase-1',
            special_requirements: parts[13] ? parts[13].split(';') : [],
            contact_person: parts[14] || '',
            contact_email: parts[15] || '',
            contact_phone: parts[16] || '',
            business_hours: parts[17] || '8:00 AM - 6:00 PM',
            timezone: parts[18] || 'Eastern',
            internet_bandwidth: parts[19] || '',
            existing_infrastructure: parts[20] ? parts[20].split(';') : [],
            compliance_requirements: parts[21] ? parts[21].split(';') : [],
            security_level: (parts[22] as any) || 'standard',
            estimated_budget: parseInt(parts[23]) || 0,
            notes: parts[24] || ''
          };

          newSites.push(newSite);
        }
      });

      setSites([...sites, ...newSites]);
      setBulkEntryText('');
      
      toast({
        title: "Bulk Sites Processed",
        description: `Successfully processed ${newSites.length} sites from bulk entry.`
      });
      
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process bulk site data. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const validateSites = () => {
    const errors: Array<{ siteIndex: number; field: string; message: string }> = [];

    sites.forEach((site, index) => {
      if (!site.name.trim()) {
        errors.push({ siteIndex: index, field: 'name', message: 'Site name is required' });
      }
      if (!site.location.trim()) {
        errors.push({ siteIndex: index, field: 'location', message: 'Location is required' });
      }
      if (site.total_users <= 0) {
        errors.push({ siteIndex: index, field: 'total_users', message: 'Must have at least 1 user' });
      }
      if (site.total_devices <= 0) {
        errors.push({ siteIndex: index, field: 'total_devices', message: 'Must have at least 1 device' });
      }
      if (!site.contact_person.trim()) {
        errors.push({ siteIndex: index, field: 'contact_person', message: 'Contact person is required' });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateSites()) {
      toast({
        title: "Validation Failed",
        description: "Please fix the validation errors before proceeding.",
        variant: "destructive"
      });
      return;
    }

    try {
      let finalProjectId = projectId;

      // Create project if not provided
      if (!finalProjectId) {
        const projectData = {
          name: projectInfo.name,
          description: projectInfo.description,
          client_name: projectInfo.client_name,
          total_sites: sites.length,
          deployment_type: 'Multi-site',
          status: 'planning',
          progress_percentage: 10,
          bulk_site_data: {
            projectInfo,
            sites,
            deployment_strategy: projectInfo.deployment_strategy
          }
        };

        const newProject = await createProject.mutateAsync(projectData);
        finalProjectId = newProject.id;
      }

      // Create all sites
      const createdSites = [];
      for (const site of sites) {
        const siteData = {
          ...site,
          project_id: finalProjectId,
          status: 'planning'
        };
        
        const createdSite = await createSite.mutateAsync(siteData);
        createdSites.push(createdSite);
      }

      toast({
        title: "Bulk Sites Created",
        description: `Successfully created ${createdSites.length} sites for the project.`
      });

      recordInteraction({
        action: 'wizard_completed',
        entityType: 'project',
        entityId: finalProjectId,
        details: { 
          wizard: 'BulkSiteCreationWizard',
          totalSites: sites.length,
          projectInfo,
          deploymentStrategy: projectInfo.deployment_strategy
        }
      });

      onComplete(finalProjectId, createdSites);

    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: `Failed to create sites: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const updateSite = (index: number, updates: Partial<SiteData>) => {
    const updatedSites = [...sites];
    updatedSites[index] = { ...updatedSites[index], ...updates };
    setSites(updatedSites);
  };

  const removeSite = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  const duplicateSite = (index: number) => {
    const siteToClone = { ...sites[index] };
    siteToClone.name = `${siteToClone.name} (Copy)`;
    setSites([...sites, siteToClone]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'project-info':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Project Information</h3>
              <p className="text-muted-foreground">Define the multi-site project details</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      value={projectInfo.name}
                      onChange={(e) => setProjectInfo({ ...projectInfo, name: e.target.value })}
                      placeholder="e.g., Global NAC Deployment 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={projectInfo.client_name}
                      onChange={(e) => setProjectInfo({ ...projectInfo, client_name: e.target.value })}
                      placeholder="e.g., Acme Corporation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={projectInfo.description}
                    onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                    placeholder="Describe the scope and objectives of this multi-site deployment..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalSites">Total Sites Planned</Label>
                    <Input
                      id="totalSites"
                      type="number"
                      value={projectInfo.total_sites_planned}
                      onChange={(e) => setProjectInfo({ ...projectInfo, total_sites_planned: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deploymentStrategy">Deployment Strategy</Label>
                    <Select
                      value={projectInfo.deployment_strategy}
                      onValueChange={(value) => setProjectInfo({ ...projectInfo, deployment_strategy: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="big-bang">Big Bang (All sites simultaneously)</SelectItem>
                        <SelectItem value="phased">Phased Rollout</SelectItem>
                        <SelectItem value="pilot-first">Pilot First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetCompletion">Target Completion</Label>
                    <Input
                      id="targetCompletion"
                      type="date"
                      value={projectInfo.target_completion}
                      onChange={(e) => setProjectInfo({ ...projectInfo, target_completion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Total Budget Range</Label>
                  <Select
                    value={projectInfo.budget_range}
                    onValueChange={(value) => setProjectInfo({ ...projectInfo, budget_range: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-100k">Under $100,000</SelectItem>
                      <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                      <SelectItem value="over-5m">Over $5,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'site-templates':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-bold mb-2">Site Templates</h3>
              <p className="text-muted-foreground">Choose templates to quickly create similar sites</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {siteTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Typical Users:</span>
                      <Badge variant="outline">{template.typical_users}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Typical Devices:</span>
                      <Badge variant="outline">{template.typical_devices}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Complexity:</span>
                      <Badge variant="outline" className="capitalize">{template.network_complexity}</Badge>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Budget Range:</span>
                      <p className="text-muted-foreground">{template.estimated_budget_range}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Default Requirements:</span>
                      <ul className="text-muted-foreground text-xs mt-1 space-y-1">
                        {template.default_requirements.slice(0, 3).map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      onClick={() => applyTemplate(template.id)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sites.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sites Added ({sites.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sites.map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{site.name || `Site ${index + 1}`}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {site.location} • {site.total_users} users • {site.site_type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateSite(index)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeSite(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'bulk-entry':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold mb-2">Bulk Site Entry</h3>
              <p className="text-muted-foreground">Enter multiple sites at once using CSV format</p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>CSV Format:</strong> Name, Location, Address, City, State, Country, Postal Code, Site Type, Users, Devices, Complexity, Priority, Phase, Requirements (semicolon-separated), Contact Person, Contact Email, Contact Phone, Business Hours, Timezone, Bandwidth, Infrastructure (semicolon-separated), Compliance (semicolon-separated), Security Level, Budget, Notes
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Site Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={bulkEntryText}
                  onChange={(e) => setBulkEntryText(e.target.value)}
                  placeholder="Enter site data (one site per line)&#10;Example:&#10;New York Office, New York NY, 123 Main St, New York, NY, United States, 10001, headquarters, 200, 400, high, 1, phase-1, Full NAC;Guest Network, John Doe, john@company.com, 555-0123, 8:00 AM - 6:00 PM, Eastern, 1Gbps, Cisco Switches;Aruba APs, HIPAA;SOX, high, 75000, Main headquarters location"
                  rows={10}
                  className="font-mono text-sm"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {bulkEntryText.trim().split('\n').filter(line => line.trim()).length} sites detected
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setBulkEntryText('')}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={processBulkEntry}
                      disabled={!bulkEntryText.trim()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Process Sites
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample CSV Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono bg-muted p-4 rounded-md overflow-x-auto">
                  <div>Headquarters, New York NY, 123 Main St, New York, NY, United States, 10001, headquarters, 500, 1000, high, 1, phase-1, Full NAC;Guest Network;BYOD, John Smith, john@company.com, 555-0123, 8:00 AM - 6:00 PM, Eastern, 1Gbps, Cisco Switches;Aruba APs, HIPAA;SOX, high, 100000, Main office</div>
                  <div>Chicago Branch, Chicago IL, 456 Oak Ave, Chicago, IL, United States, 60601, branch, 150, 300, medium, 2, phase-1, Standard NAC;Guest Network, Jane Doe, jane@company.com, 555-0124, 8:00 AM - 6:00 PM, Central, 500Mbps, Cisco Switches, HIPAA, standard, 25000, Regional office</div>
                  <div>Remote Office, Austin TX, 789 Pine St, Austin, TX, United States, 78701, remote, 25, 50, low, 3, phase-2, Cloud NAC;Basic Security, Bob Johnson, bob@company.com, 555-0125, 8:00 AM - 5:00 PM, Central, 100Mbps, Basic Infrastructure, , basic, 5000, Small remote location</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText("Headquarters, New York NY, 123 Main St, New York, NY, United States, 10001, headquarters, 500, 1000, high, 1, phase-1, Full NAC;Guest Network;BYOD, John Smith, john@company.com, 555-0123, 8:00 AM - 6:00 PM, Eastern, 1Gbps, Cisco Switches;Aruba APs, HIPAA;SOX, high, 100000, Main office\nChicago Branch, Chicago IL, 456 Oak Ave, Chicago, IL, United States, 60601, branch, 150, 300, medium, 2, phase-1, Standard NAC;Guest Network, Jane Doe, jane@company.com, 555-0124, 8:00 AM - 6:00 PM, Central, 500Mbps, Cisco Switches, HIPAA, standard, 25000, Regional office\nRemote Office, Austin TX, 789 Pine St, Austin, TX, United States, 78701, remote, 25, 50, low, 3, phase-2, Cloud NAC;Basic Security, Bob Johnson, bob@company.com, 555-0125, 8:00 AM - 5:00 PM, Central, 100Mbps, Basic Infrastructure, , basic, 5000, Small remote location")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Sample
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-2xl font-bold mb-2">Site Validation</h3>
              <p className="text-muted-foreground">Review and fix any validation errors</p>
            </div>

            {validationErrors.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Validation Errors ({validationErrors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {validationErrors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Site {error.siteIndex + 1}:</strong> {error.message} ({error.field})
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">All Sites Valid ✓</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">All {sites.length} sites have passed validation checks.</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Site Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{sites.length}</div>
                    <div className="text-sm text-muted-foreground">Total Sites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{sites.reduce((sum, site) => sum + site.total_users, 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{sites.reduce((sum, site) => sum + site.total_devices, 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Devices</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold">Sites by Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(
                      sites.reduce((acc, site) => {
                        acc[site.site_type] = (acc[site.site_type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="text-center p-3 border rounded">
                        <div className="font-semibold capitalize">{type}</div>
                        <div className="text-2xl font-bold text-primary">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold">Deployment Phases</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(
                      sites.reduce((acc, site) => {
                        acc[site.deployment_phase] = (acc[site.deployment_phase] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([phase, count]) => (
                      <div key={phase} className="text-center p-3 border rounded">
                        <div className="font-semibold capitalize">{phase.replace('-', ' ')}</div>
                        <div className="text-2xl font-bold text-blue-600">{count}</div>
                      </div>
                    ))}
                  </div>
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
              <h3 className="text-2xl font-bold mb-2">Final Review</h3>
              <p className="text-muted-foreground">Review all sites before creation</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Name:</span> {projectInfo.name}</p>
                      <p><span className="font-medium">Client:</span> {projectInfo.client_name}</p>
                      <p><span className="font-medium">Strategy:</span> {projectInfo.deployment_strategy}</p>
                      <p><span className="font-medium">Budget:</span> {projectInfo.budget_range}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Deployment Statistics</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Total Sites:</span> {sites.length}</p>
                      <p><span className="font-medium">Total Users:</span> {sites.reduce((sum, site) => sum + site.total_users, 0).toLocaleString()}</p>
                      <p><span className="font-medium">Total Devices:</span> {sites.reduce((sum, site) => sum + site.total_devices, 0).toLocaleString()}</p>
                      <p><span className="font-medium">Estimated Budget:</span> ${sites.reduce((sum, site) => sum + site.estimated_budget, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site List Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {sites.map((site, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-accent/50">
                        <div className="flex-1">
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {site.location} • {site.total_users} users • {site.total_devices} devices
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">{site.site_type}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{site.deployment_phase}</Badge>
                            <Badge variant="outline" className="text-xs capitalize">{site.network_complexity} complexity</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Priority {site.deployment_priority}</div>
                          {site.estimated_budget > 0 && (
                            <div className="text-xs text-muted-foreground">${site.estimated_budget.toLocaleString()}</div>
                          )}
                        </div>
                      </div>
                    ))}
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
                Bulk Site Creation Wizard
              </CardTitle>
              <p className="text-muted-foreground">
                Create multiple deployment sites efficiently with templates and bulk entry
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
                  loading={createProject.isPending || createSite.isPending}
                  className="flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create {sites.length} Sites
                </EnhancedButton>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="flex items-center"
                  disabled={currentStep === 'validation' && validationErrors.length > 0}
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

export default BulkSiteCreationWizard;
