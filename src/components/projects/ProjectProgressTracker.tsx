import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, CheckCircle, Clock, AlertTriangle, Target, 
  BarChart3, Calendar, Users, FileText, Plus, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays, parseISO } from 'date-fns';

interface Milestone {
  id: string;
  name: string;
  description: string;
  target_date: Date;
  completion_date?: Date;
  progress_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  dependencies: string[];
  deliverables: string[];
  owner: string;
}

interface ProgressUpdate {
  id: string;
  date: Date;
  update_type: 'milestone' | 'blocker' | 'achievement' | 'risk' | 'general';
  title: string;
  description: string;
  progress_impact: number; // percentage change
  updated_by: string;
  attachments?: string[];
}

interface ProjectProgressTrackerProps {
  projectId: string;
  currentProgress: number;
  targetCompletion?: string;
  onProgressUpdate?: (newProgress: number, update: ProgressUpdate) => void;
}

const ProjectProgressTracker: React.FC<ProjectProgressTrackerProps> = ({
  projectId,
  currentProgress,
  targetCompletion,
  onProgressUpdate
}) => {
  const { toast } = useToast();
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    target_date: '',
    owner: '',
    deliverables: ['']
  });
  const [newUpdate, setNewUpdate] = useState({
    type: 'general' as const,
    title: '',
    description: '',
    progress_impact: 0
  });
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Initialize with sample data - in production, fetch from database
    initializeSampleData();
  }, [projectId]);

  const initializeSampleData = () => {
    const sampleMilestones: Milestone[] = [
      {
        id: '1',
        name: 'Requirements Gathering',
        description: 'Complete business and technical requirements collection',
        target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress_percentage: 85,
        status: 'in_progress',
        dependencies: [],
        deliverables: ['Requirements Document', 'Stakeholder Sign-off'],
        owner: 'Business Analyst'
      },
      {
        id: '2',
        name: 'Infrastructure Setup',
        description: 'Deploy Portnox infrastructure and network configuration',
        target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        progress_percentage: 30,
        status: 'not_started',
        dependencies: ['1'],
        deliverables: ['Server Installation', 'Network Configuration', 'Security Setup'],
        owner: 'Infrastructure Team'
      },
      {
        id: '3',
        name: 'Integration Testing',
        description: 'Test all vendor integrations and authentication flows',
        target_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        progress_percentage: 0,
        status: 'not_started',
        dependencies: ['2'],
        deliverables: ['Test Results', 'Integration Documentation'],
        owner: 'QA Team'
      }
    ];

    const sampleUpdates: ProgressUpdate[] = [
      {
        id: '1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        update_type: 'achievement',
        title: 'Stakeholder Interviews Completed',
        description: 'Successfully completed interviews with all key stakeholders. Requirements are 85% complete.',
        progress_impact: 15,
        updated_by: 'Project Manager'
      },
      {
        id: '2',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        update_type: 'blocker',
        title: 'Network Access Delay',
        description: 'Waiting for network team to provide access to production environment. May impact timeline.',
        progress_impact: 0,
        updated_by: 'Technical Lead'
      }
    ];

    setMilestones(sampleMilestones);
    setProgressUpdates(sampleUpdates);
  };

  const calculateOverallProgress = () => {
    if (milestones.length === 0) return currentProgress;
    
    const totalWeight = milestones.length;
    const weightedProgress = milestones.reduce((sum, milestone) => {
      return sum + (milestone.progress_percentage / totalWeight);
    }, 0);
    
    return Math.round(weightedProgress);
  };

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.completion_date) return 'completed';
    if (milestone.progress_percentage === 0) return 'not_started';
    if (new Date() > milestone.target_date && milestone.progress_percentage < 100) return 'overdue';
    return 'in_progress';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'overdue': return 'bg-destructive/10 text-destructive';
      case 'not_started': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="h-4 w-4" />;
      case 'blocker': return <AlertTriangle className="h-4 w-4" />;
      case 'achievement': return <CheckCircle className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const addMilestone = () => {
    if (!newMilestone.name.trim() || !newMilestone.target_date) {
      toast({
        title: "Missing Information",
        description: "Please provide milestone name and target date",
        variant: "destructive"
      });
      return;
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      name: newMilestone.name,
      description: newMilestone.description,
      target_date: new Date(newMilestone.target_date),
      progress_percentage: 0,
      status: 'not_started',
      dependencies: [],
      deliverables: newMilestone.deliverables.filter(d => d.trim()),
      owner: newMilestone.owner
    };

    setMilestones(prev => [...prev, milestone]);
    setNewMilestone({
      name: '',
      description: '',
      target_date: '',
      owner: '',
      deliverables: ['']
    });
    setShowMilestoneForm(false);

    toast({
      title: "Milestone Added",
      description: `Milestone "${milestone.name}" has been added to the project.`
    });
  };

  const addProgressUpdate = () => {
    if (!newUpdate.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an update title",
        variant: "destructive"
      });
      return;
    }

    const update: ProgressUpdate = {
      id: Date.now().toString(),
      date: new Date(),
      update_type: newUpdate.type,
      title: newUpdate.title,
      description: newUpdate.description,
      progress_impact: newUpdate.progress_impact,
      updated_by: 'Current User' // In production, get from auth context
    };

    setProgressUpdates(prev => [update, ...prev]);
    
    // Update overall progress if there's an impact
    if (newUpdate.progress_impact !== 0) {
      const newProgress = Math.max(0, Math.min(100, currentProgress + newUpdate.progress_impact));
      onProgressUpdate?.(newProgress, update);
    }

    setNewUpdate({
      type: 'general',
      title: '',
      description: '',
      progress_impact: 0
    });
    setShowUpdateForm(false);

    toast({
      title: "Progress Updated",
      description: "Progress update has been added to the project timeline."
    });
  };

  const updateMilestoneProgress = (milestoneId: string, newProgress: number) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId 
        ? { 
            ...milestone, 
            progress_percentage: newProgress,
            status: newProgress === 100 ? 'completed' : getMilestoneStatus({ ...milestone, progress_percentage: newProgress }),
            completion_date: newProgress === 100 ? new Date() : undefined
          }
        : milestone
    ));

    // Recalculate overall progress
    const overallProgress = calculateOverallProgress();
    onProgressUpdate?.(overallProgress, {
      id: Date.now().toString(),
      date: new Date(),
      update_type: 'milestone',
      title: 'Milestone Progress Updated',
      description: `Updated progress for milestone`,
      progress_impact: 0,
      updated_by: 'Current User'
    });
  };

  const daysUntilTarget = targetCompletion ? differenceInDays(parseISO(targetCompletion), new Date()) : null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
              </div>
            </div>
            <Progress value={calculateOverallProgress()} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                <p className="text-2xl font-bold">
                  {milestones.filter(m => m.status === 'completed').length}/{milestones.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Days to Target</p>
                <p className="text-2xl font-bold">
                  {daysUntilTarget !== null ? (daysUntilTarget > 0 ? daysUntilTarget : 'Overdue') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Blockers</p>
                <p className="text-2xl font-bold">
                  {progressUpdates.filter(u => u.update_type === 'blocker').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="updates">Progress Updates</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Milestones
                </span>
                <Button onClick={() => setShowMilestoneForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{milestone.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(getMilestoneStatus(milestone))}`}>
                            {getMilestoneStatus(milestone).replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{milestone.progress_percentage}%</span>
                          </div>
                          <Progress value={milestone.progress_percentage} />
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={milestone.progress_percentage}
                              onChange={(e) => updateMilestoneProgress(milestone.id, parseInt(e.target.value) || 0)}
                              className="w-20 h-8"
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <span className="font-medium">Target Date:</span>
                            <p className="text-muted-foreground">{format(milestone.target_date, 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span>
                            <p className="text-muted-foreground">{milestone.owner}</p>
                          </div>
                          <div>
                            <span className="font-medium">Deliverables:</span>
                            <p className="text-muted-foreground">{milestone.deliverables.length} items</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {showMilestoneForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add New Milestone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Milestone Name</Label>
                        <Input
                          value={newMilestone.name}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Infrastructure Setup"
                        />
                      </div>
                      <div>
                        <Label>Target Date</Label>
                        <Input
                          type="date"
                          value={newMilestone.target_date}
                          onChange={(e) => setNewMilestone(prev => ({ ...prev, target_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the milestone objectives..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Owner</Label>
                      <Input
                        value={newMilestone.owner}
                        onChange={(e) => setNewMilestone(prev => ({ ...prev, owner: e.target.value }))}
                        placeholder="Responsible person or team"
                      />
                    </div>

                    <div>
                      <Label>Deliverables</Label>
                      <div className="space-y-2">
                        {newMilestone.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={deliverable}
                              onChange={(e) => {
                                const updated = [...newMilestone.deliverables];
                                updated[index] = e.target.value;
                                setNewMilestone(prev => ({ ...prev, deliverables: updated }));
                              }}
                              placeholder="Deliverable name"
                            />
                            {newMilestone.deliverables.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updated = newMilestone.deliverables.filter((_, i) => i !== index);
                                  setNewMilestone(prev => ({ ...prev, deliverables: updated }));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewMilestone(prev => ({ ...prev, deliverables: [...prev.deliverables, ''] }))}
                        >
                          Add Deliverable
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowMilestoneForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addMilestone}>
                        Add Milestone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Updates
                </span>
                <Button onClick={() => setShowUpdateForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Update
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressUpdates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No progress updates yet. Click "Add Update" to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {progressUpdates.map((update) => (
                    <Card key={update.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            update.update_type === 'achievement' ? 'bg-success/10 text-success' :
                            update.update_type === 'blocker' ? 'bg-destructive/10 text-destructive' :
                            update.update_type === 'milestone' ? 'bg-primary/10 text-primary' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {getUpdateTypeIcon(update.update_type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{update.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>{format(update.date, 'MMM dd, yyyy HH:mm')}</span>
                                  <span>By {update.updated_by}</span>
                                  {update.progress_impact !== 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {update.progress_impact > 0 ? '+' : ''}{update.progress_impact}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {update.update_type.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {showUpdateForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Progress Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Update Type</Label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={newUpdate.type}
                          onChange={(e) => setNewUpdate(prev => ({ ...prev, type: e.target.value as any }))}
                        >
                          <option value="general">General Update</option>
                          <option value="milestone">Milestone</option>
                          <option value="achievement">Achievement</option>
                          <option value="blocker">Blocker</option>
                          <option value="risk">Risk</option>
                        </select>
                      </div>
                      <div>
                        <Label>Progress Impact (%)</Label>
                        <Input
                          type="number"
                          min="-50"
                          max="50"
                          value={newUpdate.progress_impact}
                          onChange={(e) => setNewUpdate(prev => ({ ...prev, progress_impact: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Update Title</Label>
                      <Input
                        value={newUpdate.title}
                        onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief summary of the update"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newUpdate.description}
                        onChange={(e) => setNewUpdate(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed description of the progress update..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addProgressUpdate}>
                        Add Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones
                  .sort((a, b) => a.target_date.getTime() - b.target_date.getTime())
                  .map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                          milestone.status === 'completed' ? 'bg-success text-success-foreground' :
                          milestone.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
                          milestone.status === 'overdue' ? 'bg-destructive text-destructive-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="w-0.5 h-8 bg-border mx-auto mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{milestone.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: {format(milestone.target_date, 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{milestone.progress_percentage}%</div>
                            <Badge className={`text-xs ${getStatusColor(getMilestoneStatus(milestone))}`}>
                              {getMilestoneStatus(milestone).replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={milestone.progress_percentage} className="mt-2" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectProgressTracker;