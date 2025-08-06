import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, Plus, Search, UserPlus, Shield, Crown, Briefcase, 
  HeadphonesIcon, TrendingUp, Wrench, Eye, Trash2, AlertTriangle,
  Building2, Globe, Lock, Ban, RotateCcw, Mail, Activity,
  Settings, UserX, UserCheck, Key
} from 'lucide-react';
import { useUserRoles, useAssignRole, useRemoveRole, useCanManageRoles, AppRole } from '@/hooks/useUserRoles';
import InvitationManagement from './InvitationManagement';
import TwoFactorEnforcementSettings from './TwoFactorEnforcementSettings';

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

interface ComprehensiveUserManagementProps {
  scopeType?: 'global' | 'project' | 'site';
  scopeId?: string;
  scopeName?: string;
}

const ComprehensiveUserManagement: React.FC<ComprehensiveUserManagementProps> = ({
  scopeType = 'global',
  scopeId,
  scopeName
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('viewer');
  const [generatePassword, setGeneratePassword] = useState(true);
  const [userScopeType, setUserScopeType] = useState('global');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: userRoles = [], isLoading } = useUserRoles(scopeType, scopeId);
  const { data: canManage = false } = useCanManageRoles(scopeType, scopeId);
  const { mutate: assignRoleMutation } = useAssignRole();
  const { mutate: removeRole } = useRemoveRole();

  // Fetch projects and sites for scope selection
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

  // Fetch all users with enhanced profile data
  const { data: allUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, email, first_name, last_name, 
          is_active, is_blocked, last_login, 
          two_factor_enabled, failed_login_attempts,
          created_at, updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: canManage
  });

  // Fetch user activity log
  const { data: userActivity = [] } = useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: canManage
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      first_name: string;
      last_name: string;
      role: AppRole;
      password?: string;
      scope_type?: string;
      selected_projects?: string[];
      selected_sites?: string[];
    }) => {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action: 'create-user',
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          password: userData.password,
          scope_type: userData.scope_type || 'global',
          selected_projects: userData.selected_projects || [],
          selected_sites: userData.selected_sites || [],
          send_welcome_email: true
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to create user');
      }
      
      return data;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        toast({
          title: "User Created",
          description: data?.message || "User created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['all-users'] });
        queryClient.invalidateQueries({ queryKey: ['user-roles'] });
        setIsCreateDialogOpen(false);
        resetCreateForm();
      } else {
        toast({
          title: "Error",
          description: data?.error || "Failed to create user",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });

  // Block/unblock user mutation
  const toggleBlockMutation = useMutation({
    mutationFn: async ({ userId, block }: { userId: string; block: boolean }) => {
      const { data, error } = await supabase.rpc('toggle_user_block', {
        p_user_id: userId,
        p_block: block
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        description: data?.message || "User status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('soft_delete_user', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
      
      const result = data as any;
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to delete user');
      }
      
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        description: data?.message || "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.rpc('request_password_reset', {
        p_email: email
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Password Reset",
        description: data?.message || "Password reset request sent",
      });
      setResetPasswordEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    }
  });

  // 2FA enforcement mutations
  const enforce2FAMutation = useMutation({
    mutationFn: async ({ userId, immediate }: { userId: string; immediate?: boolean }) => {
      const { data, error } = await supabase.rpc('enforce_2fa_for_user' as any, {
        p_user_id: userId,
        p_deadline: immediate ? new Date() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        p_immediate: immediate || false
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "2FA Enforced",
        description: "2FA requirement has been set for the user",
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enforce 2FA",
        variant: "destructive"
      });
    }
  });

  const reset2FAMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('reset_user_2fa' as any, {
        p_user_id: userId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "2FA Reset",
        description: "User's 2FA has been reset successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset 2FA",
        variant: "destructive"
      });
    }
  });

  // Migration mutation for approved invitations
  const migrateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('migrate-invitations');
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Migration Complete",
        description: `Processed ${data.results?.length || 0} invitations`,
      });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Migration Error",
        description: error.message || "Failed to migrate invitations",
        variant: "destructive"
      });
    }
  });

  const resetCreateForm = () => {
    setNewUserEmail('');
    setNewUserFirstName('');
    setNewUserLastName('');
    setNewUserPassword('');
    setNewUserRole('viewer');
    setGeneratePassword(true);
    setUserScopeType('global');
    setSelectedProjects([]);
    setSelectedSites([]);
  };

  const handleCreateUser = () => {
    if (!newUserEmail || !newUserFirstName || !newUserLastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!generatePassword && !newUserPassword) {
      toast({
        title: "Password Required",
        description: "Please enter a password or enable auto-generation",
        variant: "destructive"
      });
      return;
    }

    createUserMutation.mutate({
      email: newUserEmail,
      first_name: newUserFirstName,
      last_name: newUserLastName,
      role: newUserRole,
      password: generatePassword ? undefined : newUserPassword,
      scope_type: userScopeType,
      selected_projects: selectedProjects,
      selected_sites: selectedSites
    });
  };

  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const userEmail = user.email || '';
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return userEmail.toLowerCase().includes(searchLower) ||
           userName.toLowerCase().includes(searchLower);
  });

  const getRoleDefinition = (role: AppRole) => {
    return ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.viewer;
  };

  const getScopeDisplay = () => {
    if (scopeType === 'global') return 'Global';
    if (scopeType === 'project') return `Project: ${scopeName || scopeId}`;
    if (scopeType === 'site') return `Site: ${scopeName || scopeId}`;
    return scopeType;
  };

  const getUserStatus = (user: any) => {
    if (!user.is_active) return { label: 'Inactive', color: 'bg-gray-500/10 text-gray-600' };
    if (user.is_blocked) return { label: 'Blocked', color: 'bg-red-500/10 text-red-600' };
    return { label: 'Active', color: 'bg-green-500/10 text-green-600' };
  };

  if (isLoading || isLoadingUsers) {
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
            <h2 className="text-2xl font-bold">Comprehensive User Management</h2>
            <Badge variant="outline" className="ml-2">
              {getScopeDisplay()}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Complete user lifecycle management with RBAC, invitations, and security controls
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
                      Create a new user account with initial role assignment
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="space-y-4">
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
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordToggle">Password</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="passwordToggle" className="text-sm font-normal">
                          Generate automatically
                        </Label>
                        <Switch
                          id="passwordToggle"
                          checked={generatePassword}
                          onCheckedChange={setGeneratePassword}
                        />
                      </div>
                    </div>
                    
                    {!generatePassword && (
                      <div className="space-y-2">
                        <Input
                          type="password"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                        <p className="text-xs text-muted-foreground">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                    )}
                    
                    {generatePassword && (
                      <p className="text-xs text-muted-foreground">
                        A temporary password will be generated automatically. User will receive an email to set their own password.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Access Scope</Label>
                    <Select value={userScopeType} onValueChange={setUserScopeType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global Access</SelectItem>
                        <SelectItem value="project">Project Specific</SelectItem>
                        <SelectItem value="site">Site Specific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {userScopeType === 'project' && (
                    <div className="space-y-2">
                      <Label>Select Projects</Label>
                      <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2">
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
                            <Label htmlFor={`project-${project.id}`} className="text-sm">
                              {project.name} - {project.client_name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userScopeType === 'site' && (
                    <div className="space-y-2">
                      <Label>Select Sites</Label>
                      <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2">
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
                            <Label htmlFor={`site-${site.id}`} className="text-sm">
                              {site.name} - {site.location}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                   )}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={createUserMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createUserMutation.isPending || !newUserEmail || !newUserFirstName || !newUserLastName}
                    >
                      {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                    </Button>
                  </div>
                  </form>
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="2fa">2FA Settings</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter email for password reset"
                value={resetPasswordEmail}
                onChange={(e) => setResetPasswordEmail(e.target.value)}
                className="w-64"
              />
              <Button
                variant="outline"
                onClick={() => resetPasswordMutation.mutate(resetPasswordEmail)}
                disabled={!resetPasswordEmail || resetPasswordMutation.isPending}
              >
                <Key className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All Users</span>
                <Badge variant="secondary">{filteredUsers.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>2FA</TableHead>
                      <TableHead>Failed Logins</TableHead>
                      <TableHead>Created</TableHead>
                      {canManage && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const status = getUserStatus(user);
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.two_factor_enabled ? 'default' : 'outline'}>
                              {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.failed_login_attempts > 3 ? 'destructive' : 'outline'}>
                              {user.failed_login_attempts || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                           {canManage && (
                             <TableCell>
                               <div className="flex space-x-1">
                                 <Button
                                   size="sm"
                                   variant="outline"
                                   onClick={() => toggleBlockMutation.mutate({ 
                                     userId: user.id, 
                                     block: !user.is_blocked 
                                   })}
                                   disabled={toggleBlockMutation.isPending}
                                 >
                                   {user.is_blocked ? (
                                     <>
                                       <UserCheck className="h-3 w-3 mr-1" />
                                       Unblock
                                     </>
                                   ) : (
                                     <>
                                       <Ban className="h-3 w-3 mr-1" />
                                       Block
                                     </>
                                   )}
                                 </Button>
                                 
                                 {!user.two_factor_enabled && (
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => enforce2FAMutation.mutate({ userId: user.id })}
                                     disabled={enforce2FAMutation.isPending}
                                     className="text-orange-600 hover:text-orange-700"
                                   >
                                     <Shield className="h-3 w-3 mr-1" />
                                     Force 2FA
                                   </Button>
                                 )}
                                 
                                 {user.two_factor_enabled && (
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => reset2FAMutation.mutate(user.id)}
                                     disabled={reset2FAMutation.isPending}
                                     className="text-blue-600 hover:text-blue-700"
                                   >
                                     <RotateCcw className="h-3 w-3 mr-1" />
                                     Reset 2FA
                                   </Button>
                                 )}
                                 
                                 <AlertDialog>
                                   <AlertDialogTrigger asChild>
                                     <Button
                                       size="sm"
                                       variant="outline"
                                       className="text-red-600 hover:text-red-700"
                                     >
                                       <Trash2 className="h-3 w-3 mr-1" />
                                       Delete
                                     </Button>
                                   </AlertDialogTrigger>
                                   <AlertDialogContent>
                                     <AlertDialogHeader>
                                       <AlertDialogTitle>Delete User</AlertDialogTitle>
                                       <AlertDialogDescription>
                                         Are you sure you want to delete {user.first_name} {user.last_name}? 
                                         This will deactivate their account and remove all roles.
                                       </AlertDialogDescription>
                                     </AlertDialogHeader>
                                     <AlertDialogFooter>
                                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                                       <AlertDialogAction
                                         onClick={() => deleteUserMutation.mutate(user.id)}
                                         className="bg-red-600 hover:bg-red-700"
                                       >
                                         Delete User
                                       </AlertDialogAction>
                                     </AlertDialogFooter>
                                   </AlertDialogContent>
                                 </AlertDialog>
                               </div>
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
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorEnforcementSettings />
        </TabsContent>

        <TabsContent value="roles">
          {/* Role Management - Use existing component logic */}
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Role assignment and management functionality</p>
              {/* Add role management table here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <div className="space-y-4">
            {canManage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Migration Tools</span>
                    <Button
                      onClick={() => migrateMutation.mutate()}
                      disabled={migrateMutation.isPending}
                      variant="outline"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {migrateMutation.isPending ? 'Processing...' : 'Create Accounts for Approved Invitations'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This will automatically create user accounts for all approved invitations that haven't been converted to user accounts yet.
                  </p>
                </CardContent>
              </Card>
            )}
            <InvitationManagement />
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>User Activity Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity recorded</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userActivity.slice(0, 50).map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge variant="outline">{activity.action}</Badge>
                        </TableCell>
                        <TableCell>{activity.user_id}</TableCell>
                        <TableCell>
                          {activity.metadata ? JSON.stringify(activity.metadata) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(activity.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveUserManagement;