import QuestionnaireManager from "@/components/questionnaires/QuestionnaireManager";
import { Badge } from "@/components/ui/badge";

const Questionnaires = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              📋 Scoping Questionnaires
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="bg-gradient-primary bg-clip-text text-transparent">Project Scoping</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create, manage, and track detailed scoping questionnaires for all your Portnox NAC 
              deployments with use case validation and requirements gathering.
            </p>
          </div>
          
          <QuestionnaireManager />
        </div>
      </div>
    </div>
  );
};

export default Questionnaires;