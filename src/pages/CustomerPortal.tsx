import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plus, 
  Settings, 
  BarChart3,
  Users,
  Zap,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  current_phase: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  customer_organization: string;
}

const CustomerPortal = () => {
  const { portalId } = useParams<{ portalId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [portalId]);

  const fetchProjectData = async () => {
    if (!portalId) return;
    
    try {
      // Get project by portal ID
      const { data: projectData, error: projectError } = await supabase
        .rpc('get_project_by_customer_portal_id', { portal_id: portalId });

      if (projectError) throw projectError;
      if (!projectData || projectData.length === 0) {
        toast.error('Invalid portal access or expired link');
        return;
      }

      setProject(projectData[0]);
    } catch (error) {
      console.error('Error fetching portal data:', error);
      toast.error('Failed to load portal data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Invalid portal access or the link has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold">{project.customer_organization || 'Customer Portal'}</h1>
                  <p className="text-sm text-muted-foreground">Project: {project.name}</p>
                </div>
              </div>
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BarChart3 className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress_percentage}%</div>
              <Progress value={project.progress_percentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Current Phase: {project.current_phase}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Calendar className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Start:</span> {' '}
                  {new Date(project.start_date).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Target:</span> {' '}
                  {new Date(project.end_date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Zap className="w-4 h-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Config Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="configs">Configurations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Implementation tracking will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configuration templates will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reporting features will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPortal;