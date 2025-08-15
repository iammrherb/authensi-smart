import React, { useState } from 'react';
import UnifiedIntelligentConfigWizard from "@/components/config/UnifiedIntelligentConfigWizard";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

const SmartConfigCenter = () => {
  const [projectId] = useState<string | undefined>(undefined);
  const [siteId] = useState<string | undefined>(undefined);

  const handleConfigSave = (config: any) => {
    console.log('Configuration saved:', config);
    // Handle save logic here
  };

  const handleConfigCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <div className="pt-8 pb-8 bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl"></div>
            
            <div className="relative text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Brain className="text-2xl text-primary-foreground animate-pulse" />
                </div>
                <Badge variant="glow" className="text-sm px-4 py-2">
                  Intelligent Configuration Suite
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Smart Config
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Generator Hub
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Revolutionary Smart-powered 802.1X configuration generation. Create, manage, and deploy 
                enterprise-grade network access control configurations with intelligent automation, 
                best practices, and seamless integration across your entire infrastructure.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Smart-Powered</div>
                  <div className="text-sm text-muted-foreground">Intelligent Generation</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Enterprise</div>
                  <div className="text-sm text-muted-foreground">Grade Security</div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">Automated</div>
                  <div className="text-sm text-muted-foreground">Best Practices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Unified Configuration Interface */}
        <div className="w-full">
          <UnifiedIntelligentConfigWizard
            projectId={projectId}
            siteId={siteId}
            onSave={handleConfigSave}
            onCancel={handleConfigCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default SmartConfigCenter;