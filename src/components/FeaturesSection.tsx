import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI-Powered Configuration",
    description: "Advanced LLMs generate optimized network configurations with vendor-specific syntax and best practices.",
    icon: "🧠",
    highlight: "GPT-4 Powered"
  },
  {
    title: "Real-Time Optimization", 
    description: "Continuous learning from network telemetry to automatically optimize performance and security.",
    icon: "⚡",
    highlight: "24/7 Learning"
  },
  {
    title: "Universal Vendor Support",
    description: "Comprehensive support for 50+ network vendors including Cisco, Aruba, Juniper, and Fortinet.",
    icon: "🌐",
    highlight: "Multi-Vendor"
  },
  {
    title: "Predictive Analytics",
    description: "AI-driven insights predict authentication issues and recommend proactive optimizations.",
    icon: "🔮",
    highlight: "Predictive AI"
  },
  {
    title: "Zero-Touch Deployment",
    description: "Automated configuration generation, validation, and deployment with intelligent rollback.",
    icon: "🚀",
    highlight: "Automated"
  },
  {
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant with end-to-end encryption and comprehensive audit logging.",
    icon: "🔒",
    highlight: "Enterprise Grade"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="glow" className="mb-4">
            Core Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Driven Network <span className="bg-gradient-primary bg-clip-text text-transparent">Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leverage cutting-edge AI to transform how you manage network authentication, 
            configuration, and optimization across your entire infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:scale-105 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <Badge variant="glow" className="text-xs">
                    {feature.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;