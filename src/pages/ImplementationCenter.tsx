import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import {
  Settings, Rocket, CheckSquare, Users, AlertTriangle, 
  Clock, Target, Activity, MapPin, Zap, Brain, 
  FileText, Calendar, TrendingUp, Shield, Globe,
  Play, Pause, CheckCircle, XCircle, RefreshCw,
  Network, Server, Database, Monitor
} from 'lucide-react';
import Header from '@/components/Header';
import { useProjects } from '@/hooks/useProjects';
import { useHasRole } from '@/hooks/useUserRoles';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ImplementationPhase {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  estimatedDays: number;
  actualDays?: number;
  dependencies: string[];
  tasks: ImplementationTask[];
}

interface ImplementationTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'planning' | 'configuration' | 'testing' | 'deployment' | 'validation';
}

const ImplementationCenter = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsights, setAiInsights] = useState<Record<string, any>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});

  const { user } = useAuth();
  const { data: isSuperAdmin } = useHasRole('super_admin');
  const { data: isProjectManager } = useHasRole('product_manager');
  const { data: allProjects = [], isLoading } = useProjects();
  const { generateProjectSummary, generateRecommendations, isLoading: aiLoading } = useAI();

  // Filter projects to show only those in implementation phases
  const implementationProjects = useMemo(() => {
    const implementationPhases = ['design', 'implementation', 'testing', 'deployment'];
    return allProjects.filter(project => 
      implementationPhases.includes(project.current_phase || '') &&
      (isSuperAdmin || 
       isProjectManager || 
       project.created_by === user?.id ||
       project.project_manager === user?.id ||
       project.project_owner === user?.id)
    );
  }, [allProjects, isSuperAdmin, isProjectManager, user?.id]);

  // Mock implementation phases data
  const implementationPhases: ImplementationPhase[] = [
    {
      id: 'design',
      name: 'Solution Design',
      description: 'Architecture design and solution planning',
      status: 'completed',
      progress: 100,
      estimatedDays: 10,
      actualDays: 8,
      dependencies: [],
      tasks: [
        {
          id: 'arch-design',
          title: 'Network Architecture Design',
          description: 'Design the complete network architecture',
          status: 'completed',
          priority: 'high',
          category: 'planning'
        },
        {
          id: 'security-design',
          title: 'Security Policy Design',
          description: 'Define security policies and access controls',
          status: 'completed',
          priority: 'high',
          category: 'planning'
        }
      ]
    },
    {
      id: 'configuration',
      name: 'System Configuration',
      description: 'Configure Portnox and integration components',
      status: 'in-progress',
      progress: 65,
      estimatedDays: 15,
      dependencies: ['design'],
      tasks: [
        {
          id: 'portnox-config',
          title: 'Portnox Core Configuration',
          description: 'Configure Portnox platform settings',
          status: 'in-progress',
          priority: 'critical',
          category: 'configuration'
        },
        {
          id: 'integration-config',
          title: 'Third-party Integrations',
          description: 'Configure vendor integrations',
          status: 'pending',
          priority: 'high',
          category: 'configuration'
        }
      ]
    },
    {
      id: 'testing',
      name: 'Testing & Validation',
      description: 'Comprehensive testing of all components',
      status: 'not-started',
      progress: 0,
      estimatedDays: 12,
      dependencies: ['configuration'],
      tasks: [
        {
          id: 'unit-testing',
          title: 'Unit Testing',
          description: 'Test individual components',
          status: 'pending',
          priority: 'high',
          category: 'testing'
        },
        {
          id: 'integration-testing',
          title: 'Integration Testing',
          description: 'Test system integrations',
          status: 'pending',
          priority: 'high',
          category: 'testing'
        }
      ]
    },
    {
      id: 'deployment',
      name: 'Go-Live Deployment',
      description: 'Production deployment and go-live activities',
      status: 'not-started',
      progress: 0,
      estimatedDays: 5,
      dependencies: ['testing'],
      tasks: [
        {
          id: 'production-deploy',
          title: 'Production Deployment',
          description: 'Deploy to production environment',
          status: 'pending',
          priority: 'critical',
          category: 'deployment'
        },
        {
          id: 'go-live',
          title: 'Go-Live Activities',
          description: 'Execute go-live checklist',
          status: 'pending',
          priority: 'critical',
          category: 'deployment'
        }
      ]
    }
  ];

  // Implementation analytics
  const analytics = useMemo(() => {
    if (!implementationProjects.length) return null;

    const totalProjects = implementationProjects.length;
    const activeProjects = implementationProjects.filter(p => p.current_phase === 'implementation').length;
    const testingProjects = implementationProjects.filter(p => p.current_phase === 'testing').length;
    const deployingProjects = implementationProjects.filter(p => p.current_phase === 'deployment').length;
    
    const avgProgress = implementationProjects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / totalProjects;
    
    const onSchedule = implementationProjects.filter(p => 
      !p.target_completion || new Date(p.target_completion) >= new Date()
    ).length;

    const riskyProjects = implementationProjects.filter(p => {
      const isOverdue = p.target_completion && new Date(p.target_completion) < new Date();
      const lowProgress = (p.progress_percentage || 0) < 50;
      return isOverdue || lowProgress;
    }).length;

    return {
      totalProjects,
      activeProjects,
      testingProjects,
      deployingProjects,
      avgProgress,
      onSchedule,
      riskyProjects,
      successRate: ((deployingProjects / totalProjects) * 100),
      phases: {
        design: implementationProjects.filter(p => p.current_phase === 'design').length,
        implementation: activeProjects,
        testing: testingProjects,
        deployment: deployingProjects
      }
    };
  }, [implementationProjects]);

  const getStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'blocked': 'bg-red-500/10 text-red-500 border-red-500/20',
      'failed': 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-blue-500/10 text-blue-500',
      'medium': 'bg-yellow-500/10 text-yellow-500',
      'high': 'bg-orange-500/10 text-orange-500',
      'critical': 'bg-red-500/10 text-red-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500/10 text-gray-500';
  };

  const generateImplementationInsights = async (project: any) => {
    if (loadingInsights[project.id]) return;
    
    setLoadingInsights(prev => ({ ...prev, [project.id]: true }));
    
    try {
      const insight = await generateRecommendations(
        {
          name: project.name,
          current_phase: project.current_phase,
          progress_percentage: project.progress_percentage,
          total_sites: project.total_sites,
          industry: project.industry
        },
        [], // use cases
        []  // vendors
      );
      
      setAiInsights(prev => ({ ...prev, [project.id]: insight }));
    } catch (error) {
      console.error('Failed to generate implementation insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setLoadingInsights(prev => ({ ...prev, [project.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Implementation <span className="bg-gradient-primary bg-clip-text text-transparent">Center</span>
              </h1>
              <p className="text-muted-foreground">
                Centralized hub for managing NAC deployment implementations with AI-powered insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <EnhancedButton gradient="primary">
                <Rocket className="h-4 w-4 mr-2" />
                Deploy Project
              </EnhancedButton>
            </div>
          </div>

          {/* Quick Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                      <div className="text-sm text-muted-foreground">Active Implementations</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.onSchedule}</div>
                      <div className="text-sm text-muted-foreground">On Schedule</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round(analytics.avgProgress)}%</div>
                      <div className="text-sm text-muted-foreground">Avg Progress</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.riskyProjects}</div>
                      <div className="text-sm text-muted-foreground">At Risk</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phases">Phases</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Implementation Pipeline */}
                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Implementation Pipeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {implementationPhases.map((phase) => (
                        <div key={phase.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(phase.status)}>
                                {phase.name}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {phase.estimatedDays}d estimated
                              </span>
                            </div>
                            <span className="text-sm font-medium">{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {phase.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>

                {/* Phase Distribution */}
                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Phase Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analytics && (
                      <div className="space-y-4">
                        {Object.entries(analytics.phases).map(([phase, count]) => (
                          <div key={phase} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <span className="text-sm capitalize">{phase}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{count}</span>
                              <div className="w-16 bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${(count / analytics.totalProjects) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </EnhancedCard>
              </div>

              {/* Recent Activity */}
              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Implementation Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {[
                        { time: '2 hours ago', action: 'Configuration completed for Site A', type: 'success' },
                        { time: '4 hours ago', action: 'Testing phase started for Project Alpha', type: 'info' },
                        { time: '6 hours ago', action: 'Deployment blocked - dependency issue', type: 'warning' },
                        { time: '1 day ago', action: 'Go-live successful for Project Beta', type: 'success' },
                        { time: '2 days ago', action: 'Security validation completed', type: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{activity.action}</div>
                            <div className="text-xs text-muted-foreground">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </EnhancedCard>
            </TabsContent>

            <TabsContent value="phases" className="space-y-6">
              <div className="space-y-6">
                {implementationPhases.map((phase) => (
                  <EnhancedCard key={phase.id} glass>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CardTitle>{phase.name}</CardTitle>
                          <Badge className={getStatusColor(phase.status)}>
                            {phase.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">
                            {phase.estimatedDays} days estimated
                          </span>
                          <span className="text-sm font-medium">{phase.progress}%</span>
                        </div>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                        
                        {/* Dependencies */}
                        {phase.dependencies.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Dependencies:</div>
                            <div className="flex flex-wrap gap-2">
                              {phase.dependencies.map((dep) => (
                                <Badge key={dep} variant="outline" className="text-xs">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tasks */}
                        <div>
                          <div className="text-sm font-medium mb-2">Tasks:</div>
                          <div className="space-y-2">
                            {phase.tasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between p-2 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    task.status === 'completed' ? 'bg-green-500' :
                                    task.status === 'in-progress' ? 'bg-blue-500' :
                                    task.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                                  }`} />
                                  <div>
                                    <div className="text-sm font-medium">{task.title}</div>
                                    <div className="text-xs text-muted-foreground">{task.description}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                                    {task.priority}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </EnhancedCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {implementationProjects.map((project) => (
                  <EnhancedCard 
                    key={project.id} 
                    glass
                    className="cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{project.client_name || 'Unknown Client'}</p>
                        </div>
                        <Badge className={getStatusColor(project.status || 'planning')}>
                          {project.current_phase?.replace('-', ' ') || 'Planning'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Implementation Progress</span>
                          <span className="font-medium">{project.progress_percentage || 0}%</span>
                        </div>
                        <Progress value={project.progress_percentage || 0} className="h-2" />
                      </div>

                      {/* Implementation Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Sites</div>
                          <div className="font-medium">{project.total_sites || 0}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Phase</div>
                          <div className="font-medium capitalize">
                            {project.current_phase?.replace('-', ' ') || 'Discovery'}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      {project.target_completion && (
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Target: {new Date(project.target_completion).toLocaleDateString()}</span>
                          {new Date(project.target_completion) < new Date() && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                        </div>
                      )}

                      {/* AI Insights Preview */}
                      {aiInsights[project.id] && (
                        <div className="mt-3 p-2 bg-primary/5 border border-primary/10 rounded-lg">
                          <div className="text-xs text-primary font-medium mb-1">AI Implementation Insights</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {typeof aiInsights[project.id] === 'string' 
                              ? aiInsights[project.id].substring(0, 100) + '...'
                              : 'Implementation recommendations available'}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateImplementationInsights(project);
                          }}
                          disabled={loadingInsights[project.id]}
                        >
                          {loadingInsights[project.id] ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Brain className="h-3 w-3 mr-1" />
                          )}
                          AI Guide
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          <Rocket className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </EnhancedCard>
                ))}
              </div>

              {implementationProjects.length === 0 && (
                <EnhancedCard glass className="text-center py-12">
                  <CardContent>
                    <Rocket className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Active Implementations</h3>
                    <p className="text-muted-foreground">
                      No projects are currently in implementation phases.
                    </p>
                  </CardContent>
                </EnhancedCard>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Implementation Resources */}
                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Network className="h-5 w-5" />
                      <span>Network Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Network Architecture Templates',
                        'VLAN Configuration Guides',
                        'Switch Configuration Scripts',
                        'Firewall Rule Templates'
                      ].map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm">{resource}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>

                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="h-5 w-5" />
                      <span>System Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Portnox Installation Guide',
                        'System Requirements Check',
                        'Database Setup Scripts',
                        'Performance Tuning Guide'
                      ].map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm">{resource}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>

                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Security Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Security Policy Templates',
                        'Compliance Frameworks',
                        'Audit Checklists',
                        'Incident Response Plans'
                      ].map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm">{resource}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>AI Implementation Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                        <div className="text-sm font-medium text-blue-600 mb-2">📊 Performance Analysis</div>
                        <div className="text-sm text-muted-foreground">
                          Current implementations are showing 15% faster completion times compared to baseline, 
                          with automated configuration reducing manual errors by 40%.
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg">
                        <div className="text-sm font-medium text-green-600 mb-2">🎯 Success Patterns</div>
                        <div className="text-sm text-muted-foreground">
                          Projects following the AI-recommended implementation sequence have a 92% on-time 
                          completion rate vs 73% for traditional approaches.
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                        <div className="text-sm font-medium text-yellow-600 mb-2">⚠️ Risk Mitigation</div>
                        <div className="text-sm text-muted-foreground">
                          3 projects show potential delays in testing phase. Recommend additional QA resources 
                          allocation to maintain schedule adherence.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </EnhancedCard>

                <EnhancedCard glass>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Optimization Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: 'Parallel Testing',
                          description: 'Run unit and integration tests in parallel to reduce testing phase by 30%',
                          impact: 'High',
                          effort: 'Medium'
                        },
                        {
                          title: 'Automated Deployment',
                          description: 'Implement CI/CD pipelines to automate deployment processes',
                          impact: 'High',
                          effort: 'High'
                        },
                        {
                          title: 'Configuration Templates',
                          description: 'Standardize configurations using templates to reduce setup time',
                          impact: 'Medium',
                          effort: 'Low'
                        }
                      ].map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm font-medium">{rec.title}</div>
                            <div className="flex space-x-1">
                              <Badge variant="outline" className="text-xs">
                                {rec.impact} Impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {rec.effort} Effort
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">{rec.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </EnhancedCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ImplementationCenter;