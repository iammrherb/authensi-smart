import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Settings, Zap, Network, Shield, FileText, Target } from 'lucide-react';
import ConfigWizardDialog from "@/components/config/ConfigWizardDialog";

const AIConfigCenter = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Generation",
      description: "Intelligent configuration creation with vendor-specific optimizations and best practices."
    },
    {
      icon: Network,
      title: "Multi-Vendor Support",
      description: "Support for Cisco, Aruba, Juniper, and other major network vendors with precise syntax."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Built-in security best practices, compliance frameworks, and advanced threat protection."
    },
    {
      icon: Target,
      title: "Scenario-Based",
      description: "Pre-configured scenarios for common use cases: BYOD, IoT, Guest Access, and more."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <Badge variant="glow" className="mb-4">
              <Bot className="h-4 w-4 mr-2" />
              AI Configuration Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Intelligent <span className="bg-gradient-primary bg-clip-text text-transparent">Config Generation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate comprehensive 802.1X network access control configurations with AI-powered recommendations, 
              vendor-specific optimization, and intelligent best practices.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => setIsWizardOpen(true)}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-4 text-lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Start Configuration Wizard
              <Zap className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 rounded-lg bg-primary/10 w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                Advanced Configuration Features
              </CardTitle>
              <CardDescription className="text-lg">
                Comprehensive toolset for enterprise-grade network access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Authentication Methods</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 802.1X with EAP variants</li>
                    <li>• MAC Authentication Bypass</li>
                    <li>• Web Authentication</li>
                    <li>• Certificate-based Auth</li>
                    <li>• Multi-Factor Authentication</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Advanced Scenarios</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Zero Trust Architecture</li>
                    <li>• IoT Device Profiling</li>
                    <li>• BYOD & Guest Access</li>
                    <li>• Healthcare & Industrial</li>
                    <li>• Compliance & Privacy</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Enterprise Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Dynamic VLAN Assignment</li>
                    <li>• RADIUS Load Balancing</li>
                    <li>• CoA & Policy Updates</li>
                    <li>• Troubleshooting Guides</li>
                    <li>• Compliance Validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfigWizardDialog 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
};

export default AIConfigCenter;