
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResourceTracking = () => {
  const teamMembers = [
    { name: "Alex Chen", role: "Project Manager", utilization: 85, projects: 3, status: "active" },
    { name: "Sarah Johnson", role: "Network Engineer", utilization: 92, projects: 2, status: "active" },
    { name: "Mike Rodriguez", role: "Security Specialist", utilization: 78, projects: 4, status: "active" },
    { name: "Emily Davis", role: "Implementation Lead", utilization: 95, projects: 2, status: "busy" },
    { name: "David Kim", role: "Technical Consultant", utilization: 67, projects: 3, status: "available" },
  ];

  const resources = [
    { category: "Hardware", allocated: 85, available: 15, total: 100 },
    { category: "Licenses", allocated: 72, available: 28, total: 100 },
    { category: "Bandwidth", allocated: 60, available: 40, total: 100 },
    { category: "Test Equipment", allocated: 90, available: 10, total: 100 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-primary";
      case "busy": return "text-destructive";
      case "available": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "bg-destructive";
    if (utilization >= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Resource Management
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Add Resource</Button>
        </div>
      </div>
      
      {/* Team Allocation */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 Team Allocation & Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{member.utilization}% Utilized</div>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getUtilizationColor(member.utilization)} transition-all duration-500`}
                        style={{ width: `${member.utilization}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{member.projects} Projects</div>
                    <div className={`text-xs capitalize ${getStatusColor(member.status)}`}>
                      {member.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Resource Allocation Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="text-center">
                <h4 className="font-semibold mb-3">{resource.category}</h4>
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${resource.allocated * 2.51} 251`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{resource.allocated}%</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Available: {resource.available}%
                  </div>
                  <div className="text-xs text-primary">
                    {resource.allocated}/{resource.total} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-accent/20 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📅</span>
              <span className="font-medium">Schedule Review</span>
              <span className="text-xs text-muted-foreground">Plan resource allocation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📈</span>
              <span className="font-medium">Performance Analytics</span>
              <span className="text-xs text-muted-foreground">View detailed metrics</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">Optimize Allocation</span>
              <span className="text-xs text-muted-foreground">AI-powered suggestions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceTracking;
