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

const CommandCenter = () => {
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Compact AI Intelligence Header */}
      <div className="flex-shrink-0 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Intelligence AI Tracker Hub
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-driven project lifecycle management
                </p>
              </div>
              <Badge variant="outline" className="text-xs px-2 py-1">
                AI Active
              </Badge>
            </div>
            
            {/* Compact Status Indicators */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span>{analytics.totalProjects} Projects</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-purple-500" />
                <span>{analytics.totalSites} Sites</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-pink-500" />
                <span>{analytics.aiRecommendations} AI Insights</span>
              </div>
            </div>
            
            {/* Compact Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAIScopingWizard(true)}
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI Scoping
              </Button>
              
              <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" />
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

              <Button size="sm" variant="outline" asChild>
                <a href="https://docs.portnox.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Docs
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Metrics Bar */}
      <div className="flex-shrink-0 border-b bg-card/50">
        <div className="px-4 py-2">
          <div className="grid grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-500/10">
                <Target className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{analytics.totalProjects}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-green-500/10">
                <Building2 className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {selectedProject ? analytics.projectSites : analytics.totalSites}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedProject ? 'Project Sites' : 'Sites'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-500/10">
                <BarChart3 className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{analytics.avgProgress}%</div>
                <div className="text-xs text-muted-foreground">Avg Progress</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-orange-500/10">
                <BookOpen className="h-3 w-3 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{analytics.useCasesLibrary}</div>
                <div className="text-xs text-muted-foreground">Use Cases</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-pink-500/10">
                <Sparkles className="h-3 w-3 text-pink-600" />
              </div>
              <div>
                <div className="text-lg font-bold">{analytics.aiRecommendations}</div>
                <div className="text-xs text-muted-foreground">AI Insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Fixed Height */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-shrink-0 border-b bg-background">
            <TabsList className="grid w-full grid-cols-6 h-10 bg-transparent border-none">
              <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
                <Target className="h-3 w-3" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1 text-xs">
                <Rocket className="h-3 w-3" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="project-insights" className="flex items-center gap-1 text-xs" disabled={!selectedProject}>
                <Brain className="h-3 w-3" />
                Project AI
              </TabsTrigger>
              <TabsTrigger value="use-cases" className="flex items-center gap-1 text-xs">
                <BookOpen className="h-3 w-3" />
                Use Cases
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
                <BarChart3 className="h-3 w-3" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="ai-tools" className="flex items-center gap-1 text-xs">
                <Zap className="h-3 w-3" />
                AI Tools
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                {/* AI Scoping Wizard */}
                {showAIScopingWizard && (
                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-primary" />
                        AI-Powered Project Scoping
                      </CardTitle>
                      <CardDescription>
                        Intelligent project scoping with automated recommendations
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-primary text-base">
                        <Brain className="h-4 w-4" />
                        AI Scoping Wizard
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Start intelligent project scoping with AI recommendations
                      </p>
                      <Button 
                        onClick={() => setShowAIScopingWizard(true)} 
                        className="w-full bg-gradient-primary"
                        size="sm"
                      >
                        Start AI Scoping
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-accent text-base">
                        <Rocket className="h-4 w-4" />
                        Project Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Unified project tracking and management
                      </p>
                      <Button 
                        onClick={() => setActiveTab('projects')} 
                        variant="outline" 
                        className="w-full border-accent/30"
                        size="sm"
                      >
                        Manage Projects
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-secondary text-base">
                        <BarChart3 className="h-4 w-4" />
                        Intelligence Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        AI-powered insights and performance analytics
                      </p>
                      <Button 
                        onClick={() => setActiveTab('analytics')} 
                        variant="outline" 
                        className="w-full border-secondary/30"
                        size="sm"
                      >
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Projects - Compact */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Projects</CardTitle>
                    <CardDescription>Latest project updates and status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projects.slice(0, 4).map((project) => (
                        <div 
                          key={project.id} 
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 cursor-pointer transition-colors"
                          onClick={() => handleProjectSelect(project.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-400'}`} />
                            <div>
                              <h4 className="font-medium text-sm">{project.name}</h4>
                              <p className="text-xs text-muted-foreground">{project.client_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-xs font-medium">{project.progress_percentage || 0}%</div>
                              <Progress value={project.progress_percentage || 0} className="w-16 h-1" />
                            </div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4">
                <div className="h-[calc(100vh-280px)] overflow-hidden">
                  <UnifiedProjectManager />
                </div>
              </TabsContent>

              {/* Project-Specific AI Insights Tab */}
              <TabsContent value="project-insights" className="space-y-4">
                {selectedProject ? (
                  <>
                    {/* Project Header - Compact */}
                    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Brain className="h-5 w-5 text-primary" />
                              Project Intelligence: {projectData?.name || 'Loading...'}
                            </CardTitle>
                            <CardDescription>AI-powered insights and recommendations</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => generateReport('deployment')} size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Report
                            </Button>
                            <Button onClick={() => generateReport('checklist')} size="sm" variant="outline">
                              <PrinterIcon className="h-3 w-3 mr-1" />
                              Checklist
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Project Sites Management - Compact */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-base">
                              <Building2 className="h-4 w-4" />
                              Project Sites ({analytics.projectSites})
                            </CardTitle>
                            <CardDescription>Manage sites for this project</CardDescription>
                          </div>
                          <Dialog open={isCreateSiteOpen} onOpenChange={setIsCreateSiteOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Plus className="h-3 w-3 mr-1" />
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
                          <div className="space-y-2">
                            {projectSites.map((site) => (
                              <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <h4 className="font-medium text-sm">{site.name}</h4>
                                  <p className="text-xs text-muted-foreground">{site.location}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{site.status}</Badge>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Building2 className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">No sites in this project yet</p>
                            <Button 
                              onClick={() => setIsCreateSiteOpen(true)} 
                              className="mt-3"
                              variant="outline"
                              size="sm"
                            >
                              Add First Site
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Compact AI Tools for Project */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AIRecommendationEngine />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4" />
                            Portnox Documentation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Search docs..."
                              value={docSearchTerm}
                              onChange={(e) => setDocSearchTerm(e.target.value)}
                              className="flex-1 text-sm"
                            />
                            <Button onClick={() => searchPortnoxDocs(docSearchTerm)} size="sm">
                              <Search className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('firewall configuration')} className="text-xs">
                              Firewall
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('wireless vendors')} className="text-xs">
                              Wireless
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('VPN integration')} className="text-xs">
                              VPN
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => searchPortnoxDocs('troubleshooting')} className="text-xs">
                              Troubleshooting
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                      <h3 className="text-base font-semibold mb-2">No Project Selected</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select a project to view AI insights and site management
                      </p>
                      <Button onClick={() => setActiveTab('projects')} size="sm">
                        <Rocket className="h-3 w-3 mr-1" />
                        View Projects
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Use Cases Tab */}
              <TabsContent value="use-cases" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="h-4 w-4" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {useCases.slice(0, 6).map((useCase) => (
                        <Card key={useCase.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <Badge variant="outline" className="text-xs">{useCase.category}</Badge>
                              <Badge 
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
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {useCase.description}
                            </p>
                            {selectedProject && (
                              <Button 
                                size="sm" 
                                className="w-full text-xs"
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
              <TabsContent value="analytics" className="space-y-4">
                <div className="h-[calc(100vh-280px)] overflow-hidden">
                  <SmartProjectDashboard />
                </div>
                
                {/* Compact Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Project Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">On-Track Projects</span>
                          <span className="font-medium text-sm">{analytics.onTrackProjects}/{analytics.totalProjects}</span>
                        </div>
                        <Progress value={(analytics.onTrackProjects / Math.max(analytics.totalProjects, 1)) * 100} className="h-1" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Progress</span>
                          <span className="font-medium text-sm">{analytics.avgProgress}%</span>
                        </div>
                        <Progress value={analytics.avgProgress} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">AI Insights Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Active Recommendations</span>
                          <Badge className="text-xs">{analytics.aiRecommendations}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Automated Actions</span>
                          <Badge variant="secondary" className="text-xs">8</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Success Rate</span>
                          <Badge variant="outline" className="text-xs">94.2%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* AI Tools Tab */}
              <TabsContent value="ai-tools" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4 text-primary" />
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
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Global AI Insights
                      </CardTitle>
                      <CardDescription>Cross-project intelligence and recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AIRecommendationEngine />
                    </CardContent>
                  </Card>
                </div>

                {/* AI Capabilities Summary - Compact */}
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="h-5 w-5 text-primary" />
                      Complete AI Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Automated Project Management</h4>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Intelligent project template selection
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Automated site and resource planning
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Smart vendor recommendation and selection
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Dynamic timeline optimization
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Intelligent Analysis & Insights</h4>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Real-time project health monitoring
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Predictive risk assessment
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Performance optimization recommendations
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                            Compliance and security validation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CommandCenter;