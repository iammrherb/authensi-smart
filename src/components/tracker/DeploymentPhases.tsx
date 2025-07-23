
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DeploymentPhases = () => {
  const phases = [
    { name: "Discovery", status: "completed", duration: "2 weeks", description: "Network assessment and requirements gathering" },
    { name: "Design", status: "completed", duration: "1 week", description: "Architecture design and policy planning" },
    { name: "Implementation", status: "in-progress", duration: "3 weeks", description: "Portnox installation and configuration" },
    { name: "Testing", status: "pending", duration: "1 week", description: "Comprehensive testing and validation" },
    { name: "Go-Live", status: "pending", duration: "1 week", description: "Production deployment and monitoring" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Deployment Phases</h2>
      
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={index} className={phase.status === "in-progress" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{phase.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    phase.status === "completed" ? "default" :
                    phase.status === "in-progress" ? "secondary" : "outline"
                  }>
                    {phase.status}
                  </Badge>
                  <Badge variant="outline">{phase.duration}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{phase.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeploymentPhases;
