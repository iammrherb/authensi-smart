import React, { useState } from 'react';
import OneXerConfigWizard from "@/components/config/OneXerConfigWizard";
import EnhancedConfigTemplateManager from "@/components/config/EnhancedConfigTemplateManager";
import ConfigGeneratorManager from "@/components/config/ConfigGeneratorManager";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Settings, FileText, Sparkles, Zap, Target } from "lucide-react";

const SmartConfigCenter = () => {
  const [activeTab, setActiveTab] = useState("wizard");
  const [searchTerm, setSearchTerm] = useState("");

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="wizard" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Config Wizard
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wizard" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Intelligent Configuration Wizard</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Step-by-step guided configuration with Smart-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OneXerConfigWizard 
                  onSave={handleConfigSave}
                  onCancel={handleConfigCancel}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Configuration Templates</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Manage and customize pre-built configuration templates for various scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedConfigTemplateManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Smart Configuration Generator</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Advanced Smart-powered configuration generation with custom requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigGeneratorManager searchTerm={searchTerm} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartConfigCenter;