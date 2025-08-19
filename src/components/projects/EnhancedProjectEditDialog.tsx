import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar as CalendarIcon, Save, X, TrendingUp, AlertTriangle, 
  Clock, Users, FileText, Download, Target, CheckCircle,
  BarChart3, Settings, Brain, Zap, Shield, Network
} from 'lucide-react';
import { useUpdateProject, type Project } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectMeeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  attendees: string[];
  type: 'kickoff' | 'review' | 'planning' | 'demo' | 'retrospective' | 'stakeholder';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

interface RiskItem {
  id: string;
  category: 'technical' | 'business' | 'security' | 'timeline' | 'budget' | 'resource';
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation_strategy: string;
  owner: string;
  status: 'identified' | 'monitoring' | 'mitigating' | 'resolved' | 'occurred';
  due_date?: Date;
}

interface ProjectReport {
  id: string;
  type: 'status' | 'progress' | 'risk' | 'deployment' | 'financial' | 'comprehensive';
  title: string;
  description: string;
  generated_at: Date;
  sections: string[];
  format: 'pdf' | 'docx' | 'html' | 'json';
  auto_generate: boolean;
  frequency?: 'weekly' | 'monthly' | 'milestone';
}

interface EnhancedProjectEditDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const EnhancedProjectEditDialog: React.FC<EnhancedProjectEditDialogProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { toast } = useToast();
  const updateProject = useUpdateProject();
  
  // Form state
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    current_phase: project?.current_phase || 'discovery',
    start_date: project?.start_date || '',
    target_completion: project?.target_completion || '',
    budget: project?.budget || '',
    client_name: project?.client_name || '',
    progress_percentage: project?.progress_percentage || 0
  });

  // Progress tracking state
  const [progressNotes, setProgressNotes] = useState('');
  const [milestoneUpdate, setMilestoneUpdate] = useState('');
  const [blockers, setBlockers] = useState<string[]>([]);
  const [newBlocker, setNewBlocker] = useState('');

  // Meeting scheduling state
  const [meetings, setMeetings] = useState<ProjectMeeting[]>([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: new Date(),
    duration: 60,
    attendees: [''],
    type: 'review' as const
  });
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  // Risk assessment state
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [newRisk, setNewRisk] = useState({
    category: 'technical' as const,
    description: '',
    probability: 'medium' as const,
    impact: 'medium' as const,
    mitigation_strategy: '',
    owner: ''
  });
  const [showRiskForm, setShowRiskForm] = useState(false);

  // Report generation state
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [reportConfig, setReportConfig] = useState({
    type: 'status' as const,
    title: '',
    sections: ['overview', 'progress', 'risks', 'timeline'],
    format: 'pdf' as const,
    auto_generate: false
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    if (project) {
      // Initialize with project data
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'planning',
        current_phase: project.current_phase || 'discovery',
        start_date: project.start_date || '',
        target_completion: project.target_completion || '',
        budget: project.budget?.toString() || '',
        client_name: project.client_name || '',
        progress_percentage: project.progress_percentage || 0
      });

      // Load existing meetings, risks, and reports from project data
      // In a real implementation, these would come from the database
      initializeMockData();
    }
  }, [project]);

  const initializeMockData = () => {
    // Initialize with sample data - in production, this would come from database
    setMeetings([
      {
        id: '1',
        title: 'Project Kickoff',
        description: 'Initial project setup and stakeholder alignment',
        date: addDays(new Date(), 2),
        duration: 90,
        attendees: ['john@company.com', 'jane@client.com'],
        type: 'kickoff',
        status: 'scheduled'
      }
    ]);

    setRisks([
      {
        id: '1',
        category: 'technical',
        description: 'Network infrastructure compatibility issues',
        probability: 'medium',
        impact: 'high',
        severity: 'high',
        mitigation_strategy: 'Conduct thorough pre-deployment testing',
        owner: 'Technical Lead',
        status: 'monitoring'
      }
    ]);

    setReports([
      {
        id: '1',
        type: 'status',
        title: 'Weekly Status Report',
        description: 'Regular project status updates',
        generated_at: new Date(),
        sections: ['overview', 'progress', 'risks'],
        format: 'pdf',
        auto_generate: true,
        frequency: 'weekly'
      }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProject.mutateAsync({
        id: project.id,
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget.toString()) : null,
        progress_percentage: parseInt(formData.progress_percentage.toString())
      });
      
      toast({
        title: "Project Updated",
        description: "Project details have been successfully updated."
      });
      
      onUpdate?.();
      onClose();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProgressUpdate = () => {
    if (!progressNotes.trim()) {
      toast({
        title: "Progress Update Required",
        description: "Please enter progress notes",
        variant: "destructive"
      });
      return;
    }

    // Update progress with notes
    setFormData(prev => ({
      ...prev,
      progress_percentage: Math.min(100, prev.progress_percentage + 5) // Sample increment
    }));

    toast({
      title: "Progress Updated",
      description: "Project progress has been updated with your notes."
    });

    setProgressNotes('');
    setMilestoneUpdate('');
  };

  const addBlocker = () => {
    if (newBlocker.trim()) {
      setBlockers(prev => [...prev, newBlocker.trim()]);
      setNewBlocker('');
    }
  };

  const removeBlocker = (index: number) => {
    setBlockers(prev => prev.filter((_, i) => i !== index));
  };

  const scheduleMeeting = () => {
    if (!newMeeting.title.trim()) {
      toast({
        title: "Meeting Title Required",
        description: "Please enter a meeting title",
        variant: "destructive"
      });
      return;
    }

    const meeting: ProjectMeeting = {
      id: Date.now().toString(),
      ...newMeeting,
      attendees: newMeeting.attendees.filter(email => email.trim()),
      status: 'scheduled'
    };

    setMeetings(prev => [...prev, meeting]);
    setNewMeeting({
      title: '',
      description: '',
      date: new Date(),
      duration: 60,
      attendees: [''],
      type: 'review'
    });
    setShowMeetingForm(false);

    toast({
      title: "Meeting Scheduled",
      description: `Meeting "${meeting.title}" has been scheduled.`
    });
  };

  const addRisk = () => {
    if (!newRisk.description.trim()) {
      toast({
        title: "Risk Description Required",
        description: "Please enter a risk description",
        variant: "destructive"
      });
      return;
    }

    const risk: RiskItem = {
      id: Date.now().toString(),
      ...newRisk,
      severity: calculateRiskSeverity(newRisk.probability, newRisk.impact),
      status: 'identified'
    };

    setRisks(prev => [...prev, risk]);
    setNewRisk({
      category: 'technical',
      description: '',
      probability: 'medium',
      impact: 'medium',
      mitigation_strategy: '',
      owner: ''
    });
    setShowRiskForm(false);

    toast({
      title: "Risk Added",
      description: "New risk has been added to the assessment."
    });
  };

  const calculateRiskSeverity = (probability: string, impact: string): 'low' | 'medium' | 'high' | 'critical' => {
    const matrix = {
      'low': { 'low': 'low', 'medium': 'low', 'high': 'medium' },
      'medium': { 'low': 'low', 'medium': 'medium', 'high': 'high' },
      'high': { 'low': 'medium', 'medium': 'high', 'high': 'critical' }
    };
    return matrix[probability as keyof typeof matrix][impact as keyof typeof matrix['low']] as any;
  };

  const generateReport = async () => {
    if (!reportConfig.title.trim()) {
      toast({
        title: "Report Title Required",
        description: "Please enter a report title",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingReport(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const report: ProjectReport = {
        id: Date.now().toString(),
        ...reportConfig,
        description: reportConfig.title,
        generated_at: new Date(),
        auto_generate: false
      };

      setReports(prev => [...prev, report]);

      // Simulate file download
      const reportContent = {
        project: formData,
        progress: { percentage: formData.progress_percentage, notes: progressNotes },
        risks: risks,
        meetings: meetings,
        generated_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}-${reportConfig.type}-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: `${reportConfig.type} report has been generated and downloaded.`
      });

      setReportConfig({
        type: 'status',
        title: '',
        sections: ['overview', 'progress', 'risks', 'timeline'],
        format: 'pdf',
        auto_generate: false
      });

    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Enhanced Project Management: {project?.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="scoping">Scoping</SelectItem>
                      <SelectItem value="designing">Designing</SelectItem>
                      <SelectItem value="implementing">Implementing</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployed">Deployed</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase">Current Phase</Label>
                  <Select value={formData.current_phase} onValueChange={(value: any) => setFormData(prev => ({ ...prev, current_phase: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="scoping">Scoping</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="implementation">Implementation</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_completion">Target Completion</Label>
                  <Input
                    id="target_completion"
                    type="date"
                    value={formData.target_completion}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_completion: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <div className="space-y-2">
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress_percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, progress_percentage: parseInt(e.target.value) || 0 }))}
                    />
                    <Progress value={formData.progress_percentage} className="w-full" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateProject.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Tracking
                </CardTitle>
                <CardDescription>
                  Update project progress, add milestones, and track blockers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Current Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{formData.progress_percentage}%</div>
                        <Progress value={formData.progress_percentage} className="mt-2" />
                        <p className="text-sm text-muted-foreground mt-2">Overall Completion</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Phase Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-sm">
                          {formData.current_phase}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">Current Phase</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Progress Update</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="progress-notes">Progress Notes</Label>
                      <Textarea
                        id="progress-notes"
                        placeholder="Describe recent progress, achievements, and completed tasks..."
                        value={progressNotes}
                        onChange={(e) => setProgressNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="milestone-update">Milestone Update</Label>
                      <Input
                        id="milestone-update"
                        placeholder="Update on current milestone or deliverable..."
                        value={milestoneUpdate}
                        onChange={(e) => setMilestoneUpdate(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleProgressUpdate} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Progress
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Current Blockers
                  </h4>
                  
                  <div className="space-y-2">
                    {blockers.map((blocker, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <span className="text-sm">{blocker}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeBlocker(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a new blocker..."
                        value={newBlocker}
                        onChange={(e) => setNewBlocker(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addBlocker()}
                      />
                      <Button onClick={addBlocker} size="sm">Add</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Meeting Management
                  </span>
                  <Button onClick={() => setShowMeetingForm(true)}>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {meetings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No meetings scheduled. Click "Schedule Meeting" to add one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meetings.map((meeting) => (
                      <Card key={meeting.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{meeting.title}</h4>
                              <p className="text-sm text-muted-foreground">{meeting.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {format(meeting.date, 'PPP')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {meeting.duration} minutes
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {meeting.type}
                                </Badge>
                              </div>
                            </div>
                            <Badge className={`${
                              meeting.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                              meeting.status === 'completed' ? 'bg-success/10 text-success' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {meeting.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {showMeetingForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Schedule New Meeting</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Meeting Title</Label>
                          <Input
                            value={newMeeting.title}
                            onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Sprint Review"
                          />
                        </div>
                        <div>
                          <Label>Meeting Type</Label>
                          <Select value={newMeeting.type} onValueChange={(value: any) => setNewMeeting(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kickoff">Kickoff</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="demo">Demo</SelectItem>
                              <SelectItem value="retrospective">Retrospective</SelectItem>
                              <SelectItem value="stakeholder">Stakeholder</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newMeeting.description}
                          onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Meeting agenda and objectives..."
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(newMeeting.date, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newMeeting.date}
                                onSelect={(date) => date && setNewMeeting(prev => ({ ...prev, date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={newMeeting.duration}
                            onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                            min="15"
                            max="480"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Attendees (email addresses)</Label>
                        <div className="space-y-2">
                          {newMeeting.attendees.map((email, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={email}
                                onChange={(e) => {
                                  const updated = [...newMeeting.attendees];
                                  updated[index] = e.target.value;
                                  setNewMeeting(prev => ({ ...prev, attendees: updated }));
                                }}
                                placeholder="attendee@email.com"
                              />
                              {newMeeting.attendees.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const updated = newMeeting.attendees.filter((_, i) => i !== index);
                                    setNewMeeting(prev => ({ ...prev, attendees: updated }));
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
                            onClick={() => setNewMeeting(prev => ({ ...prev, attendees: [...prev.attendees, ''] }))}
                          >
                            Add Attendee
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowMeetingForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={scheduleMeeting}>
                          Schedule Meeting
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Risk Assessment
                  </span>
                  <Button onClick={() => setShowRiskForm(true)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Add Risk
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {risks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No risks identified. Click "Add Risk" to add one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {risks.map((risk) => (
                      <Card key={risk.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {risk.category}
                                </Badge>
                                <Badge className={`text-xs ${getRiskColor(risk.severity)}`}>
                                  {risk.severity}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {risk.status}
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-1">{risk.description}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                <strong>Mitigation:</strong> {risk.mitigation_strategy}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Probability: <strong>{risk.probability}</strong></span>
                                <span>Impact: <strong>{risk.impact}</strong></span>
                                {risk.owner && <span>Owner: <strong>{risk.owner}</strong></span>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {showRiskForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Add New Risk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Category</Label>
                          <Select value={newRisk.category} onValueChange={(value: any) => setNewRisk(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="timeline">Timeline</SelectItem>
                              <SelectItem value="budget">Budget</SelectItem>
                              <SelectItem value="resource">Resource</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Owner</Label>
                          <Input
                            value={newRisk.owner}
                            onChange={(e) => setNewRisk(prev => ({ ...prev, owner: e.target.value }))}
                            placeholder="Risk owner"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Risk Description</Label>
                        <Textarea
                          value={newRisk.description}
                          onChange={(e) => setNewRisk(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the potential risk..."
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Mitigation Strategy</Label>
                        <Textarea
                          value={newRisk.mitigation_strategy}
                          onChange={(e) => setNewRisk(prev => ({ ...prev, mitigation_strategy: e.target.value }))}
                          placeholder="How will this risk be mitigated?"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Probability</Label>
                          <Select value={newRisk.probability} onValueChange={(value: any) => setNewRisk(prev => ({ ...prev, probability: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Impact</Label>
                          <Select value={newRisk.impact} onValueChange={(value: any) => setNewRisk(prev => ({ ...prev, impact: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowRiskForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addRisk}>
                          Add Risk
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Report Generation
                </CardTitle>
                <CardDescription>
                  Generate comprehensive project reports and set up automated reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Generate New Report</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Report Type</Label>
                        <Select value={reportConfig.type} onValueChange={(value: any) => setReportConfig(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="status">Status Report</SelectItem>
                            <SelectItem value="progress">Progress Report</SelectItem>
                            <SelectItem value="risk">Risk Assessment Report</SelectItem>
                            <SelectItem value="deployment">Deployment Report</SelectItem>
                            <SelectItem value="financial">Financial Report</SelectItem>
                            <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Report Title</Label>
                        <Input
                          value={reportConfig.title}
                          onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter report title"
                        />
                      </div>

                      <div>
                        <Label>Format</Label>
                        <Select value={reportConfig.format} onValueChange={(value: any) => setReportConfig(prev => ({ ...prev, format: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="docx">Word Document</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Include Sections</Label>
                        <div className="space-y-2 mt-2">
                          {['overview', 'progress', 'risks', 'timeline', 'budget', 'resources'].map((section) => (
                            <div key={section} className="flex items-center space-x-2">
                              <Checkbox
                                id={section}
                                checked={reportConfig.sections.includes(section)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setReportConfig(prev => ({ ...prev, sections: [...prev.sections, section] }));
                                  } else {
                                    setReportConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s !== section) }));
                                  }
                                }}
                              />
                              <Label htmlFor={section} className="text-sm capitalize">
                                {section}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={generateReport} disabled={isGeneratingReport} className="w-full">
                        {isGeneratingReport ? (
                          <>
                            <Zap className="h-4 w-4 mr-2 animate-spin" />
                            Generating Report...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reports.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No reports generated yet
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {reports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium text-sm">{report.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {report.type}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {report.format.toUpperCase()}
                                  </Badge>
                                  {report.auto_generate && (
                                    <Badge variant="outline" className="text-xs">
                                      Auto
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(report.generated_at, 'PPp')}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedProjectEditDialog;