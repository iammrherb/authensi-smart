import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, UserCheck, UserX, Key, Trash2, CheckCircle, XCircle, 
  AlertTriangle, Database, RefreshCw, Eye
} from 'lucide-react';

interface DatabaseUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_blocked: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  scope_type: string;
  scope_id?: string;
  assigned_at: string;
}

const UserManagementVerification: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users from database
  const { data: dbUsers = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['database-users'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('user-management/users');
      if (error) throw error;
      return data.users as DatabaseUser[];
    }
  });

  // Fetch user roles
  const { data: userRoles = [], isLoading: rolesLoading, refetch: refetchRoles } = useQuery({
    queryKey: ['database-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        role: item.role || 'viewer',
        scope_type: item.scope_type || 'global',
        scope_id: item.scope_id || null
      })) as UserRole[];
    }
  });

  // Test user creation
  const createTestUserMutation = useMutation({
    mutationFn: async () => {
      const testEmail = `test.user.${Date.now()}@example.com`;
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action: 'create-user',
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
          role: 'viewer',
          scope_type: 'global',
          send_welcome_email: false
        }
      });
      if (error) throw error;
      return { ...data, email: testEmail };
    },
    onSuccess: (data) => {
      toast({
        title: "Test User Created",
        description: `Test user ${data.email} created successfully in database`,
      });
      refetchUsers();
      refetchRoles();
    },
    onError: (error: any) => {
      toast({
        title: "Test User Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Test user status update
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string, action: string }) => {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action: 'update-user-status',
          user_id: userId,
          user_action: action
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "User Status Updated",
        description: `User ${variables.action} operation completed successfully`,
      });
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "Status Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Test 2FA operations
  const toggle2FAMutation = useMutation({
    mutationFn: async ({ userId, enable }: { userId: string, enable: boolean }) => {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: {
          action: 'update-user-status',
          user_id: userId,
          user_action: enable ? 'enable_2fa' : 'disable_2fa'
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "2FA Updated",
        description: `Two-factor authentication ${variables.enable ? 'enabled' : 'disabled'} successfully`,
      });
      refetchUsers();
    },
    onError: (error: any) => {
      toast({
        title: "2FA Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Complete user deletion from auth system
  const deleteFromAuthMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('user-management/delete-auth-user', {
        body: {
          user_id: userId
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "User Completely Deleted",
        description: "User has been permanently removed from the authentication system",
      });
      refetchUsers();
      refetchRoles();
    },
    onError: (error: any) => {
      toast({
        title: "Complete Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (user: DatabaseUser) => {
    if (!user.is_active) return 'destructive';
    if (user.is_blocked) return 'secondary';
    return 'default';
  };

  const getStatusText = (user: DatabaseUser) => {
    if (!user.is_active) return 'Inactive';
    if (user.is_blocked) return 'Blocked';
    return 'Active';
  };

  const testUserOperations = async (userId: string) => {
    try {
      // Test blocking user
      await updateUserStatusMutation.mutateAsync({ userId, action: 'block' });
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test unblocking user
      await updateUserStatusMutation.mutateAsync({ userId, action: 'unblock' });
      
      toast({
        title: "User Operations Test Complete",
        description: "Block/unblock operations tested successfully",
      });
    } catch (error: any) {
      toast({
        title: "User Operations Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center">
            <Database className="h-6 w-6 mr-2 text-primary" />
            User Management Verification
          </h2>
          <p className="text-muted-foreground mt-2">
            Verify that all user management operations are properly persisting to the database
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              refetchUsers();
              refetchRoles();
            }}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button
            onClick={() => createTestUserMutation.mutate()}
            disabled={createTestUserMutation.isPending}
            className="bg-gradient-primary hover:opacity-90"
          >
            {createTestUserMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 mr-2" />
                Test User Creation
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Orphaned Users Cleanup */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Auth System Cleanup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              These users still exist in the auth.users table but have been removed from the application database. 
              Use the buttons below to completely remove them from the authentication system.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  if (confirm('This will PERMANENTLY delete user 2d7e65f7-698a-4e59-ae15-a415ad3c9dd8 from the authentication system. Continue?')) {
                    deleteFromAuthMutation.mutate('2d7e65f7-698a-4e59-ae15-a415ad3c9dd8');
                  }
                }}
                disabled={deleteFromAuthMutation.isPending}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete 2d7e65f7 (matt.herbert@portnox.com)
              </Button>
              <Button
                onClick={() => {
                  if (confirm('This will PERMANENTLY delete user 08c1181f-bccd-4cef-ba70-2541b6c55024 from the authentication system. Continue?')) {
                    deleteFromAuthMutation.mutate('08c1181f-bccd-4cef-ba70-2541b6c55024');
                  }
                }}
                disabled={deleteFromAuthMutation.isPending}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete 08c1181f (Garrett Gross)
              </Button>
            </div>
            {deleteFromAuthMutation.isPending && (
              <p className="text-sm text-muted-foreground">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-destructive mr-2"></div>
                Deleting user from authentication system...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{dbUsers.length}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {dbUsers.filter(u => u.is_active && !u.is_blocked).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blocked Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {dbUsers.filter(u => u.is_blocked).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">2FA Enabled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dbUsers.filter(u => u.two_factor_enabled).length}
                </p>
              </div>
              <Key className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Database Users & Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : dbUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found in database</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">2FA</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Test Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {dbUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground font-mono">{user.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(user) as any}>
                          {getStatusText(user)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={user.two_factor_enabled ? 'default' : 'outline'}>
                            {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggle2FAMutation.mutate({ 
                              userId: user.id, 
                              enable: !user.two_factor_enabled 
                            })}
                            disabled={toggle2FAMutation.isPending}
                          >
                            <Key className="h-3 w-3 mr-1" />
                            {user.two_factor_enabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testUserOperations(user.id)}
                            disabled={updateUserStatusMutation.isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Test
                          </Button>
                          {user.email.includes('test.user.') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserStatusMutation.mutate({ 
                                userId: user.id, 
                                action: 'delete' 
                              })}
                              disabled={updateUserStatusMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete Test
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Database User Roles ({userRoles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rolesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No user roles found in database</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">User ID</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Scope</th>
                    <th className="text-left p-4">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((role) => (
                    <tr key={role.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-mono text-sm">{role.user_id}</td>
                      <td className="p-4">
                        <Badge variant="default">{role.role}</Badge>
                      </td>
                      <td className="p-4 text-sm">
                        {role.scope_type}
                        {role.scope_id && ` (${role.scope_id})`}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(role.assigned_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementVerification;