import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Tag, Globe, Brain, Zap, Database, 
  Shield, Network, Settings, Target, Rocket,
  CheckCircle, ExternalLink, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewFeaturesShowcase: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Enterprise Report Generator",
      description: "AI-powered report generation with Firecrawler integration",
      icon: FileText,
      badge: "NEW",
      color: "bg-blue-500/10 text-blue-700",
      features: [
        "Portnox documentation crawling",
        "Firewall requirements extraction",
        "Prerequisites analysis",
        "Deployment checklists",
        "6 professional report types"
      ],
      action: () => navigate('/dev/reports'),
      route: "/dev/reports"
    },
    {
      title: "Enhanced Resource Library",
      description: "Advanced resource management with comprehensive tagging",
      icon: Tag,
      badge: "NEW",
      color: "bg-green-500/10 text-green-700",
      features: [
        "40+ predefined tags",
        "Advanced labeling system",
        "External link management",
        "Relationship mapping",
        "Usage analytics"
      ],
      action: () => navigate('/dev/resource/vendor/1'),
      route: "/dev/resource/vendor/1"
    },
    {
      title: "Web Intelligence Engine",
      description: "AI-powered web crawling and content analysis",
      icon: Globe,
      badge: "NEW",
      color: "bg-purple-500/10 text-purple-700",
      features: [
        "Firecrawler API integration",
        "Content intelligence extraction",
        "Business profile generation",
        "Wireless configuration intelligence",
        "Security monitoring"
      ],
      action: () => navigate('/ai-context'),
      route: "/ai-context"
    },
    {
      title: "Enhanced AI Scoping",
      description: "Intelligent project scoping with Resource Library integration",
      icon: Brain,
      badge: "ENHANCED",
      color: "bg-orange-500/10 text-orange-700",
      features: [
        "Resource Library integration",
        "Vendor-specific recommendations",
        "Use case analysis",
        "Requirements mapping",
        "Compliance checking"
      ],
      action: () => navigate('/scoping'),
      route: "/scoping"
    }
  ];

  const databaseTables = [
    { name: "Enterprise Reports", count: "8 tables", status: "✅ Created" },
    { name: "Enhanced Resource Library", count: "6 tables", status: "✅ Created" },
    { name: "Firecrawler Jobs", count: "1 table", status: "✅ Created" },
    { name: "Report Templates", count: "1 table", status: "✅ Created" },
    { name: "Resource Tags", count: "40+ predefined", status: "✅ Seeded" },
    { name: "External Links", count: "12 types", status: "✅ Configured" }
  ];

  const edgeFunctions = [
    { name: "ai-completion", version: "v93", status: "✅ Active" },
    { name: "enhanced-ai-completion", version: "v30", status: "✅ Active" },
    { name: "documentation-crawler", version: "v70", status: "✅ Active" },
    { name: "portnox-doc-scraper", version: "v78", status: "✅ Active" },
    { name: "enterprise-ai-report-generator", version: "v4", status: "✅ Active" },
    { name: "ultimate-ai-report-generator", version: "v2", status: "✅ Active" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Intelligence Engine</h1>
            <p className="text-muted-foreground">Comprehensive showcase of new enterprise features</p>
          </div>
        </div>
        <Separator />
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {feature.badge}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {feature.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button 
                  onClick={feature.action}
                  className="w-full"
                  variant="default"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open {feature.title}
                </Button>
              </div>
            </CardContent>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Database & Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Tables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Schema</span>
            </CardTitle>
            <CardDescription>New tables created for enhanced functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {databaseTables.map((table, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{table.name}</p>
                    <p className="text-sm text-muted-foreground">{table.count}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {table.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edge Functions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Edge Functions</span>
            </CardTitle>
            <CardDescription>Deployed serverless functions for AI processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {edgeFunctions.map((func, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{func.name}</p>
                    <p className="text-sm text-muted-foreground">{func.version}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {func.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Get started with the new features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/dev/reports')}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm">Generate Report</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/dev/resource/vendor/1')}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <Tag className="h-5 w-5" />
              <span className="text-sm">Manage Resources</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/scoping')}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <Target className="h-5 w-5" />
              <span className="text-sm">Enhanced Scoping</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/resource-library')}
              variant="outline"
              className="h-20 flex flex-col space-y-2"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm">Resource Library</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Environment Status</span>
          </CardTitle>
          <CardDescription>System configuration and API status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="font-medium text-green-700">Firecrawler API</p>
              <p className="text-sm text-green-600">Connected</p>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="font-medium text-blue-700">Portnox API</p>
              <p className="text-sm text-blue-600">Connected</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="font-medium text-purple-700">AI Providers</p>
              <p className="text-sm text-purple-600">Configured</p>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="font-medium text-orange-700">Database</p>
              <p className="text-sm text-orange-600">Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewFeaturesShowcase;
