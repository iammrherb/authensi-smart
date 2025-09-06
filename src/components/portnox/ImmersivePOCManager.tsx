import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, Pause, RotateCcw, Zap, Target, TrendingUp,
  Activity, Globe, Users, MessageSquare, Video,
  CheckCircle, AlertTriangle, Clock, BarChart3,
  Network, Shield, Monitor, Settings, Eye
} from 'lucide-react';
import { PortnoxApiService } from '@/services/PortnoxApiService';
import { useToast } from '@/hooks/use-toast';

interface POCMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface POCPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  progress: number;
  duration_days: number;
  critical_path: boolean;
  dependencies: string[];
  deliverables: string[];
  success_criteria: string[];
}

interface CollaborationActivity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  type: 'comment' | 'decision' | 'approval' | 'concern';
}

interface SuccessPrediction {
  probability: number;
  confidence: number;
  risk_factors: Array<{
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  recommendations: string[];
}

const ImmersivePOCManager: React.FC = () => {
  const [pocStatus, setPocStatus] = useState<'planning' | 'active' | 'paused' | 'completed'>('active');
  const [liveMetrics, setLiveMetrics] = useState<POCMetric[]>([]);
  const [pocPhases, setPocPhases] = useState<POCPhase[]>([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [collaborationFeed, setCollaborationFeed] = useState<CollaborationActivity[]>([]);
  const [successPrediction, setSuccessPrediction] = useState<SuccessPrediction | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  
  const metricsIntervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    initializePOCData();
    if (realtimeUpdates) {
      startRealTimeUpdates();
    }
    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [realtimeUpdates]);

  const initializePOCData = () => {
    // Initialize with realistic POC metrics
    const initialMetrics: POCMetric[] = [
      {
        id: '1',
        name: 'Device Authentication Rate',
        value: 98.5,
        target: 99.0,
        unit: '%',
        trend: 'up',
        status: 'good'
      },
      {
        id: '2',
        name: 'Policy Compliance',
        value: 87.3,
        target: 95.0,
        unit: '%',
        trend: 'up',
        status: 'warning'
      },
      {
        id: '3',
        name: 'Response Time',
        value: 1.2,
        target: 1.0,
        unit: 'sec',
        trend: 'down',
        status: 'warning'
      },
      {
        id: '4',
        name: 'Threat Detection',
        value: 15,
        target: 10,
        unit: 'threats/day',
        trend: 'stable',
        status: 'good'
      },
      {
        id: '5',
        name: 'User Satisfaction',
        value: 92,
        target: 90,
        unit: '%',
        trend: 'up',
        status: 'good'
      }
    ];

    const initialPhases: POCPhase[] = [
      {
        id: '1',
        name: 'Infrastructure Setup',
        description: 'Deploy Portnox components and integrate with existing network',
        status: 'completed',
        progress: 100,
        duration_days: 5,
        critical_path: true,
        dependencies: [],
        deliverables: ['Portnox server deployed', 'Network integration complete', 'Initial policies configured'],
        success_criteria: ['All components responding', 'Network connectivity verified']
      },
      {
        id: '2',
        name: 'Policy Configuration',
        description: 'Configure access policies and user groups',
        status: 'completed',
        progress: 100,
        duration_days: 3,
        critical_path: true,
        dependencies: ['1'],
        deliverables: ['User groups configured', 'Access policies defined', 'Device classification rules'],
        success_criteria: ['Policies enforced correctly', 'User groups functional']
      },
      {
        id: '3',
        name: 'User Testing',
        description: 'Pilot testing with selected user groups',
        status: 'active',
        progress: 75,
        duration_days: 7,
        critical_path: true,
        dependencies: ['2'],
        deliverables: ['User acceptance testing', 'Performance validation', 'Security testing'],
        success_criteria: ['95% authentication success', 'Sub-2sec response time']
      },
      {
        id: '4',
        name: 'Performance Optimization',
        description: 'Fine-tune policies and optimize performance',
        status: 'pending',
        progress: 0,
        duration_days: 4,
        critical_path: false,
        dependencies: ['3'],
        deliverables: ['Performance tuning', 'Policy optimization', 'Monitoring setup'],
        success_criteria: ['Performance targets met', 'Monitoring dashboards active']
      }
    ];

    const initialCollaboration: CollaborationActivity[] = [
      {
        id: '1',
        user: 'Sarah Chen (CISO)',
        action: 'Approved security policies for guest network access',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: 'approval'
      },
      {
        id: '2',
        user: 'Mike Johnson (Network Admin)',
        action: 'Reported excellent performance on VLAN 10 testing',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'comment'
      },
      {
        id: '3',
        user: 'AI Assistant',
        action: 'Detected potential performance optimization opportunity',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        type: 'concern'
      }
    ];

    const prediction: SuccessPrediction = {
      probability: 87,
      confidence: 92,
      risk_factors: [
        {
          factor: 'Response time approaching target threshold',
          impact: 'medium',
          mitigation: 'Optimize database queries and enable caching'
        },
        {
          factor: 'Guest network compliance below target',
          impact: 'low',
          mitigation: 'Implement stricter device profiling rules'
        }
      ],
      recommendations: [
        'Consider implementing advanced device fingerprinting',
        'Schedule performance tuning session with network team',
        'Prepare user training materials for rollout phase'
      ]
    };

    setLiveMetrics(initialMetrics);
    setPocPhases(initialPhases);
    setCollaborationFeed(initialCollaboration);
    setSuccessPrediction(prediction);
    setSelectedPhase('3'); // Active phase
  };

  const startRealTimeUpdates = () => {
    metricsIntervalRef.current = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2, // Simulate realistic fluctuation
      })));

      // Occasionally add collaboration updates
      if (Math.random() < 0.3) {
        const updates = [
          'Test user reported successful login from mobile device',
          'Performance metrics within acceptable range',
          'Security scan completed - no issues found',
          'User feedback: Very smooth authentication experience'
        ];

        const newActivity: CollaborationActivity = {
          id: Date.now().toString(),
          user: ['Test User', 'AI Monitor', 'Security Scanner'][Math.floor(Math.random() * 3)],
          action: updates[Math.floor(Math.random() * updates.length)],
          timestamp: new Date(),
          type: 'comment'
        };

        setCollaborationFeed(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 3000);
  };

  const handlePOCControl = (action: 'start' | 'pause' | 'reset') => {
    switch (action) {
      case 'start':
        setPocStatus('active');
        setRealtimeUpdates(true);
        toast({
          title: "🚀 POC Resumed",
          description: "Real-time monitoring and data collection active",
        });
        break;
      case 'pause':
        setPocStatus('paused');
        setRealtimeUpdates(false);
        toast({
          title: "⏸️ POC Paused",
          description: "Data collection paused - current state preserved",
        });
        break;
      case 'reset':
        setPocStatus('planning');
        setRealtimeUpdates(false);
        initializePOCData();
        toast({
          title: "🔄 POC Reset",
          description: "POC environment reset to initial state",
        });
        break;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      case 'blocked': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* POC Control Center */}
      <Card className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Immersive POC Command Center</CardTitle>
                <p className="text-muted-foreground">
                  Real-time POC monitoring with AI-powered success prediction
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={pocStatus === 'active' ? 'default' : 'secondary'} className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                {pocStatus.toUpperCase()}
              </Badge>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePOCControl('start')}
                  disabled={pocStatus === 'active'}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePOCControl('pause')}
                  disabled={pocStatus === 'paused'}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePOCControl('reset')}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Live Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {liveMetrics.map((metric) => (
          <Card key={metric.id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.name}</span>
                <Badge className={getMetricStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Target: {metric.target}{metric.unit}</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span>{metric.trend}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main POC Interface */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topology">3D Topology</TabsTrigger>
          <TabsTrigger value="collaboration">War Room</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="reporting">Live Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* POC Phases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  POC Phases & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pocPhases.map((phase) => (
                  <div 
                    key={phase.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedPhase === phase.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{phase.name}</span>
                        {phase.critical_path && (
                          <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                        )}
                      </div>
                      <Badge className={getPhaseStatusColor(phase.status)}>
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Success Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Success Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {successPrediction && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {successPrediction.probability}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Success Probability ({successPrediction.confidence}% confidence)
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Risk Factors:</h4>
                      {successPrediction.risk_factors.map((risk, index) => (
                        <Alert key={index}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="font-medium">{risk.factor}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <strong>Impact:</strong> {risk.impact} | <strong>Mitigation:</strong> {risk.mitigation}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">AI Recommendations:</h4>
                      {successPrediction.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm bg-blue-50 p-2 rounded flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                3D POC Network Topology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center space-y-3">
                  <Globe className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-medium">Immersive 3D Network View</h3>
                  <p className="text-muted-foreground">
                    Interactive 3D topology showing POC deployment points, 
                    device relationships, and real-time traffic flow
                  </p>
                  <Button className="mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    Launch 3D Experience
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaborative War Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Request Approval
                  </Button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {collaborationFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'approval' ? 'bg-green-100 text-green-600' :
                        activity.type === 'concern' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'approval' ? <CheckCircle className="h-4 w-4" /> :
                         activity.type === 'concern' ? <AlertTriangle className="h-4 w-4" /> :
                         <MessageSquare className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.user}</div>
                        <div className="text-sm text-muted-foreground">{activity.action}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {activity.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Predictive Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Trends</h4>
                  <div className="h-48 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center border">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Real-time analytics chart</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Predictive Insights</h4>
                  <div className="space-y-3">
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        Authentication rates trending upward - 12% improvement over baseline
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Security posture improving - risk score decreased by 8 points
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        User satisfaction high - 94% positive feedback from test users
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Live Executive Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Executive Summary</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Shield className="h-6 w-6 mb-2" />
                  <span>Security Assessment</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>ROI Analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImmersivePOCManager;