import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Building2, Shield, Users, Target, Network, 
  Globe, Database, FileCheck, Settings, Monitor, Router,
  Lock, Smartphone, CheckCircle, AlertTriangle, BookOpen,
  Filter, Edit, Trash2, Eye, Code, Folder, HardDrive
} from 'lucide-react';

// Import all the management components
import { EnhancedResourceManager } from '@/components/resources/EnhancedResourceManager';
import EnhancedVendorManagement from '@/components/vendors/EnhancedVendorManagement';
import EnhancedConfigTemplateManager from '@/components/config/EnhancedConfigTemplateManager';
import UseCaseLibraryBrowser from '@/components/use-cases/UseCaseLibraryBrowser';
import RequirementsManagement from '@/components/requirements/RequirementsManagement';
import ProjectTemplatesManager from '@/components/templates/ProjectTemplatesManager';

// Import hooks for real data
import { useEnhancedVendors } from '@/hooks/useEnhancedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { 
  useIndustryOptions, 
  useComplianceFrameworks, 
  useDeploymentTypes, 
  useSecurityLevels,
  useBusinessDomains,
  useAuthenticationMethods,
  useNetworkSegments,
  useProjectPhases
} from '@/hooks/useResourceLibrary';

const UnifiedResourceCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('overview');

  // Fetch real data for counts
  const { data: vendors = [] } = useEnhancedVendors();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { data: configTemplates = [] } = useConfigTemplates();
  const { data: industries = [] } = useIndustryOptions();
  const { data: complianceFrameworks = [] } = useComplianceFrameworks();
  const { data: deploymentTypes = [] } = useDeploymentTypes();
  const { data: securityLevels = [] } = useSecurityLevels();
  const { data: businessDomains = [] } = useBusinessDomains();
  const { data: authenticationMethods = [] } = useAuthenticationMethods();
  const { data: networkSegments = [] } = useNetworkSegments();
  const { data: projectPhases = [] } = useProjectPhases();

  const resourceCategories = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Globe,
      description: 'Unified Resource Center Dashboard',
      count: '--'
    },
    {
      id: 'vendors',
      name: 'Vendors',
      icon: Building2,
      description: 'NAC, Wireless, Wired, Security, EDR, SIEM, Identity, Cloud, VPN, MFA, SSO, PKI vendors',
      count: vendors.length
    },
    {
      id: 'config-templates',
      name: 'Config Templates',
      icon: FileCheck,
      description: 'Configuration templates for all vendor devices and systems',
      count: configTemplates.length
    },
    {
      id: 'project-templates',
      name: 'Project Templates',
      icon: Folder,
      description: 'Pre-configured project templates for various deployment scenarios',
      count: 15
    },
    {
      id: 'use-cases',
      name: 'Use Cases',
      icon: CheckCircle,
      description: 'Authentication, access control, and security use cases',
      count: useCases.length
    },
    {
      id: 'requirements',
      name: 'Requirements',
      icon: AlertTriangle,
      description: 'Business and technical requirements catalog',
      count: requirements.length
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: Shield,
      description: 'Compliance frameworks and regulatory controls',
      count: complianceFrameworks.length
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Lock,
      description: 'Authentication methods and identity workflows',
      count: authenticationMethods.length
    },
    {
      id: 'network-segments',
      name: 'Network Segments',
      icon: Network,
      description: 'Network segmentation patterns and architectures',
      count: networkSegments.length
    },
    {
      id: 'industries',
      name: 'Industries',
      icon: Building2,
      description: 'Industry-specific configurations and requirements',
      count: industries.length
    }
  ];

  const quickActions = [
    { 
      label: 'Add Vendor', 
      icon: Building2, 
      action: () => setActiveCategory('vendors'),
      category: 'vendors'
    },
    { 
      label: 'Create Config Template', 
      icon: FileCheck, 
      action: () => setActiveCategory('config-templates'),
      category: 'templates'
    },
    { 
      label: 'Add Project Template', 
      icon: Folder, 
      action: () => setActiveCategory('project-templates'),
      category: 'projects'
    },
    { 
      label: 'Add Use Case', 
      icon: CheckCircle, 
      action: () => setActiveCategory('use-cases'),
      category: 'use-cases'
    },
    { 
      label: 'Add Requirement', 
      icon: AlertTriangle, 
      action: () => setActiveCategory('requirements'),
      category: 'requirements'
    },
    { 
      label: 'Add Compliance Framework', 
      icon: Shield, 
      action: () => setActiveCategory('compliance'),
      category: 'compliance'
    }
  ];

  const getColorClasses = (category: string) => {
    const colorMap: { [key: string]: string } = {
      vendors: 'border-l-primary',
      'config-templates': 'border-l-green-500',
      'project-templates': 'border-l-purple-500',
      'use-cases': 'border-l-orange-500',
      requirements: 'border-l-red-500',
      compliance: 'border-l-indigo-500',
      authentication: 'border-l-pink-500',
      'network-segments': 'border-l-teal-500',
      industries: 'border-l-gray-500'
    };
    return colorMap[category] || 'border-l-primary';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Resource Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resourceCategories.filter(cat => cat.id !== 'overview').map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id} 
              className={`border-l-4 ${getColorClasses(category.id)} cursor-pointer hover:shadow-lg transition-all duration-300`}
              onClick={() => setActiveCategory(category.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">{category.count}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Quickly add new resources to your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 hover:bg-muted/50"
                  onClick={action.action}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Vendors</span>
                <Badge variant="secondary">{vendors.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Config Templates</span>
                <Badge variant="secondary">{configTemplates.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Use Cases</span>
                <Badge variant="secondary">{useCases.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Requirements</span>
                <Badge variant="secondary">{requirements.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Compliance Frameworks</span>
                <Badge variant="secondary">{complianceFrameworks.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Plus className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New Cisco vendor configuration added</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Edit className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">HIPAA compliance framework updated</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Plus className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New healthcare use case template created</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'vendors':
        return <EnhancedVendorManagement />;
      case 'config-templates':
        return <EnhancedConfigTemplateManager searchTerm={searchTerm} />;
      case 'project-templates':
        return <ProjectTemplatesManager searchTerm={searchTerm} />;
      case 'use-cases':
        return <UseCaseLibraryBrowser />;
      case 'requirements':
        return <RequirementsManagement />;
      case 'compliance':
      case 'authentication':
      case 'network-segments':
      case 'industries':
        return <EnhancedResourceManager />;
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="glow" className="mb-2">
                🏢 Unified Resource Center
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">
              Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Resource Library</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Centralized management for vendors, templates, use cases, requirements, and configurations. 
              Everything you need for successful NAC deployments across all technology categories.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search all resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max">
              {resourceCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    <span>{category.name}</span>
                    {category.count !== '--' && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-6">
            {renderCategoryContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UnifiedResourceCenter;