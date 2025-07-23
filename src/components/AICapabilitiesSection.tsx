import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const aiCapabilities = [
  {
    category: "Configuration Intelligence",
    features: [
      "Multi-vendor AI models trained on 500K+ configurations",
      "Context-aware generation with network topology analysis", 
      "Real-time syntax validation and optimization",
      "Compliance alignment with SOX, PCI-DSS, HIPAA"
    ],
    icon: "⚙️"
  },
  {
    category: "Predictive Analytics",
    features: [
      "Anomaly detection using ML pattern recognition",
      "Performance degradation prediction",
      "Security threat identification through auth patterns",
      "Capacity planning with usage trend analysis"
    ],
    icon: "📊"
  },
  {
    category: "Natural Language Processing",
    features: [
      "Chat-based configuration generation",
      "Plain English troubleshooting queries",
      "Automated documentation generation",
      "Voice-to-config capability"
    ],
    icon: "💬"
  },
  {
    category: "Continuous Learning",
    features: [
      "24/7 network telemetry analysis",
      "Configuration effectiveness scoring",
      "Automated optimization recommendations",
      "Self-healing configuration updates"
    ],
    icon: "🔄"
  }
];

const AICapabilitiesSection = () => {
  return (
    <section id="ai-capabilities" className="py-24 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="ai" className="mb-4">
            🤖 Advanced AI Engine
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Next-Generation <span className="bg-gradient-primary bg-clip-text text-transparent">AI Capabilities</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI engine combines multiple specialized models to deliver unprecedented 
            network authentication intelligence and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {aiCapabilities.map((capability, index) => (
            <Card key={index} className="p-8 hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{capability.icon}</div>
                  <CardTitle className="text-2xl">{capability.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {capability.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Experience the AI Revolution in Network Management
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            See how our AI-powered platform can transform your network authentication 
            infrastructure with a personalized demonstration.
          </p>
          <Button variant="hero" size="lg">
            Schedule AI Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AICapabilitiesSection;