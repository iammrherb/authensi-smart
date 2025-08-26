import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, Plus, Edit, Tag, Link, FileText, Settings, 
  Network, Target, CheckSquare, Building2, Shield, Globe,
  Users, Database, Workflow
} from 'lucide-react';
import { useUnifiedVendors, useCreateVendor } from '@/hooks/useUnifiedVendors';
import { useUseCases, useCreateUseCase } from '@/hooks/useUseCases';
import { useRequirements, useCreateRequirement } from '@/hooks/useRequirements';
import { 
  useIndustryOptions, 
  useComplianceFrameworks, 
  useDeploymentTypes, 
  useSecurityLevels,
  useBusinessDomains,
  useAuthenticationMethods,
  useNetworkSegments,
  useProjectPhases,
  useCreateIndustryOption,
  useCreateComplianceFramework,
  useCreateDeploymentType,
  useCreateSecurityLevel,
  useCreateBusinessDomain,
  useCreateAuthenticationMethod,
  useCreateNetworkSegment,
  useCreateProjectPhase
} from '@/hooks/useResourceLibrary';
import { useToast } from '@/hooks/use-toast';

interface EnhancedResourceManagerProps {
  onResourceSelect?: (resource: any, type: string) => void;
  selectedResources?: { [key: string]: any[] };
  showOnlySelectable?: boolean;
}

export const EnhancedResourceManager: React.FC<EnhancedResourceManagerProps> = ({
  onResourceSelect,
  selectedResources = {},
  showOnlySelectable = false
}) => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingResource, setEditingResource] = useState<any>(null);
  const [newResourceDialog, setNewResourceDialog] = useState(false);

  // Data hooks
  const { data: vendors = [], isLoading: vendorsLoading } = useUnifiedVendors({});
  const { data: useCases = [], isLoading: useCasesLoading } = useUseCases();
  const { data: requirements = [], isLoading: requirementsLoading } = useRequirements();
  const { data: industries = [] } = useIndustryOptions();
  const { data: complianceFrameworks = [] } = useComplianceFrameworks();
  const { data: deploymentTypes = [] } = useDeploymentTypes();
  const { data: securityLevels = [] } = useSecurityLevels();
  const { data: businessDomains = [] } = useBusinessDomains();
  const { data: authenticationMethods = [] } = useAuthenticationMethods();
  const { data: networkSegments = [] } = useNetworkSegments();
  const { data: projectPhases = [] } = useProjectPhases();
  
  // Mutation hooks
  const createVendorMutation = useCreateVendor();
  const createUseCaseMutation = useCreateUseCase();
  const createRequirementMutation = useCreateRequirement();
  const createIndustryMutation = useCreateIndustryOption();
  const createComplianceMutation = useCreateComplianceFramework();
  const createDeploymentMutation = useCreateDeploymentType();
  const createSecurityMutation = useCreateSecurityLevel();
  const createBusinessMutation = useCreateBusinessDomain();
  const createAuthMutation = useCreateAuthenticationMethod();
  const createNetworkMutation = useCreateNetworkSegment();
  const createPhaseMutation = useCreateProjectPhase();
  
  const { toast } = useToast();

  // Form states
  const [newResourceData, setNewResourceData] = useState({
    vendor: {
      name: '',
      vendor_type: '',
      category: 'NAC',
      description: '',
      website_url: '',
      support_contact: {},
      certifications: [],
      portnox_integration_level: 'supported',
      portnox_documentation: {},
      models: [],
      supported_protocols: [],
      integration_methods: [],
      portnox_compatibility: {},
      configuration_templates: {},
      known_limitations: [],
      firmware_requirements: {},
      documentation_links: [],
      support_level: 'full',
      status: 'active'
    },
    usecase: {
      name: '',
      description: '',
      category: '',
      industry_focus: [],
      technical_requirements: [],
      portnox_features: [],
      complexity_level: 'medium',
      implementation_time: '1-2 weeks',
      tags: []
    },
    requirement: {
      title: '',
      description: '',
      category: 'functional',
      priority: 'medium',
      complexity: 'medium',
      validation_criteria: [],
      dependencies: [],
      tags: []
    },
    industry: { name: '', description: '', category: 'general' },
    compliance: { name: '', description: '', requirements: [], industry_specific: [] },
    deployment: { name: '', description: '', complexity_level: 'medium', typical_timeline: '', requirements: [] },
    security: { name: '', description: '', requirements: [], compliance_mappings: [] },
    business: { name: '', description: '', typical_use_cases: [], industry_alignment: [] },
    authentication: { 
      name: '', 
      description: '', 
      method_type: '', 
      security_level: 'medium', 
      vendor_support: [], 
      configuration_complexity: 'medium', 
      documentation_links: [], 
      portnox_integration: {} 
    },
    network: { 
      name: '', 
      segment_type: '', 
      description: '', 
      typical_size_range: '', 
      security_requirements: [], 
      vendor_considerations: [] 
    },
    phase: { 
      name: '', 
      description: '', 
      typical_duration: '', 
      deliverables: [], 
      prerequisites: [], 
      success_criteria: [], 
      phase_order: 1 
    }
  });

  const getResourceData = () => {
    const searchLower = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'vendors': return { 
        data: vendors.filter(v => v.name?.toLowerCase().includes(searchLower) || v.category?.toLowerCase().includes(searchLower)), 
        loading: vendorsLoading 
      };
      case 'usecases': return { 
        data: useCases.filter(uc => uc.name?.toLowerCase().includes(searchLower) || uc.description?.toLowerCase().includes(searchLower)), 
        loading: useCasesLoading 
      };
      case 'requirements': return { 
        data: requirements.filter(r => r.title?.toLowerCase().includes(searchLower) || r.description?.toLowerCase().includes(searchLower)), 
        loading: requirementsLoading 
      };
      case 'industries': return { 
        data: industries.filter(i => i.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'compliance': return { 
        data: complianceFrameworks.filter(c => c.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'deployment': return { 
        data: deploymentTypes.filter(d => d.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'security': return { 
        data: securityLevels.filter(s => s.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'business': return { 
        data: businessDomains.filter(b => b.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'authentication': return { 
        data: authenticationMethods.filter(a => a.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'network': return { 
        data: networkSegments.filter(n => n.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      case 'phases': return { 
        data: projectPhases.filter(p => p.name?.toLowerCase().includes(searchLower)), 
        loading: false 
      };
      default: return { data: [], loading: false };
    }
  };

  const handleCreateResource = async () => {
    const resourceType = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
    const data = newResourceData[resourceType as keyof typeof newResourceData];
    
    try {
      switch (activeTab) {
        case 'vendors':
          await createVendorMutation.mutateAsync(data as any);
          break;
        case 'usecases':
          await createUseCaseMutation.mutateAsync(data as any);
          break;
        case 'requirements':
          await createRequirementMutation.mutateAsync(data as any);
          break;
        case 'industries':
          await createIndustryMutation.mutateAsync(data as any);
          break;
        case 'compliance':
          await createComplianceMutation.mutateAsync(data as any);
          break;
        case 'deployment':
          await createDeploymentMutation.mutateAsync(data as any);
          break;
        case 'security':
          await createSecurityMutation.mutateAsync(data as any);
          break;
        case 'business':
          await createBusinessMutation.mutateAsync(data as any);
          break;
        case 'authentication':
          await createAuthMutation.mutateAsync(data as any);
          break;
        case 'network':
          await createNetworkMutation.mutateAsync(data as any);
          break;
        case 'phases':
          await createPhaseMutation.mutateAsync(data as any);
          break;
      }
      setNewResourceDialog(false);
      resetForm();
      toast({
        title: "Resource Created",
        description: `New ${resourceType} has been added to the library`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${resourceType}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewResourceData(prev => ({
      ...prev,
      [activeTab]: getDefaultFormData(activeTab)
    }));
  };

  const getDefaultFormData = (type: string) => {
    const defaults: any = {
      vendor: { name: '', vendor_type: '', category: 'NAC', description: '', website_url: '', support_contact: {}, certifications: [], portnox_integration_level: 'supported', portnox_documentation: {}, models: [], supported_protocols: [], integration_methods: [], portnox_compatibility: {}, configuration_templates: {}, known_limitations: [], firmware_requirements: {}, documentation_links: [], support_level: 'full', status: 'active' },
      usecase: { name: '', description: '', category: '', industry_focus: [], technical_requirements: [], portnox_features: [], complexity_level: 'medium', implementation_time: '1-2 weeks', tags: [] },
      requirement: { title: '', description: '', category: 'functional', priority: 'medium', complexity: 'medium', validation_criteria: [], dependencies: [], tags: [] },
      industries: { name: '', description: '', category: 'general' },
      compliance: { name: '', description: '', requirements: [], industry_specific: [] },
      deployment: { name: '', description: '', complexity_level: 'medium', typical_timeline: '', requirements: [] },
      security: { name: '', description: '', requirements: [], compliance_mappings: [] },
      business: { name: '', description: '', typical_use_cases: [], industry_alignment: [] },
      authentication: { name: '', description: '', method_type: '', security_level: 'medium', vendor_support: [], configuration_complexity: 'medium', documentation_links: [], portnox_integration: {} },
      network: { name: '', segment_type: '', description: '', typical_size_range: '', security_requirements: [], vendor_considerations: [] },
      phases: { name: '', description: '', typical_duration: '', deliverables: [], prerequisites: [], success_criteria: [], phase_order: 1 }
    };
    return defaults[type] || {};
  };

  const renderResourceCard = (resource: any, type: string) => {
    const isSelected = selectedResources[type]?.some((r: any) => r.id === resource.id);
    
    return (
      <Card key={resource.id} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {resource.name || resource.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.vendor_type || resource.description || resource.category}
              </p>
            </div>
            <div className="flex gap-2">
              {!showOnlySelectable && (
                <Button size="sm" variant="ghost" onClick={() => setEditingResource(resource)}>
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onResourceSelect && (
                <Button 
                  size="sm" 
                  variant={isSelected ? "secondary" : "default"}
                  onClick={() => onResourceSelect(resource, type)}
                  disabled={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {resource.category || resource.vendor_type || resource.method_type || resource.segment_type}
              </Badge>
              {resource.support_level && (
                <Badge variant={resource.support_level === 'full' ? 'default' : 'secondary'}>
                  {resource.support_level} support
                </Badge>
              )}
              {resource.priority && (
                <Badge variant={resource.priority === 'high' ? 'destructive' : resource.priority === 'medium' ? 'default' : 'secondary'}>
                  {resource.priority}
                </Badge>
              )}
              {resource.complexity_level && (
                <Badge variant="secondary">{resource.complexity_level}</Badge>
              )}
            </div>
            
            {resource.supported_protocols?.length > 0 && (
              <div>
                <Label className="text-xs">Protocols</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.supported_protocols.slice(0, 3).map((protocol: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">{protocol}</Badge>
                  ))}
                  {resource.supported_protocols.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{resource.supported_protocols.length - 3}</Badge>
                  )}
                </div>
              </div>
            )}
            
            {resource.portnox_integration_level && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Portnox: {resource.portnox_integration_level}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderNewResourceForm = () => {
    const resourceType = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
    const data = newResourceData[resourceType as keyof typeof newResourceData] as any;

    const updateData = (field: string, value: any) => {
      setNewResourceData(prev => ({
        ...prev,
        [resourceType]: { ...prev[resourceType as keyof typeof prev], [field]: value }
      }));
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Name/Title</Label>
            <Input 
              value={data.name || data.title || ''}
              onChange={(e) => updateData(data.name !== undefined ? 'name' : 'title', e.target.value)}
              placeholder="Enter name or title"
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea 
              value={data.description || ''}
              onChange={(e) => updateData('description', e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {activeTab === 'vendors' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vendor Type</Label>
                  <Input 
                    value={data.vendor_type || ''}
                    onChange={(e) => updateData('vendor_type', e.target.value)}
                    placeholder="e.g., Network Access Control"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={data.category || 'NAC'} onValueChange={(value) => updateData('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NAC">NAC</SelectItem>
                      <SelectItem value="Wireless">Wireless</SelectItem>
                      <SelectItem value="Wired">Wired</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="MDM">MDM</SelectItem>
                      <SelectItem value="SIEM">SIEM</SelectItem>
                      <SelectItem value="Identity">Identity</SelectItem>
                      <SelectItem value="Cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Support Level</Label>
                  <Select value={data.support_level || 'full'} onValueChange={(value) => updateData('support_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Support</SelectItem>
                      <SelectItem value="partial">Partial Support</SelectItem>
                      <SelectItem value="limited">Limited Support</SelectItem>
                      <SelectItem value="none">No Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Portnox Integration</Label>
                  <Select value={data.portnox_integration_level || 'supported'} onValueChange={(value) => updateData('portnox_integration_level', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="certified">Certified</SelectItem>
                      <SelectItem value="supported">Supported</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Website URL</Label>
                <Input 
                  value={data.website_url || ''}
                  onChange={(e) => updateData('website_url', e.target.value)}
                  placeholder="https://vendor-website.com"
                />
              </div>
            </>
          )}

          {(activeTab === 'usecases' || activeTab === 'requirements') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input 
                  value={data.category || ''}
                  onChange={(e) => updateData('category', e.target.value)}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <Label>Priority/Complexity</Label>
                <Select value={data.priority || data.complexity_level || 'medium'} onValueChange={(value) => updateData(data.priority !== undefined ? 'priority' : 'complexity_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleCreateResource} 
          disabled={!data.name && !data.title}
          className="w-full"
        >
          Create {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
        </Button>
      </div>
    );
  };

  const tabs = [
    { id: 'vendors', label: 'Vendors', icon: Network, count: vendors.length },
    { id: 'usecases', label: 'Use Cases', icon: Target, count: useCases.length },
    { id: 'requirements', label: 'Requirements', icon: CheckSquare, count: requirements.length },
    { id: 'industries', label: 'Industries', icon: Building2, count: industries.length },
    { id: 'compliance', label: 'Compliance', icon: Shield, count: complianceFrameworks.length },
    { id: 'deployment', label: 'Deployment', icon: Settings, count: deploymentTypes.length },
    { id: 'security', label: 'Security', icon: Shield, count: securityLevels.length },
    { id: 'business', label: 'Business', icon: Building2, count: businessDomains.length },
    { id: 'authentication', label: 'Auth Methods', icon: Users, count: authenticationMethods.length },
    { id: 'network', label: 'Network Segments', icon: Database, count: networkSegments.length },
    { id: 'phases', label: 'Project Phases', icon: Workflow, count: projectPhases.length }
  ];

  const { data: currentData, loading } = getResourceData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resource Library</h2>
          <p className="text-muted-foreground">Comprehensive resource management for NAC implementations</p>
        </div>
        
        <Dialog open={newResourceDialog} onOpenChange={setNewResourceDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}</DialogTitle>
            </DialogHeader>
            {renderNewResourceForm()}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          {tabs.slice(0, 6).map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                ({tab.count})
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {tabs.slice(6).length > 0 && (
          <TabsList className="grid w-full grid-cols-5 mt-2">
            {tabs.slice(6).map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                  ({tab.count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        )}

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {tab.label.toLowerCase()} found</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setNewResourceDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First {tab.label.slice(0, -1)}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentData.map((resource: any) => renderResourceCard(resource, tab.id))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};