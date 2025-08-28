import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, AlertCircle, ArrowRight, Award, BarChart3, Bell,
  Calendar, CheckCircle, ChevronDown, ChevronRight, Clock,
  Download, Edit, FileText, Filter, Home, Layers, LineChart,
  MessageSquare, MoreVertical, PieChart, Plus, RefreshCw,
  Search, Settings, Shield, Star, Target, TrendingUp, Upload,
  User, Users, Zap, XCircle, ThumbsUp, ThumbsDown, Eye,
  Send, Paperclip, Hash, GitBranch, Package, Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// Recharts imports commented out - install recharts if needed
// import {
//   LineChart as RechartsLineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   RadialBarChart,
//   RadialBar
// } from 'recharts';

interface CustomerPortalProps {
  portalId?: string;
  projectId?: string;
}

interface PortalData {
  id: string;
  portal_name: string;
  portal_slug: string;
  is_active: boolean;
  access_level: string;
  features_enabled: any;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  welcome_message?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  completion_percentage: number;
  company_data: any;
  timeline: any;
  budget: any;
}

interface Milestone {
  id: string;
  phase_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  completion_percentage: number;
  deliverables: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
}

interface Update {
  id: string;
  update_type: string;
  title: string;
  content: string;
  severity: string;
  author_name: string;
  created_at: string;
  is_pinned: boolean;
}

interface Metric {
  overall_progress: number;
  milestones_completed: number;
  milestones_total: number;
  tasks_completed: number;
  tasks_total: number;
  days_elapsed: number;
  days_remaining: number;
  schedule_variance: number;
  issues_open: number;
  approval_pending: number;
}

const EpicCustomerPortal: React.FC<CustomerPortalProps> = ({ portalId, projectId }) => {
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [newComment, setNewComment] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPortalData();
    setupRealtimeSubscription();
  }, [portalId, projectId]);

  const loadPortalData = async () => {
    try {
      setIsLoading(true);
      
      // Load portal configuration
      if (portalId) {
        const { data: portal } = await supabase
          .from('customer_portals')
          .select('*')
          .eq('id', portalId)
          .single();
        
        if (portal) {
          setPortalData(portal);
          
          // Apply custom branding
          if (portal.primary_color) {
            document.documentElement.style.setProperty('--primary', portal.primary_color);
          }
        }
      }
      
      // Load project data
      if (projectId) {
        const { data: project } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        setProjectData(project);
        
        // Load milestones
        const { data: milestonesData } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('start_date', { ascending: true });
        
        setMilestones(milestonesData || []);
        
        // Load tasks
        const { data: tasksData } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('due_date', { ascending: true });
        
        setTasks(tasksData || []);
        
        // Load updates
        const { data: updatesData } = await supabase
          .from('portal_updates')
          .select('*')
          .eq('portal_id', portalId)
          .order('created_at', { descending: true })
          .limit(10);
        
        setUpdates(updatesData || []);
        
        // Load metrics
        const { data: metricsData } = await supabase
          .from('portal_metrics')
          .select('*')
          .eq('portal_id', portalId)
          .eq('metric_date', new Date().toISOString().split('T')[0])
          .single();
        
        setMetrics(metricsData);
      }
      
      // Load notifications
      const { data: notificationsData } = await supabase
        .from('portal_notifications')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('is_read', false)
        .order('created_at', { descending: true })
        .limit(10);
      
      setNotifications(notificationsData || []);
      
    } catch (error) {
      console.error('Error loading portal data:', error);
      toast({
        title: "Error",
        description: "Failed to load portal data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`portal-${portalId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_milestones',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        console.log('Milestone update:', payload);
        loadPortalData(); // Reload data on change
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_tasks',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        console.log('Task update:', payload);
        loadPortalData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'portal_updates',
        filter: `portal_id=eq.${portalId}`
      }, (payload) => {
        console.log('Portal update:', payload);
        setUpdates(prev => [payload.new as Update, ...prev]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    try {
      const { error } = await supabase
        .from('portal_comments')
        .insert({
          portal_id: portalId,
          entity_type: 'update',
          entity_id: updates[0]?.id,
          content: newComment,
          user_name: 'Customer User'
        });
      
      if (error) throw error;
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added",
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    }
  };

  const handleApproval = async (approvalId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('portal_approvals')
        .update({
          status: approved ? 'approved' : 'rejected',
          [approved ? 'approved_by' : 'rejected_by']: (await supabase.auth.getUser()).data.user?.id,
          [approved ? 'approved_at' : 'rejected_at']: new Date().toISOString(),
          [approved ? 'approval_notes' : 'rejection_reason']: approved ? 'Approved via portal' : 'Rejected via portal'
        })
        .eq('id', approvalId);
      
      if (error) throw error;
      
      toast({
        title: approved ? "Approved" : "Rejected",
        description: `The item has been ${approved ? 'approved' : 'rejected'}`,
      });
      
      loadPortalData();
    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: "Error",
        description: "Failed to update approval",
        variant: "destructive"
      });
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await supabase
        .from('portal_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  // Chart data preparation
  const progressData = milestones.map(m => ({
    name: m.phase_name,
    progress: m.completion_percentage,
    target: 100
  }));

  const timelineData = [
    { name: 'Elapsed', value: metrics?.days_elapsed || 0, fill: '#3B82F6' },
    { name: 'Remaining', value: metrics?.days_remaining || 0, fill: '#10B981' }
  ];

  const taskStatusData = [
    { name: 'Completed', value: metrics?.tasks_completed || 0, fill: '#10B981' },
    { name: 'In Progress', value: (metrics?.tasks_total || 0) - (metrics?.tasks_completed || 0), fill: '#F59E0B' },
    { name: 'Pending', value: metrics?.issues_open || 0, fill: '#EF4444' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case 'medium': return <ChevronRight className="h-4 w-4 text-yellow-500" />;
      case 'low': return <ChevronDown className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {portalData?.logo_url && (
                <img src={portalData.logo_url} alt="Logo" className="h-8 w-auto mr-4" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {portalData?.portal_name || 'Customer Portal'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {projectData?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <ScrollArea className="h-64">
                      {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No new notifications
                        </p>
                      ) : (
                        <div className="p-2">
                          {notifications.map(notification => (
                            <div
                              key={notification.id}
                              className="p-3 hover:bg-gray-50 rounded cursor-pointer"
                              onClick={() => markNotificationRead(notification.id)}
                            >
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-0">
              <TabsTrigger value="dashboard" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="milestones" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Target className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="updates" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <Activity className="h-4 w-4 mr-2" />
                Updates
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {portalData?.welcome_message && activeTab === 'dashboard' && (
          <Alert className="mb-6">
            <AlertDescription>{portalData.welcome_message}</AlertDescription>
          </Alert>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                      <p className="text-3xl font-bold">{metrics?.overall_progress || 0}%</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Gauge className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={metrics?.overall_progress || 0} className="mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                      <p className="text-3xl font-bold">
                        {metrics?.milestones_completed || 0}/{metrics?.milestones_total || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {Math.round(((metrics?.milestones_completed || 0) / (metrics?.milestones_total || 1)) * 100)}% complete
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                      <p className="text-3xl font-bold">
                        {metrics?.tasks_completed || 0}/{metrics?.tasks_total || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics?.issues_open || 0} open issues
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Schedule</p>
                      <p className="text-3xl font-bold">
                        {metrics?.schedule_variance || 0 > 0 ? '+' : ''}{metrics?.schedule_variance || 0}
                      </p>
                    </div>
                    <div className={`h-12 w-12 ${(metrics?.schedule_variance || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                      <Clock className={`h-6 w-6 ${(metrics?.schedule_variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {(metrics?.schedule_variance || 0) >= 0 ? 'On schedule' : 'Behind schedule'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {updates.slice(0, 5).map(update => (
                    <div key={update.id} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-2 ${
                        update.severity === 'success' ? 'bg-green-500' :
                        update.severity === 'warning' ? 'bg-yellow-500' :
                        update.severity === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{update.title}</p>
                          {update.is_pinned && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{update.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {update.author_name} • {new Date(update.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            {milestones.map(milestone => (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{milestone.phase_name}</CardTitle>
                      <CardDescription>{milestone.description}</CardDescription>
                    </div>
                    <Badge className={
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }>
                      {milestone.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{milestone.completion_percentage}%</span>
                    </div>
                    <Progress value={milestone.completion_percentage} />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start Date: </span>
                        <span className="font-medium">
                          {new Date(milestone.start_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date: </span>
                        <span className="font-medium">
                          {new Date(milestone.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Deliverables:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {milestone.deliverables.map((deliverable, index) => (
                            <li key={index}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Tasks</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${getStatusColor(task.status)}`} />
                            <h4 className="font-medium">{task.title}</h4>
                            {getPriorityIcon(task.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {task.assigned_to || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            {/* Post Update */}
            <Card>
              <CardHeader>
                <CardTitle>Post an Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share an update or ask a question..."
                    rows={3}
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach
                      </Button>
                    </div>
                    <Button onClick={handleCommentSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates Feed */}
            {updates.map(update => (
              <Card key={update.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{update.author_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{update.author_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(update.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {update.is_pinned && <Star className="h-4 w-4 text-yellow-500" />}
                          <Badge variant={
                            update.severity === 'success' ? 'default' :
                            update.severity === 'warning' ? 'secondary' :
                            update.severity === 'error' ? 'destructive' :
                            'outline'
                          }>
                            {update.update_type}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold mt-3">{update.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{update.content}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timelineData.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value} days</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8">
                          <div 
                            className="h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              backgroundColor: item.fill,
                              width: `${(item.value / (timelineData[0].value + timelineData[1].value)) * 100}%`
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Task Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {taskStatusData.map((item, index) => {
                      const total = taskStatusData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                              {item.name}
                            </span>
                            <span className="font-medium">{item.value} ({percentage}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Progress Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {progressData.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="relative w-32 h-32 mx-auto">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="#E5E7EB"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="56"
                              stroke="#3B82F6"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${(item.progress / 100) * 351.86} 351.86`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{item.progress}%</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpicCustomerPortal;
