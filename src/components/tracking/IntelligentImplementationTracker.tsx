import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Brain, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Zap,
  BarChart3,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  ExternalLink
} from 'lucide-react';
import { 
  IntelligentTrackingEngine, 
  TrackingContext, 
  SmartChecklist, 
  SmartChecklistItem,
  RealTimeMetric,
  PredictiveAlert,
  TrackingRecommendation,
  IntelligentReport
} from '@/services/IntelligentTrackingEngine';

interface IntelligentImplementationTrackerProps {
  projectId: string;
  implementationType: 'poc' | 'pilot' | 'full_deployment' | 'migration';
  onUpdate?: (context: TrackingContext) => void;
}

const IntelligentImplementationTracker: React.FC<IntelligentImplementationTrackerProps> = ({
  projectId,
  implementationType,
  onUpdate
}) => {
  const [trackingEngine, setTrackingEngine] = useState<IntelligentTrackingEngine | null>(null);
  const [context, setContext] = useState<TrackingContext | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChecklist, setSelectedChecklist] = useState<SmartChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [editingItem, setEditingItem] = useState<SmartChecklistItem | null>(null);
  const [reportData, setReportData] = useState<IntelligentReport | null>(null);

  // Initialize tracking engine
  useEffect(() => {
    const initializeTracking = async () => {
      setIsInitializing(true);
      try {
        const engine = new IntelligentTrackingEngine(projectId, implementationType);
        const initialContext = await engine.initializeTracking();
        
        setTrackingEngine(engine);
        setContext(initialContext);
        setSelectedChecklist(initialContext.smart_checklists[0] || null);
        
        toast.success("Intelligent tracking system initialized!");
      } catch (error) {
        console.error('Failed to initialize tracking:', error);
        toast.error("Failed to initialize tracking system");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeTracking();
  }, [projectId, implementationType]);

  // Handle checklist item update
  const handleItemUpdate = async (itemId: string, status: SmartChecklistItem['status'], actualHours?: number, notes?: string) => {
    if (!trackingEngine) return;

    setIsLoading(true);
    try {
      await trackingEngine.updateProgress(itemId, status, actualHours, notes);
      
      // Refresh context
      const updatedContext = await trackingEngine.initializeTracking();
      setContext(updatedContext);
      onUpdate?.(updatedContext);
      
      toast.success("Progress updated successfully!");
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error("Failed to update progress");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate intelligent report
  const handleGenerateReport = async () => {
    if (!trackingEngine) return;

    setIsLoading(true);
    try {
      const report = await trackingEngine.generateIntelligentReport();
      setReportData(report);
      toast.success("Intelligent report generated!");
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error("Failed to generate intelligent report");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!context?.smart_checklists.length) return 0;
    
    const totalItems = context.smart_checklists.reduce((sum, cl) => sum + cl.items.length, 0);
    const completedItems = context.smart_checklists.reduce(
      (sum, cl) => sum + cl.items.filter(item => item.status === 'completed').length, 
      0
    );
    
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  // Get status color
  const getStatusColor = (status: SmartChecklistItem['status'] | string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'skipped': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'delayed': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: SmartChecklistItem['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(calculateOverallProgress())}%</div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <Progress value={calculateOverallProgress()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {context?.smart_checklists.reduce((sum, cl) => sum + cl.items.filter(item => item.status === 'in_progress').length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {context?.predictive_alerts.filter(alert => alert.status === 'active').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {context?.ai_recommendations.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">AI Recommendations</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Phase Status */}
      {context?.current_phase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Phase: {context.current_phase.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={getStatusColor(context.current_phase.status)}>
                {context.current_phase.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {context.current_phase.completion_percentage}% Complete
              </span>
            </div>
            <Progress value={context.current_phase.completion_percentage} className="mb-4" />
            
            {context.current_phase.success_criteria.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Success Criteria</h4>
                <div className="space-y-2">
                  {context.current_phase.success_criteria.map(criteria => (
                    <div key={criteria.id} className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${criteria.status === 'met' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm">{criteria.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {context?.predictive_alerts.filter(alert => alert.status === 'active').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {context.predictive_alerts.filter(alert => alert.status === 'active').map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{alert.title}</h5>
                      <Badge variant="outline" className={getPriorityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Probability: {Math.round(alert.probability * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {context?.ai_recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {context.ai_recommendations.slice(0, 3).map(recommendation => (
                <div key={recommendation.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Brain className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium">{recommendation.title}</h5>
                      <Badge variant="outline">
                        {Math.round(recommendation.confidence_score * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                    <p className="text-xs text-muted-foreground">{recommendation.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render checklists tab
  const renderChecklists = () => (
    <div className="space-y-6">
      {/* Checklist Selector */}
      <div className="flex items-center gap-4">
        <Select 
          value={selectedChecklist?.id} 
          onValueChange={(value) => {
            const checklist = context?.smart_checklists.find(cl => cl.id === value);
            setSelectedChecklist(checklist || null);
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select checklist" />
          </SelectTrigger>
          <SelectContent>
            {context?.smart_checklists.map(checklist => (
              <SelectItem key={checklist.id} value={checklist.id}>
                {checklist.title} ({checklist.completion_percentage}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedChecklist && (
          <Badge variant="outline">
            {selectedChecklist.items.filter(item => item.status === 'completed').length} / {selectedChecklist.items.length} Complete
          </Badge>
        )}
      </div>

      {/* Selected Checklist */}
      {selectedChecklist && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedChecklist.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedChecklist.estimated_duration} • Priority Score: {selectedChecklist.priority_score}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedChecklist.ai_optimized && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Optimized
                  </Badge>
                )}
                <Badge variant="outline">
                  {selectedChecklist.completion_percentage}% Complete
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={selectedChecklist.completion_percentage} className="mb-6" />
            
            <div className="space-y-4">
              {selectedChecklist.items.map(item => (
                <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={item.status === 'completed'}
                    onCheckedChange={(checked) => {
                      const newStatus = checked ? 'completed' : 'not_started';
                      handleItemUpdate(item.id, newStatus);
                    }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Est: {item.estimated_hours}h</span>
                      {item.actual_hours && <span>Actual: {item.actual_hours}h</span>}
                      {item.assigned_to && <span>Assigned: {item.assigned_to}</span>}
                    </div>
                    
                    {item.dependencies.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Dependencies: {item.dependencies.join(', ')}</span>
                      </div>
                    )}
                    
                    {item.ai_guidance && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Brain className="h-3 w-3 text-blue-500" />
                          <span className="font-medium text-blue-700">AI Guidance</span>
                        </div>
                        <p className="text-blue-600">{item.ai_guidance}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.automation_available && (
                      <Button size="sm" variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        Auto
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select defaultValue={item.status}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not_started">Not Started</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="skipped">Skipped</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Actual Hours</Label>
                            <Input type="number" placeholder="Enter actual hours" />
                          </div>
                          
                          <div>
                            <Label>Notes</Label>
                            <Textarea placeholder="Add completion notes..." />
                          </div>
                          
                          <Button className="w-full">Update Task</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Render analytics tab
  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Real-time Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {context?.real_time_metrics.map(metric => (
              <div key={metric.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{metric.metric_name}</h4>
                  <Badge variant="outline" className={
                    metric.trend === 'improving' ? 'text-green-600' :
                    metric.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                  }>
                    {metric.trend}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.current_value} {metric.unit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {metric.target_value} {metric.unit}
                </div>
                <Progress 
                  value={(metric.current_value / metric.target_value) * 100} 
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={handleGenerateReport} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate AI Report'}
            </Button>
            
            {reportData && (
              <Badge variant="outline" className="text-green-600">
                Report generated at {reportData.generated_at.toLocaleTimeString()}
              </Badge>
            )}
          </div>
          
          {reportData && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <h4 className="font-medium mb-2">Executive Summary</h4>
              <p className="text-sm text-muted-foreground">{reportData.executive_summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Initializing Intelligent Tracking</h3>
          <p className="text-muted-foreground">Setting up AI-powered implementation tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-background via-accent/10 to-primary/5 border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent mb-2">
                Intelligent Implementation Tracker
              </CardTitle>
              <p className="text-muted-foreground">
                AI-driven implementation tracking for {implementationType.replace('_', ' ')} projects
              </p>
            </div>
            <Badge variant="glow" className="text-sm px-3 py-1">
              <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              Live Tracking
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="checklists" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Smart Checklists
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="checklists">
          {renderChecklists()}
        </TabsContent>

        <TabsContent value="analytics">
          {renderAnalytics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentImplementationTracker;