import RequirementsManagement from "@/components/requirements/RequirementsManagement";
import { Badge } from "@/components/ui/badge";

const Requirements = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              📄 Requirements Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Requirements Library</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Centralized repository of technical requirements, compliance standards, use cases, 
              and prerequisites for successful NAC deployments across all environments.
            </p>
          </div>
          
          <RequirementsManagement />
        </div>
      </div>
    </div>
  );
};

export default Requirements;