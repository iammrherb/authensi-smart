
import Header from "@/components/Header";
import PortnoxTracker from "@/components/tracker/PortnoxTracker";
import { Badge } from "@/components/ui/badge";

const Tracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              📊 Portnox Deployment Tracker
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track Your <span className="bg-gradient-primary bg-clip-text text-transparent">Portnox Deployments</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete project management for Portnox NAC implementations. Monitor progress, 
              track milestones, and ensure successful deployments with our comprehensive tracker.
            </p>
          </div>
          
          <PortnoxTracker />
        </div>
      </div>
    </div>
  );
};

export default Tracker;
