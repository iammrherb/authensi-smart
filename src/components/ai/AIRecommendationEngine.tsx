import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Shield, TrendingUp, AlertTriangle, CheckCircle, 
  Lightbulb, Target, FileText, Users, Building2, Zap,
  Settings, Network, Clock, Star, ArrowRight
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'compliance' | 'security' | 'performance' | 'industry';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  actionItems: string[];
  relatedUseCases?: string[];
  estimatedEffort?: string;
  complianceFramework?: string;
  industryContext?: string;
}

const AIRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Mock AI recommendations data
  useEffect(() => {
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        type: 'compliance',
        priority: 'critical',
        title: 'PCI-DSS 4.0 Network Segmentation Requirements',
        description: 'New PCI-DSS 4.0 requirements mandate enhanced network segmentation for payment processing environments.',
        impact: 'Ensures compliance with latest payment card security standards',
        actionItems: [
          'Implement micro-segmentation for payment processing zones',
          'Deploy enhanced NAC policies for cardholder data environments',
          'Configure automated compliance monitoring'
        ],
        complianceFramework: 'PCI-DSS 4.0',
        estimatedEffort: '3-4 weeks',
        relatedUseCases: ['Payment Processing Security', 'Retail POS Protection']
      },
      {
        id: '2',
        type: 'security',
        priority: 'high',
        title: 'Zero Trust Architecture Enhancement',
        description: 'Strengthen your security posture with advanced Zero Trust Network Access (ZTNA) capabilities.',
        impact: 'Reduces breach risk by 70% through identity-based access controls',
        actionItems: [
          'Implement device trust verification',
          'Deploy continuous authentication monitoring',
          'Configure adaptive access policies'
        ],
        estimatedEffort: '2-3 weeks',
        relatedUseCases: ['Zero Trust Implementation', 'Remote Worker Security']
      },
      {
        id: '3',
        type: 'industry',
        priority: 'medium',
        title: 'Healthcare HIPAA Security Enhancement',
        description: 'New healthcare cybersecurity guidelines recommend enhanced patient data protection measures.',
        impact: 'Ensures HIPAA compliance and protects patient privacy',
        actionItems: [
          'Implement medical device network isolation',
          'Deploy healthcare-specific access policies',
          'Configure patient data access logging'
        ],
        industryContext: 'Healthcare',
        complianceFramework: 'HIPAA',
        estimatedEffort: '4-5 weeks'
      },
      {
        id: '4',
        type: 'performance',
        priority: 'medium',
        title: 'Network Performance Optimization',
        description: 'AI analysis suggests configuration optimizations to improve network performance by 40%.',
        impact: 'Reduces latency and improves user experience',
        actionItems: [
          'Optimize authentication server load balancing',
          'Implement intelligent traffic prioritization',
          'Configure adaptive bandwidth management'
        ],
        estimatedEffort: '1-2 weeks'
      }
    ];

    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredRecommendations = recommendations.filter(rec => 
    activeFilter === 'all' || rec.type === activeFilter
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'industry': return <Building2 className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">AI Recommendation Engine</h2>
          <Badge variant="outline" className="animate-pulse">Analyzing...</Badge>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-accent/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Recommendation Engine</h2>
          <Badge variant="glow" className="animate-pulse">
            Live Analysis
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure AI
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-500">
                  {recommendations.filter(r => r.priority === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-500">
                  {recommendations.filter(r => r.priority === 'high').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold text-blue-500">
                  {recommendations.filter(r => r.type === 'compliance').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold text-green-500">
                  {recommendations.filter(r => r.type === 'performance').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <Card key={recommendation.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(recommendation.type)}
                    <div>
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {recommendation.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(recommendation.priority)}
                    <Badge variant={getPriorityColor(recommendation.priority) as any}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Impact */}
                <div className="p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Expected Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.impact}</p>
                </div>

                {/* Action Items */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Recommended Actions</span>
                  </div>
                  <ul className="space-y-2">
                    {recommendation.actionItems.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  {recommendation.estimatedEffort && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Effort: {recommendation.estimatedEffort}</span>
                    </div>
                  )}
                  {recommendation.complianceFramework && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{recommendation.complianceFramework}</span>
                    </div>
                  )}
                  {recommendation.industryContext && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{recommendation.industryContext}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                      <Zap className="h-4 w-4 mr-2" />
                      Implement Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                  {recommendation.relatedUseCases && (
                    <Button variant="ghost" size="sm">
                      View Use Cases
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIRecommendationEngine;