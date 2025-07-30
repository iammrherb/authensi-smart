
import ArchitectureDesigner from "@/components/designer/ArchitectureDesigner";
import { Badge } from "@/components/ui/badge";

const Designer = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🏗️ Zero Trust NAC Architecture Designer
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Design Your <span className="bg-gradient-primary bg-clip-text text-transparent">Network Architecture</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create comprehensive zero-trust network access control architectures with our AI-powered visual designer.
              Supports Portnox, Cisco, Aruba, Fortinet, and 50+ other vendors.
            </p>
          </div>
          
          <ArchitectureDesigner />
        </div>
      </div>
    </div>
  );
};

export default Designer;
