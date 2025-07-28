import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, Target, Building2, Users, BarChart3, TrendingUp, Filter, 
  Search, Calendar, AlertCircle, CheckCircle, Clock, Zap, Brain,
  FileText, Settings, Activity, MapPin, Rocket, Eye, Edit, Trash2,
  Library, Layout, Workflow, Gauge, Star, ArrowRight, PlayCircle,
  Lightbulb, Network, Globe, ShieldCheck, Users2, Database, BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useSites, useDeleteSite } from '@/hooks/useSites';
import { useUseCases, useAddUseCaseToProject } from '@/hooks/useUseCases';
import { useToast } from '@/hooks/use-toast';
import EnhancedProjectCreationWizard from '@/components/comprehensive/EnhancedProjectCreationWizard';
import SiteForm from '@/components/sites/SiteForm';
import AnalyticsDashboard from '@/components/tracker/AnalyticsDashboard';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';
import SmartProjectDashboard from '@/components/ai/SmartProjectDashboard';

const CommandCenter = () => {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { data: useCases = [], isLoading: useCasesLoading } = useUseCases();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateSiteOpen, setIsCreateSiteOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectForUseCase, setSelectedProjectForUseCase] = useState<string | null>(null);
  const { toast } = useToast();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: deleteSite } = useDeleteSite();
  const { mutate: addUseCaseToProject } = useAddUseCaseToProject();

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

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleProjectCreated = (projectId: string) => {
    setIsCreateProjectOpen(false);
    // Navigate to project scoping
    window.location.href = `/scoping/${projectId}`;
  };

  const handleAddUseCaseToProject = (useCaseId: string, projectId: string) => {
    addUseCaseToProject({
      projectId,
      useCaseId,
      priority: 'medium',
    });
  };

  if (projectsLoading || sitesLoading || useCasesLoading) {
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
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Hero Header Section - Fixed */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative px-6 py-8">
            <div className="max-w-full">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Command Center
                      </h1>
                      <p className="text-base text-muted-foreground">
                        Comprehensive project management and deployment tracking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-muted-foreground">System Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">{analytics.totalProjects} Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-500" />
                      <span className="text-muted-foreground">{analytics.totalSites} Sites</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Library className="h-4 w-4 text-orange-500" />
                      <span className="text-muted-foreground">{useCases.length} Use Cases</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                    <DialogTrigger asChild>
                      <Button size="default" className="bg-gradient-primary hover:opacity-90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
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
                  
                  <Dialog open={isCreateSiteOpen} onOpenChange={setIsCreateSiteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="default">
                        <Building2 className="h-4 w-4 mr-2" />
                        New Site
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Site</DialogTitle>
                        <DialogDescription>
                          Add a new site to manage and deploy
                        </DialogDescription>
                      </DialogHeader>
                      <SiteForm />
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="default" asChild>
                    <Link to="/scoping">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Scoping
                    </Link>
                  </Button>

                  <Button variant="outline" size="default" asChild>
                    <Link to="/use-cases">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Use Cases
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Key Metrics Dashboard */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{analytics.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">Total Projects</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{analytics.activeProjects} active</span>
                      <span className="font-medium">{Math.round((analytics.activeProjects / Math.max(analytics.totalProjects, 1)) * 100)}%</span>
                    </div>
                    <Progress value={(analytics.activeProjects / Math.max(analytics.totalProjects, 1)) * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100/80 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
                      Sites
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{analytics.totalSites}</div>
                    <p className="text-xs text-muted-foreground">Total Sites</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Managed infrastructure</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-100/80 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 text-xs">
                      Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{analytics.avgProgress}%</div>
                    <p className="text-xs text-muted-foreground">Avg Progress</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Library className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <Badge variant="secondary" className="bg-orange-100/80 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 text-xs">
                      Library
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{useCases.length}</div>
                    <p className="text-xs text-muted-foreground">Use Cases</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Available templates</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="px-6 pb-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 h-12">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="sites" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sites
                </TabsTrigger>
                <TabsTrigger value="use-cases" className="flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  Use Cases
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai-workflow" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Tools
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>
                        Get started with common tasks and workflows
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                          <Link to="/scoping">
                            <Brain className="h-6 w-6" />
                            <span className="font-medium">AI Scoping</span>
                            <span className="text-xs text-muted-foreground text-center">Smart project planning</span>
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                          <Link to="/use-cases">
                            <BookOpen className="h-6 w-6" />
                            <span className="font-medium">Use Case Library</span>
                            <span className="text-xs text-muted-foreground text-center">Browse templates</span>
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                          <Link to="/sites">
                            <Building2 className="h-6 w-6" />
                            <span className="font-medium">Manage Sites</span>
                            <span className="text-xs text-muted-foreground text-center">Site configuration</span>
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                          <Link to="/reports">
                            <FileText className="h-6 w-6" />
                            <span className="font-medium">Reports</span>
                            <span className="text-xs text-muted-foreground text-center">Analytics & insights</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Projects & Sites */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Recent Projects
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {projects.slice(0, 3).map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{project.name}</p>
                              <p className="text-xs text-muted-foreground">{project.client_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {project.status}
                              </Badge>
                              <Link to={`/project/${project.id}/tracking`}>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                        {projects.length === 0 && (
                          <div className="text-center py-8">
                            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No projects yet</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsCreateProjectOpen(true)}>
                              Create First Project
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Recent Sites
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {sites.slice(0, 3).map((site) => (
                          <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{site.name}</p>
                              <p className="text-xs text-muted-foreground">{site.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {site.status}
                              </Badge>
                              <Link to={`/sites`}>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                        {sites.length === 0 && (
                          <div className="text-center py-8">
                            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No sites yet</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsCreateSiteOpen(true)}>
                              Create First Site
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-[250px]"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
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
                <div className="grid gap-4">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <Badge 
                                variant="secondary" 
                                className={`${statusColors[project.status as keyof typeof statusColors]} text-white text-xs`}
                              >
                                {project.status}
                              </Badge>
                              {project.current_phase && (
                                <Badge variant="outline" className="text-xs">
                                  {project.current_phase}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {project.client_name || 'No client specified'}
                            </p>
                            {project.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            {(project as any).industry && (
                              <Badge variant="outline" className="text-xs">{(project as any).industry}</Badge>
                            )}
                            <div className="flex gap-1">
                              <Link to={`/scoping/${project.id}`}>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/project/${project.id}/tracking`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{project.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteProject(project.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">Progress</span>
                              <span>{project.progress_percentage}%</span>
                            </div>
                            <Progress value={project.progress_percentage} className="h-2" />
                          </div>

                          {/* Key Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Start Date:</span>
                              <p className="font-medium">{project.start_date || 'Not set'}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Target Completion:</span>
                              <p className="font-medium">{project.target_completion || 'Not set'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Get started by creating your first project'
                        }
                      </p>
                      {!searchTerm && filterStatus === 'all' && (
                        <Button onClick={() => setIsCreateProjectOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Project
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Sites Tab */}
              <TabsContent value="sites" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search sites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[250px]"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {filteredSites.length} of {sites.length} sites
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredSites.map((site) => (
                    <Card key={site.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{site.name}</CardTitle>
                              <Badge 
                                variant="secondary" 
                                className={`${statusColors[site.status as keyof typeof statusColors]} text-white text-xs`}
                              >
                                {site.status}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`${priorityColors[site.priority as keyof typeof priorityColors]} text-white text-xs`}
                              >
                                {site.priority}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {site.location || 'No location specified'}
                            </p>
                          </div>
                          
                          <div className="flex gap-1">
                            <Link to={`/sites`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Site</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{site.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteSite(site.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{site.site_type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Devices:</span>
                            <p className="font-medium">{site.device_count}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={site.progress_percentage || 0} className="h-1 flex-1" />
                              <span className="font-medium">{site.progress_percentage || 0}%</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phase:</span>
                            <p className="font-medium">{site.current_phase || 'Planning'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredSites.length === 0 && (
                    <div className="text-center py-12">
                      <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No sites found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search criteria'
                          : 'Get started by creating your first site'
                        }
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => setIsCreateSiteOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Site
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Use Cases Tab */}
              <TabsContent value="use-cases" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search use cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-[250px]"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {useCases.length} use cases available
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCases
                    .filter(useCase => 
                      useCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      useCase.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((useCase) => (
                    <Card key={useCase.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {useCase.category}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                useCase.complexity === 'low' ? 'bg-green-100 text-green-700' :
                                useCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {useCase.complexity}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm">{useCase.name}</CardTitle>
                          {useCase.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {useCase.description}
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Effort:</span>
                            <span className="font-medium ml-1">
                              {useCase.estimated_effort_weeks ? `${useCase.estimated_effort_weeks} weeks` : 'TBD'}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/use-cases`}>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>
                            
                            {projects.length > 0 && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="text-xs">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add to Project
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Use Case to Project</DialogTitle>
                                    <DialogDescription>
                                      Select a project to add "{useCase.name}" to
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {projects.map((project) => (
                                      <Card key={project.id} className="cursor-pointer hover:bg-muted/50" 
                                            onClick={() => {
                                              handleAddUseCaseToProject(useCase.id, project.id);
                                              setSelectedProjectForUseCase(null);
                                            }}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-medium">{project.name}</p>
                                              <p className="text-sm text-muted-foreground">{project.client_name}</p>
                                            </div>
                                            <Badge variant="outline">{project.status}</Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {useCases.length === 0 && (
                  <div className="text-center py-12">
                    <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No use cases available</h3>
                    <p className="text-muted-foreground">
                      Use cases will appear here once they are added to the library
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <AnalyticsDashboard />
              </TabsContent>

              {/* AI Workflow Tab */}
              <TabsContent value="ai-workflow" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI-Powered Tools
                      </CardTitle>
                      <CardDescription>
                        Leverage artificial intelligence to streamline your project workflows
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AIWorkflowEngine context="command-center" />
                        <SmartProjectDashboard />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;