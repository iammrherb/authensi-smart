
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProjectOverview = () => {
  const projects = [
    {
      id: "1",
      name: "Enterprise HQ Deployment",
      client: "Acme Corporation",
      status: "In Progress",
      progress: 65,
      phase: "Implementation",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      budget: "$150,000",
      spent: "$97,500",
    },
    {
      id: "2",
      name: "Healthcare Network Upgrade",
      client: "MediCare Systems",
      status: "Planning",
      progress: 25,
      phase: "Design",
      startDate: "2024-02-01",
      endDate: "2024-04-15",
      budget: "$200,000",
      spent: "$50,000",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <Button variant="default">New Project</Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium">Progress</div>
                  <div className="text-2xl font-bold text-primary">{project.progress}%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Current Phase</div>
                  <div className="text-lg font-semibold">{project.phase}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Timeline</div>
                  <div className="text-sm">{project.startDate} - {project.endDate}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Budget</div>
                  <div className="text-sm">{project.spent} / {project.budget}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectOverview;
