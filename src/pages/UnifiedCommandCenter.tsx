import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, Building2, BarChart3, TrendingUp, Bot, Sparkles, 
  Rocket, Brain, Zap, AlertTriangle, CheckCircle, Clock,
  Users, Network, Settings, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import IntelligentProjectWizard from "@/components/comprehensive/IntelligentProjectWizard";
import IntelligentProjectReports from "@/components/reports/IntelligentProjectReports";
import AIAssistant from '@/components/ai/AIAssistant';
import { useSites } from '@/hooks/useSites';
import { useProjects } from '@/hooks/useProjects';
import { useUnifiedProjects } from '@/hooks/useUnifiedProjectManagement';
import { Button } from '@/components/ui/button';

const UnifiedCommandCenter = () => {
  const [activeInsight, setActiveInsight] = useState(0);
  const [showIntelligentWizard, setShowIntelligentWizard] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const { data: sites = [] } = useSites();
  const { data: projects = [] } = useProjects();
  const { data: unifiedProjects = [] } = useUnifiedProjects();

  // Calculate key metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'implementing' || p.status === 'scoping').length;
  const totalSites = sites.length;
  const deployedSites = sites.filter(s => s.status === 'deployed').length;
  const completionRate = totalSites > 0 ? Math.round((deployedSites / totalSites) * 100) : 0;

  const quickActions = [
    {
      title: "Smart Project Wizard",
      description: "AI-powered project creation with intelligent scoping",
      icon: <Sparkles className="h-8 w-8" />,
      href: "/wizard",
      badge: "AI",
      gradient: "primary"
    },
    {
      title: "AI Scoping Assistant",
      description: "Intelligent project analysis and requirements gathering",
      icon: <Brain className="h-8 w-8" />,
      href: "/scoping",
      badge: "Smart",
      gradient: "accent"
    },
    {
      title: "Project Tracking",
      description: "Real-time project monitoring and analytics",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/tracking",
      gradient: "button"
    },
    {
      title: "AI Config Generator",
      description: "OneXer intelligent 802.1X configuration",
      icon: <Settings className="h-8 w-8" />,
      href: "/ai-config",
      badge: "1X",
      gradient: "primary"
    }
  ];

  const aiInsights = [
    {
      type: "optimization",
      title: "Deployment Optimization",
      message: "3 sites can be optimized for 15% faster deployment",
      priority: "medium",
      action: "View Recommendations"
    },
    {
      type: "alert",
      title: "Resource Allocation",
      message: "2 projects may need additional resources next week",
      priority: "high",
      action: "Manage Resources"
    },
    {
      type: "success",
      title: "Milestone Achievement",
      message: "Project Alpha completed ahead of schedule",
      priority: "low",
      action: "View Details"
    }
  ];

  const systemStatus = [
    { label: "AI Engine", status: "active", color: "text-green-500" },
    { label: "Analytics", status: "active", color: "text-green-500" },
    { label: "Automation", status: "active", color: "text-green-500" },
    { label: "Integrations", status: "syncing", color: "text-yellow-500" }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Command Center
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered dashboard for comprehensive project management
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button size="lg" onClick={() => setShowIntelligentWizard(true)}>
            <Brain className="w-5 h-5 mr-2" />
            AI-Powered Project Wizard
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowReports(true)}>
            <BarChart3 className="w-5 h-5 mr-2" />
            Intelligent Reports
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          {systemStatus.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`}></div>
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedCard glass lift glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {activeProjects}
              <span className="text-sm text-muted-foreground font-normal">
                /{totalProjects}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass lift glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites Deployed</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {deployedSites}
              <span className="text-sm text-muted-foreground font-normal">
                /{totalSites}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass lift glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
            <Bot className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              12
            </div>
            <p className="text-xs text-muted-foreground">
              3 high priority actions
            </p>
          </CardContent>
        </EnhancedCard>

        <EnhancedCard glass lift glow>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              98.5%
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </EnhancedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <EnhancedCard 
                      lift 
                      glow 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-primary">
                              {action.icon}
                            </div>
                            {action.badge && (
                              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                {action.badge}
                              </Badge>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </EnhancedCard>
                  </Link>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>

          {/* AI Insights */}
          <EnhancedCard glass>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI Insights</span>
                <Badge variant="glow" className="ml-2">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="mt-1">
                      {insight.type === 'alert' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {insight.type === 'optimization' && <Zap className="h-4 w-4 text-blue-500" />}
                      {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.message}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {insight.priority}
                      </Badge>
                      <EnhancedButton variant="outline" size="sm">
                        {insight.action}
                      </EnhancedButton>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>
        </div>

        {/* AI Assistant */}
        <div className="space-y-6">
          <EnhancedCard glass className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span>AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <AIAssistant context="general" className="h-full border-0" />
            </CardContent>
          </EnhancedCard>
        </div>
      </div>

      {/* Recent Activity */}
      <EnhancedCard glass>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">2 minutes ago</span>
              <span>•</span>
              <span>Project Alpha site deployment completed successfully</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">15 minutes ago</span>
              <span>•</span>
              <span>AI generated new optimization recommendations for Project Beta</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-muted-foreground">1 hour ago</span>
              <span>•</span>
              <span>New user John Doe added to Project Gamma team</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">3 hours ago</span>
              <span>•</span>
              <span>OneXer config generated for 5 new network devices</span>
            </div>
          </div>
        </CardContent>
      </EnhancedCard>

      {/* Intelligent Project Wizard */}
      {showIntelligentWizard && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <IntelligentProjectWizard 
            onComplete={() => setShowIntelligentWizard(false)}
            onCancel={() => setShowIntelligentWizard(false)}
          />
        </div>
      )}

      {/* Intelligent Reports */}
      {showReports && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Project Reports & Analytics</h1>
              <Button variant="outline" onClick={() => setShowReports(false)}>
                Close
              </Button>
            </div>
            <IntelligentProjectReports />
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedCommandCenter;