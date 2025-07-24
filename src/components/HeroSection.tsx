import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-network-ai.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-secondary overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-glow rounded-full animate-pulse-glow opacity-20"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-glow rounded-full animate-pulse-glow opacity-20 animation-delay-1000"></div>
      </div>
      
      {/* Hero image background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="AI-powered network visualization" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <Badge variant="ai" className="mb-4">
            🚀 World's Best Portnox Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent leading-tight">
            Portnox ZTAC
            <br />
            <span className="bg-gradient-primary bg-clip-text">Ultimate Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The Ultimate Zero Trust Access Control platform for enterprise Portnox scoping, 
            POC management, deployment tracking, and implementation management. Complete project 
            lifecycle management with advanced automation and reporting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Designing
            </Button>
            <Button variant="glow" size="lg" className="text-lg px-8 py-4">
              View Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/30">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">90%</div>
              <div className="text-muted-foreground">Faster Design Process</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Successful Deployments</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Configuration Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
