import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserRoles, useAssignRole, useRemoveRole, type AppRole, type ScopeType } from '@/hooks/useUserRoles';
import { 
  UserPlus, Shield, Globe, Building2, MapPin, Users, Trash2
} from 'lucide-react';

interface EnhancedRoleAssignmentProps {
  userId?: string;
  userEmail?: string;
}

const EnhancedRoleAssignment: React.FC<EnhancedRoleAssignmentProps> = ({ 
  userId, 
  userEmail 
}) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(userEmail || '');
  const [selectedRole, setSelectedRole] = useState<AppRole>('viewer');
  const [scopeType, setScopeType] = useState<ScopeType>('global');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: userRoles = [] } = useUserRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  // Fetch projects for project scope selection
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, client_name')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch sites for site scope selection
  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('id, name, location')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const roleLabels: Record<AppRole, string> = {
    super_admin: 'Super Admin',
    project_creator: 'Project Creator',
    project_viewer: 'Project Viewer',
    product_manager: 'Product Manager',
    sales_engineer: 'Sales Engineer',
    technical_account_manager: 'Technical Account Manager',
    technical_seller: 'Technical Seller',
    sales: 'Sales',
    lead_engineer: 'Lead Engineer',
    engineer: 'Engineer',
    viewer: 'Viewer'
  };

  const handleAssignRole = async () => {
    if (!selectedEmail || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find user by email
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', selectedEmail)
        .single();

      if (profileError || !userProfile) {
        throw new Error('User not found. Please ensure the user has an account.');
      }

      // For global scope, assign one role
      if (scopeType === 'global') {
        await assignRole.mutateAsync({
          user_id: userProfile.id,
          role: selectedRole,
          scope_type: 'global'
        });
      }
      // For project scope, assign role to each selected project
      else if (scopeType === 'project') {
        if (selectedProjects.length === 0) {
          throw new Error('Please select at least one project');
        }
        
        for (const projectId of selectedProjects) {
          await assignRole.mutateAsync({
            user_id: userProfile.id,
            role: selectedRole,
            scope_type: 'project',
            scope_id: projectId
          });
        }
      }
      // For site scope, assign role to each selected site
      else if (scopeType === 'site') {
        if (selectedSites.length === 0) {
          throw new Error('Please select at least one site');
        }
        
        for (const siteId of selectedSites) {
          await assignRole.mutateAsync({
            user_id: userProfile.id,
            role: selectedRole,
            scope_type: 'site',
            scope_id: siteId
          });
        }
      }

      toast({
        title: "Success",
        description: `Role ${roleLabels[selectedRole]} assigned successfully`,
      });

      // Reset form
      setSelectedEmail('');
      setSelectedRole('viewer');
      setScopeType('global');
      setSelectedProjects([]);
      setSelectedSites([]);
      setIsAssignDialogOpen(false);

    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'global': return Globe;
      case 'project': return Building2;
      case 'site': return MapPin;
      default: return Globe;
    }
  };

  const getScopeLabel = (role: any) => {
    if (role.scope_type === 'global') return 'Global';
    
    if (role.scope_type === 'project') {
      const project = projects.find(p => p.id === role.scope_id);
      return project ? `Project: ${project.name}` : `Project: ${role.scope_id}`;
    }
    
    if (role.scope_type === 'site') {
      const site = sites.find(s => s.id === role.scope_id);
      return site ? `Site: ${site.name}` : `Site: ${role.scope_id}`;
    }
    
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            Role Assignment
          </h2>
          <p className="text-muted-foreground mt-2">
            Assign users to specific roles with granular scope control
          </p>
        </div>

        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign User Role</DialogTitle>
              <DialogDescription>
                Assign a role to a user with specific scope permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">User Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={selectedEmail}
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    placeholder="user@company.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([role, label]) => (
                        <SelectItem key={role} value={role}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Access Scope</Label>
                <Select value={scopeType} onValueChange={(value: ScopeType) => setScopeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Global Access
                      </div>
                    </SelectItem>
                    <SelectItem value="project">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Project Specific
                      </div>
                    </SelectItem>
                    <SelectItem value="site">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Site Specific
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scopeType === 'project' && (
                <div className="space-y-2">
                  <Label>Select Projects (Multiple allowed)</Label>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`project-${project.id}`}
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
                        <Label htmlFor={`project-${project.id}`} className="text-sm cursor-pointer">
                          <span className="font-medium">{project.name}</span>
                          {project.client_name && (
                            <span className="text-muted-foreground"> - {project.client_name}</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedProjects.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selected {selectedProjects.length} project(s)
                    </p>
                  )}
                </div>
              )}

              {scopeType === 'site' && (
                <div className="space-y-2">
                  <Label>Select Sites (Multiple allowed)</Label>
                  <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                    {sites.map((site) => (
                      <div key={site.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`site-${site.id}`}
                          checked={selectedSites.includes(site.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSites([...selectedSites, site.id]);
                            } else {
                              setSelectedSites(selectedSites.filter(id => id !== site.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`site-${site.id}`} className="text-sm cursor-pointer">
                          <span className="font-medium">{site.name}</span>
                          {site.location && (
                            <span className="text-muted-foreground"> - {site.location}</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSites.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Selected {selectedSites.length} site(s)
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAssignRole}
                  disabled={assignRole.isPending}
                >
                  {assignRole.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    'Assign Role'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Current Role Assignments ({userRoles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No role assignments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.map((userRole) => {
                  const ScopeIcon = getScopeIcon(userRole.scope_type);
                  return (
                    <TableRow key={userRole.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {userRole.user_profile?.first_name} {userRole.user_profile?.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {userRole.user_profile?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {roleLabels[userRole.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ScopeIcon className="h-4 w-4" />
                          <span className="text-sm">{getScopeLabel(userRole)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(userRole.assigned_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {userRole.assigned_by_profile?.first_name} {userRole.assigned_by_profile?.last_name}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeRole.mutate(userRole.id)}
                          disabled={removeRole.isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRoleAssignment;