
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Brain, 
  Target, 
  Users, 
  Settings, 
  BarChart3, 
  Globe,
  Zap,
  Database,
  FileText,
  CheckSquare,
  TrendingUp,
  Shield,
  Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UnifiedCreationWizard from '@/components/unified/UnifiedCreationWizard';
import { PROJECT_TEMPLATES } from '@/services/UnifiedProjectCreationService';

const EnhancedCommandCenter = () => {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'create-project',
      title: 'Create New Project',
      description: 'Launch unified project creation with AI assistance',
      icon: Rocket,
      color: 'from-blue-500 to-purple-600',
      action: () => setActiveAction('project-creation'),
      badge: 'Popular'
    },
    {
      id: 'ai-scoping',
      title: 'AI-Assisted Scoping',
      description: 'Intelligent project scoping with recommendations',
      icon: Brain,
      color: 'from-purple-500 to-pink-600',
      action: () => setActiveAction('ai-scoping'),
      badge: 'Smart'
    },
    {
      id: 'template-creation',
      title: 'Template-Based Creation',
      description: 'Quick setup using industry templates',
      icon: Target,
      color: 'from-green-500 to-blue-600',
      action: () => setActiveAction('template-creation')
    },
    {
      id: 'portnox-integration',
      title: 'Portnox Integration',
      description: 'API management and automation setup',
      icon: Network,
      color: 'from-orange-500 to-red-600',
      action: () => navigate('/project-tracking')
    }
  ];

  const managementActions = [
    {
      title: 'Project Tracking',
      description: 'Monitor active projects and milestones',
      icon: BarChart3,
      action: () => navigate('/project-tracking'),
      stats: '12 Active'
    },
    {
      title: 'Resource Library',
      description: 'Access templates, docs, and best practices',
      icon: Database,
      action: () => navigate('/resources'),
      stats: '250+ Resources'
    },
    {
      title: 'User Management',
      description: 'Manage teams and permissions',
      icon: Users,
      action: () => navigate('/users'),
      stats: '45 Users'
    },
    {
      title: 'Reports & Analytics',
      description: 'Generate insights and compliance reports',
      icon: FileText,
      action: () => navigate('/reports'),
      stats: '15 Reports'
    }
  ];

  const systemStatus = [
    { label: 'Active Projects', value: '12', trend: '+3', positive: true },
    { label: 'Portnox Integrations', value: '8', trend: '+2', positive: true },
    { label: 'Automated Tasks', value: '156', trend: '+12', positive: true },
    { label: 'Compliance Score', value: '94%', trend: '+2%', positive: true }
  ];

  const recentTemplates = PROJECT_TEMPLATES.slice(0, 4);

  if (activeAction === 'project-creation' || activeAction === 'ai-scoping' || activeAction === 'template-creation') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveAction(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Project Creation</h1>
        </div>
        
        <UnifiedCreationWizard
          initialMethod={
            activeAction === 'ai-scoping' ? 'ai-scoping' :
            activeAction === 'template-creation' ? 'template-based' : 'ai-scoping'
          }
          context="command-center"
          onComplete={(projectId) => {
            navigate(`/projects/${projectId}`);
          }}
          onCancel={() => setActiveAction(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="glow" className="mb-4">
          🎯 Command Center
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unified <span className="bg-gradient-primary bg-clip-text text-transparent">Control Hub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Centralized management for projects, scoping, integrations, and automation workflows
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemStatus.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} this week
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={action.id}
                  className="cursor-pointer hover:shadow-lg transition-all relative group"
                  onClick={action.action}
                >
                  {action.badge && (
                    <Badge className="absolute -top-2 right-2 z-10 bg-primary text-primary-foreground">
                      {action.badge}
                    </Badge>
                  )}
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managementActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={action.action}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{action.stats}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentTemplates.map((template) => (
              <Card 
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => setActiveAction('template-creation')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{template.scenario}</p>
                    </div>
                    <Badge variant={
                      template.complexity === 'High' ? 'destructive' : 
                      template.complexity === 'Medium' ? 'default' : 'secondary'
                    }>
                      {template.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industry:</span>
                    <Badge variant="outline">{template.industry}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Network className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Portnox API</h3>
                    <p className="text-sm text-muted-foreground">Manage NAC integrations</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-700">Connected</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Services</h3>
                    <p className="text-sm text-muted-foreground">Smart recommendations</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-700">Active</Badge>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compliance</h3>
                    <p className="text-sm text-muted-foreground">Audit & reporting</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-700">Monitored</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Active Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Project Reports</span>
                    <Badge className="bg-green-500/10 text-green-700">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Monitoring</span>
                    <Badge className="bg-green-500/10 text-green-700">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portnox Sync</span>
                    <Badge className="bg-green-500/10 text-green-700">Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Scheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Daily Backup</span>
                    <span className="text-xs text-muted-foreground">Next: 2:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Reports</span>
                    <span className="text-xs text-muted-foreground">Next: Monday 9:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compliance Check</span>
                    <span className="text-xs text-muted-foreground">Next: Friday 5:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommandCenter;
