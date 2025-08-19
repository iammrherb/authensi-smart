import React, { useState } from 'react';
import EnhancedProjectTracker from '@/components/projects/EnhancedProjectTracker';
import ProjectEditDialog from '@/components/projects/ProjectEditDialog';
import PhaseManagementPanel from '@/components/projects/PhaseManagementPanel';
import CustomerPortalAccess from '@/components/projects/CustomerPortalAccess';
import ProjectTemplateManager from '@/components/projects/ProjectTemplateManager';
import ProjectKnowledgeManager from '@/components/projects/ProjectKnowledgeManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { ArrowLeft, Edit, Settings, Users, FileText, BarChart3, Folder } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, refetch } = useProject(id || '');
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The project you're looking for doesn't exist or you don't have access to it.
                </p>
                <Button onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Transform project data to match EnhancedProjectTracker interface
  const projectDetails = {
    id: project.id,
    name: project.name,
    customer: project.client_name || 'Unknown Client',
    type: (project.current_phase === 'scoping' ? 'POC' : 
           project.current_phase === 'testing' ? 'Pilot' : 'Production') as "POC" | "Pilot" | "Production",
    status: (project.status === 'planning' ? 'Planning' :
             project.status === 'scoping' || project.status === 'designing' || project.status === 'implementing' ? 'Active' :
             project.status === 'deployed' ? 'Completed' : 'On-Hold') as "Planning" | "Active" | "Completed" | "On-Hold",
    start_date: project.start_date || '',
    target_date: project.target_completion || '',
    current_phase: project.current_phase || 'discovery',
    overall_progress: project.progress_percentage || 0,
    budget: project.budget,
    spent_budget: project.budget ? Math.floor(project.budget * 0.3) : undefined, // Mock spent budget
    team_size: 5, // Mock team size
    sites_count: 3, // Mock sites count - would come from project sites query
    endpoints_count: 150, // Mock endpoints count - would come from project configuration
  };

  // Sample phases data for the project
  const projectPhases = [
    {
      id: "discovery",
      name: "Discovery & Planning",
      status: "completed" as const,
      progress: 100,
      start_date: "2025-01-01",
      end_date: "2025-01-14",
      estimated_duration: 14,
      dependencies: [],
      deliverables: ["Network Assessment", "Requirements Document", "Project Plan"],
      assigned_team: ["Lead Architect", "Network Engineer"]
    },
    {
      id: "design",
      name: "Design & Architecture",
      status: "in-progress" as const,
      progress: 75,
      start_date: "2025-01-15",
      estimated_duration: 21,
      dependencies: ["discovery"],
      deliverables: ["Technical Design", "Security Policies", "Integration Plan"],
      assigned_team: ["Lead Architect", "Security Specialist"]
    },
    {
      id: "implementation",
      name: "Implementation & Testing",
      status: "not-started" as const,
      progress: 0,
      estimated_duration: 42,
      dependencies: ["design"],
      deliverables: ["System Implementation", "Testing Reports", "Documentation"],
      assigned_team: ["Implementation Team", "QA Team"]
    }
  ];

  // Sample milestones data for the project
  const projectMilestones = [
    {
      id: "requirements-signed",
      name: "Requirements Sign-off",
      date: "2025-01-14",
      status: "completed" as const,
      description: "All project requirements have been documented and approved",
      phase_id: "discovery"
    },
    {
      id: "design-review",
      name: "Design Review Complete",
      date: "2025-02-05",
      status: "pending" as const,
      description: "Technical design review and stakeholder approval",
      phase_id: "design"
    },
    {
      id: "pilot-deployment",
      name: "Pilot Deployment",
      date: "2025-03-15",
      status: "pending" as const,
      description: "Pilot site deployment and initial testing",
      phase_id: "implementation"
    }
  ];

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleViewSites = () => {
    navigate('/sites', { state: { projectId: project.id } });
  };

  const handleViewTimeline = () => {
    console.log('View timeline for project:', project.id);
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
                onClick={() => navigate('/dashboard')}
                className="p-1 h-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <span>/</span>
              <span>Projects</span>
              <span>/</span>
              <span className="text-foreground font-medium">{project.name}</span>
            </div>

            {/* Project Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>
                  <p className="text-muted-foreground">
                    {project.client_name} • {project.current_phase} phase
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button variant="outline" onClick={handleViewSites}>
                  <Settings className="h-4 w-4 mr-2" />
                  Sites
                </Button>
                <Button variant="outline" onClick={() => navigate(`/reports?project=${project.id}`)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </div>
            </div>

            {/* Project Management Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="phases">Phases & Milestones</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <EnhancedProjectTracker
                  project={projectDetails}
                  onEdit={handleEdit}
                  onViewSites={handleViewSites}
                  onViewTimeline={handleViewTimeline}
                />
              </TabsContent>

              <TabsContent value="phases">
                <PhaseManagementPanel
                  projectId={project.id}
                  phases={projectPhases}
                  milestones={projectMilestones}
                  onUpdatePhase={(phase) => console.log('Update phase:', phase)}
                  onUpdateMilestone={(milestone) => console.log('Update milestone:', milestone)}
                />
              </TabsContent>

              <TabsContent value="templates">
                <ProjectTemplateManager 
                  projectId={project.id}
                  onTemplateAssigned={(templateId) => console.log('Template assigned:', templateId)}
                />
              </TabsContent>

              <TabsContent value="knowledge">
                <ProjectKnowledgeManager projectId={project.id} />
              </TabsContent>

              <TabsContent value="sites">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Sites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage and track implementation across all project sites.
                    </p>
                    <Button onClick={handleViewSites}>
                      <Settings className="h-4 w-4 mr-2" />
                      View All Sites
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <Badge variant="outline" className="ml-2">{project.status}</Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Current Phase</label>
                            <p className="text-sm text-muted-foreground capitalize">{project.current_phase}</p>
                          </div>
                        </div>
                        {project.description && (
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <CustomerPortalAccess 
                    project={{
                      id: project.id,
                      name: project.name,
                      customer_portal_id: project.customer_portal_id,
                      customer_portal_enabled: project.customer_portal_enabled || false,
                      customer_access_expires_at: project.customer_access_expires_at,
                      customer_organization: project.customer_organization || project.client_name
                    }}
                    onUpdate={() => refetch()}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Project Edit Dialog */}
            <ProjectEditDialog
              project={project}
              isOpen={showEditDialog}
              onClose={() => setShowEditDialog(false)}
              onUpdate={() => {
                refetch();
                setShowEditDialog(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;