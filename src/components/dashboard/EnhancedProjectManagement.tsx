import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import {
  Building2, Clock, Target, Users, AlertTriangle, CheckCircle,
  TrendingUp, FileText, Brain, Zap, Settings, Calendar,
  ArrowRight, Plus, Filter, Search, RefreshCw
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import SmartProjectInsights from '@/components/ai/SmartProjectInsights';

interface ProjectOverviewProps {
  onCreateProject?: () => void;
  onProjectSelect?: (projectId: string) => void;
}

const EnhancedProjectManagement: React.FC<ProjectOverviewProps> = ({
  onCreateProject,
  onProjectSelect
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: projects = [], isLoading } = useProjects();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'in-progress': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'on-hold': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'cancelled': 'bg-red-500/10 text-red-500 border-red-500/20'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getPhaseColor = (phase: string) => {
    const colors = {
      'discovery': 'text-blue-500',
      'scoping': 'text-purple-500',
      'design': 'text-cyan-500',
      'implementation': 'text-orange-500',
      'testing': 'text-yellow-500',
      'deployment': 'text-green-500',
      'maintenance': 'text-gray-500'
    };
    return colors[phase as keyof typeof colors] || 'text-gray-500';
  };

  const selectedProjectData = selectedProject 
    ? projects.find(p => p.id === selectedProject)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Project <span className="bg-gradient-primary bg-clip-text text-transparent">Management</span>
          </h2>
          <p className="text-muted-foreground">
            AI-powered project tracking and management for NAC deployments
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <EnhancedButton
            onClick={onCreateProject}
            gradient="primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </EnhancedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.current_phase === 'implementation').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'planning').length}
                </div>
                <div className="text-sm text-muted-foreground">In Planning</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(projects.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / projects.length || 0)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Project Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="planning">Smart Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <EnhancedCard 
                key={project.id} 
                glass
                className="cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedProject(project.id);
                  onProjectSelect?.(project.id);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.client_name || 'Unknown Client'}</p>
                    </div>
                    <Badge className={getStatusColor(project.status || 'planning')}>
                      {project.status?.replace('-', ' ') || 'Planning'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress_percentage || 0}%</span>
                    </div>
                    <Progress value={project.progress_percentage || 0} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Sites</div>
                      <div className="font-medium">{project.total_sites || 0}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Endpoints</div>
                      <div className="font-medium">{project.total_endpoints || 0}</div>
                    </div>
                  </div>

                  {/* Current Phase */}
                  <div className="flex items-center space-x-2">
                    <Clock className={`h-4 w-4 ${getPhaseColor(project.current_phase || 'discovery')}`} />
                    <span className="text-sm capitalize">
                      {project.current_phase?.replace('-', ' ') || 'Discovery'} Phase
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Insights
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Scoping
                    </Button>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>

          {projects.length === 0 && (
            <EnhancedCard glass className="text-center py-12">
              <CardContent>
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get started by creating your first NAC deployment project. Our AI-powered wizard will guide you through the process.
                </p>
                <EnhancedButton
                  onClick={onCreateProject}
                  gradient="primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </EnhancedButton>
              </CardContent>
            </EnhancedCard>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {selectedProjectData ? (
            <SmartProjectInsights
              projectData={{
                ...selectedProjectData,
                client_name: selectedProjectData.client_name || 'Unknown Client',
                industry: selectedProjectData.industry || 'Unknown',
                deployment_type: selectedProjectData.deployment_type || 'unknown',
                security_level: selectedProjectData.security_level || 'standard',
                current_phase: selectedProjectData.current_phase || 'discovery',
                success_criteria: selectedProjectData.success_criteria || [],
                pain_points: selectedProjectData.pain_points || [],
                total_sites: selectedProjectData.total_sites || 0,
                total_endpoints: selectedProjectData.total_endpoints || 0
              }}
              useCases={useCases}
              vendors={[]}
            />
          ) : (
            <EnhancedCard glass className="text-center py-12">
              <CardContent>
                <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a Project for AI Insights</h3>
                <p className="text-muted-foreground">
                  Choose a project from the overview tab to view intelligent analysis and recommendations.
                </p>
              </CardContent>
            </EnhancedCard>
          )}
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Use Cases Library Integration */}
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Available Use Cases</span>
                  <Badge variant="secondary">{useCases.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {useCases.slice(0, 10).map((useCase) => (
                      <div key={useCase.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{useCase.name}</div>
                            <div className="text-xs text-muted-foreground">{useCase.category}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {useCase.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {useCase.complexity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse All Use Cases
                  </Button>
                </div>
              </CardContent>
            </EnhancedCard>

            {/* Requirements Library Integration */}
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Requirements Library</span>
                  <Badge variant="secondary">{requirements.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {requirements.slice(0, 10).map((req) => (
                      <div key={req.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{req.title}</div>
                            <div className="text-xs text-muted-foreground">{req.category}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {req.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {req.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Browse All Requirements
                  </Button>
                </div>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* AI Planning Tools */}
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Planning Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-medium">Smart Scoping</span>
                  <span className="text-xs text-muted-foreground text-center">
                    AI-powered project scoping wizard
                  </span>
                </EnhancedButton>

                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span className="font-medium">Timeline Planning</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Intelligent timeline generation
                  </span>
                </EnhancedButton>

                <EnhancedButton variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <Target className="h-6 w-6 text-primary" />
                  <span className="font-medium">Resource Planning</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Optimize resource allocation
                  </span>
                </EnhancedButton>
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProjectManagement;