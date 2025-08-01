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

// For now, we'll create placeholder components until we can access the real ones
const EnhancedResourceManager = () => <div className="p-4">Enhanced Resource Manager - Coming Soon</div>;
const ProjectTemplatesManager = () => <div className="p-4">Project Templates Manager - Coming Soon</div>;
const UseCaseLibraryBrowser = () => <div className="p-4">Use Case Library Browser - Coming Soon</div>;
const RequirementsManagement = () => <div className="p-4">Requirements Management - Coming Soon</div>;
const EnhancedVendorManagement = () => <div className="p-4">Enhanced Vendor Management - Coming Soon</div>;
const EnhancedConfigTemplateManager = () => <div className="p-4">Enhanced Config Template Manager - Coming Soon</div>;

const ResourceCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('overview');

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
      count: '150+'
    },
    {
      id: 'config-templates',
      name: 'Config Templates',
      icon: FileCheck,
      description: 'Configuration templates for all vendor devices',
      count: '200+'
    },
    {
      id: 'project-templates',
      name: 'Project Templates',
      icon: Target,
      description: 'Industry-specific project templates',
      count: '25+'
    },
    {
      id: 'use-cases',
      name: 'Use Cases',
      icon: CheckCircle,
      description: 'Authentication and access control use cases',
      count: '75+'
    },
    {
      id: 'requirements',
      name: 'Requirements',
      icon: AlertTriangle,
      description: 'Business and technical requirements',
      count: '100+'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: Shield,
      description: 'Compliance frameworks and controls',
      count: '30+'
    },
    {
      id: 'pain-points',
      name: 'Pain Points',
      icon: AlertTriangle,
      description: 'Common business and technical challenges',
      count: '50+'
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: Lock,
      description: 'Authentication methods and workflows',
      count: '40+'
    },
    {
      id: 'devices',
      name: 'Device Types',
      icon: Smartphone,
      description: 'Network device types and categories',
      count: '80+'
    },
    {
      id: 'network-segments',
      name: 'Network Segments',
      icon: Network,
      description: 'Network segmentation patterns',
      count: '20+'
    },
    {
      id: 'industries',
      name: 'Industries',
      icon: Building2,
      description: 'Industry-specific configurations',
      count: '15+'
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
      case 'project-templates':
        return <ProjectTemplatesManager />;
      case 'use-cases':
        return <UseCaseLibraryBrowser />;
      case 'requirements':
        return <RequirementsManagement />;
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
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          {resourceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-1 text-xs"
              >
                <IconComponent className="h-3 w-3" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {renderCategoryContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceCenter;