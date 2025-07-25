import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AIRecommendationEngine from '@/components/ai/AIRecommendationEngine';
import AIWorkflowEngine from '@/components/ai/AIWorkflowEngine';
import SmartProjectDashboard from '@/components/ai/SmartProjectDashboard';
import { Brain, Sparkles, Target, TrendingUp } from 'lucide-react';

const AIRecommendations = () => {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">AI Recommendations Center</h1>
            <p className="text-xl text-muted-foreground">
              Intelligent insights, automation, and optimization for your NAC deployments
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Intelligence
          </Badge>
          <Badge variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Real-time Analysis
          </Badge>
          <Badge variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Continuous Optimization
          </Badge>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Brain className="h-5 w-5" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              AI analyzes your projects and provides contextual recommendations for optimization, 
              risk mitigation, and performance improvements.
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Sparkles className="h-5 w-5" />
              Automated Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">
              Streamline project creation, scoping, vendor selection, and deployment planning 
              with intelligent automation.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="h-5 w-5" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-600">
              Get insights into project health, timeline predictions, success rates, 
              and resource optimization opportunities.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main AI Components */}
      <div className="space-y-8">
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
      </div>

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
    </div>
  );
};

export default AIRecommendations;