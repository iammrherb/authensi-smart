import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Brain, Target, Users, Settings, BarChart3, Globe, Zap, Database, 
  FileText, CheckSquare, TrendingUp, Shield, Network, Building2, 
  Lock, Router, Monitor, Code, Folder, Plus, Edit, Search, Filter,
  Command, Eye, Settings2, Activity, Clock, DollarSign, Award,
  AlertTriangle, Calendar, MapPin, GitBranch, Layers, Crown,
  Sparkles, Rocket, Star, Trophy, Medal, Flame, Gauge, Wand2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIInsightsDashboard } from '@/components/ai/AIInsightsDashboard';
import ComprehensiveReports from '@/components/reports/ComprehensiveReports';
import EnhancedVendorManagement from '@/components/vendors/EnhancedVendorManagement';
import UnifiedResourceCenter from '@/pages/UnifiedResourceCenter';
import PortnoxApiExplorer from '@/components/portnox/PortnoxApiExplorer';
import ComprehensiveTaxonomyManager from '@/components/taxonomy/ComprehensiveTaxonomyManager';
import UnifiedCreationWizard from '@/components/unified/UnifiedCreationWizard';
import ConfigGeneratorManager from '@/components/config/ConfigGeneratorManager';
import EnhancedConfigTemplateManager from '@/components/config/EnhancedConfigTemplateManager';
import UnifiedIntelligentConfigWizard from '@/components/config/UnifiedIntelligentConfigWizard';
import AdvancedConfigAnalyzer from '@/components/config/AdvancedConfigAnalyzer';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'insights' | 'management' | 'reports' | 'resources' | 'operations';
  priority: 'critical' | 'high' | 'medium' | 'low';
  action: () => void;
  badge?: string;
  stats?: string;
  color: string;
}

const EnterpriseCommandCenter = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const actionItems: ActionItem[] = [
    // AI Insights & Recommendations
    {
      id: 'ai-insights',
      title: 'AI Insights Dashboard',
      description: 'Real-time AI analysis, autonomous optimization, and intelligent recommendations',
      icon: Brain,
      category: 'insights',
      priority: 'critical',
      action: () => setActiveView('ai-insights'),
      badge: 'AI Powered',
      stats: '15+ Insights',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      description: 'AI-generated optimization recommendations and autonomous suggestions',
      icon: Sparkles,
      category: 'insights',
      priority: 'high',
      action: () => setActiveView('ai-insights'),
      badge: 'Smart',
      stats: '8 Active',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Engine',
      description: 'Comprehensive risk analysis and mitigation strategies',
      icon: Shield,
      category: 'insights',
      priority: 'high',
      action: () => setActiveView('ai-insights'),
      badge: 'Security',
      stats: '3 Risks',
      color: 'from-red-500 to-orange-600'
    },

    // Executive Reports
    {
      id: 'executive-reports',
      title: 'Executive Reports',
      description: 'Professional, enterprise-ready reports with advanced formatting',
      icon: FileText,
      category: 'reports',
      priority: 'critical',
      action: () => setActiveView('executive-reports'),
      badge: 'Executive',
      stats: '12 Reports',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'analytics-dashboard',
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics with visual insights and KPI tracking',
      icon: BarChart3,
      category: 'reports',
      priority: 'high',
      action: () => navigate('/analytics'),
      badge: 'Analytics',
      stats: '25+ Metrics',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'milestone-tracking',
      title: 'Milestone Achievement',
      description: 'Track project milestones, deliverables, and achievement metrics',
      icon: Target,
      category: 'management',
      priority: 'high',
      action: () => setActiveView('ai-insights'),
      badge: 'Tracking',
      stats: '18 Active',
      color: 'from-green-500 to-emerald-600'
    },

    // Resource Management
    {
      id: 'config-generator',
      title: 'Config Generator Studio',
      description: 'AI-powered configuration generation with templates and automation',
      icon: Code,
      category: 'management',
      priority: 'critical',
      action: () => setActiveView('config-generator'),
      badge: 'AI Powered',
      stats: '50+ Templates',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'config-templates',
      title: 'Configuration Templates',
      description: 'Manage vendor-specific configuration templates and libraries',
      icon: FileText,
      category: 'management',
      priority: 'high',
      action: () => setActiveView('config-templates'),
      badge: 'Template Library',
      stats: '25+ Templates',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'config-wizard',
      title: 'Smart Config Wizard',
      description: 'Intelligent configuration wizard with AI assistance',
      icon: Wand2,
      category: 'management',
      priority: 'high',
      action: () => setActiveView('config-wizard'),
      badge: 'AI Assistant',
      stats: 'Smart Guide',
      color: 'from-violet-500 to-purple-600'
    },
    {
      id: 'resource-center',
      title: 'Unified Resource Center',
      description: 'Comprehensive resource management: vendors, templates, libraries',
      icon: Database,
      category: 'resources',
      priority: 'high',
      action: () => setActiveView('resource-center'),
      badge: 'Central Hub',
      stats: '500+ Resources',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'vendor-management',
      title: 'Vendor Ecosystem',
      description: 'Advanced vendor management with AI-enhanced selection',
      icon: Building2,
      category: 'resources',
      priority: 'medium',
      action: () => setActiveView('vendor-management'),
      badge: 'Vendors',
      stats: '150+ Vendors',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'template-library',
      title: 'Template Library',
      description: 'Configuration templates, deployment guides, and best practices',
      icon: Folder,
      category: 'resources',
      priority: 'medium',
      action: () => navigate('/templates'),
      badge: 'Templates',
      stats: '200+ Templates',
      color: 'from-violet-500 to-purple-600'
    },

    // Operations & Management
    {
      id: 'project-creation',
      title: 'Intelligent Project Creation',
      description: 'AI-assisted project creation with smart scoping and recommendations',
      icon: Rocket,
      category: 'operations',
      priority: 'critical',
      action: () => setActiveView('project-creation'),
      badge: 'AI Scoping',
      stats: 'Smart Wizard',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'project-tracking',
      title: 'Project Tracking Hub',
      description: 'Real-time project monitoring with intelligent alerts',
      icon: Monitor,
      category: 'management',
      priority: 'high',
      action: () => navigate('/tracker'),
      badge: 'Live Tracking',
      stats: '12 Projects',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'portnox-integration',
      title: 'Portnox Integration',
      description: 'Advanced API management, testing, and automation workflows',
      icon: Network,
      category: 'operations',
      priority: 'medium',
      action: () => setActiveView('portnox-integration'),
      badge: 'API Integration',
      stats: '8 APIs',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'taxonomy-management',
      title: 'Taxonomy Management',
      description: 'Intelligent taxonomy seeding and resource categorization',
      icon: Settings,
      category: 'management',
      priority: 'medium',
      action: () => setActiveView('taxonomy-management'),
      badge: 'AI Enhanced',
      stats: 'Smart Seeding',
      color: 'from-slate-500 to-gray-600'
    },
    {
      id: 'advanced-analyzer',
      title: 'Advanced Config Analyzer',
      description: 'AI-powered configuration analysis for security, performance, and compliance',
      icon: Shield,
      category: 'insights',
      priority: 'high',
      action: () => setActiveView('advanced-analyzer'),
      badge: 'AI Analysis',
      stats: 'Deep Scan',
      color: 'from-emerald-500 to-cyan-600'
    }
  ];

  const systemMetrics = [
    { label: 'Active Projects', value: '12', trend: '+3', positive: true, icon: Rocket },
    { label: 'AI Optimizations', value: '23', trend: '+8', positive: true, icon: Brain },
    { label: 'Cost Efficiency', value: '94%', trend: '+2%', positive: true, icon: DollarSign },
    { label: 'System Health', value: '98%', trend: '+1%', positive: true, icon: Activity }
  ];

  const filteredActions = actionItems.filter(action => {
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All', icon: Command },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'management', label: 'Management', icon: Settings },
    { id: 'resources', label: 'Resources', icon: Database },
    { id: 'operations', label: 'Operations', icon: Zap }
  ];

  // Handle specific views
  if (activeView === 'ai-insights') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">AI Insights & Recommendations</h1>
        </div>
        <AIInsightsDashboard />
      </div>
    );
  }

  if (activeView === 'executive-reports') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Executive Reports Center</h1>
        </div>
        <ComprehensiveReports />
      </div>
    );
  }

  if (activeView === 'resource-center') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Unified Resource Center</h1>
        </div>
        <UnifiedResourceCenter />
      </div>
    );
  }

  if (activeView === 'vendor-management') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Vendor Management</h1>
        </div>
        <EnhancedVendorManagement />
      </div>
    );
  }

  if (activeView === 'portnox-integration') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Portnox Integration Hub</h1>
        </div>
        <PortnoxApiExplorer />
      </div>
    );
  }

  if (activeView === 'taxonomy-management') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Taxonomy Management</h1>
        </div>
        <ComprehensiveTaxonomyManager />
      </div>
    );
  }

  if (activeView === 'project-creation') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Intelligent Project Creation</h1>
        </div>
        <UnifiedCreationWizard
          initialMethod="ai-scoping"
          context="command-center"
          onComplete={(projectId) => navigate(`/projects/${projectId}`)}
          onCancel={() => setActiveView(null)}
        />
      </div>
    );
  }

  if (activeView === 'config-generator') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Configuration Generator Studio</h1>
        </div>
        <ConfigGeneratorManager searchTerm={searchTerm} />
      </div>
    );
  }

  if (activeView === 'config-templates') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Configuration Templates</h1>
        </div>
        <EnhancedConfigTemplateManager searchTerm={searchTerm} />
      </div>
    );
  }

  if (activeView === 'config-wizard') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Smart Configuration Wizard</h1>
        </div>
        <UnifiedIntelligentConfigWizard onCancel={() => setActiveView(null)} />
      </div>
    );
  }

  if (activeView === 'advanced-analyzer') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setActiveView(null)}>
            ← Back to Command Center
          </Button>
          <h1 className="text-2xl font-bold">Advanced Configuration Analyzer</h1>
        </div>
        <AdvancedConfigAnalyzer />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="glow" className="mb-4 px-4 py-2">
          <Crown className="h-4 w-4 mr-2" />
          Enterprise Command Center
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unified <span className="bg-gradient-primary bg-clip-text text-transparent">Control Hub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Comprehensive enterprise management with AI-powered insights, executive reporting, and intelligent automation
        </p>
      </div>

      {/* System Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="text-center p-4 bg-card border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <div className={`text-xs ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend} this week
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search capabilities, reports, resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Card 
                  key={action.id}
                  className="cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
                  onClick={action.action}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.color}`} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        {action.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {action.badge}
                          </Badge>
                        )}
                        {action.stats && (
                          <Badge variant="outline" className="text-xs">
                            {action.stats}
                          </Badge>
                        )}
                        <Badge 
                          variant={
                            action.priority === 'critical' ? 'destructive' :
                            action.priority === 'high' ? 'default' :
                            action.priority === 'medium' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseCommandCenter;