
import Header from "@/components/Header";
import PortnoxTracker from "@/components/tracker/PortnoxTracker";
import { Badge } from "@/components/ui/badge";

const Tracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modern Header Section */}
      <div className="pt-20 pb-8 bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl"></div>
            
            <div className="relative text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-2xl">📊</span>
                </div>
                <Badge variant="glow" className="text-sm px-4 py-2">
                  Enterprise Deployment Suite
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Implementation
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Command Center
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Comprehensive project management for Portnox NAC deployments. Monitor real-time progress, 
                track critical milestones, manage resources, and ensure successful enterprise implementations 
                with our advanced tracking and analytics platform.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">97%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <PortnoxTracker />
      </div>
    </div>
  );
};

export default Tracker;
