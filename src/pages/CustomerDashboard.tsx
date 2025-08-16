import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3, Users, Calendar, Clock, CheckCircle2, AlertTriangle,
  TrendingUp, FileText, MessageSquare, Settings, LogOut, Building,
  Target, Activity, PieChart, MapPin, Phone, Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CustomerTeamManagement from '@/components/customer/CustomerTeamManagement';
import CustomerAnalyticsDashboard from '@/components/customer/CustomerAnalyticsDashboard';
import CustomerImplementationTracking from '@/components/customer/CustomerImplementationTracking';
import CustomerPreDeploymentChecklist from '@/components/customer/CustomerPreDeploymentChecklist';

interface CustomerSession {
  user_id: string;
  project_id: string;
  role: string;
  project_name: string;
  customer_organization: string;
  authenticated_at: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  current_phase: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  customer_organization: string;
}

const CustomerDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [customerSession, setCustomerSession] = useState<CustomerSession | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeCustomerSession();
  }, [projectId]);

  const initializeCustomerSession = () => {
    try {
      const sessionData = localStorage.getItem('customer_session');
      if (!sessionData) {
        toast.error('Please log in to access your dashboard');
        navigate('/customer-auth');
        return;
      }

      const session: CustomerSession = JSON.parse(sessionData);
      
      // Verify project access
      if (session.project_id !== projectId) {
        toast.error('Unauthorized access to this project');
        navigate('/customer-auth');
        return;
      }

      setCustomerSession(session);
      fetchProjectData(session.project_id);
      
      // Log dashboard access
      logAnalyticsEvent('dashboard_access', {
        page: 'overview',
        session_id: session.user_id
      });

    } catch (error) {
      console.error('Session initialization error:', error);
      navigate('/customer-auth');
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProjectData({
        id: data.id,
        name: data.name,
        description: data.description || '',
        status: data.status,
        current_phase: data.current_phase,
        progress_percentage: data.progress_percentage,
        start_date: data.start_date,
        end_date: data.target_completion || data.end_date,
        estimated_budget: data.budget || data.estimated_budget || 0,
        customer_organization: data.customer_organization || ''
      });
    } catch (error) {
      console.error('Error fetching project data:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const logAnalyticsEvent = async (eventType: string, eventData: any) => {
    if (!customerSession) return;
    
    try {
      await supabase.from('customer_analytics').insert({
        project_id: customerSession.project_id,
        customer_user_id: customerSession.user_id,
        event_type: eventType,
        event_data: {
          ...eventData,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Analytics logging error:', error);
    }
  };

  const handleLogout = () => {
    logAnalyticsEvent('logout', {});
    localStorage.removeItem('customer_session');
    toast.success('Logged out successfully');
    navigate('/customer-auth');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'active': case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'on_hold': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || !customerSession || !projectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="glow" className="bg-primary/10">
                <Building className="w-4 h-4 mr-2" />
                {customerSession.customer_organization}
              </Badge>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{projectData.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {customerSession.role === 'admin' ? 'Administrator' : 'Team Member'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(projectData.status)}>
                {projectData.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectData.progress_percentage}%</div>
              <Progress value={projectData.progress_percentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {projectData.progress_percentage > 75 ? 'Nearing completion' : 
                 projectData.progress_percentage > 50 ? 'Good progress' : 'Getting started'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectData.current_phase || 'Planning'}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active phase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {Math.ceil((new Date(projectData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Until completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investment</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(projectData.estimated_budget || 0)}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Project budget
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          logAnalyticsEvent('tab_change', { tab: value });
        }}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="checklist">Pre-Deploy</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Key project information and current status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground text-sm">{projectData.description}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Start Date:</span>
                      <p className="text-muted-foreground">{formatDate(projectData.start_date)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Target End:</span>
                      <p className="text-muted-foreground">{formatDate(projectData.end_date)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Requirements Analysis Complete</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Network Assessment Started</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Project Team Assigned</p>
                        <p className="text-xs text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="mt-6">
            <CustomerImplementationTracking 
              projectId={customerSession.project_id}
              onEventLog={logAnalyticsEvent}
            />
          </TabsContent>

          <TabsContent value="checklist" className="mt-6">
            <CustomerPreDeploymentChecklist 
              projectId={customerSession.project_id}
              onEventLog={logAnalyticsEvent}
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <CustomerTeamManagement 
              projectId={customerSession.project_id}
              customerRole={customerSession.role}
              onEventLog={logAnalyticsEvent}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CustomerAnalyticsDashboard 
              projectId={customerSession.project_id}
              onEventLog={logAnalyticsEvent}
            />
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Requirements & Use Cases</CardTitle>
                <CardDescription>Technical requirements and use cases for your implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Requirements and use cases documentation will be available soon.</p>
                  <p className="text-sm mt-2">Contact your project manager for immediate access.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;