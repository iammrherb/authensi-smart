// Temporary test page that doesn't import ANY vendor hooks
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Settings, FileText, Sparkles, Zap, Target } from "lucide-react";

const TestAIConfigCenter = () => {
  const [activeTab, setActiveTab] = useState("wizard");

  return (
    <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <div className="pt-8 pb-8 bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <div className="container mx-auto px-6">
          <div className="relative">
            <div className="relative text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Brain className="text-2xl text-primary-foreground animate-pulse" />
                </div>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  TEST - Intelligent Configuration Suite
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                TEST AI Config
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Gen1Xer Hub
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                This is a test version that doesn't import any vendor hooks to isolate the JavaScript error.
              </p>
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
                  <CardTitle className="text-2xl">TEST Configuration Wizard</CardTitle>
                </div>
                <CardDescription className="text-base">
                  This is a test page - no vendor hooks imported
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>If you can see this without JavaScript errors, the issue is in the vendor hooks.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle>Test Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Test content for templates tab</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader>
                <CardTitle>Test AI Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Test content for AI generator tab</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestAIConfigCenter;