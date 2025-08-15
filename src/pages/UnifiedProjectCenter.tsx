import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Plus, Search, Filter, Building2, Target, Settings,
  Activity, Users, MapPin, Clock, Zap, TrendingUp, Brain,
  CheckSquare, Calendar, FileText, BarChart3, Rocket
} from "lucide-react";

// Import all project management components
import { useProjects } from "@/hooks/useProjects";
import { useSites } from "@/hooks/useSites";
import { useTrackerData } from "@/hooks/useTrackerData";
import ProjectManagementHub from "@/components/management/ProjectManagementHub";
import ComprehensiveImplementationTracker from "@/components/tracker/ComprehensiveImplementationTracker";
import ProfessionalDeploymentReportGenerator from "@/components/tracker/ProfessionalDeploymentReportGenerator";
import ChecklistManager from "@/components/tracker/ChecklistManager";
import TimelineManager from "@/components/tracker/TimelineManager";
import ProjectTrackingOverview from "@/components/tracker/ProjectTrackingOverview";
import SitesTable from "@/components/sites/SitesTable";
import EnhancedSiteForm from "@/components/sites/EnhancedSiteForm";
import SiteDetailsDialog from "@/components/sites/SiteDetailsDialog";
import RobustProjectCreationWizard from "@/components/comprehensive/RobustProjectCreationWizard";
import UltimateAIScopingWizard from "@/components/scoping/UltimateAIScopingWizard";
import PortnoxKeyManager from "@/components/portnox/PortnoxKeyManager";
import PortnoxApiExplorer from "@/components/portnox/PortnoxApiExplorer";
import BulkApiRunner from "@/components/portnox/BulkApiRunner";
import DevicesExplorer from "@/components/portnox/DevicesExplorer";

const UnifiedProjectCenter = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(projectId ? "tracking" : "overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isScoping, setIsScoping] = useState(false);
  const [scopingData, setScopingData] = useState<any>(null);

  // Data hooks
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { sites: trackerSites, stats, milestones, loading: trackerLoading } = useTrackerData();
  
  // Get selected project data
  const selectedProject = projectId ? projects.find(p => p.id === projectId) : null;

  // Filter data based on project context
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.location && site.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    const matchesProject = !projectId || (site as any).project_id === projectId;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  // Calculate overview stats
  const overviewStats = {
    totalProjects: projects.length,
    activeSites: sites.filter(s => s.status === 'implementing' || s.status === 'testing').length,
    completedSites: sites.filter(s => s.status === 'deployed').length,
    overallProgress: Math.round((sites.filter(s => s.status === 'deployed').length / Math.max(sites.length, 1)) * 100),
    atRiskProjects: projects.filter(p => (p.progress_percentage && p.progress_percentage < 30) || (p as any).status === 'at_risk').length
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "planning", label: "Planning" },
    { value: "scoping", label: "Scoping" },
    { value: "designing", label: "Designing" },
    { value: "implementing", label: "Implementing" },
    { value: "testing", label: "Testing" },
    { value: "deployed", label: "Deployed" },
    { value: "maintenance", label: "Maintenance" }
  ];

  // Handle creation workflow
  if (isScoping) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setIsScoping(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Center
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Project Scoping</CardTitle>
            </CardHeader>
            <CardContent>
              <UltimateAIScopingWizard 
                onComplete={(sessionId, data) => {
                  setScopingData(data);
                  setIsScoping(false);
                  setIsCreating(true);
                }}
                onSave={(sessionId, data) => {
                  setScopingData(data);
                  setIsScoping(false);
                  setIsCreating(true);
                }}
                onCancel={() => setIsScoping(false)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Center
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Project Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <RobustProjectCreationWizard 
                scopingData={scopingData}
                onSave={(projectData) => {
                  console.log('Project created:', projectData);
                  setIsCreating(false);
                  setScopingData(null);
                  // Navigate to the new project's tracking
                  if (projectData.id) {
                    navigate(`/projects/${projectData.id}`);
                  }
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setScopingData(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-8 pb-6 bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            {selectedProject && (
              <Badge variant="outline" className="px-3 py-1">
                Project: {selectedProject.name}
              </Badge>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <Badge variant="glow" className="text-sm px-4 py-2">
                Unified Project Center
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              {selectedProject ? selectedProject.name : 'Project Management'}
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                {selectedProject ? 'Command Center' : 'Hub'}
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {selectedProject 
                ? `Complete project management, implementation tracking, site coordination, and analytics for ${selectedProject.name}.`
                : "Complete project lifecycle management - from AI-powered scoping and creation to deployment tracking and site management."
              }
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">{overviewStats.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{overviewStats.activeSites}</div>
                <div className="text-sm text-muted-foreground">Active Sites</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{overviewStats.completedSites}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">{overviewStats.overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-500">{overviewStats.atRiskProjects}</div>
                <div className="text-sm text-muted-foreground">At Risk</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${selectedProject ? 'grid-cols-7' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Projects
            </TabsTrigger>
            {selectedProject && (
              <>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger value="sites" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Sites
                </TabsTrigger>
                <TabsTrigger value="portnox" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Portnox
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="checklists" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Checklists
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {selectedProject ? (
              <ProjectTrackingOverview 
                stats={overviewStats}
                onNavigateToTab={setActiveTab}
              />
            ) : (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group" onClick={() => setIsScoping(true)}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">AI Scoping + Creation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Start with AI-powered scoping and create a complete project</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group" onClick={() => setIsCreating(true)}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Rocket className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">Quick Project Creation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Create a new project directly without scoping</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group" onClick={() => setActiveTab('projects')}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">Manage Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">View and manage all existing projects</p>
                    </CardContent>
                  </Card>
                </div>

                <ProjectTrackingOverview 
                  stats={overviewStats}
                  onNavigateToTab={setActiveTab}
                />
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManagementHub />
          </TabsContent>

          {/* Project-specific tabs */}
          {selectedProject && (
            <>
              <TabsContent value="tracking">
                <ComprehensiveImplementationTracker />
              </TabsContent>

              <TabsContent value="sites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <CardTitle>Project Site Deployment ({filteredSites.length})</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Manage sites for: <span className="font-medium">{selectedProject.name}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsFormOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Site
                        </Button>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col lg:flex-row gap-4 pt-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search sites by name or location..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredSites.length > 0 ? (
                      <SitesTable
                        sites={filteredSites}
                        onEdit={(site) => {
                          setSelectedSite(site);
                          setIsFormOpen(true);
                        }}
                        onDelete={(id) => {
                          if (confirm("Are you sure you want to remove this site?")) {
                            // Handle delete
                          }
                        }}
                        onViewDetails={(site) => {
                          setSelectedSite(site);
                          setIsDetailsOpen(true);
                        }}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏢</div>
                        <h3 className="text-lg font-semibold mb-2">No sites in this project</h3>
                        <p className="text-muted-foreground mb-4">
                          Add sites to start managing deployment locations.
                        </p>
                        <Button onClick={() => setIsFormOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Site
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portnox">
                <Card>
                  <CardHeader>
                    <CardTitle>Portnox Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="credentials">
                      <TabsList>
                        <TabsTrigger value="credentials">Credentials</TabsTrigger>
                        <TabsTrigger value="explorer">API Explorer</TabsTrigger>
                        <TabsTrigger value="bulk">Bulk Ops</TabsTrigger>
                        <TabsTrigger value="devices">Devices</TabsTrigger>
                      </TabsList>
                      <TabsContent value="credentials">
                        <PortnoxKeyManager projectId={projectId!} />
                      </TabsContent>
                      <TabsContent value="explorer">
                        <PortnoxApiExplorer projectId={projectId!} />
                      </TabsContent>
                      <TabsContent value="bulk">
                        <BulkApiRunner projectId={projectId!} />
                      </TabsContent>
                      <TabsContent value="devices">
                        <DevicesExplorer projectId={projectId!} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ProfessionalDeploymentReportGenerator />
          </TabsContent>

          {/* Checklists Tab */}
          <TabsContent value="checklists">
            <ChecklistManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <EnhancedSiteForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSite(null);
        }}
        onSubmit={(siteData) => {
          setIsFormOpen(false);
          setSelectedSite(null);
        }}
        initialData={selectedSite}
        isLoading={false}
      />

      <SiteDetailsDialog
        site={selectedSite}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedSite(null);
        }}
        onEdit={(site) => {
          setSelectedSite(site);
          setIsDetailsOpen(false);
          setIsFormOpen(true);
        }}
      />
    </div>
  );
};

export default UnifiedProjectCenter;