import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, Clock, AlertTriangle, Edit, Plus, Calendar,
  Target, Users, FileText, Save, X 
} from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  start_date?: string;
  end_date?: string;
  estimated_duration: number;
  dependencies: string[];
  deliverables: string[];
  assigned_team: string[];
}

interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'completed' | 'at-risk';
  description: string;
  phase_id: string;
}

interface PhaseManagementPanelProps {
  projectId: string;
  phases: Phase[];
  milestones: Milestone[];
  onUpdatePhase?: (phase: Phase) => void;
  onUpdateMilestone?: (milestone: Milestone) => void;
}

const PhaseManagementPanel: React.FC<PhaseManagementPanelProps> = ({
  projectId,
  phases,
  milestones,
  onUpdatePhase,
  onUpdateMilestone
}) => {
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [showPhaseDialog, setShowPhaseDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'at-risk': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'blocked': return 'destructive';
      case 'at-risk': return 'secondary';
      default: return 'outline';
    }
  };

  const handlePhaseEdit = (phase: Phase) => {
    setEditingPhase(phase);
    setShowPhaseDialog(true);
  };

  const handleMilestoneEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setShowMilestoneDialog(true);
  };

  const handlePhaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhase && onUpdatePhase) {
      onUpdatePhase(editingPhase);
    }
    setShowPhaseDialog(false);
    setEditingPhase(null);
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMilestone && onUpdateMilestone) {
      onUpdateMilestone(editingMilestone);
    }
    setShowMilestoneDialog(false);
    setEditingMilestone(null);
  };

  return (
    <div className="space-y-6">
      {/* Phases Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Phases
            </span>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Phase
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(phase.status)}
                  <h3 className="font-medium">{phase.name}</h3>
                  <Badge variant={getStatusColor(phase.status) as any}>
                    {phase.status.replace('-', ' ')}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePhaseEdit(phase)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <Progress value={phase.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span> {phase.estimated_duration} days
                </div>
                <div>
                  <span className="text-muted-foreground">Team:</span> {phase.assigned_team.length} members
                </div>
              </div>

              {phase.deliverables.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Deliverables:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {phase.deliverables.map((deliverable, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Milestones Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Milestones
            </span>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(milestone.status)}
                  <h3 className="font-medium">{milestone.name}</h3>
                  <Badge variant={getStatusColor(milestone.status) as any}>
                    {milestone.status}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMilestoneEdit(milestone)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                {milestone.date}
              </div>
              
              <p className="text-sm">{milestone.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Phase Edit Dialog */}
      <Dialog open={showPhaseDialog} onOpenChange={setShowPhaseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Phase: {editingPhase?.name}</DialogTitle>
          </DialogHeader>
          
          {editingPhase && (
            <form onSubmit={handlePhaseSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phase Name</Label>
                  <Input
                    value={editingPhase.name}
                    onChange={(e) => setEditingPhase({...editingPhase, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingPhase.status} 
                    onValueChange={(value: any) => setEditingPhase({...editingPhase, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={editingPhase.start_date || ''}
                    onChange={(e) => setEditingPhase({...editingPhase, start_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={editingPhase.end_date || ''}
                    onChange={(e) => setEditingPhase({...editingPhase, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editingPhase.progress}
                  onChange={(e) => setEditingPhase({...editingPhase, progress: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowPhaseDialog(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Milestone Edit Dialog */}
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Milestone: {editingMilestone?.name}</DialogTitle>
          </DialogHeader>
          
          {editingMilestone && (
            <form onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Milestone Name</Label>
                <Input
                  value={editingMilestone.name}
                  onChange={(e) => setEditingMilestone({...editingMilestone, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editingMilestone.date}
                    onChange={(e) => setEditingMilestone({...editingMilestone, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingMilestone.status} 
                    onValueChange={(value: any) => setEditingMilestone({...editingMilestone, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingMilestone.description}
                  onChange={(e) => setEditingMilestone({...editingMilestone, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowMilestoneDialog(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhaseManagementPanel;