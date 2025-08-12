import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, Search, Filter, MoreHorizontal, Trash2, Edit3, Eye, 
  Calendar, Users, MapPin, TrendingUp, AlertCircle, CheckCircle,
  Archive, Download, Upload, RefreshCw, Settings, Star, Clock
} from 'lucide-react';

import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useScopingManagement } from '@/hooks/useScopingManagement';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ProjectManagementHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editSession, setEditSession] = useState<{ id: string; name: string; status: 'draft' | 'completed' | 'archived' } | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'completed' | 'archived'>('draft');

  const { data: projects = [], isLoading } = useProjects();
  const deleteProjectMutation = useDeleteProject();
  const { 
    sessions: scopingSessions, 
    deleteSession: deleteScopingSession,
    updateSession: updateScopingSession,
    getStatistics: getScopingStats,
    bulkDelete: bulkDeleteSessions 
  } = useScopingManagement();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter scoping sessions
  const filteredSessions = scopingSessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Handle scoping session deletion
  const handleDeleteScopingSession = (sessionId: string) => {
    deleteScopingSession(sessionId);
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedProjects.length === 0) return;
    
    selectedProjects.forEach(projectId => {
      deleteProjectMutation.mutate(projectId);
    });
    
    setSelectedProjects([]);
    toast({
      title: "Projects Deleted",
      description: `${selectedProjects.length} projects deleted successfully`,
    });
  };

  // Statistics
  const projectStats = {
    total: projects.length,
    planning: projects.filter(p => p.status === 'planning').length,
    implementing: projects.filter(p => p.status === 'implementing').length,
    deployed: projects.filter(p => p.status === 'deployed').length,
    maintenance: projects.filter(p => p.status === 'maintenance').length
  };

  const scopingStats = getScopingStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'scoping': return 'bg-purple-100 text-purple-800';
      case 'designing': return 'bg-yellow-100 text-yellow-800';
      case 'implementing': return 'bg-orange-100 text-orange-800';
      case 'testing': return 'bg-indigo-100 text-indigo-800';
      case 'deployed': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProjectsTab = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projectStats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planning</p>
                <p className="text-2xl font-bold">{projectStats.planning}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Implementing</p>
                <p className="text-2xl font-bold">{projectStats.implementing}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deployed</p>
                <p className="text-2xl font-bold">{projectStats.deployed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="implementing">Implementing</option>
            <option value="deployed">Deployed</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedProjects.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedProjects.length})
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No projects match your current filters.' 
                  : 'Create your first project to get started.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects([...selectedProjects, project.id]);
                        } else {
                          setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.current_phase && (
                          <Badge variant="outline">{project.current_phase}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {project.client_name || 'No client'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {project.industry || 'No industry'}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {project.total_sites || 0} sites
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProjectToDelete(project.id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderScopingSessionsTab = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{scopingStats.total}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{scopingStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">{scopingStats.draft}</p>
              </div>
              <Edit3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{scopingStats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scoping Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Scoping Sessions</h3>
              <p className="text-muted-foreground">
                Create your first scoping session to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{session.name}</h3>
                      <Badge className={
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {session.organizationName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {session.industry}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditSession({ id: session.id, name: session.name, status: session.status });
                        setEditName(session.name);
                        setEditStatus(session.status);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteScopingSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management Hub</h1>
          <p className="text-muted-foreground">
            Comprehensive project and scoping session management
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="scoping">Scoping Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="mt-6">
          {renderProjectsTab()}
        </TabsContent>
        
        <TabsContent value="scoping" className="mt-6">
          {renderScopingSessionsTab()}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
            >
              Delete Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagementHub;