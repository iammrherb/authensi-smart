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
  ArrowLeft, Plus, Search, LayoutGrid, Table, Filter, 
  BarChart3, FileText, CheckSquare, Calendar, Target,
  TrendingUp, Activity, Users, MapPin, Clock, Zap
} from "lucide-react";

// Import existing components
import { useProjects } from "@/hooks/useProjects";
import { useSites } from "@/hooks/useSites";
import { useTrackerData } from "@/hooks/useTrackerData";
import SitesTable from "@/components/sites/SitesTable";
import EnhancedSiteForm from "@/components/sites/EnhancedSiteForm";
import SiteDetailsDialog from "@/components/sites/SiteDetailsDialog";
import ComprehensiveImplementationTracker from "@/components/tracker/ComprehensiveImplementationTracker";
import ProfessionalDeploymentReportGenerator from "@/components/tracker/ProfessionalDeploymentReportGenerator";
import ChecklistManager from "@/components/tracker/ChecklistManager";
import TimelineManager from "@/components/tracker/TimelineManager";
import ProjectTrackingOverview from "@/components/tracker/ProjectTrackingOverview";

const UnifiedProjectTrackingCenter = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Data hooks
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { sites: trackerSites, stats, milestones, loading: trackerLoading } = useTrackerData();

  // Filter data
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.location && site.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    const matchesProject = !projectId || (site as any).project_id === projectId;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const selectedProject = projectId ? projects.find(p => p.id === projectId) : null;

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
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <Badge variant="glow" className="text-sm px-4 py-2">
                Unified Tracking Center
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              Project Tracking
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Command Center
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Complete project management, implementation tracking, site coordination, and analytics 
              for all your Portnox NAC deployments in one unified platform.
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="checklists" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <ProjectTrackingOverview 
              stats={overviewStats}
              onNavigateToTab={setActiveTab}
            />
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation">
            <ComprehensiveImplementationTracker />
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle>Sites Management ({filteredSites.length})</CardTitle>
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
                <SitesTable
                  sites={filteredSites}
                  onEdit={(site) => {
                    setSelectedSite(site);
                    setIsFormOpen(true);
                  }}
                  onDelete={(id) => {
                    if (confirm("Are you sure you want to delete this site?")) {
                      // Handle delete
                    }
                  }}
                  onViewDetails={(site) => {
                    setSelectedSite(site);
                    setIsDetailsOpen(true);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <ProfessionalDeploymentReportGenerator />
          </TabsContent>

          {/* Checklists Tab */}
          <TabsContent value="checklists">
            <ChecklistManager />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <TimelineManager />
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
          // Handle site creation/update
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

export default UnifiedProjectTrackingCenter;