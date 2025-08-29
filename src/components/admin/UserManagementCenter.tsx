import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users, UserPlus, Shield, Settings, Eye, Edit, Trash2, 
  Plus, Search, Filter, Download, Upload, RefreshCw,
  CheckCircle, XCircle, AlertTriangle, Clock, 
  Mail, Phone, Building, Calendar, Activity,
  Lock, Unlock, Key, History, FileText, BarChart3
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import rbacService, { 
  Role, 
  Permission, 
  UserRole, 
  RoleAuditLog,
  type RoleHierarchy 
} from '@/services/rbac/RBACService';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  user_metadata?: any;
  app_metadata?: any;
  raw_user_meta_data?: any;
  raw_app_meta_data?: any;
  is_super_admin?: boolean;
  is_sso_user?: boolean;
  confirmed_at?: string;
  invited_at?: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  encrypted_password?: string;
  email_change_confirm_status?: number;
  phone?: string;
  phone_confirmed_at?: string;
  phone_change?: string;
  phone_change_sent_at?: string;
  phone_change_confirm_status?: number;
  last_sign_in_with?: string;
  factor_id_updated_at?: string;
  banned_until?: string;
  reauthentication_sent_at?: string;
  reauthentication_confirm_status?: number;
  audit_log_entries?: any[];
  identities?: any[];
  role_count?: number;
  permissions?: Permission[];
}

const UserManagementCenter: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<RoleAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Dialog states
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRoleForBulk, setSelectedRoleForBulk] = useState<string>('');

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    notes: ''
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, rolesData, permissionsData, userRolesData, auditLogsData] = await Promise.all([
        loadUsers(),
        rbacService.getRoles(),
        rbacService.getPermissions(),
        rbacService.getAllUserRoles(),
        rbacService.getAuditLogs()
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
      setUserRoles(userRolesData);
      setAuditLogs(auditLogsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load user management data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (): Promise<User[]> => {
    try {
      const { data: { users }, error } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.admin.listUsers());
      if (error) throw error;
      
      // Enrich user data with roles and permissions
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const userRoleCount = userRoles.filter(ur => ur.user_id === user.id).length;
          const userPermissions = await rbacService.getUserPermissions(user.id);
          
          return {
            ...user,
            role_count: userRoleCount,
            permissions: userPermissions
          };
        })
      );
      
      return enrichedUsers;
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                       userRoles.some(ur => ur.user_id === user.id && ur.role?.name === selectedRole);
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && user.email_confirmed_at) ||
                         (selectedStatus === 'pending' && !user.email_confirmed_at);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserRoles = (userId: string): UserRole[] => {
    return userRoles.filter(ur => ur.user_id === userId);
  };

  const getUserPermissions = (userId: string): Permission[] => {
    const userRoles = getUserRoles(userId);
    const permissions: Permission[] = [];
    
    userRoles.forEach(ur => {
      if (ur.role) {
        // Get permissions for this role
        const rolePermissions = permissions.filter(p => 
          userRoles.some(ur => ur.role_id === ur.role?.id)
        );
        permissions.push(...rolePermissions);
      }
    });
    
    return permissions;
  };

  const handleCreateUser = async () => {
    try {
      // Create user in Supabase Auth
      const { data: { user }, error: authError } = await import('@/integrations/supabase/client').then(m => 
        m.supabase.auth.admin.createUser({
          email: newUser.email,
          password: newUser.password,
          user_metadata: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            full_name: `${newUser.firstName} ${newUser.lastName}`
          }
        })
      );

      if (authError) throw authError;

      // Assign role if selected
      if (newUser.role && user) {
        await rbacService.assignRoleToUser(
          user.id,
          newUser.role,
          undefined, // assigned by current user
          undefined, // no expiration
          newUser.notes
        );
      }

      toast({
        title: "Success",
        description: "User created successfully"
      });

      setShowUserDialog(false);
      setNewUser({
        email: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        notes: ''
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const handleCreateRole = async () => {
    try {
      const role = await rbacService.createRole({
        name: newRole.name,
        description: newRole.description,
        is_system_role: false
      });

      // Assign permissions to role
      for (const permissionId of newRole.permissions) {
        await rbacService.assignPermissionToRole(role.id, permissionId);
      }

      toast({
        title: "Success",
        description: "Role created successfully"
      });

      setShowRoleDialog(false);
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to create role:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleBulkAssignRoles = async () => {
    try {
      const assignments = selectedUsers.map(userId => ({
        userId,
        roleId: selectedRoleForBulk
      }));

      await rbacService.bulkAssignRoles(assignments);

      toast({
        title: "Success",
        description: `Assigned role to ${selectedUsers.length} users`
      });

      setShowBulkAssignDialog(false);
      setSelectedUsers([]);
      setSelectedRoleForBulk('');
      
      loadData();
    } catch (error) {
      console.error('Failed to bulk assign roles:', error);
      toast({
        title: "Error",
        description: "Failed to assign roles",
        variant: "destructive"
      });
    }
  };

  const handleRevokeRole = async (userId: string, roleId: string) => {
    try {
      await rbacService.revokeRoleFromUser(userId, roleId);
      
      toast({
        title: "Success",
        description: "Role revoked successfully"
      });
      
      loadData();
    } catch (error) {
      console.error('Failed to revoke role:', error);
      toast({
        title: "Error",
        description: "Failed to revoke role",
        variant: "destructive"
      });
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getRoleColor = (roleName: string): string => {
    const colors: Record<string, string> = {
      'super_admin': 'bg-red-100 text-red-800 border-red-200',
      'admin': 'bg-orange-100 text-orange-800 border-orange-200',
      'manager': 'bg-blue-100 text-blue-800 border-blue-200',
      'engineer': 'bg-green-100 text-green-800 border-green-200',
      'analyst': 'bg-purple-100 text-purple-800 border-purple-200',
      'viewer': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[roleName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getUserStatus = (user: User): { status: string; color: string } => {
    if (user.email_confirmed_at) {
      return { status: 'Active', color: 'bg-green-100 text-green-800 border-green-200' };
    } else if (user.invited_at) {
      return { status: 'Invited', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { status: 'Pending', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading user management data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management Center</h1>
          <p className="text-muted-foreground">
            Manage users, roles, permissions, and access control
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate roles
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newUser.notes}
                    onChange={(e) => setNewUser(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes about this user..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.email_confirmed_at).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              {roles.filter(r => r.is_system_role).length} system roles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(permissions.map(p => p.resource)).size} resources
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="role-filter">Filter by Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="status-filter">Filter by Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users ({filteredUsers.length})</CardTitle>
                  <CardDescription>
                    Manage user accounts and their roles
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedUsers.length > 0 && (
                    <Dialog open={showBulkAssignDialog} onOpenChange={setShowBulkAssignDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Role ({selectedUsers.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bulk Assign Role</DialogTitle>
                          <DialogDescription>
                            Assign a role to {selectedUsers.length} selected users
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Select value={selectedRoleForBulk} onValueChange={setSelectedRoleForBulk}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowBulkAssignDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleBulkAssignRoles} disabled={!selectedRoleForBulk}>
                            Assign Role
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="outline" onClick={() => setSelectedUsers([])}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const userRolesData = getUserRoles(user.id);
                    const userPermissions = getUserPermissions(user.id);
                    const status = getUserStatus(user);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(prev => [...prev, user.id]);
                              } else {
                                setSelectedUsers(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {user.user_metadata?.full_name || user.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userRolesData.map((userRole) => (
                              <Badge
                                key={userRole.id}
                                variant="outline"
                                className={getRoleColor(userRole.role?.name || '')}
                              >
                                {userRole.role?.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {userPermissions.length} permissions
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : 'Never'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Manage Roles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>
                    Manage system roles and their associated permissions
                  </CardDescription>
                </div>
                <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Create a new role with specific permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={newRole.name}
                          onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter role name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={newRole.description}
                          onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the role's purpose"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={permission.id}
                                checked={newRole.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewRole(prev => ({
                                      ...prev,
                                      permissions: [...prev.permissions, permission.id]
                                    }));
                                  } else {
                                    setNewRole(prev => ({
                                      ...prev,
                                      permissions: prev.permissions.filter(p => p !== permission.id)
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={permission.id} className="text-sm">
                                {permission.resource}.{permission.action}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateRole}>
                        Create Role
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Roles List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">System Roles</h3>
                  {roles.map((role) => (
                    <Card key={role.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getRoleColor(role.name)}>
                              {role.name}
                            </Badge>
                            {role.is_system_role && (
                              <Badge variant="secondary">System</Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription>{role.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          {userRoles.filter(ur => ur.role_id === role.id).length} users assigned
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Permissions by Resource */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Permissions by Resource</h3>
                  {Object.entries(
                    permissions.reduce((acc, permission) => {
                      if (!acc[permission.resource]) {
                        acc[permission.resource] = [];
                      }
                      acc[permission.resource].push(permission);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                  ).map(([resource, resourcePermissions]) => (
                    <Card key={resource}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{resource}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {resourcePermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center justify-between">
                              <span className="text-sm">{permission.action}</span>
                              <Badge variant="outline" className="text-xs">
                                {permission.description}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                Track all role assignment and revocation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 50).map((log) => {
                    const user = users.find(u => u.id === log.user_id);
                    const role = roles.find(r => r.id === log.role_id);
                    const performer = users.find(u => u.id === log.performed_by);
                    
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(log.performed_at).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            log.action === 'assigned' ? 'default' :
                            log.action === 'revoked' ? 'destructive' : 'secondary'
                          }>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user?.email || 'Unknown User'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {role?.name || 'Unknown Role'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {performer?.email || 'System'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {(log as any).notes || 'No additional details'}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementCenter;
