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
  Building2, Globe, Lock, UserX, RefreshCw, MoreHorizontal,
  Ban, CheckCircle, XCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('viewer');
  const [assignUserEmail, setAssignUserEmail] = useState('');
  const [assignRole, setAssignRole] = useState<AppRole>('viewer');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const { toast } = useToast();
  const { data: userRoles = [], isLoading, refetch } = useUserRoles(scopeType, scopeId);
  const { data: canManage = false } = useCanManageRoles(scopeType, scopeId);
  const { mutate: assignRoleMutation } = useAssignRole();
  const { mutate: removeRole } = useRemoveRole();

  // Filter roles based on search term
  const filteredRoles = userRoles.filter(role => {
    const searchLower = searchTerm.toLowerCase();
    const userEmail = role.user_profile?.email || '';
    const userName = `${role.user_profile?.first_name || ''} ${role.user_profile?.last_name || ''}`.trim();
    return userEmail.toLowerCase().includes(searchLower) ||
           userName.toLowerCase().includes(searchLower) ||
           role.role.toLowerCase().includes(searchLower);
  });

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserFirstName || !newUserLastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingUser(true);
    
    try {
      // Use the new database function for safe user creation
      const { data, error } = await supabase.rpc('create_user_safely', {
        p_email: newUserEmail,
        p_password: 'TempPassword123!', // Temporary password, user will reset
        p_first_name: newUserFirstName,
        p_last_name: newUserLastName,
        p_role: 'viewer',
        p_scope_type: scopeType,
        p_scope_id: scopeId
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast({
          title: "User Created",
          description: `User ${newUserEmail} has been created. They will receive a password reset email.`,
        });

        // Reset form and refresh data
        setNewUserEmail('');
        setNewUserFirstName('');
        setNewUserLastName('');
        setNewUserRole('viewer');
        setIsCreateDialogOpen(false);
        refetch();
      } else {
        throw new Error(result.error);
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
        .eq('is_active', true)
        .eq('is_blocked', false)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        toast({
          title: "User Not Found",
          description: "No active user found with this email address",
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
      refetch();
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  const handlePasswordReset = async (userEmail: string) => {
    try {
      const { data, error } = await supabase.rpc('request_password_reset', {
        p_email: userEmail
      });

      if (error) throw error;

      toast({
        title: "Password Reset",
        description: "Password reset email has been sent if the user exists.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset",
        variant: "destructive"
      });
    }
  };

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const { data, error } = await supabase.rpc('toggle_user_block', {
        p_user_id: userId,
        p_block: !isBlocked
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast({
          title: "User Updated",
          description: result.message,
        });
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('delete_user_safely', {
        p_user_id: userId
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        toast({
          title: "User Deleted",
          description: result.message,
        });
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
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
            Manage user roles and permissions with enhanced security controls
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
                    Create a new user account with secure profile setup
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
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      A temporary password will be assigned. The user will receive a password reset email to set their own password.
                    </p>
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
                    Assign a role to an existing active user
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
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{searchTerm ? 'No users match your search' : 'No users found for this scope'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((userRole) => {
                  const roleDefinition = getRoleDefinition(userRole.role);
                  const RoleIcon = roleDefinition.icon;
                  const userProfile = userRole.user_profile;
                  const isBlocked = (userProfile as any)?.is_blocked || false;
                  const isActive = (userProfile as any)?.is_active !== false;
                  
                  return (
                    <TableRow key={userRole.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {userProfile?.first_name} {userProfile?.last_name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {userProfile?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <RoleIcon className="h-4 w-4" />
                          <Badge variant="outline" className={roleDefinition.color}>
                            {roleDefinition.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={isActive ? "default" : "secondary"} className="w-fit">
                            {isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                          {isBlocked && (
                            <Badge variant="destructive" className="w-fit">
                              <Ban className="h-3 w-3 mr-1" />
                              Blocked
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(userRole.assigned_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {userRole.assigned_by_profile ? 
                          `${userRole.assigned_by_profile.first_name} ${userRole.assigned_by_profile.last_name}` :
                          'System'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {canManage && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handlePasswordReset(userProfile?.email || '')}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleBlock(userRole.user_id, isBlocked)}
                                >
                                  {isBlocked ? (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Unblock User
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="h-4 w-4 mr-2" />
                                      Block User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove Role
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove User Role</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove this role from {userProfile?.first_name} {userProfile?.last_name}? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => removeRole(userRole.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Remove Role
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                {userRole.role !== 'super_admin' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          <UserX className="h-4 w-4 mr-2" />
                                          Delete User
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to permanently delete {userProfile?.first_name} {userProfile?.last_name}? 
                                            This will deactivate their account and remove all roles. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteUser(userRole.user_id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete User
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
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

export default EnhancedUserManagement;