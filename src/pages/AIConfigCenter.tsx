import React, { useState } from 'react';
import ConfigWizardDialog from "@/components/config/ConfigWizardDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Settings, FileText, Sparkles, Zap, Target, Plus } from "lucide-react";

const AIConfigCenter = () => {
  const [activeTab, setActiveTab] = useState("wizard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleConfigSave = (config: any) => {
    console.log('Configuration saved:', config);
    setIsWizardOpen(false);
  };

  const handleConfigCancel = () => {
    setIsWizardOpen(false);
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
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Intelligent Configuration Suite
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                AI Config
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Gen1Xer Hub
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Advanced AI-powered network configuration generation with intelligent recommendations and automated best practices.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">AI-Powered</div>
                  <div className="text-sm text-muted-foreground">Smart Generation</div>
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
              AI Generator
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
                  AI-powered 802.1X configuration generation with smart recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Launch the comprehensive configuration wizard to generate custom 802.1X configurations with AI-powered recommendations.
                  </p>
                  <Button 
                    onClick={() => setIsWizardOpen(true)}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Launch Configuration Wizard
                  </Button>
                </div>
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
                  Component temporarily disabled for debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  EnhancedConfigTemplateManager component temporarily disabled to isolate the JavaScript error.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">AI Configuration Generator</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Component temporarily disabled for debugging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  ConfigGeneratorManager component temporarily disabled to isolate the JavaScript error.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Configuration Wizard Dialog */}
      <ConfigWizardDialog
        isOpen={isWizardOpen}
        onClose={handleConfigCancel}
      />
    </div>
  );
};

export default AIConfigCenter;