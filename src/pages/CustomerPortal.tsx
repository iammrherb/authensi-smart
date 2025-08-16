import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, MapPin, Clock, DollarSign, BarChart3, MessageSquare, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerProject {
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
  customer_portal_enabled: boolean;
  created_at: string;
}

interface PortalActivity {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

const CustomerPortal: React.FC = () => {
  const { portalId } = useParams<{ portalId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<CustomerProject | null>(null);
  const [activities, setActivities] = useState<PortalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!portalId) {
      setError('Invalid portal access link');
      setLoading(false);
      return;
    }

    fetchProjectData();
    logPortalAccess();
  }, [portalId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      
      // Get project by customer portal ID
      const { data: projectData, error: projectError } = await supabase
        .rpc('get_project_by_customer_portal_id', { portal_id: portalId });

      if (projectError) {
        console.error('Error fetching project:', projectError);
        setError('Unable to access project. Please check your link.');
        return;
      }

      if (!projectData || projectData.length === 0) {
        setError('Project not found or access has expired.');
        return;
      }

      setProject(projectData[0]);
      
      // Fetch recent activities (mock data for now)
      setActivities([
        {
          id: '1',
          activity_type: 'status_update',
          activity_data: { message: 'Project moved to Implementation phase' },
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          activity_type: 'milestone_completed',
          activity_data: { milestone: 'Network Assessment Complete' },
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);

    } catch (err) {
      console.error('Error in fetchProjectData:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logPortalAccess = async () => {
    try {
      await supabase.from('customer_portal_activity').insert({
        customer_portal_id: portalId,
        project_id: project?.id,
        activity_type: 'portal_access',
        activity_data: { 
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent 
        },
        ip_address: '0.0.0.0' // In a real app, you'd get the actual IP
      });
    } catch (err) {
      console.error('Error logging portal access:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-primary text-primary-foreground';
      case 'on_hold': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Error</CardTitle>
            <CardDescription>{error || 'Project not found'}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Go to Main Site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">{project.customer_organization}</p>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress_percentage}%</div>
              <Progress value={project.progress_percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Phase</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.current_phase || 'Planning'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Start: {formatDate(project.start_date)}</div>
                <div>End: {formatDate(project.end_date)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBudget(project.estimated_budget || 0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="communication">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Project Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Project ID:</span>
                        <span className="font-mono">{project.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Started:</span>
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phase:</span>
                        <span>{project.current_phase || 'Planning'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {activity.activity_data.message || activity.activity_data.milestone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Key milestones and project phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-success"></div>
                    <div>
                      <h4 className="font-semibold">Project Initiation</h4>
                      <p className="text-sm text-muted-foreground">Completed on {formatDate(project.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <div>
                      <h4 className="font-semibold">Current Phase: {project.current_phase || 'Planning'}</h4>
                      <p className="text-sm text-muted-foreground">{project.progress_percentage}% complete</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg opacity-50">
                    <div className="w-4 h-4 rounded-full bg-muted"></div>
                    <div>
                      <h4 className="font-semibold">Project Completion</h4>
                      <p className="text-sm text-muted-foreground">Scheduled for {formatDate(project.end_date)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Documents</CardTitle>
                <CardDescription>Access important project files and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Document sharing will be available soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Communication</CardTitle>
                <CardDescription>Messages and updates from your project team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>Communication center coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPortal;