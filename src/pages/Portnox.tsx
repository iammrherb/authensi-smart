import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortnoxKeyManager from "@/components/portnox/PortnoxKeyManager";
import PortnoxApiExplorer from "@/components/portnox/PortnoxApiExplorer";
import BulkApiRunner from "@/components/portnox/BulkApiRunner";
import RevolutionaryDiscoveryHub from "@/components/portnox/RevolutionaryDiscoveryHub";
import ConversationalScopingWizard from "@/components/portnox/ConversationalScopingWizard";
import ImmersivePOCManager from "@/components/portnox/ImmersivePOCManager";
import { 
  Rocket, Brain, Globe, MessageSquare, Target, Zap,
  Network, Shield, TrendingUp, Sparkles 
} from "lucide-react";

const Portnox: React.FC = () => {
  useEffect(() => {
    document.title = "🚀 Revolutionary Portnox Platform - The Future of NAC"; // SEO title
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Revolutionary Hero Header */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-primary/20">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Revolutionary Portnox Platform
                  </h1>
                  <p className="text-xl text-muted-foreground mt-2">
                    The world's most advanced NAC discovery, scoping & POC platform
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Globe className="h-3 w-3 mr-1" />
                  Real-Time Discovery
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Conversational Scoping
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  <Target className="h-3 w-3 mr-1" />
                  Immersive POC
                </Badge>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">98.5%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">40%</div>
                  <div className="text-sm text-muted-foreground">Faster Deals</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">3D</div>
                  <div className="text-sm text-muted-foreground">Visualization</div>
                </div>
                <div className="bg-background/50 backdrop-blur-sm p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">AI</div>
                  <div className="text-sm text-muted-foreground">Driven</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Revolutionary Platform Tabs */}
      <section className="container mx-auto px-6 py-8">
        <Tabs defaultValue="discovery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">AI Discovery</span>
            </TabsTrigger>
            <TabsTrigger value="scoping" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Scoping</span>
            </TabsTrigger>
            <TabsTrigger value="poc" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Immersive POC</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">API Explorer</span>
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Management</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Network className="h-6 w-6 text-primary" />
                  🚀 AI-Powered Discovery Command Center
                  <Badge className="ml-2 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Revolutionary
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Transform network discovery into an interactive, intelligent experience with real-time AI analysis
                </p>
              </CardHeader>
              <CardContent>
                <RevolutionaryDiscoveryHub />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="h-6 w-6 text-primary" />
                  💬 Conversational AI Scoping Wizard
                  <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Game Changer
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  The industry's first natural-language scoping experience that adapts to stakeholder personas
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <ConversationalScopingWizard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="poc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Globe className="h-6 w-6 text-primary" />
                  🎮 Immersive POC Management Suite
                  <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-green-500 text-white">
                    <Target className="h-3 w-3 mr-1" />
                    3D Experience
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Turn POC tracking into a captivating experience with 3D visualization and predictive analytics
                </p>
              </CardHeader>
              <CardContent>
                <ImmersivePOCManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <PortnoxKeyManager />
              <PortnoxApiExplorer />
              <BulkApiRunner />
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Advanced Management Tools
                </CardTitle>
                <p className="text-muted-foreground">
                  Comprehensive Portnox management and configuration tools
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Advanced Management Suite</h3>
                  <p>Comprehensive management tools coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Advanced Analytics & Insights
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-powered analytics and business intelligence for Portnox deployments
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Advanced Analytics Dashboard</h3>
                  <p>Comprehensive analytics and reporting tools coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Portnox;
