import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Clock, Target, Plus } from "lucide-react";
import { useProjects, useCreateProject } from "@/hooks/useProjects";

const ProjectOverview = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_name: "",
    status: "planning" as const,
    current_phase: "discovery" as const,
    start_date: "",
    target_completion: "",
    budget: ""
  });

  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();

  const handleCreateProject = () => {
    const projectData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      progress_percentage: 0
    };
    
    createProject.mutate(projectData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          client_name: "",
          status: "planning",
          current_phase: "discovery",
          start_date: "",
          target_completion: "",
          budget: ""
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "implementing": "default",
      "planning": "secondary", 
      "deployed": "outline",
      "maintenance": "outline",
      "scoping": "secondary",
      "designing": "secondary",
      "testing": "default"
    };
    return variants[status] || "outline";
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="scoping">Scoping</SelectItem>
                      <SelectItem value="designing">Designing</SelectItem>
                      <SelectItem value="implementing">Implementing</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phase">Phase</Label>
                  <Select
                    value={formData.current_phase}
                    onValueChange={(value) => setFormData({ ...formData, current_phase: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="scoping">Scoping</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="implementation">Implementation</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="target_completion">Target Completion</Label>
                  <Input
                    id="target_completion"
                    type="date"
                    value={formData.target_completion}
                    onChange={(e) => setFormData({ ...formData, target_completion: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="Enter budget amount"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateProject} disabled={createProject.isPending}>
                  {createProject.isPending ? "Creating..." : "Create Project"}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.client_name || "No client"}</p>
                </div>
                <Badge variant={getStatusBadge(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-2xl font-bold text-primary">{project.progress_percentage}%</div>
                  <Progress value={project.progress_percentage} className="h-2 mt-1" />
                </div>
                <div>
                  <div className="text-sm font-medium">Current Phase</div>
                  <div className="text-lg font-semibold">{project.current_phase}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Timeline</div>
                  <div className="text-sm">
                    {project.start_date && new Date(project.start_date).toLocaleDateString()}
                    {project.start_date && project.target_completion && " - "}
                    {project.target_completion && new Date(project.target_completion).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Budget</div>
                  <div className="text-sm">
                    {project.budget ? `$${project.budget.toLocaleString()}` : "Not set"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first project
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;