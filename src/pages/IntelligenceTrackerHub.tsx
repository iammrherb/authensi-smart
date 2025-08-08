import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIRecommendationEngine from '@/components/ai/AIRecommendationEngine';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';
import SmartProjectDashboard from '@/components/ai/SmartProjectDashboard';
import UnifiedProjectManager from '@/components/tracker/UnifiedProjectManager';
import UltimateAIScopingWizard from '@/components/scoping/UltimateAIScopingWizard';
import { Brain, Sparkles, Target, TrendingUp, Rocket, Zap, Building2, Plus, ArrowRight } from 'lucide-react';

const IntelligenceTrackerHub = () => {
  const [activeTab, setActiveTab] = useState("ai-scoping");
  const [showProjectWizard, setShowProjectWizard] = useState(false);

  const handleScopingComplete = (sessionId: string, scopingData: any) => {
    console.log('Scoping completed:', sessionId, scopingData);
    setActiveTab("project-management");
  };

  return (
    <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger 
              value="ai-scoping" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Brain className="h-4 w-4" />
              AI Scoping
            </TabsTrigger>
            <TabsTrigger 
              value="project-management"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Building2 className="h-4 w-4" />
              Project Management
            </TabsTrigger>
            <TabsTrigger 
              value="ai-insights"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* AI Scoping Wizard Tab */}
          <TabsContent value="ai-scoping" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI-Powered Scoping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Leverage AI to analyze requirements, recommend solutions, and create comprehensive project scopes automatically.
                  </p>
                  <Button 
                    onClick={() => setShowProjectWizard(true)}
                    className="w-full bg-gradient-primary hover:shadow-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start AI Scoping
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Smart Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI analyzes your environment and provides intelligent recommendations for optimal configurations.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-accent/30 hover:bg-accent/10"
                    onClick={() => setActiveTab("ai-insights")}
                  >
                    View Recommendations
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-secondary" />
                    Project Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seamlessly transition from scoping to project creation with AI-generated templates and workflows.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-secondary/30 hover:bg-secondary/10"
                    onClick={() => setActiveTab("project-management")}
                  >
                    Manage Projects
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Scoping Wizard */}
            <Card>
              <CardHeader>
                <CardTitle>Intelligent Scoping Wizard</CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-guided project scoping with automated recommendations and intelligent analysis
                </p>
              </CardHeader>
              <CardContent>
                <UltimateAIScopingWizard
                  onComplete={handleScopingComplete}
                  onSave={() => setShowProjectWizard(false)}
                  onCancel={() => setShowProjectWizard(false)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Management Tab */}
          <TabsContent value="project-management" className="space-y-6">
            <UnifiedProjectManager />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            {/* AI Features Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Brain className="h-5 w-5" />
                    Smart Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes your projects and provides contextual recommendations for optimization, 
                    risk mitigation, and performance improvements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" />
                    Automated Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Streamline project creation, scoping, vendor selection, and deployment planning 
                    with intelligent automation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <TrendingUp className="h-5 w-5" />
                    Predictive Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get insights into project health, timeline predictions, success rates, 
                    and resource optimization opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendation Engine */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendation Engine</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Intelligent recommendations based on your current projects and industry best practices
                </p>
              </CardHeader>
              <CardContent>
                <AIRecommendationEngine />
              </CardContent>
            </Card>

            {/* AI Workflow Engine */}
            <Card>
              <CardHeader>
                <CardTitle>AI Workflow Automation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Streamline your workflows with intelligent automation and smart suggestions
                </p>
              </CardHeader>
              <CardContent>
                <AIWorkflowEngine 
                  context="optimization"
                  onAction={(action, data) => {
                    console.log('AI Optimization Action:', action, data);
                  }}
                  onRecommendationAccept={(recommendation) => {
                    console.log('Optimization recommendation accepted:', recommendation);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Smart Project Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Project Intelligence</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time project health monitoring, predictions, and optimization insights
                </p>
              </CardHeader>
              <CardContent>
                <SmartProjectDashboard />
              </CardContent>
            </Card>

            {/* AI Capabilities Summary */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Complete AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Automated Project Management</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Intelligent project template selection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Automated site and resource planning
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Smart vendor recommendation and selection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Dynamic timeline optimization
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Intelligent Analysis & Insights</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Real-time project health monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Predictive risk assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Performance optimization recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        Compliance and security validation
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default IntelligenceTrackerHub;