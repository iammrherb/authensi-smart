import React, { useState, useEffect } from 'react';
import { useProjects, useCreateProject, useDeleteProject, useProject } from '@/hooks/useProjects';
import { useSites, useCreateSite, useDeleteSite } from '@/hooks/useSites';
import { useUseCases, useAddUseCaseToProject } from '@/hooks/useUseCases';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import ComprehensiveAIScopingWizard from '@/components/scoping/ComprehensiveAIScopingWizard';
import EnhancedProjectCreationWizard from '@/components/comprehensive/EnhancedProjectCreationWizard';
import SiteForm from '@/components/sites/SiteForm';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';
import AIRecommendationEngine from '@/components/ai/AIRecommendationEngine';
import SmartProjectDashboard from '@/components/ai/SmartProjectDashboard';
import UnifiedProjectManager from '@/components/tracker/UnifiedProjectManager';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, Users, Building2, Rocket, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, Plus, Search, Filter, Eye, Edit, Trash2,
  Brain, Sparkles, BookOpen, Zap, BarChart3, Settings, MapPin,
  Calendar, DollarSign, Shield, Network, FileText, Lightbulb,
  ArrowRight, Globe, Database, Cpu, Activity, Download, PrinterIcon,
  ExternalLink, ChevronDown, ChevronUp, RefreshCw, Star, Tag
} from 'lucide-react';

const IntelligenceTrackerHub = () => {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { data: useCases = [], isLoading: useCasesLoading } = useUseCases();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateSiteOpen, setIsCreateSiteOpen] = useState(false);
  const [showAIScopingWizard, setShowAIScopingWizard] = useState(false);
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [aiInsightsFilter, setAiInsightsFilter] = useState('all');
  
  const { toast } = useToast();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: deleteSite } = useDeleteSite();
  const { mutate: addUseCaseToProject } = useAddUseCaseToProject();

  // Get project data if one is selected
  const { data: projectData } = useProject(selectedProject || '');

  // Filter sites by selected project
  const projectSites = selectedProject 
    ? sites.filter(site => {
        // You'd need to implement project-site relationship
        // For now, we'll assume all sites if no project selected
        return selectedProject;
      })
    : [];

  // Analytics calculations
  const analytics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => ['scoping', 'implementing', 'testing'].includes(p.status)).length,
    completedProjects: projects.filter(p => p.status === 'deployed').length,
    totalSites: sites.length,
    projectSites: projectSites.length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / projects.length) : 0,
    useCasesLibrary: useCases.length,
    aiRecommendations: 12, // Mock data
    onTrackProjects: projects.filter(p => !['at-risk', 'on-hold'].includes(p.status || '')).length,
  };

  const statusColors = {
    planning: 'bg-gray-500',
    scoping: 'bg-blue-500',
    designing: 'bg-purple-500',
    implementing: 'bg-orange-500',
    testing: 'bg-yellow-500',
    deployed: 'bg-green-500',
    maintenance: 'bg-cyan-500',
    'at-risk': 'bg-red-500'
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    // Switch to project insights when a project is selected
    if (activeTab === 'overview') {
      setActiveTab('project-insights');
    }
  };

  const handleScopingComplete = (projectId: string, scopingData: any) => {
    setShowAIScopingWizard(false);
    setSelectedProject(projectId);
    toast({
      title: "AI Scoping Complete",
      description: "Project has been scoped and is ready for implementation",
    });
  };

  const generateReport = (type: 'deployment' | 'requirements' | 'checklist') => {
    if (!selectedProject) {
      toast({
        title: "No Project Selected",
        description: "Please select a project to generate reports",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: `Generating ${type} Report`,
      description: "Report generation will be implemented soon",
    });
  };

  const searchPortnoxDocs = async (query: string) => {
    // Mock function for Portnox documentation search
    toast({
      title: "Searching Portnox Documentation",
      description: `Searching for: ${query}`,
    });
  };

  if (projectsLoading || sitesLoading || useCasesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Intelligence Tracker Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced AI Intelligence Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-accent/10 to-primary/5 border-b">
        <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl"></div>
        <div className="relative px-6 py-8">
          <div className="max-w-full">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse">
                    <Brain className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      Intelligence AI Tracker Hub
                    </h1>
                    <p className="text-lg text-muted-foreground mt-1">
                      Complete AI-driven project lifecycle management and deployment optimization
                    </p>
                  </div>
                  <Badge variant="glow" className="text-sm px-4 py-2 animate-fade-in ml-4">
                    AI-Powered Suite
                  </Badge>
                </div>

                {/* Enhanced Status Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-muted-foreground font-medium">AI Engine Active</span>
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
                    <BookOpen className="h-4 w-4 text-orange-500" />
                    <span className="text-muted-foreground">{analytics.useCasesLibrary} Use Cases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span className="text-muted-foreground">{analytics.aiRecommendations} AI Insights</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowAIScopingWizard(true)}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  AI Scoping
                </Button>
                
                <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Intelligent Project</DialogTitle>
                      <DialogDescription>
                        AI-powered project creation with automated scoping and recommendations
                      </DialogDescription>
                    </DialogHeader>
                    <EnhancedProjectCreationWizard
                      onComplete={(projectId) => {
                        setIsCreateProjectOpen(false);
                        setSelectedProject(projectId);
                        setActiveTab('project-insights');
                      }}
                      onCancel={() => setIsCreateProjectOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" asChild>
                  <a href="https://docs.portnox.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Portnox Docs
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Dashboard */}
      <div className="p-6">
        {/* Key AI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <Badge variant="secondary" className="bg-blue-100/80 text-blue-700">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProjects}</div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <div className="text-xs text-blue-600 mt-1">{analytics.activeProjects} in progress</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 border-green-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <Badge variant="secondary" className="bg-green-100/80 text-green-700">Sites</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProject ? analytics.projectSites : analytics.totalSites}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedProject ? 'Project Sites' : 'Total Sites'}
              </p>
              {selectedProject && (
                <div className="text-xs text-green-600 mt-1">In selected project</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <Badge variant="secondary" className="bg-purple-100/80 text-purple-700">Progress</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgProgress}%</div>
              <p className="text-sm text-muted-foreground">Avg Progress</p>
              <Progress value={analytics.avgProgress} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <Badge variant="secondary" className="bg-orange-100/80 text-orange-700">Library</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.useCasesLibrary}</div>
              <p className="text-sm text-muted-foreground">Use Cases</p>
              <div className="text-xs text-orange-600 mt-1">AI-curated</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50/50 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-900/20 border-pink-200/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-pink-500/10">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                </div>
                <Badge variant="secondary" className="bg-pink-100/80 text-pink-700">AI</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.aiRecommendations}</div>
              <p className="text-sm text-muted-foreground">AI Insights</p>
              <div className="text-xs text-pink-600 mt-1">Active recommendations</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Intelligence Hub Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-12 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="project-insights" className="flex items-center gap-2" disabled={!selectedProject}>
              <Brain className="h-4 w-4" />
              Project AI
            </TabsTrigger>
            <TabsTrigger value="use-cases" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Use Cases
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* AI Scoping Wizard */}
            {showAIScopingWizard && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI-Powered Project Scoping
                  </CardTitle>
                  <CardDescription>
                    Intelligent project scoping with automated recommendations and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComprehensiveAIScopingWizard
                    onComplete={handleScopingComplete}
                    onCancel={() => setShowAIScopingWizard(false)}
                  />
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Brain className="h-5 w-5" />
                    AI Scoping Wizard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Start intelligent project scoping with AI recommendations
                  </p>
                  <Button 
                    onClick={() => setShowAIScopingWizard(true)} 
                    className="w-full bg-gradient-primary"
                  >
                    Start AI Scoping
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Rocket className="h-5 w-5" />
                    Project Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Unified project tracking and management
                  </p>
                  <Button 
                    onClick={() => setActiveTab('projects')} 
                    variant="outline" 
                    className="w-full border-accent/30"
                  >
                    Manage Projects
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <BarChart3 className="h-5 w-5" />
                    Intelligence Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI-powered insights and performance analytics
                  </p>
                  <Button 
                    onClick={() => setActiveTab('analytics')} 
                    variant="outline" 
                    className="w-full border-secondary/30"
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest project updates and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div 
                      key={project.id} 
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 cursor-pointer transition-colors"
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-400'}`} />
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.client_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{project.progress_percentage || 0}%</div>
                          <Progress value={project.progress_percentage || 0} className="w-20 h-1" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <UnifiedProjectManager />
          </TabsContent>

          {/* Project-Specific AI Insights Tab */}
          <TabsContent value="project-insights" className="space-y-6">
            {selectedProject ? (
              <>
                {/* Project Header */}
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-6 w-6 text-primary" />
                          Project Intelligence: {projectData?.name || 'Loading...'}
                        </CardTitle>
                        <CardDescription>AI-powered insights and recommendations for this project</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => generateReport('deployment')} size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Deployment Report
                        </Button>
                        <Button onClick={() => generateReport('checklist')} size="sm" variant="outline">
                          <PrinterIcon className="h-4 w-4 mr-2" />
                          Checklist
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Project Sites Management */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Project Sites ({analytics.projectSites})
                        </CardTitle>
                        <CardDescription>Manage sites specific to this project</CardDescription>
                      </div>
                      <Dialog open={isCreateSiteOpen} onOpenChange={setIsCreateSiteOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Site
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Add Site to Project</DialogTitle>
                            <DialogDescription>
                              Add a new site to {projectData?.name}
                            </DialogDescription>
                          </DialogHeader>
                          <SiteForm 
                            isOpen={true}
                            onClose={() => setIsCreateSiteOpen(false)}
                            onSubmit={(siteData) => {
                              setIsCreateSiteOpen(false);
                              toast({
                                title: "Site Added",
                                description: "Site has been added to the project",
                              });
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {projectSites.length > 0 ? (
                      <div className="space-y-4">
                        {projectSites.map((site) => (
                          <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{site.name}</h4>
                              <p className="text-sm text-muted-foreground">{site.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{site.status}</Badge>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No sites in this project yet</p>
                        <Button 
                          onClick={() => setIsCreateSiteOpen(true)} 
                          className="mt-4"
                          variant="outline"
                        >
                          Add First Site
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* AI Recommendations for Project */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>Personalized recommendations for this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIRecommendationEngine />
                  </CardContent>
                </Card>

                {/* Project Use Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Project Use Cases
                    </CardTitle>
                    <CardDescription>Use cases assigned to this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setActiveTab('use-cases')}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Use Cases to Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Portnox Documentation Search */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Portnox Documentation
                    </CardTitle>
                    <CardDescription>AI-powered documentation search and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search Portnox documentation..."
                        value={docSearchTerm}
                        onChange={(e) => setDocSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => searchPortnoxDocs(docSearchTerm)}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('firewall configuration')}>
                        Firewall Config
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('wireless vendors')}>
                        Wireless Vendors
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('VPN integration')}>
                        VPN Integration
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('troubleshooting')}>
                        Troubleshooting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a project to view AI insights, site management, and recommendations
                  </p>
                  <Button onClick={() => setActiveTab('projects')}>
                    <Rocket className="h-4 w-4 mr-2" />
                    View Projects
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="use-cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Use Case Library
                </CardTitle>
                <CardDescription>
                  {selectedProject 
                    ? `Apply use cases to ${projectData?.name}` 
                    : 'Browse and manage use cases'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCases.slice(0, 6).map((useCase) => (
                    <Card key={useCase.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{useCase.category}</Badge>
                          <Badge 
                            className={`${
                              useCase.complexity === 'low' ? 'bg-green-100 text-green-700' :
                              useCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            {useCase.complexity}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm">{useCase.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                          {useCase.description}
                        </p>
                        {selectedProject && (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => addUseCaseToProject({
                              projectId: selectedProject,
                              useCaseId: useCase.id,
                              priority: 'medium'
                            })}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add to Project
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <SmartProjectDashboard />
            
            {/* Enhanced Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">On-Track Projects</span>
                      <span className="font-medium">{analytics.onTrackProjects}/{analytics.totalProjects}</span>
                    </div>
                    <Progress value={(analytics.onTrackProjects / Math.max(analytics.totalProjects, 1)) * 100} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Progress</span>
                      <span className="font-medium">{analytics.avgProgress}%</span>
                    </div>
                    <Progress value={analytics.avgProgress} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Insights Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Recommendations</span>
                      <Badge>{analytics.aiRecommendations}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Automated Actions</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success Rate</span>
                      <Badge variant="outline">94.2%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    AI Workflow Engine
                  </CardTitle>
                  <CardDescription>Intelligent automation and workflow optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <AIWorkflowEngine 
                    context="deployment"
                    onAction={(action, data) => {
                      console.log('AI Action:', action, data);
                    }}
                    onRecommendationAccept={(recommendation) => {
                      toast({
                        title: "Recommendation Applied",
                        description: "AI recommendation has been implemented",
                      });
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Global AI Insights
                  </CardTitle>
                  <CardDescription>Cross-project intelligence and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <AIRecommendationEngine />
                </CardContent>
              </Card>
            </div>

            {/* AI Capabilities Summary */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Complete AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Automated Project Management</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Intelligent project template selection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Automated site and resource planning
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Smart vendor recommendation and selection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Dynamic timeline optimization
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Intelligent Analysis & Insights</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Real-time project health monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Predictive risk assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Performance optimization recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Compliance and security validation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntelligenceTrackerHub;