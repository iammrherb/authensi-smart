import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Clock, Users, AlertTriangle, CheckCircle, Activity, DollarSign, Calendar, Zap } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  trend: number[];
  color: string;
}

interface EnhancedAnalyticsDashboardProps {
  projectId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({ 
  projectId, 
  timeRange = '30d' 
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data generation based on time range
    const generateMetrics = (): MetricCard[] => {
      return [
        {
          title: 'Project Progress',
          value: '73%',
          change: 12,
          changeType: 'increase',
          icon: <Target className="h-5 w-5" />,
          trend: [65, 68, 70, 71, 73],
          color: 'hsl(var(--primary))'
        },
        {
          title: 'Tasks Completed',
          value: 142,
          change: 8,
          changeType: 'increase',
          icon: <CheckCircle className="h-5 w-5" />,
          trend: [120, 125, 135, 140, 142],
          color: 'hsl(142, 76%, 36%)'
        },
        {
          title: 'Budget Utilization',
          value: '68%',
          change: -3,
          changeType: 'decrease',
          icon: <DollarSign className="h-5 w-5" />,
          trend: [75, 72, 70, 69, 68],
          color: 'hsl(47, 96%, 53%)'
        },
        {
          title: 'Team Productivity',
          value: '94%',
          change: 15,
          changeType: 'increase',
          icon: <Activity className="h-5 w-5" />,
          trend: [85, 88, 90, 92, 94],
          color: 'hsl(262, 83%, 58%)'
        },
        {
          title: 'Active Risks',
          value: 7,
          change: -2,
          changeType: 'decrease',
          icon: <AlertTriangle className="h-5 w-5" />,
          trend: [12, 10, 9, 8, 7],
          color: 'hsl(0, 84%, 60%)'
        },
        {
          title: 'Time Efficiency',
          value: '87%',
          change: 5,
          changeType: 'increase',
          icon: <Clock className="h-5 w-5" />,
          trend: [80, 82, 84, 86, 87],
          color: 'hsl(200, 98%, 39%)'
        },
        {
          title: 'Stakeholder Satisfaction',
          value: '4.6/5',
          change: 0.2,
          changeType: 'increase',
          icon: <Users className="h-5 w-5" />,
          trend: [4.2, 4.3, 4.4, 4.5, 4.6],
          color: 'hsl(173, 58%, 39%)'
        },
        {
          title: 'Velocity Score',
          value: 89,
          change: 11,
          changeType: 'increase',
          icon: <Zap className="h-5 w-5" />,
          trend: [75, 78, 82, 85, 89],
          color: 'hsl(280, 65%, 60%)'
        }
      ];
    };

    setTimeout(() => {
      setMetrics(generateMetrics());
      setLoading(false);
    }, 1000);
  }, [selectedTimeRange]);

  const getTrendDirection = (trend: number[]) => {
    const first = trend[0];
    const last = trend[trend.length - 1];
    return last > first ? 'up' : last < first ? 'down' : 'stable';
  };

  const renderMiniChart = (trend: number[], color: string) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min;
    
    return (
      <svg width="60" height="20" className="ml-auto">
        <polyline
          points={trend.map((value, index) => {
            const x = (index / (trend.length - 1)) * 55;
            const y = 15 - ((value - min) / range) * 10;
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="opacity-60"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-muted/50" style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : metric.changeType === 'decrease' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {metric.changeType === 'increase' ? '+' : metric.changeType === 'decrease' ? '-' : ''}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">
                    {metric.value}
                  </p>
                  {renderMiniChart(metric.trend, metric.color)}
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sprint Velocity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'].map((sprint, index) => (
                    <div key={sprint} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{sprint}</span>
                        <span className="font-medium">{85 + index * 3} pts</span>
                      </div>
                      <Progress value={85 + index * 3} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Task Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Completed', value: 65, color: 'hsl(142, 76%, 36%)' },
                    { label: 'In Progress', value: 25, color: 'hsl(47, 96%, 53%)' },
                    { label: 'Todo', value: 10, color: 'hsl(220, 14%, 96%)' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Frontend Team', 'Backend Team', 'DevOps Team'].map((team, index) => (
                    <div key={team} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{team}</span>
                        <span className="font-medium">{92 - index * 5}%</span>
                      </div>
                      <Progress value={92 - index * 5} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Development', 'Testing', 'Infrastructure'].map((category, index) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span className="font-medium">${(50 + index * 15)}k</span>
                      </div>
                      <Progress value={60 + index * 15} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Planning', 'Development', 'Review'].map((phase, index) => (
                    <div key={phase} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{phase}</span>
                        <span className="font-medium">{25 + index * 10}%</span>
                      </div>
                      <Progress value={25 + index * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Test Coverage', value: 94 },
                    { metric: 'Code Review Score', value: 88 },
                    { metric: 'Technical Debt', value: 15 },
                    { metric: 'Bug Density', value: 2.3 }
                  ].map((item) => (
                    <div key={item.metric} className="flex justify-between items-center">
                      <span className="text-sm">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={item.value} className="w-20 h-2" />
                        <span className="text-sm font-medium w-12">
                          {item.metric === 'Bug Density' ? `${item.value}%` : `${item.value}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.91)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">91%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent security posture
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Project Completion Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">Estimated Completion</p>
                    <p className="text-2xl font-bold text-primary">March 15, 2024</p>
                    <p className="text-sm text-muted-foreground">
                      93% confidence level
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Best Case</span>
                      <span className="font-medium">March 8, 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Worst Case</span>
                      <span className="font-medium">March 28, 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { risk: 'Schedule Delay', probability: 23, impact: 'Medium' },
                    { risk: 'Budget Overrun', probability: 15, impact: 'High' },
                    { risk: 'Resource Shortage', probability: 8, impact: 'Low' }
                  ].map((risk) => (
                    <div key={risk.risk} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{risk.risk}</span>
                        <Badge variant={risk.probability > 20 ? 'destructive' : risk.probability > 10 ? 'secondary' : 'default'}>
                          {risk.probability}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Impact: {risk.impact}</span>
                        <Progress value={risk.probability} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;