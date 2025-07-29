import React, { useState } from 'react';
import { useUserRoles, useAssignRole, useRemoveRole, useCanManageRoles, AppRole } from '@/hooks/useUserRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, Plus, Search, UserPlus, Shield, Crown, Briefcase, 
  HeadphonesIcon, TrendingUp, Wrench, Eye, Trash2, AlertTriangle,
  Building2, Globe, Lock
} from 'lucide-react';

// Enhanced role definitions with descriptions and permissions
const ROLE_DEFINITIONS = {
  super_admin: {
    icon: Crown,
    label: 'Super Admin',
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    description: 'Full system access - can manage everything and see all projects',
    capabilities: ['Full system access', 'User management', 'All projects', 'System settings']
  },
  project_creator: {
    icon: Building2,
    label: 'Project Creator',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'Can create and manage projects they create',
    capabilities: ['Create projects', 'Manage own projects', 'Assign team members']
  },
  project_viewer: {
    icon: Eye,
    label: 'Project Viewer',
    color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    description: 'Read-only access to assigned projects',
    capabilities: ['View assigned projects', 'Read project data', 'Generate reports']
  },
  product_manager: {
    icon: Briefcase,
    label: 'Product Manager',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    description: 'Full project lifecycle management with scoping and tracking',
    capabilities: ['Create/manage projects', 'Full scoping', 'Timeline management', 'Team coordination']
  },
  sales_engineer: {
    icon: TrendingUp,
    label: 'Sales Engineer',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
    description: 'Technical sales with scoping and project creation capabilities',
    capabilities: ['Project scoping', 'Create projects', 'Generate reports', 'Technical validation']
  },
  technical_account_manager: {
    icon: HeadphonesIcon,
    label: 'Technical Account Manager',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    description: 'Manage specific projects, stakeholders, and implementation phases',
    capabilities: ['Project management', 'Stakeholder coordination', 'Phase management', 'Technical oversight']
  },
  technical_seller: {
    icon: Shield,
    label: 'Technical Seller',
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    description: 'Pre-sales technical activities and project scoping',
    capabilities: ['Technical scoping', 'Pre-sales support', 'Requirements gathering']
  },
  sales: {
    icon: TrendingUp,
    label: 'Sales',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Sales activities with basic scoping capabilities',
    capabilities: ['Basic scoping', 'Lead qualification', 'Customer engagement']
  },
  lead_engineer: {
    icon: Wrench,
    label: 'Lead Engineer',
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    description: 'Technical leadership for project implementation',
    capabilities: ['Technical implementation', 'Team leadership', 'Architecture decisions']
  },
  engineer: {
    icon: Wrench,
    label: 'Engineer',
    color: 'bg-blue-400/10 text-blue-500 border-blue-400/20',
    description: 'Hands-on technical implementation work',
    capabilities: ['Technical implementation', 'Testing', 'Documentation']
  },
  viewer: {
    icon: Eye,
    label: 'Viewer',
    color: 'bg-gray-400/10 text-gray-500 border-gray-400/20',
    description: 'Read-only access to assigned resources',
    capabilities: ['View only', 'Basic reporting']
  }
};

interface EnhancedUserManagementProps {
  scopeType?: 'global' | 'project' | 'site';
  scopeId?: string;
  scopeName?: string;
}

const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  scopeType = 'global',
  scopeId,
  scopeName
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('viewer');
  const [assignUserEmail, setAssignUserEmail] = useState('');
  const [assignRole, setAssignRole] = useState<AppRole>('viewer');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const { toast } = useToast();
  const { data: userRoles = [], isLoading } = useUserRoles(scopeType, scopeId);
  const { data: canManage = false } = useCanManageRoles(scopeType, scopeId);
  const { mutate: assignRoleMutation } = useAssignRole();
  const { mutate: removeRole } = useRemoveRole();

  // Filter roles based on search term
  const filteredRoles = userRoles.filter(role => {
    const searchLower = searchTerm.toLowerCase();
    return role.user_id.toLowerCase().includes(searchLower) ||
           role.role.toLowerCase().includes(searchLower);
  });

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFirstName || !newUserLastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingUser(true);
    
    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        user_metadata: {
          first_name: newUserFirstName,
          last_name: newUserLastName,
        },
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign the role
        assignRoleMutation({
          user_id: authData.user.id,
          role: newUserRole,
          scope_type: scopeType,
          scope_id: scopeId
        });

        toast({
          title: "User Created",
          description: `User ${newUserEmail} has been created with ${ROLE_DEFINITIONS[newUserRole].label} role`,
        });

        // Reset form
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserFirstName('');
        setNewUserLastName('');
        setNewUserRole('viewer');
        setIsCreateDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleAssignRole = async () => {
    if (!assignUserEmail) {
      toast({
        title: "Missing Information",
        description: "Please enter a user email",
        variant: "destructive"
      });
      return;
    }

    try {
      // Find user by email in profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', assignUserEmail)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        toast({
          title: "User Not Found",
          description: "No user found with this email address",
          variant: "destructive"
        });
        return;
      }

      assignRoleMutation({
        user_id: profile.id,
        role: assignRole,
        scope_type: scopeType,
        scope_id: scopeId
      });

      setAssignUserEmail('');
      setAssignRole('viewer');
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  const getRoleDefinition = (role: AppRole) => {
    return ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.viewer;
  };

  const getScopeDisplay = () => {
    if (scopeType === 'global') return 'Global';
    if (scopeType === 'project') return `Project: ${scopeName || scopeId}`;
    if (scopeType === 'site') return `Site: ${scopeName || scopeId}`;
    return scopeType;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">User Management</h2>
            <Badge variant="outline" className="ml-2">
              {getScopeDisplay()}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage user roles and permissions for enhanced access control
          </p>
        </div>

        {canManage && (
          <div className="flex space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account and assign initial role
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newUserFirstName}
                        onChange={(e) => setNewUserFirstName(e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newUserLastName}
                        onChange={(e) => setNewUserLastName(e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Secure password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Initial Role</Label>
                    <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as AppRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_DEFINITIONS).map(([role, definition]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center space-x-2">
                              <definition.icon className="h-4 w-4" />
                              <span>{definition.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreatingUser}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser} disabled={isCreatingUser}>
                      {isCreatingUser ? 'Creating...' : 'Create User'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Role to User</DialogTitle>
                  <DialogDescription>
                    Assign a role to an existing user
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={assignUserEmail}
                      onChange={(e) => setAssignUserEmail(e.target.value)}
                      placeholder="user@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignRole">Role</Label>
                    <Select value={assignRole} onValueChange={(value) => setAssignRole(value as AppRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_DEFINITIONS).map(([role, definition]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center space-x-2">
                              <definition.icon className="h-4 w-4" />
                              <span>{definition.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAssignDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAssignRole}>
                      Assign Role
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Current User Roles</span>
            <Badge variant="secondary">{filteredRoles.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRoles.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No users match your search criteria.' : 'No users have been assigned roles yet.'}
              </p>
              {canManage && !searchTerm && (
                <Button 
                  className="mt-4" 
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First User
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Assigned By</TableHead>
                  {canManage && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((userRole) => {
                  const roleDefinition = getRoleDefinition(userRole.role);
                  const RoleIcon = roleDefinition.icon;

                  return (
                    <TableRow key={userRole.id}>
                      <TableCell>
                        <div className="font-medium">
                          {userRole.user_id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1.5 rounded-lg ${roleDefinition.color}`}>
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{roleDefinition.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {roleDefinition.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {userRole.scope_type === 'global' && <Globe className="h-4 w-4 text-blue-500" />}
                          {userRole.scope_type === 'project' && <Building2 className="h-4 w-4 text-green-500" />}
                          {userRole.scope_type === 'site' && <Lock className="h-4 w-4 text-orange-500" />}
                          <span className="capitalize">{userRole.scope_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(userRole.assigned_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {userRole.assigned_by?.slice(0, 8) || 'System'}
                        </div>
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center space-x-2">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                  <span>Remove Role</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove the {roleDefinition.label} role from this user? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRole(userRole.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove Role
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Definitions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Role Definitions & Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ROLE_DEFINITIONS).map(([role, definition]) => {
              const RoleIcon = definition.icon;
              return (
                <div key={role} className={`p-4 rounded-lg border ${definition.color}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RoleIcon className="h-5 w-5" />
                    <h4 className="font-semibold">{definition.label}</h4>
                  </div>
                  <p className="text-sm mb-3">{definition.description}</p>
                  <div className="space-y-1">
                    {definition.capabilities.map((capability, index) => (
                      <div key={index} className="text-xs flex items-center space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserManagement;