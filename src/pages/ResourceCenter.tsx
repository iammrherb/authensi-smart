import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Building2, Shield, Users, Target, Network, 
  Globe, Database, FileCheck, Settings, Monitor, Router,
  Lock, Smartphone, CheckCircle, AlertTriangle, BookOpen,
  Filter, Edit, Trash2, Eye
} from 'lucide-react';

// Import all the actual components
import { EnhancedResourceManager } from '@/components/resources/EnhancedResourceManager';
import EnhancedVendorManagement from '@/components/vendors/EnhancedVendorManagement';
import UseCaseLibraryBrowser from '@/components/use-cases/UseCaseLibraryBrowser';
import RequirementsManagement from '@/components/requirements/RequirementsManagement';
// Temporary placeholders for missing components
const EnhancedConfigTemplateManager = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Configuration Templates</h2>
    <p className="text-muted-foreground">
      Configuration template management coming soon. This will include device-specific configurations,
      automation templates, and deployment scripts.
    </p>
  </div>
);

const ProjectTemplatesManager = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Project Templates</h2>
    <p className="text-muted-foreground">
      Project template management coming soon. This will include industry-specific templates,
      deployment scenarios, and pre-configured project setups.
    </p>
  </div>
);

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

const ResourceCenter = () => {
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
      description: 'Resource Center Dashboard',
      count: '--'
    },
    {
      id: 'vendors',
      name: 'Vendors',
      icon: Building2,
      description: 'NAC, Wireless, Security, EDR, SIEM, Identity, Cloud vendors',
      count: vendors.length
    },
    {
      id: 'config-templates',
      name: 'Config Templates',
      icon: FileCheck,
      description: 'Configuration templates for all vendor devices',
      count: configTemplates.length
    },
    {
      id: 'use-cases',
      name: 'Use Cases',
      icon: CheckCircle,
      description: 'Authentication and access control use cases',
      count: useCases.length
    },
    {
      id: 'requirements',
      name: 'Requirements',
      icon: AlertTriangle,
      description: 'Business and technical requirements',
      count: requirements.length
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: Shield,
      description: 'Compliance frameworks and controls',
      count: complianceFrameworks.length
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Lock,
      description: 'Authentication methods and workflows',
      count: authenticationMethods.length
    },
    {
      id: 'network-segments',
      name: 'Network Segments',
      icon: Network,
      description: 'Network segmentation patterns',
      count: networkSegments.length
    },
    {
      id: 'industries',
      name: 'Industries',
      icon: Building2,
      description: 'Industry-specific configurations',
      count: industries.length
    },
    {
      id: 'security-levels',
      name: 'Security Levels',
      icon: Shield,
      description: 'Security level classifications',
      count: securityLevels.length
    },
    {
      id: 'business-domains',
      name: 'Business Domains',
      icon: Target,
      description: 'Business domain classifications',
      count: businessDomains.length
    },
    {
      id: 'deployment-types',
      name: 'Deployment Types',
      icon: Settings,
      description: 'Different deployment approaches',
      count: deploymentTypes.length
    }
  ];

  const quickActions = [
    { 
      label: 'Add Vendor', 
      icon: Plus, 
      action: () => setActiveCategory('vendors'),
      category: 'vendors'
    },
    { 
      label: 'Create Template', 
      icon: Plus, 
      action: () => setActiveCategory('config-templates'),
      category: 'templates'
    },
    { 
      label: 'Add Use Case', 
      icon: Plus, 
      action: () => setActiveCategory('use-cases'),
      category: 'use-cases'
    },
    { 
      label: 'Add Requirement', 
      icon: Plus, 
      action: () => setActiveCategory('requirements'),
      category: 'requirements'
    }
  ];

  const getColorClasses = (category: string) => {
    const colorMap: { [key: string]: string } = {
      vendors: 'border-l-blue-500',
      'config-templates': 'border-l-green-500',
      'project-templates': 'border-l-purple-500',
      'use-cases': 'border-l-orange-500',
      requirements: 'border-l-red-500',
      compliance: 'border-l-indigo-500',
      'pain-points': 'border-l-yellow-500',
      authentication: 'border-l-pink-500',
      devices: 'border-l-cyan-500',
      'network-segments': 'border-l-teal-500',
      industries: 'border-l-gray-500'
    };
    return colorMap[category] || 'border-l-gray-500';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Resource Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {resourceCategories.filter(cat => cat.id !== 'overview').map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id} 
              className={`border-l-4 ${getColorClasses(category.id)} cursor-pointer hover:shadow-lg transition-shadow`}
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
                  <span className="text-2xl font-bold">{category.count}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col gap-2"
                  onClick={action.action}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
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
  );

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'vendors':
        return <EnhancedVendorManagement />;
      case 'config-templates':
        return <EnhancedConfigTemplateManager />;
      case 'use-cases':
        return <UseCaseLibraryBrowser />;
      case 'requirements':
        return <RequirementsManagement />;
      case 'compliance':
      case 'authentication':
      case 'network-segments':
      case 'industries':
      case 'security-levels':
      case 'business-domains':
      case 'deployment-types':
        return <EnhancedResourceManager />;
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resource Center</h1>
          <p className="text-muted-foreground">
            Centralized library for vendors, templates, use cases, requirements, and configurations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button>
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
  );
};

export default ResourceCenter;