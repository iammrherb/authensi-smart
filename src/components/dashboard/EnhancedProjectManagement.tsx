import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import {
  Building2, Clock, Target, Users, AlertTriangle, CheckCircle,
  TrendingUp, FileText, Brain, Zap, Settings, Calendar,
  ArrowRight, Plus, Filter, Search, RefreshCw, BarChart3,
  Activity, Shield, Globe, DollarSign, Gauge, MapPin,
  UserCheck, PieChart
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useHasRole } from '@/hooks/useUserRoles';
import SmartProjectInsights from '@/components/ai/SmartProjectInsights';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectOverviewProps {
  onCreateProject?: () => void;
  onProjectSelect?: (projectId: string) => void;
}

const EnhancedProjectManagement: React.FC<ProjectOverviewProps> = ({
  onCreateProject,
  onProjectSelect
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('overview');
  
  const { user } = useAuth();
  const { data: isSuperAdmin } = useHasRole('super_admin');
  const { data: isProjectManager } = useHasRole('product_manager');
  
  const { data: allProjects = [], isLoading } = useProjects();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();

  // Filter projects based on user role
  const projects = useMemo(() => {
    if (isSuperAdmin) {
      return allProjects; // Super admins see all projects
    }
    if (isProjectManager) {
      // Project managers see projects they manage or created
      return allProjects.filter(p => 
        p.created_by === user?.id || 
        p.project_manager === user?.id || 
        p.project_owner === user?.id
      );
    }
    // Regular users see only projects they created
    return allProjects.filter(p => p.created_by === user?.id);
  }, [allProjects, isSuperAdmin, isProjectManager, user?.id]);

  // Advanced Analytics Calculations
  const analytics = useMemo(() => {
    if (!projects.length) return null;

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSites = projects.reduce((sum, p) => sum + (p.total_sites || 0), 0);
    const totalEndpoints = projects.reduce((sum, p) => sum + (p.total_endpoints || 0), 0);
    
    const byStatus = projects.reduce((acc, p) => {
      const status = p.status || 'planning';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPhase = projects.reduce((acc, p) => {
      const phase = p.current_phase || 'discovery';
      acc[phase] = (acc[phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byIndustry = projects.reduce((acc, p) => {
      const industry = p.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const healthScore = projects.reduce((sum, p) => {
      let score = 0;
      if (p.progress_percentage && p.progress_percentage > 0) score += 25;
      if (p.current_phase === 'implementation' || p.current_phase === 'deployment') score += 25;
      if (p.current_phase && p.current_phase !== 'discovery') score += 25;
      if (p.target_completion && new Date(p.target_completion) > new Date()) score += 25;
      return sum + score;
    }, 0) / projects.length;

    const avgProgress = projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / projects.length;
    
    const riskyProjects = projects.filter(p => {
      const isOverdue = p.target_completion && new Date(p.target_completion) < new Date();
      const lowProgress = (p.progress_percentage || 0) < 30;
      const stuckInPhase = p.current_phase === 'discovery' && p.created_at && 
        new Date().getTime() - new Date(p.created_at).getTime() > 30 * 24 * 60 * 60 * 1000;
      return isOverdue || lowProgress || stuckInPhase;
    });

    const completedProjects = projects.filter(p => p.current_phase === 'deployment' || (p.progress_percentage && p.progress_percentage >= 100));

    return {
      totalBudget,
      totalSites,
      totalEndpoints,
      byStatus,
      byPhase,
      byIndustry,
      healthScore,
      avgProgress,
      riskyProjects: riskyProjects.length,
      successRate: ((completedProjects.length) / projects.length * 100),
      timeToComplete: completedProjects.filter(p => p.start_date && p.actual_completion)
        .reduce((sum, p) => {
          const start = new Date(p.start_date!).getTime();
          const end = new Date(p.actual_completion!).getTime();
          return sum + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / completedProjects.filter(p => p.start_date && p.actual_completion).length || 0
    };
  }, [projects]);

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'in-progress': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'on-hold': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      'discovery': 'text-blue-500',
      'scoping': 'text-purple-500',
      'design': 'text-cyan-500',
      'implementation': 'text-orange-500',
      'testing': 'text-yellow-500',
      'deployment': 'text-green-500',
      'maintenance': 'text-gray-500'
    };
    return colors[phase as keyof typeof colors] || 'text-gray-500';
  };

  const selectedProjectData = selectedProject 
    ? projects.find(p => p.id === selectedProject)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Project <span className="bg-gradient-primary bg-clip-text text-transparent">Management</span>
          </h2>
          <p className="text-muted-foreground">
            AI-powered project tracking and management for NAC deployments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <EnhancedButton
            onClick={onCreateProject}
            gradient="primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </EnhancedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.current_phase === 'implementation').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'planning').length}
                </div>
                <div className="text-sm text-muted-foreground">In Planning</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(projects.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / projects.length || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Admin Analytics Dashboard */}
      {(isSuperAdmin || isProjectManager) && analytics && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Advanced Analytics</span>
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeAnalyticsTab === 'overview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveAnalyticsTab('overview')}
              >
                Overview
              </Button>
              <Button
                variant={activeAnalyticsTab === 'health' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveAnalyticsTab('health')}
              >
                Health
              </Button>
              <Button
                variant={activeAnalyticsTab === 'industry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveAnalyticsTab('industry')}
              >
                Industry
              </Button>
            </div>
          </div>

          {/* Comprehensive Analytics Cards */}
          {activeAnalyticsTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">${(analytics.totalBudget / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-muted-foreground">Total Budget</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.totalSites.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Sites</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.totalEndpoints.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Endpoints</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round(analytics.timeToComplete)}</div>
                      <div className="text-sm text-muted-foreground">Avg Days to Complete</div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          )}

          {activeAnalyticsTab === 'health' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5" />
                    <span>Health Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{Math.round(analytics.healthScore)}%</div>
                      <div className="text-sm text-muted-foreground">Overall Health</div>
                    </div>
                    <Progress value={analytics.healthScore} className="h-3" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Success Rate</div>
                        <div className="font-medium">{Math.round(analytics.successRate)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Progress</div>
                        <div className="font-medium">{Math.round(analytics.avgProgress)}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Risk Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-500">{analytics.riskyProjects}</div>
                      <div className="text-sm text-muted-foreground">Risky Projects</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Level</span>
                        <span className={analytics.riskyProjects > projects.length * 0.3 ? 'text-red-500' : 
                                       analytics.riskyProjects > projects.length * 0.1 ? 'text-yellow-500' : 'text-green-500'}>
                          {analytics.riskyProjects > projects.length * 0.3 ? 'High' : 
                           analytics.riskyProjects > projects.length * 0.1 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <Progress 
                        value={(analytics.riskyProjects / projects.length) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Project Phases</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.byPhase).map(([phase, count]) => (
                      <div key={phase} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase).replace('text-', 'bg-')}`} />
                          <span className="text-sm capitalize">{phase.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(count / projects.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          )}

          {activeAnalyticsTab === 'industry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Industry Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.byIndustry).map(([industry, count]) => (
                      <div key={industry} className="flex items-center justify-between">
                        <span className="text-sm">{industry}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(count / projects.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>

              <EnhancedCard glass>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Status Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(status)} variant="outline">
                            {status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <div className="w-16 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(count / projects.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </EnhancedCard>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Show all projects grid for admins */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <EnhancedCard 
                key={project.id} 
                glass
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedProject(project.id);
                  onProjectSelect?.(project.id);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.client_name || 'Unknown Client'}</p>
                      {project.industry && (
                        <Badge variant="outline" className="text-xs">
                          {project.industry}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(project.status || 'planning')}>
                        {project.status?.replace('-', ' ') || 'Planning'}
                      </Badge>
                      {(isSuperAdmin || isProjectManager) && project.budget && (
                        <div className="text-xs text-muted-foreground">
                          ${(project.budget / 1000).toFixed(0)}K
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Health Indicator */}
                  <div className="flex items-center justify-between text-sm">
                    <span>Health Score</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        (project.progress_percentage || 0) > 70 ? 'bg-green-500' :
                        (project.progress_percentage || 0) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">
                        {(project.progress_percentage || 0) > 70 ? 'Good' :
                         (project.progress_percentage || 0) > 40 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress_percentage || 0}%</span>
                    </div>
                    <Progress value={project.progress_percentage || 0} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Sites</div>
                      <div className="font-medium">{project.total_sites || 0}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Endpoints</div>
                      <div className="font-medium">{project.total_endpoints || 0}</div>
                    </div>
                  </div>

                  {/* Current Phase */}
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${getPhaseColor(project.current_phase || 'discovery')}`} />
                    <span className="text-sm capitalize">
                      {project.current_phase?.replace('-', ' ') || 'Discovery'} Phase
                    </span>
                  </div>

                  {/* Timeline Info */}
                  {project.target_completion && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Target: {new Date(project.target_completion).toLocaleDateString()}</span>
                      {new Date(project.target_completion) < new Date() && (
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                      )}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Insights
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Scoping
                    </Button>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          {projects.length === 0 && (
            <EnhancedCard glass className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Projects Available</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {isSuperAdmin ? 'No projects have been created yet.' : 
                   'You don\'t have access to any projects yet.'}
                </p>
                {isSuperAdmin && (
                  <EnhancedButton
                    onClick={onCreateProject}
                    gradient="primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Project
                  </EnhancedButton>
                )}
              </CardContent>
            </EnhancedCard>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Legacy project grid view */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <EnhancedCard 
                key={project.id} 
                glass
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedProject(project.id);
                  onProjectSelect?.(project.id);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.client_name || 'Unknown Client'}</p>
                    </div>
                    <Badge className={getStatusColor(project.status || 'planning')}>
                      {project.status?.replace('-', ' ') || 'Planning'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress_percentage || 0}%</span>
                    </div>
                    <Progress value={project.progress_percentage || 0} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Sites</div>
                      <div className="font-medium">{project.total_sites || 0}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Endpoints</div>
                      <div className="font-medium">{project.total_endpoints || 0}</div>
                    </div>
                  </div>

                  {/* Current Phase */}
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${getPhaseColor(project.current_phase || 'discovery')}`} />
                    <span className="text-sm capitalize">
                      {project.current_phase?.replace('-', ' ') || 'Discovery'} Phase
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Insights
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Scoping
                    </Button>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {selectedProjectData ? (
            <SmartProjectInsights
              projectData={{
                ...selectedProjectData,
                client_name: selectedProjectData.client_name || 'Unknown Client',
                industry: selectedProjectData.industry || 'Unknown',
                deployment_type: selectedProjectData.deployment_type || 'unknown',
                security_level: selectedProjectData.security_level || 'standard',
                current_phase: selectedProjectData.current_phase || 'discovery',
                success_criteria: selectedProjectData.success_criteria || [],
                pain_points: selectedProjectData.pain_points || [],
                total_sites: selectedProjectData.total_sites || 0,
                total_endpoints: selectedProjectData.total_endpoints || 0
              }}
              useCases={useCases}
              vendors={[]}
            />
          ) : (
            <EnhancedCard glass className="text-center py-12">
              <CardContent>
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a Project for AI Insights</h3>
                <p className="text-muted-foreground">
                  Choose a project from the overview tab to view intelligent analysis and recommendations.
                </p>
              </CardContent>
            </EnhancedCard>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Use Cases Library Integration */}
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Available Use Cases</span>
                  <Badge variant="secondary">{useCases.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {useCases.slice(0, 10).map((useCase) => (
                      <div key={useCase.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{useCase.name}</div>
                            <div className="text-xs text-muted-foreground">{useCase.category}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {useCase.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {useCase.complexity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse All Use Cases
                  </Button>
                </div>
              </CardContent>
            </EnhancedCard>

            {/* Requirements Library Integration */}
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Requirements Library</span>
                  <Badge variant="secondary">{requirements.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {requirements.slice(0, 10).map((req) => (
                      <div key={req.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{req.title}</div>
                            <div className="text-xs text-muted-foreground">{req.category}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {req.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {req.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse All Requirements
                  </Button>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* AI Planning Tools */}
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Planning Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-medium">Smart Scoping</span>
                  <span className="text-xs text-muted-foreground text-center">
                    AI-powered project scoping wizard
                  </span>
                </EnhancedButton>

                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span className="font-medium">Timeline Planning</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Intelligent timeline generation
                  </span>
                </EnhancedButton>

                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Target className="h-6 w-6 text-primary" />
                  <span className="font-medium">Resource Planning</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Optimize resource allocation
                  </span>
                </EnhancedButton>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProjectManagement;