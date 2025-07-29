import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, Plus, Edit, Eye, Users, Settings,
  FileText, TestTube, BarChart3, Globe, Building2, MapPin
} from 'lucide-react';

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  is_system_role: boolean;
  created_at: string;
}

type ResourceType = 'projects' | 'sites' | 'users' | 'vendors' | 'use_cases' | 'requirements' | 'test_cases' | 'reports' | 'settings';
type PermissionType = 'read' | 'write' | 'update' | 'delete' | 'admin';

const RESOURCES: { key: ResourceType; label: string; icon: any }[] = [
  { key: 'projects', label: 'Projects', icon: Building2 },
  { key: 'sites', label: 'Sites', icon: MapPin },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'vendors', label: 'Vendors', icon: Shield },
  { key: 'use_cases', label: 'Use Cases', icon: FileText },
  { key: 'requirements', label: 'Requirements', icon: FileText },
  { key: 'test_cases', label: 'Test Cases', icon: TestTube },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const PERMISSIONS: { key: PermissionType; label: string; description: string }[] = [
  { key: 'read', label: 'Read', description: 'View and list items' },
  { key: 'write', label: 'Write', description: 'Create new items' },
  { key: 'update', label: 'Update', description: 'Modify existing items' },
  { key: 'delete', label: 'Delete', description: 'Remove items' },
  { key: 'admin', label: 'Admin', description: 'Full administrative access' },
];

const CustomRoleManager: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<ResourceType, PermissionType[]>>({
    projects: [],
    sites: [],
    users: [],
    vendors: [],
    use_cases: [],
    requirements: [],
    test_cases: [],
    reports: [],
    settings: []
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch custom roles
  const { data: customRoles = [], isLoading } = useQuery({
    queryKey: ['custom-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_roles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as CustomRole[];
    }
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (roleData: {
      name: string;
      description: string;
      permissions: Record<string, string[]>;
    }) => {
      const { data, error } = await supabase
        .from('custom_roles')
        .insert(roleData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Role Created",
        description: "Custom role has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['custom-roles'] });
      resetForm();
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive"
      });
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, ...roleData }: {
      id: string;
      name: string;
      description: string;
      permissions: Record<string, string[]>;
    }) => {
      const { data, error } = await supabase
        .from('custom_roles')
        .update(roleData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "Custom role has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['custom-roles'] });
      resetForm();
      setIsEditDialogOpen(false);
      setEditingRole(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setPermissions({
      projects: [],
      sites: [],
      users: [],
      vendors: [],
      use_cases: [],
      requirements: [],
      test_cases: [],
      reports: [],
      settings: []
    });
  };

  const handlePermissionChange = (resource: ResourceType, permission: PermissionType, checked: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      if (checked) {
        if (!newPermissions[resource].includes(permission)) {
          newPermissions[resource] = [...newPermissions[resource], permission];
        }
      } else {
        newPermissions[resource] = newPermissions[resource].filter(p => p !== permission);
      }
      return newPermissions;
    });
  };

  const handleCreateRole = () => {
    if (!roleName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a role name",
        variant: "destructive"
      });
      return;
    }

    createRoleMutation.mutate({
      name: roleName,
      description: roleDescription,
      permissions
    });
  };

  const handleEditRole = (role: CustomRole) => {
    if (role.is_system_role) {
      toast({
        title: "System Role",
        description: "System roles cannot be edited",
        variant: "destructive"
      });
      return;
    }

    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setPermissions(role.permissions as Record<ResourceType, PermissionType[]>);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole || !roleName.trim()) {
      return;
    }

    updateRoleMutation.mutate({
      id: editingRole.id,
      name: roleName,
      description: roleDescription,
      permissions
    });
  };

  const getPermissionCount = (rolePermissions: Record<string, string[]>) => {
    return Object.values(rolePermissions).flat().length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Roles</h2>
          <p className="text-muted-foreground">
            Create and manage custom roles with granular permissions
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions for different resources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name *</Label>
                  <Input
                    id="roleName"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Project Coordinator"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Brief description of the role..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="space-y-4">
                <h4 className="font-medium">Permissions</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Resource</TableHead>
                        {PERMISSIONS.map(permission => (
                          <TableHead key={permission.key} className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium">{permission.label}</span>
                              <span className="text-xs text-muted-foreground">{permission.description}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {RESOURCES.map(resource => {
                        const Icon = resource.icon;
                        return (
                          <TableRow key={resource.key}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {resource.label}
                              </div>
                            </TableCell>
                            {PERMISSIONS.map(permission => (
                              <TableCell key={permission.key} className="text-center">
                                <Checkbox
                                  checked={permissions[resource.key]?.includes(permission.key)}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(resource.key, permission.key, !!checked)
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  disabled={createRoleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateRole}
                  disabled={createRoleMutation.isPending}
                >
                  {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Roles</span>
            <Badge variant="secondary">{customRoles.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">
                        {role.description || 'No description'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPermissionCount(role.permissions)} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.is_system_role ? 'default' : 'secondary'}>
                        {role.is_system_role ? 'System' : 'Custom'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(role.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {!role.is_system_role && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Custom Role</DialogTitle>
            <DialogDescription>
              Modify role permissions and details
            </DialogDescription>
          </DialogHeader>
          {/* Same form content as create dialog but with update handler */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRoleName">Role Name *</Label>
                <Input
                  id="editRoleName"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g., Project Coordinator"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRoleDescription">Description</Label>
                <Textarea
                  id="editRoleDescription"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Brief description of the role..."
                  rows={2}
                />
              </div>
            </div>

            {/* Same permissions matrix */}
            <div className="space-y-4">
              <h4 className="font-medium">Permissions</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Resource</TableHead>
                      {PERMISSIONS.map(permission => (
                        <TableHead key={permission.key} className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{permission.label}</span>
                            <span className="text-xs text-muted-foreground">{permission.description}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RESOURCES.map(resource => {
                      const Icon = resource.icon;
                      return (
                        <TableRow key={resource.key}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {resource.label}
                            </div>
                          </TableCell>
                          {PERMISSIONS.map(permission => (
                            <TableCell key={permission.key} className="text-center">
                              <Checkbox
                                checked={permissions[resource.key]?.includes(permission.key)}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(resource.key, permission.key, !!checked)
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingRole(null);
                  resetForm();
                }}
                disabled={updateRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateRole}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomRoleManager;