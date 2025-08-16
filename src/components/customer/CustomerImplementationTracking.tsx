import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, Clock, AlertTriangle, Calendar, Target, 
  Activity, TrendingUp, Users, MapPin, Zap, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImplementationMilestone {
  id: string;
  phase: string;
  milestone_name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  assigned_to: string;
  target_date: string;
  completion_date?: string;
  progress_percentage: number;
  dependencies: string[];
  success_criteria: string[];
  deliverables: string[];
}

interface CustomerImplementationTrackingProps {
  projectId: string;
  onEventLog: (eventType: string, eventData: any) => void;
}

const phaseOrder = ['Planning', 'Design', 'Implementation', 'Testing', 'Deployment', 'Support'];

const CustomerImplementationTracking: React.FC<CustomerImplementationTrackingProps> = ({
  projectId,
  onEventLog
}) => {
  const [milestones, setMilestones] = useState<ImplementationMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImplementationData();
    onEventLog('implementation_view', { project_id: projectId });
  }, [projectId]);

  const fetchImplementationData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('customer_implementation_tracking')
        .select('*')
        .eq('project_id', projectId)
        .order('target_date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setMilestones(data);
      } else {
        // Create default milestones if none exist
        setMilestones(getDefaultMilestones());
      }
    } catch (error) {
      console.error('Error fetching implementation data:', error);
      toast.error('Failed to load implementation tracking');
      // Fallback to default milestones
      setMilestones(getDefaultMilestones());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMilestones = (): ImplementationMilestone[] => {
    const today = new Date();
    return [
      {
        id: '1',
        phase: 'Planning',
        milestone_name: 'Requirements Gathering',
        description: 'Complete analysis of network infrastructure and security requirements',
        status: 'completed',
        assigned_to: 'Technical Team',
        target_date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completion_date: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 100,
        dependencies: [],
        success_criteria: ['All requirements documented', 'Stakeholder approval received'],
        deliverables: ['Requirements document', 'Network assessment report']
      },
      {
        id: '2',
        phase: 'Planning',
        milestone_name: 'Project Scoping',
        description: 'Define project scope, timeline, and resource allocation',
        status: 'completed',
        assigned_to: 'Project Manager',
        target_date: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completion_date: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 100,
        dependencies: ['Requirements Gathering'],
        success_criteria: ['Scope approved', 'Timeline confirmed'],
        deliverables: ['Project scope document', 'Resource plan']
      },
      {
        id: '3',
        phase: 'Design',
        milestone_name: 'Network Architecture Design',
        description: 'Design NAC implementation architecture and integration points',
        status: 'in_progress',
        assigned_to: 'Solutions Architect',
        target_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 75,
        dependencies: ['Project Scoping'],
        success_criteria: ['Architecture approved', 'Integration points validated'],
        deliverables: ['Architecture diagrams', 'Integration specifications']
      },
      {
        id: '4',
        phase: 'Design',
        milestone_name: 'Security Policy Framework',
        description: 'Develop comprehensive security policies and access controls',
        status: 'in_progress',
        assigned_to: 'Security Team',
        target_date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 45,
        dependencies: ['Network Architecture Design'],
        success_criteria: ['Policies defined', 'Compliance validated'],
        deliverables: ['Security policy document', 'Access control matrix']
      },
      {
        id: '5',
        phase: 'Implementation',
        milestone_name: 'Core System Deployment',
        description: 'Deploy and configure Portnox NAC core components',
        status: 'pending',
        assigned_to: 'Implementation Team',
        target_date: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 0,
        dependencies: ['Security Policy Framework'],
        success_criteria: ['Core system operational', 'Basic connectivity confirmed'],
        deliverables: ['Deployed system', 'Configuration documentation']
      },
      {
        id: '6',
        phase: 'Implementation',
        milestone_name: 'Integration & Configuration',
        description: 'Integrate with existing network infrastructure and configure policies',
        status: 'pending',
        assigned_to: 'Integration Team',
        target_date: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 0,
        dependencies: ['Core System Deployment'],
        success_criteria: ['All integrations working', 'Policies active'],
        deliverables: ['Integration test results', 'Policy configurations']
      },
      {
        id: '7',
        phase: 'Testing',
        milestone_name: 'User Acceptance Testing',
        description: 'Conduct comprehensive testing with customer team',
        status: 'pending',
        assigned_to: 'QA Team',
        target_date: new Date(today.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 0,
        dependencies: ['Integration & Configuration'],
        success_criteria: ['All tests passed', 'User acceptance confirmed'],
        deliverables: ['Test reports', 'User acceptance sign-off']
      },
      {
        id: '8',
        phase: 'Deployment',
        milestone_name: 'Production Go-Live',
        description: 'Deploy to production environment and enable monitoring',
        status: 'pending',
        assigned_to: 'Deployment Team',
        target_date: new Date(today.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress_percentage: 0,
        dependencies: ['User Acceptance Testing'],
        success_criteria: ['Production deployment successful', 'Monitoring active'],
        deliverables: ['Production system', 'Monitoring dashboards']
      }
    ];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchImplementationData();
    setRefreshing(false);
    onEventLog('implementation_refresh', {});
    toast.success('Implementation data refreshed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'delayed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Activity;
      case 'delayed': return AlertTriangle;
      default: return Clock;
    }
  };

  const filteredMilestones = selectedPhase === 'all' 
    ? milestones 
    : milestones.filter(m => m.phase === selectedPhase);

  const phaseProgress = phaseOrder.map(phase => {
    const phaseMilestones = milestones.filter(m => m.phase === phase);
    const totalProgress = phaseMilestones.reduce((sum, m) => sum + m.progress_percentage, 0);
    const avgProgress = phaseMilestones.length > 0 ? totalProgress / phaseMilestones.length : 0;
    
    return {
      phase,
      progress: Math.round(avgProgress),
      milestones: phaseMilestones.length,
      completed: phaseMilestones.filter(m => m.status === 'completed').length
    };
  });

  const overallProgress = Math.round(
    milestones.reduce((sum, m) => sum + m.progress_percentage, 0) / milestones.length
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Implementation Tracking
          </h2>
          <p className="text-muted-foreground">
            Monitor project phases, milestones, and delivery progress
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              {phaseOrder.map(phase => (
                <SelectItem key={phase} value={phase}>{phase}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Implementation Progress</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {overallProgress}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {phaseProgress.map(phase => (
              <div key={phase.phase} className="text-center">
                <div className="font-medium text-sm">{phase.phase}</div>
                <div className="text-2xl font-bold text-primary">{phase.progress}%</div>
                <div className="text-xs text-muted-foreground">
                  {phase.completed}/{phase.milestones} milestones
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="phases">By Phase</TabsTrigger>
          <TabsTrigger value="status">By Status</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {filteredMilestones.map((milestone, index) => {
            const StatusIcon = getStatusIcon(milestone.status);
            const isOverdue = milestone.status !== 'completed' && 
              new Date(milestone.target_date) < new Date();

            return (
              <Card key={milestone.id} className={isOverdue ? 'border-destructive/50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          milestone.status === 'completed' ? 'bg-success/10' :
                          milestone.status === 'in_progress' ? 'bg-primary/10' :
                          milestone.status === 'delayed' ? 'bg-destructive/10' : 'bg-secondary/10'
                        }`}>
                          <StatusIcon className={`w-6 h-6 ${
                            milestone.status === 'completed' ? 'text-success' :
                            milestone.status === 'in_progress' ? 'text-primary' :
                            milestone.status === 'delayed' ? 'text-destructive' : 'text-muted-foreground'
                          }`} />
                        </div>
                        {index < filteredMilestones.length - 1 && (
                          <div className="absolute top-12 left-6 w-0.5 h-16 bg-border"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{milestone.milestone_name}</h3>
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{milestone.phase}</Badge>
                            {isOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {milestone.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Assigned to:</span>
                            <p className="text-muted-foreground flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {milestone.assigned_to}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Target Date:</span>
                            <p className="text-muted-foreground flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(milestone.target_date).toLocaleDateString()}
                            </p>
                          </div>
                          {milestone.completion_date && (
                            <div>
                              <span className="font-medium">Completed:</span>
                              <p className="text-success flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                {new Date(milestone.completion_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {milestone.status !== 'completed' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{milestone.progress_percentage}%</span>
                            </div>
                            <Progress value={milestone.progress_percentage} className="h-2" />
                          </div>
                        )}

                        {milestone.success_criteria.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Success Criteria:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {milestone.success_criteria.map((criteria, idx) => (
                                <li key={idx}>{criteria}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {milestone.deliverables.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Deliverables:</h4>
                            <div className="flex flex-wrap gap-2">
                              {milestone.deliverables.map((deliverable, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {deliverable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {phaseOrder.map(phase => {
            const phaseMilestones = milestones.filter(m => m.phase === phase);
            if (phaseMilestones.length === 0) return null;

            const phaseData = phaseProgress.find(p => p.phase === phase);

            return (
              <Card key={phase}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{phase} Phase</span>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        {phaseData?.completed}/{phaseData?.milestones} Complete
                      </Badge>
                      <Badge className="bg-primary/10 text-primary">
                        {phaseData?.progress}%
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={phaseData?.progress} className="mb-4" />
                  <div className="space-y-3">
                    {phaseMilestones.map(milestone => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(milestone.status)} variant="secondary">
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                          <span className="font-medium">{milestone.milestone_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {milestone.progress_percentage}% • {new Date(milestone.target_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          {['in_progress', 'pending', 'completed', 'delayed'].map(status => {
            const statusMilestones = milestones.filter(m => m.status === status);
            if (statusMilestones.length === 0) return null;

            return (
              <Card key={status}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Badge className={getStatusColor(status)}>
                      {status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span>{statusMilestones.length} Milestones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statusMilestones.map(milestone => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{milestone.milestone_name}</div>
                          <div className="text-sm text-muted-foreground">{milestone.phase} Phase</div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{milestone.progress_percentage}%</div>
                          <div className="text-muted-foreground">
                            {new Date(milestone.target_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerImplementationTracking;