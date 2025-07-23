
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProjectDashboard = () => {
  const stats = [
    { label: "Active Projects", value: "8", change: "+2", trend: "up" },
    { label: "Completed Deployments", value: "24", change: "+4", trend: "up" },
    { label: "Success Rate", value: "96%", change: "+2%", trend: "up" },
    { label: "Avg. Deployment Time", value: "6.2 weeks", change: "-0.8", trend: "down" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
                <Badge variant={stat.trend === "up" ? "default" : "secondary"}>
                  {stat.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Comprehensive project dashboard with real-time metrics and analytics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;
