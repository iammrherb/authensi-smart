
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkflowTimelineProps {
  vendor: string;
}

const WorkflowTimeline = ({ vendor }: WorkflowTimelineProps) => {
  const workflowSteps = [
    {
      id: "1",
      title: "Discovery & Assessment",
      description: "Network inventory and security assessment",
      status: "completed",
      duration: "2 weeks",
      tasks: ["Network scanning", "Asset inventory", "Security audit", "Requirements gathering"],
    },
    {
      id: "2",
      title: "Architecture Design",
      description: "Design zero-trust NAC architecture",
      status: "completed",
      duration: "1 week",
      tasks: ["Network topology", "Policy design", "Integration planning", "Security zones"],
    },
    {
      id: "3",
      title: "Configuration Generation",
      description: "AI-powered configuration creation",
      status: "in-progress",
      duration: "3 days",
      tasks: ["Policy configuration", "Network device config", "Integration setup", "Testing scenarios"],
    },
    {
      id: "4",
      title: "Testing & Validation",
      description: "Comprehensive testing in lab environment",
      status: "pending",
      duration: "1 week",
      tasks: ["Lab deployment", "Functionality testing", "Performance testing", "Security validation"],
    },
    {
      id: "5",
      title: "Production Deployment",
      description: "Phased rollout to production",
      status: "pending",
      duration: "2 weeks",
      tasks: ["Pilot deployment", "Monitoring setup", "User training", "Full rollout"],
    },
    {
      id: "6",
      title: "Post-Deployment",
      description: "Monitoring and optimization",
      status: "pending",
      duration: "Ongoing",
      tasks: ["Performance monitoring", "Policy optimization", "User support", "Documentation"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Deployment Workflow</h3>
        <Button variant="outline" size="sm">
          Export Timeline
        </Button>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`w-8 h-8 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-white font-bold text-sm z-10`}>
                {step.status === "completed" ? "✓" : index + 1}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <Card className={step.status === "in-progress" ? "border-primary" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{step.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(step.status)}
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Key Tasks:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {step.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              step.status === "completed" ? "bg-green-500" :
                              step.status === "in-progress" ? "bg-blue-500" : "bg-gray-400"
                            }`}></div>
                            <span className="text-xs">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {step.status === "in-progress" && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Progress: 60%</span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">2</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">1</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">3</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6-8</div>
              <div className="text-xs text-muted-foreground">Weeks Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTimeline;
