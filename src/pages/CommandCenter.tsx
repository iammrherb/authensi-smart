import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, Target, Building2, Users, BarChart3, TrendingUp, Filter, 
  Search, Calendar, AlertCircle, CheckCircle, Clock, Zap, Brain,
  FileText, Settings, Activity, MapPin, Rocket, Eye, Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useToast } from '@/hooks/use-toast';
import EnhancedProjectCreationWizard from '@/components/comprehensive/EnhancedProjectCreationWizard';
import AnalyticsDashboard from '@/components/tracker/AnalyticsDashboard';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';
import SmartProjectDashboard from '@/components/ai/SmartProjectDashboard';

const CommandCenter = () => {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Analytics calculations
  const analytics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => ['scoping', 'implementing', 'testing'].includes(p.status)).length,
    completedProjects: projects.filter(p => p.status === 'deployed').length,
    totalSites: sites.length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / projects.length) : 0,
    onTimeDelivery: 94.2, // Mock calculation
    budgetEfficiency: 12, // Mock calculation
  };

  const projectTypes = [
    { value: 'poc', label: 'Proof of Concept', color: 'bg-blue-500' },
    { value: 'implementation', label: 'Implementation', color: 'bg-green-500' },
    { value: 'expansion', label: 'Expansion', color: 'bg-purple-500' },
    { value: 'migration', label: 'Migration', color: 'bg-orange-500' },
    { value: 'upgrade', label: 'Upgrade', color: 'bg-cyan-500' }
  ];

  const statusColors = {
    planning: 'bg-gray-500',
    scoping: 'bg-blue-500',
    designing: 'bg-purple-500',
    implementing: 'bg-orange-500',
    testing: 'bg-yellow-500',
    deployed: 'bg-green-500',
    maintenance: 'bg-cyan-500'
  };

  const priorityColors = {
    low: 'bg-gray-400',
    medium: 'bg-blue-400',
    high: 'bg-orange-400',
    critical: 'bg-red-500'
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleProjectCreated = (projectId: string) => {
    setIsCreateProjectOpen(false);
    // Navigate to project scoping
    window.location.href = `/scoping/${projectId}`;
  };

  if (projectsLoading || sitesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Command Center
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">
                      Comprehensive project management and deployment tracking
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-muted-foreground">System Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-muted-foreground">{analytics.totalProjects} Active Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <span className="text-muted-foreground">{analytics.totalSites} Sites Managed</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-xl">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>
                        Create a comprehensive project with full scoping and tracking capabilities
                      </DialogDescription>
                    </DialogHeader>
                    <EnhancedProjectCreationWizard
                      onComplete={handleProjectCreated}
                      onCancel={() => setIsCreateProjectOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" size="lg" asChild className="border-primary/20 hover:bg-primary/5">
                  <Link to="/scoping">
                    <Brain className="h-5 w-5 mr-2" />
                    AI Scoping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">{analytics.totalProjects}</div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{analytics.activeProjects} active</span>
                    <span className="font-medium">{Math.round((analytics.activeProjects / Math.max(analytics.totalProjects, 1)) * 100)}%</span>
                  </div>
                  <Progress value={(analytics.activeProjects / Math.max(analytics.totalProjects, 1)) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    Success
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">{analytics.onTimeDelivery}%</div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <p className="text-xs text-muted-foreground">On-time delivery performance</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">{analytics.avgProgress}%</div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
                <p className="text-xs text-muted-foreground">Across all active projects</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300">
                    Budget
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-foreground">{analytics.budgetEfficiency}%</div>
                  <p className="text-sm text-muted-foreground">Budget Efficiency</p>
                </div>
                <p className="text-xs text-muted-foreground">Under budget average</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="projects" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="projects">Project Overview</TabsTrigger>
          <TabsTrigger value="ai-workflow">AI Workflow</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="pipeline">Project Pipeline</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>

        {/* Projects Overview Tab */}
        <TabsContent value="projects" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="scoping">Scoping</SelectItem>
                  <SelectItem value="designing">Designing</SelectItem>
                  <SelectItem value="implementing">Implementing</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}
                        >
                          {project.status}
                        </Badge>
                        {project.current_phase && (
                          <Badge variant="outline">
                            {project.current_phase}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {project.client_name || 'No client specified'}
                      </p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {(project as any).industry && (
                        <Badge variant="outline">{(project as any).industry}</Badge>
                      )}
                      <div className="flex gap-2">
                        <Link to={`/scoping/${project.id}`}>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </Link>
                        <Link to={`/project/${project.id}/tracking`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span>{project.progress_percentage}%</span>
                      </div>
                      <Progress value={project.progress_percentage} className="h-2" />
                    </div>

                    {/* Project Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{(project as any).total_sites || 0} sites</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{(project as any).total_endpoints || 0} endpoints</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {project.target_completion 
                            ? new Date(project.target_completion).toLocaleDateString()
                            : 'No date set'
                          }
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {project.updated_at 
                            ? `Updated ${new Date(project.updated_at).toLocaleDateString()}`
                            : 'No updates'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Budget if available */}
                    {project.budget && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Budget:</span>
                        <span>${project.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {projects.length === 0 
                      ? 'Get started by creating your first project with our AI-powered scoping wizard'
                      : 'Try adjusting your search or filter criteria'
                    }
                  </p>
                  {projects.length === 0 && (
                    <Button onClick={() => setIsCreateProjectOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* AI Workflow Tab */}
        <TabsContent value="ai-workflow">
          <div className="space-y-6">
            <AIWorkflowEngine 
              context="project_creation"
              onAction={(action, data) => {
                console.log('AI Action:', action, data);
                toast({
                  title: "AI Action Executed",
                  description: `Successfully performed: ${action.replace('_', ' ')}`,
                });
              }}
              onRecommendationAccept={(recommendation) => {
                console.log('Recommendation accepted:', recommendation);
                toast({
                  title: "Recommendation Applied",
                  description: recommendation.title,
                });
              }}
            />
            
            <SmartProjectDashboard projects={projects} />
          </div>
        </TabsContent>

        {/* Analytics Dashboard Tab */}
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        {/* Project Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Pipeline Overview</CardTitle>
              <CardDescription>
                Visual representation of projects across different phases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['planning', 'scoping', 'designing', 'implementing', 'testing', 'deployed'].map(status => {
                  const statusProjects = projects.filter(p => p.status === status);
                  const percentage = (statusProjects.length / Math.max(projects.length, 1)) * 100;
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                          <span className="font-medium capitalize">{status}</span>
                          <span className="text-sm text-muted-foreground">
                            ({statusProjects.length} projects)
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      
                      {statusProjects.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {statusProjects.slice(0, 3).map(project => (
                            <div key={project.id} className="text-xs text-muted-foreground">
                              • {project.name} ({project.client_name})
                            </div>
                          ))}
                          {statusProjects.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              + {statusProjects.length - 3} more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Project Activities</CardTitle>
              <CardDescription>
                Latest updates and milestones across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 10).map((project) => (
                  <div key={project.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Status updated to {project.status} • Phase: {project.current_phase}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities to show. Create a project to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };

export default CommandCenter;