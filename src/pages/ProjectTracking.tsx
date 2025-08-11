import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectTrackingDashboard from "@/components/projects/ProjectTrackingDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortnoxKeyManager from "@/components/portnox/PortnoxKeyManager";
import PortnoxApiExplorer from "@/components/portnox/PortnoxApiExplorer";
import BulkApiRunner from "@/components/portnox/BulkApiRunner";
import DevicesExplorer from "@/components/portnox/DevicesExplorer";
const ProjectTracking = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(projectId!);

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
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Project Tracking</h1>
          <p className="text-muted-foreground">Monitor progress for {project.name}</p>
        </div>
      </div>

      <ProjectTrackingDashboard projectId={projectId!} projectData={project} />

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
    </div>
  );
};

export default ProjectTracking;