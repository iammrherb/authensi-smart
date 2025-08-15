import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, Brain, Building2, MapPin, Settings, FileText, 
  Plus, ArrowLeft, TrendingUp, Activity, CheckSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import consolidated components
import ProjectManagementHub from '@/components/management/ProjectManagementHub';
import UltimateAIScopingWizard from '@/components/scoping/UltimateAIScopingWizard';
import UnifiedProjectCreationWizard from '@/components/unified/UnifiedProjectCreationWizard';
import ComprehensiveImplementationTracker from '@/components/tracker/ComprehensiveImplementationTracker';
import SitesTable from '@/components/sites/SitesTable';
import ProfessionalDeploymentReportGenerator from '@/components/tracker/ProfessionalDeploymentReportGenerator';
import ChecklistManager from '@/components/tracker/ChecklistManager';

const ProjectManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'dashboard' | 'ai-scoping' | 'create-project' | 'project-detail'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [scopingData, setScopingData] = useState<any>(null);

  // Handle AI Scoping completion
  const handleScopingComplete = (sessionId: string, data: any) => {
    setScopingData(data);
    setCurrentView('create-project');
    toast({
      title: "Scoping Complete",
      description: "Your project has been scoped. Now let's create it!"
    });
  };

  // Handle project creation
  const handleProjectCreate = (projectData: any) => {
    setSelectedProjectId(projectData.id);
    setCurrentView('project-detail');
    setScopingData(null);
    toast({
      title: "Project Created",
      description: `${projectData.name} has been created successfully!`
    });
  };

  // Render AI Scoping Wizard
  if (currentView === 'ai-scoping') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Manager
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Project Scoping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UltimateAIScopingWizard 
                onComplete={handleScopingComplete}
                onSave={handleScopingComplete}
                onCancel={() => setCurrentView('dashboard')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Project Creation Wizard
  if (currentView === 'create-project') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Manager
            </Button>
            {scopingData && (
              <Badge variant="outline">From AI Scoping</Badge>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Create New Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedProjectCreationWizard 
                scopingData={scopingData}
                onComplete={handleProjectCreate}
                onCancel={() => setCurrentView('dashboard')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Project Detail View
  if (currentView === 'project-detail' && selectedProjectId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project Manager
            </Button>
            <Badge variant="outline">Project: {selectedProjectId}</Badge>
          </div>

          <Tabs defaultValue="tracking" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="tracking" className="flex items-center gap-2">
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
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <ComprehensiveImplementationTracker />
            </TabsContent>

            <TabsContent value="sites">
              <Card>
                <CardHeader>
                  <CardTitle>Site Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Site management functionality will be integrated here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <ProfessionalDeploymentReportGenerator />
            </TabsContent>

            <TabsContent value="checklists">
              <ChecklistManager />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Project configuration and settings will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-8 pb-6 bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <Badge variant="glow" className="text-sm px-4 py-2">
                Project Manager
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              Project
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                Management Hub
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Everything you need to create, scope, track, and manage your NAC projects in one simple interface.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 border-transparent hover:border-primary/20" 
            onClick={() => setCurrentView('ai-scoping')}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Start with AI Scoping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Let AI analyze your requirements and scope your project automatically
              </p>
              <Badge variant="secondary" className="mt-3">
                Recommended
              </Badge>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 border-transparent hover:border-primary/20" 
            onClick={() => setCurrentView('create-project')}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Create Project Directly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a new project with manual configuration and setup
              </p>
              <Badge variant="outline" className="mt-3">
                Quick Start
              </Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 border-transparent hover:border-primary/20">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">View Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See project performance, completion rates, and insights
              </p>
              <Badge variant="outline" className="mt-3">
                Coming Soon
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              All Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectManagementHub />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectManager;