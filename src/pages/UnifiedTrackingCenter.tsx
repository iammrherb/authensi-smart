import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Target, 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Download
} from 'lucide-react';

// Import enhanced tracking components
import EnhancedImplementationTracker from '@/components/unified/EnhancedImplementationTracker';
import UnifiedSiteCreationWizard from '@/components/unified/UnifiedSiteCreationWizard';
import SitesTable from '@/components/sites/SitesTable';
import SiteDetailsDialog from '@/components/sites/SiteDetailsDialog';
import UserManagement from '@/components/users/UserManagement';
import VendorManagement from '@/components/vendors/VendorManagement';
import EnhancedChecklistManager from '@/components/tracker/EnhancedChecklistManager';
import TimelineManager from '@/components/tracker/TimelineManager';
import ProfessionalDeploymentReportGenerator from '@/components/tracker/ProfessionalDeploymentReportGenerator';

// Import hooks for data management
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useTrackerData } from '@/hooks/useTrackerData';

const UnifiedTrackingCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false);
  const [isCreateSiteOpen, setIsCreateSiteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Data hooks
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const { stats, milestones } = useTrackerData();

  // Calculate overview statistics
  const overviewStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => ['in-progress', 'poc-active'].includes(p.status || '')).length,
    totalSites: sites.length,
    activeSites: sites.filter(s => s.status === 'deployed').length,
    completedTasks: 0, // This would come from checklists
    pendingTasks: 0,   // This would come from checklists
    teamMembers: 15,   // This would come from user management
    activeVendors: 8   // This would come from vendor management
  };

  // Filter sites based on search and status
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSiteEdit = (site: any) => {
    setSelectedSite(site);
    setIsSiteDialogOpen(true);
  };

  const handleSiteView = (site: any) => {
    setSelectedSite(site);
    setIsSiteDialogOpen(true);
  };

  const handleCreateSite = () => {
    setIsCreateSiteOpen(true);
  };

  const handleSiteFormSubmit = () => {
    setIsSiteDialogOpen(false);
    setIsCreateSiteOpen(false);
    setSelectedSite(null);
    toast.success('Site updated successfully');
  };

  if (projectsLoading || sitesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tracking center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="bg-gradient-neon-green border-b border-neon-green/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-neon-green-foreground mb-2">
                Unified Tracking Command Center
              </h1>
              <p className="text-neon-green-foreground/80 text-lg">
                Comprehensive project, site, and implementation management platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="electric" className="animate-pulse-glow">
                <div className="w-2 h-2 bg-electric-blue rounded-full mr-2"></div>
                Live Monitoring
              </Badge>
              <Button variant="neon" onClick={handleCreateSite}>
                <Plus className="h-4 w-4 mr-2" />
                New Site
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
            <Card className="bg-gradient-electric-cyber border-electric-blue/30">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-electric-blue-foreground">{overviewStats.totalProjects}</div>
                <div className="text-sm text-electric-blue-foreground/70">Total Projects</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-neon-purple border-neon-purple/30">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-purple-foreground">{overviewStats.activeProjects}</div>
                <div className="text-sm text-neon-purple-foreground/70">Active Projects</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-neon-orange border-neon-orange/30">
              <CardContent className="p-4 text-center">
                <Building2 className="h-8 w-8 text-neon-orange mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-orange-foreground">{overviewStats.totalSites}</div>
                <div className="text-sm text-neon-orange-foreground/70">Total Sites</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-cyber-wave border-cyber-pink/30">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
                <div className="text-2xl font-bold text-cyber-pink-foreground">{overviewStats.activeSites}</div>
                <div className="text-sm text-cyber-pink-foreground/70">Active Sites</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-neon-green border-neon-green/30">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-neon-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-green-foreground">{overviewStats.completedTasks}</div>
                <div className="text-sm text-neon-green-foreground/70">Completed Tasks</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-neon-yellow border-neon-yellow/30">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-neon-yellow mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-yellow-foreground">{overviewStats.pendingTasks}</div>
                <div className="text-sm text-neon-yellow-foreground/70">Pending Tasks</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-digital-rain border-neon-red/30">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-neon-red mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-red-foreground">{overviewStats.teamMembers}</div>
                <div className="text-sm text-neon-red-foreground/70">Team Members</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-matrix border-electric-blue/30">
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                <div className="text-2xl font-bold text-electric-blue-foreground">{overviewStats.activeVendors}</div>
                <div className="text-sm text-electric-blue-foreground/70">Active Vendors</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Vendors
            </TabsTrigger>
            <TabsTrigger value="checklists" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-primary">Active Projects Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.filter(p => ['implementing', 'testing'].includes(p.status || '')).slice(0, 5).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-accent/30">
                        <div>
                        <div className="font-medium text-foreground">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.description || 'No description'}</div>
                        </div>
                        <Badge variant="electric" className={project.status === 'implementing' ? 'bg-status-in-progress' : 'bg-neon-purple/20'}>
                          {project.status?.replace('-', ' ') || 'Unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Site Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sites.slice(0, 5).map((site) => (
                      <div key={site.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-accent/30">
                        <div>
                          <div className="font-medium text-foreground">{site.name}</div>
                          <div className="text-sm text-muted-foreground">{site.location || 'No location'}</div>
                        </div>
                        <Badge variant="outline" className="border-neon-green/30 text-neon-green">
                          {site.status || 'Unknown'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Enhanced Implementation Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedImplementationTracker 
                  projectId={selectedProject || projects[0]?.id || 'default'}
                  onUpdate={(result) => {
                    console.log('Implementation updated:', result);
                    toast.success('Implementation progress updated');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sites Tab */}
          <TabsContent value="sites" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-primary">
                  Site Management
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search sites..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="neon" onClick={handleCreateSite}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Site
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SitesTable
                  sites={filteredSites}
                  onEdit={handleSiteEdit}
                  onDelete={() => {}}
                  onViewDetails={handleSiteView}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Team Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Vendor Management</CardTitle>
              </CardHeader>
              <CardContent>
                <VendorManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checklists Tab */}
          <TabsContent value="checklists" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Enhanced Deployment Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedChecklistManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-primary">Professional Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfessionalDeploymentReportGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Site Creation Dialog */}
      <Dialog open={isCreateSiteOpen} onOpenChange={setIsCreateSiteOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
          </DialogHeader>
          <UnifiedSiteCreationWizard
            onComplete={handleSiteFormSubmit}
            onCancel={() => setIsCreateSiteOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Site Details Dialog */}
      <SiteDetailsDialog
        site={selectedSite}
        isOpen={isSiteDialogOpen}
        onClose={() => setIsSiteDialogOpen(false)}
        onEdit={handleSiteEdit}
      />
    </div>
  );
};

export default UnifiedTrackingCenter;