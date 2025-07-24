
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
              🎯 SCOPE SLAYER Command Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">POC TRACKER</span> • 
              <span className="text-foreground"> DEPLOYMENT MASTER</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              🎯 <strong>USE CASE MAESTRO</strong> - Your ultimate command center for Portnox ZTAC projects, 
              POC orchestration, deployment tracking, and implementation management.
            </p>
          </div>
          
          <ProjectDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
