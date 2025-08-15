import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Settings, Users, FileText, BarChart3, Building } from 'lucide-react';
import EnhancedProjectTracker from '@/components/projects/EnhancedProjectTracker';
import PhaseManagementPanel from '@/components/projects/PhaseManagementPanel';
import { useSites } from '@/hooks/useSites';

const SiteDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sites = [], isLoading } = useSites();
  
  const site = sites.find(s => s.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Site Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The site you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => navigate('/sites')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sites
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Transform site data to match EnhancedProjectTracker interface
  const siteAsProject = {
    id: site.id,
    name: site.name,
    customer: 'Site Owner', // Sites don't have customers, use placeholder
    type: (site.site_type === 'main' ? 'Production' : 
           site.site_type === 'branch' ? 'Pilot' : 'POC') as "POC" | "Pilot" | "Production",
    status: (site.status === 'planning' ? 'Planning' :
             site.status === 'scoping' || site.status === 'designing' || site.status === 'implementing' ? 'Active' :
             site.status === 'deployed' ? 'Completed' : 'On-Hold') as "Planning" | "Active" | "Completed" | "On-Hold",
    start_date: '', // Sites don't have start_date in current schema
    target_date: '', // Sites don't have target_completion in current schema
    current_phase: site.current_phase || 'discovery',
    overall_progress: site.progress_percentage || 0,
    budget: undefined, // Sites don't have budgets in current schema
    spent_budget: undefined,
    team_size: 3, // Mock team size for sites
    sites_count: 1, // Always 1 for individual site
    endpoints_count: site.device_count || 0,
  };

  // Sample phases for sites
  const sitePhases = [
    {
      id: "site-survey",
      name: "Site Survey & Assessment",
      status: "completed" as const,
      progress: 100,
      start_date: "2025-01-01",
      end_date: "2025-01-07",
      estimated_duration: 7,
      dependencies: [],
      deliverables: ["Network Survey", "Infrastructure Assessment", "Requirements Gathering"],
      assigned_team: ["Site Engineer", "Network Specialist"]
    },
    {
      id: "site-design",
      name: "Site Design & Configuration",
      status: "in-progress" as const,
      progress: 60,
      start_date: "2025-01-08",
      estimated_duration: 14,
      dependencies: ["site-survey"],
      deliverables: ["Network Design", "Security Policies", "Device Configuration"],
      assigned_team: ["Network Engineer", "Security Specialist"]
    },
    {
      id: "site-implementation",
      name: "Site Implementation",
      status: "not-started" as const,
      progress: 0,
      estimated_duration: 21,
      dependencies: ["site-design"],
      deliverables: ["Device Installation", "Network Configuration", "Testing Results"],
      assigned_team: ["Implementation Team", "Field Engineer"]
    }
  ];

  // Sample milestones for sites
  const siteMilestones = [
    {
      id: "survey-complete",
      name: "Site Survey Complete",
      date: "2025-01-07",
      status: "completed" as const,
      description: "Comprehensive site assessment and network inventory completed",
      phase_id: "site-survey"
    },
    {
      id: "design-review",
      name: "Design Review & Approval",
      date: "2025-01-20",
      status: "pending" as const,
      description: "Technical design review and stakeholder approval",
      phase_id: "site-design"
    },
    {
      id: "go-live",
      name: "Site Go-Live",
      date: "2025-02-15",
      status: "pending" as const,
      description: "Site fully operational and handed over to operations team",
      phase_id: "site-implementation"
    }
  ];

  const handleEdit = () => {
    // Navigate to site edit page or open edit modal
    console.log('Edit site:', site.id);
  };

  const handleViewTeam = () => {
    navigate('/users', { state: { siteId: site.id } });
  };

  const handleViewReports = () => {
    navigate('/reports', { state: { siteId: site.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/sites')}
                className="p-1 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Sites
              </Button>
              <span>/</span>
              <span className="text-foreground font-medium">{site.name}</span>
            </div>

            {/* Site Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{site.name}</h1>
                  <p className="text-muted-foreground">
                    {site.location} • {site.site_type} site
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Site
                </Button>
                <Button variant="outline" onClick={handleViewTeam}>
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </Button>
                <Button variant="outline" onClick={handleViewReports}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </div>
            </div>

            {/* Site Tracker (using same component as projects) */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="phases">Phases & Milestones</TabsTrigger>
                <TabsTrigger value="implementation">Implementation</TabsTrigger>
                <TabsTrigger value="settings">Site Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <EnhancedProjectTracker
                  project={siteAsProject}
                  onEdit={handleEdit}
                  onViewSites={() => navigate('/sites')}
                  onViewTimeline={() => console.log('View timeline')}
                />
              </TabsContent>

              <TabsContent value="phases">
                <PhaseManagementPanel
                  projectId={site.id}
                  phases={sitePhases}
                  milestones={siteMilestones}
                  onUpdatePhase={(phase) => console.log('Update phase:', phase)}
                  onUpdateMilestone={(milestone) => console.log('Update milestone:', milestone)}
                />
              </TabsContent>

              <TabsContent value="implementation">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Detailed implementation tracking and checklist management for this site.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to={`/tracker?site=${site.id}`}>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Implementation Workbook
                        </Button>
                      </Link>
                      <Link to={`/questionnaires?site=${site.id}`}>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Scoping Questionnaire
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Site Type</label>
                          <p className="text-sm text-muted-foreground capitalize">{site.site_type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <Badge variant="outline" className="ml-2 capitalize">{site.priority}</Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <p className="text-sm text-muted-foreground">{site.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Site Status</label>
                        <p className="text-sm text-muted-foreground capitalize">{site.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;