
import Header from "@/components/Header";
import ProjectDashboard from "@/components/dashboard/ProjectDashboard";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              📈 Project Dashboard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Project <span className="bg-gradient-primary bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive overview of all your Portnox projects, deployments, and performance metrics 
              in one centralized dashboard.
            </p>
          </div>
          
          <ProjectDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
