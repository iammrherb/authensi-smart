import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, Target, FileText, Settings, BarChart3, Users, 
  Zap, ArrowRight, Plus, Search, Filter, Calendar,
  Building2, Network, Shield, Download, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { EnhancedResourceManager } from '@/components/resources/EnhancedResourceManager';
import { PortnoxProjectReport } from '@/components/reports/PortnoxProjectReport';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  path?: string;
  action?: () => void;
}

const EnhancedCommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { data: projects = [] } = useProjects();

  const quickActions: QuickAction[] = [
    {
      id: 'ai-scoping',
      title: 'AI Scoping Wizard',
      description: 'Start comprehensive project scoping with AI recommendations',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      path: '/scoping'
    },
    {
      id: 'create-project',
      title: 'Create Project',
      description: 'Launch new Portnox deployment project',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      path: '/scoping'
    },
    {
      id: 'resource-library',
      title: 'Resource Library',
      description: 'Manage vendors, use cases, and requirements',
      icon: Building2,
      color: 'from-blue-500 to-cyan-600',
      path: '/resources'
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      description: 'Create professional project documentation',
      icon: FileText,
      color: 'from-orange-500 to-red-600',
      action: () => setActiveTab('reports')
    },
    {
      id: 'analytics',
      title: 'Project Analytics',
      description: 'View insights and performance metrics',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-600',
      path: '/intelligence'
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'from-teal-500 to-green-600',
      path: '/settings?tab=users'
    }
  ];

  const recentProjects = projects.slice(0, 5);

  const handleQuickAction = (action: QuickAction) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
      action.action();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card 
                key={action.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${action.color.split(' ')[1]}, ${action.color.split(' ')[3]})` }}
                onClick={() => handleQuickAction(action)}
              >
                <CardContent className="p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <action.icon className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 opacity-70" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'deployed').length}</p>
                <p className="text-sm text-muted-foreground">Deployed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{projects.filter(p => p.status === 'implementing').length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Projects</CardTitle>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">Start by creating your first Portnox deployment project</p>
              <Button onClick={() => navigate('/scoping')}>
                <Brain className="h-4 w-4 mr-2" />
                Start AI Scoping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.client_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant="outline">{project.status}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {project.progress_percentage}% complete
                      </div>
                    </div>
                    <Progress value={project.progress_percentage} className="w-20" />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/project/${project.id}/tracking`)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderResources = () => (
    <EnhancedResourceManager />
  );

  const renderReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional Project Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Generate comprehensive, professionally formatted reports for your Portnox deployment projects.
              All reports include Portnox branding and can be exported to PDF or PowerPoint.
            </p>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Projects Available</h3>
                <p className="text-muted-foreground mb-4">Create a project first to generate reports</p>
                <Button onClick={() => navigate('/scoping')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Start New Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.client_name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{project.status}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {project.total_sites} sites, {project.total_endpoints} endpoints
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline">
                            <Upload className="h-3 w-3 mr-1" />
                            PPT
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-muted-foreground">
            Central hub for AI-powered Portnox project management
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="resources">
          {renderResources()}
        </TabsContent>

        <TabsContent value="reports">
          {renderReports()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommandCenter;