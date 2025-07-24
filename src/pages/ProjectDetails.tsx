import React from 'react';
import Header from '@/components/Header';
import EnhancedProjectTracker from '@/components/projects/EnhancedProjectTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { ArrowLeft, Edit, Settings, Users, FileText } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
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
        <Header />
        <div className="pt-20">
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

  const handleEdit = () => {
    // Navigate to project edit page or open edit modal
    console.log('Edit project:', project.id);
  };

  const handleViewSites = () => {
    navigate('/sites', { state: { projectId: project.id } });
  };

  const handleViewTimeline = () => {
    console.log('View timeline for project:', project.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
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

            {/* Enhanced Project Tracker */}
            <EnhancedProjectTracker
              project={projectDetails}
              onEdit={handleEdit}
              onViewSites={handleViewSites}
              onViewTimeline={handleViewTimeline}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;