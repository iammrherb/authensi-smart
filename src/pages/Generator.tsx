
import Header from "@/components/Header";
import AIConfigGenerator from "@/components/generator/AIConfigGenerator";
import { Badge } from "@/components/ui/badge";

const Generator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🤖 AI Configuration Generator
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Generate <span className="bg-gradient-primary bg-clip-text text-transparent">Smart Configurations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage GPT-4 powered AI to generate optimized Portnox configurations, policies, 
              and deployment scripts tailored to your specific network requirements.
            </p>
          </div>
          
          <AIConfigGenerator />
        </div>
      </div>
    </div>
  );
};

export default Generator;
