import React from 'react';
import { Badge } from "@/components/ui/badge";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import AIAssistant from "@/components/ai/AIAssistant";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Shield, Network, Users, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface ProjectMetrics {
  completion: number;
  risksIdentified: number;
  mitigated: number;
  totalSites: number;
  completedSites: number;
  upcomingMilestones: number;
}

interface IntelligentProjectDashboardProps {
  projectId?: string;
  metrics?: ProjectMetrics;
}

const IntelligentProjectDashboard: React.FC<IntelligentProjectDashboardProps> = ({ 
  projectId,
  metrics = {
    completion: 67,
    risksIdentified: 8,
    mitigated: 5,
    totalSites: 24,
    completedSites: 16,
    upcomingMilestones: 3
  }
}) => {
  const aiInsights = [
    {
      type: "recommendation",
      icon: Brain,
      title: "Authentication Optimization",
      message: "Consider implementing SAML SSO for corporate sites to reduce complexity and improve security.",
      priority: "high"
    },
    {
      type: "alert",
      icon: AlertTriangle,
      title: "Timeline Risk",
      message: "3 sites are behind schedule. Suggest reallocating resources from completed phases.",
      priority: "medium"
    },
    {
      type: "insight",
      icon: TrendingUp,
      title: "Performance Trend",
      message: "Implementation velocity has improved 23% over the last month. Current pace will complete project 2 weeks early.",
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="glow" className="mb-4">
          🧠 Intelligent Project Dashboard
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI-Enhanced <span className="bg-gradient-primary bg-clip-text text-transparent">Project Intelligence</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Real-time insights, predictive analytics, and intelligent recommendations for your NAC deployment
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedCard glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completion}%</div>
            <Progress value={metrics.completion} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +5% from last week
            </p>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Management</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.mitigated}/{metrics.risksIdentified}</div>
            <p className="text-xs text-muted-foreground">
              Risks mitigated
            </p>
            <Progress value={(metrics.mitigated / metrics.risksIdentified) * 100} className="mt-2" />
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Progress</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedSites}/{metrics.totalSites}</div>
            <p className="text-xs text-muted-foreground">
              Sites completed
            </p>
            <Progress value={(metrics.completedSites / metrics.totalSites) * 100} className="mt-2" />
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingMilestones}</div>
            <p className="text-xs text-muted-foreground">
              Due this month
            </p>
          </CardContent>
        </EnhancedCard>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedCard glow>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                  <IconComponent className={`w-5 h-5 mt-1 ${
                    insight.priority === 'high' ? 'text-destructive' : 
                    insight.priority === 'medium' ? 'text-warning' : 'text-success'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </EnhancedCard>

        {/* Interactive AI Assistant */}
        <EnhancedCard glow>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Project AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIAssistant 
              context="project"
              projectId={projectId}
            />
          </CardContent>
        </EnhancedCard>
      </div>

      {/* Quick Actions */}
      <EnhancedCard glass>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <EnhancedButton glow size="sm" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Generate Report
            </EnhancedButton>
            <EnhancedButton gradient="primary" size="sm" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </EnhancedButton>
            <EnhancedButton variant="outline" size="sm" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Risk Assessment
            </EnhancedButton>
            <EnhancedButton variant="ghost" size="sm" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Site Overview
            </EnhancedButton>
          </div>
        </CardContent>
      </EnhancedCard>
    </div>
  );
};

export default IntelligentProjectDashboard;