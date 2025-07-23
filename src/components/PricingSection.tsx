import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    description: "Perfect for small teams and growing networks",
    highlight: false,
    features: [
      "Up to 50 network devices",
      "Basic configuration generation",
      "Standard troubleshooting assistant", 
      "Email support",
      "Basic AI optimization",
      "Community access"
    ]
  },
  {
    name: "Professional", 
    price: "$499",
    period: "/month",
    description: "Advanced AI capabilities for medium enterprises",
    highlight: true,
    features: [
      "Up to 500 network devices",
      "Advanced AI optimization",
      "Real-time monitoring & alerts",
      "Priority support",
      "API access",
      "Custom integrations",
      "Predictive analytics",
      "Performance dashboards"
    ]
  },
  {
    name: "Enterprise",
    price: "$1,999", 
    period: "/month",
    description: "Complete AI-powered platform for large organizations",
    highlight: false,
    features: [
      "Unlimited network devices",
      "Full AI suite with custom models",
      "Dedicated customer success manager",
      "On-premises deployment option",
      "Advanced security & compliance",
      "White-label options",
      "24/7 premium support",
      "Custom SLA agreements"
    ]
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="ai" className="mb-4">
            💰 Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your <span className="bg-gradient-primary bg-clip-text text-transparent">AI Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start with our free trial and scale as your network grows. 
            All plans include core AI capabilities with advanced features for larger deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-8 ${plan.highlight ? 'ring-2 ring-primary shadow-glow scale-105' : ''} hover:scale-105 transition-all duration-300`}
            >
              {plan.highlight && (
                <Badge variant="ai" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="mt-4">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.highlight ? "hero" : "glow"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Benefits */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">
            Proven ROI Across Enterprise Deployments
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">80%</div>
              <div className="text-sm text-muted-foreground">Reduction in configuration time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">90%</div>
              <div className="text-sm text-muted-foreground">Fewer authentication tickets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">60%</div>
              <div className="text-sm text-muted-foreground">Security posture improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50%</div>
              <div className="text-sm text-muted-foreground">Reduction in network downtime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;