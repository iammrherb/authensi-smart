
import Header from "@/components/Header";
import TemplateLibrary from "@/components/templates/TemplateLibrary";
import { Badge } from "@/components/ui/badge";

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              📋 Template Library
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pre-built <span className="bg-gradient-primary bg-clip-text text-transparent">Portnox Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access our comprehensive library of pre-configured Portnox templates for common 
              deployment scenarios and industry-specific requirements.
            </p>
          </div>
          
          <TemplateLibrary />
        </div>
      </div>
    </div>
  );
};

export default Templates;
