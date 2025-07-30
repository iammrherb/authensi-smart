import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Bot } from "lucide-react";
import IntelligentAIScopingWizard from "@/components/scoping/IntelligentAIScopingWizard";
import AIAssistant from "@/components/ai/AIAssistant";
import { PageLayout } from "@/components/layout/PageLayout";

const ProjectScoping = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(projectId!);

  const handleScopingComplete = (projectId: string, scopingData: any) => {
    navigate(`/project/${projectId}/tracking`);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return <div className="p-6">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
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
    );
  }

  return (
    <PageLayout noPadding fullWidth>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <EnhancedButton variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </EnhancedButton>
          <div>
            <h1 className="text-2xl font-bold">
              Project <span className="bg-gradient-primary bg-clip-text text-transparent">Scoping</span>
            </h1>
            <p className="text-muted-foreground">Configure detailed scoping for {project.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Project: {project.name}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Client: {project.client_name || "No client specified"} | 
                  Status: {project.status} | 
                  Phase: {project.current_phase}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This AI-powered scoping wizard will analyze your project requirements and generate 
                  comprehensive project plans, timelines, milestones, and tracking criteria specific to this project.
                </p>
              </CardContent>
            </EnhancedCard>

            <IntelligentAIScopingWizard
              projectId={projectId!}
              onComplete={handleScopingComplete}
              onCancel={handleCancel}
            />
          </div>

          <div className="space-y-6">
            <EnhancedCard glass>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Scoping Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIAssistant 
                  context="scoping" 
                  projectId={projectId}
                  className="h-[500px]" 
                /> 
              </CardContent>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectScoping;