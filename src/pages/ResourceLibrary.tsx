import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Database, Shield, Network, Users, Building2, FileText, 
  Target, CheckSquare, Globe, Workflow, Plus, Search, 
  Filter, TrendingUp, BarChart3, Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedResourceManager } from '@/components/resources/EnhancedResourceManager';

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const resourceCategories = [
    {
      id: 'vendors',
      name: 'Vendor Library',
      icon: <Building2 className="h-5 w-5" />,
      description: 'Network equipment vendors and compatibility matrix',
      count: '50+',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'usecases',
      name: 'Use Cases',
      icon: <Target className="h-5 w-5" />,
      description: 'NAC implementation scenarios and patterns',
      count: '200+',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'requirements',
      name: 'Requirements',
      icon: <CheckSquare className="h-5 w-5" />,
      description: 'Technical and business requirements library',
      count: '150+',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'industries',
      name: 'Industries',
      icon: <Building2 className="h-5 w-5" />,
      description: 'Industry-specific classifications and needs',
      count: '25+',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: <Shield className="h-5 w-5" />,
      description: 'Regulatory frameworks and standards',
      count: '30+',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      id: 'deployment',
      name: 'Deployment Types',
      icon: <Workflow className="h-5 w-5" />,
      description: 'Deployment models and methodologies',
      count: '15+',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      borderColor: 'border-cyan-200 dark:border-cyan-800'
    },
    {
      id: 'security',
      name: 'Security Levels',
      icon: <Shield className="h-5 w-5" />,
      description: 'Security classification and controls',
      count: '20+',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'business',
      name: 'Business Domains',
      icon: <Users className="h-5 w-5" />,
      description: 'Business function areas and domains',
      count: '35+',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: <Users className="h-5 w-5" />,
      description: 'Authentication methods and protocols',
      count: '40+',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      id: 'network',
      name: 'Network Segments',
      icon: <Network className="h-5 w-5" />,
      description: 'Network segmentation patterns',
      count: '25+',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-800'
    },
    {
      id: 'phases',
      name: 'Project Phases',
      icon: <Workflow className="h-5 w-5" />,
      description: 'Implementation phases and milestones',
      count: '12+',
      color: 'text-violet-500',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      borderColor: 'border-violet-200 dark:border-violet-800'
    }
  ];

  const stats = [
    {
      title: 'Total Resources',
      value: '600+',
      icon: <Database className="h-5 w-5" />,
      description: 'Comprehensive knowledge base',
      trend: '+15%'
    },
    {
      title: 'Vendor Integrations',
      value: '50+',
      icon: <Building2 className="h-5 w-5" />,
      description: 'Supported vendors',
      trend: '+8%'
    },
    {
      title: 'Use Cases',
      value: '200+',
      icon: <Target className="h-5 w-5" />,
      description: 'Implementation scenarios',
      trend: '+22%'
    },
    {
      title: 'Active Projects',
      value: '45',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Using these resources',
      trend: '+12%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="pt-24 pb-8">
        <div className="container mx-auto px-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Database className="h-4 w-4" />
              Comprehensive Resource Library
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Portnox Knowledge Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The ultimate repository of NAC implementation resources, vendor compatibility, 
              use cases, and best practices. Everything you need for successful deployments.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-primary">
                      {stat.icon}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm font-medium text-foreground">{stat.title}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Resource Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search across all resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Categories Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Resource Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {resourceCategories.map((category) => (
                  <Card 
                    key={category.id} 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${category.bgColor} ${category.borderColor} border-2 hover:border-primary/50`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={category.color}>
                          {category.icon}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Resource Manager */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Resource Management
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Browse, search, and manage all resources for NAC implementations
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedResourceManager 
                onResourceSelect={(resource, type) => {
                  toast({
                    title: "Resource Selected",
                    description: `${resource.name || resource.title} added to current project`,
                  });
                }}
                showOnlySelectable={false}
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">Import Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                  Bulk import resources from spreadsheets or external systems
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Import from CSV
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">Export Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                  Export selected resources for offline use or documentation
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
                  Connect with external systems and maintain data synchronization
                </p>
                <Button variant="outline" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  API Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}