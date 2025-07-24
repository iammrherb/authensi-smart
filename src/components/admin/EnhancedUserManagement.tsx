import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useUserRoles, useAssignRole, useRemoveRole, useCanManageRoles, type AppRole, type ScopeType } from "@/hooks/useUserRoles";
import { Plus, Trash2, Search, Users, Shield, UserPlus, Mail, Lock, Crown, Settings, Eye } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { logRoleEvent } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

interface EnhancedUserManagementProps {
  scopeType?: ScopeType;
  scopeId?: string;
  scopeName?: string;
}

const EnhancedUserManagement = ({ scopeType = 'global', scopeId, scopeName }: EnhancedUserManagementProps) => {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('viewer');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const { data: userRoles, isLoading } = useUserRoles(scopeType, scopeId);
  const { data: canManage } = useCanManageRoles(scopeType, scopeId);
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const roleLabels: Record<AppRole, string> = {
    project_owner: 'Admin / Project Owner',
    project_manager: 'Project Manager',
    lead_engineer: 'Lead Engineer',
    engineer: 'Engineer',
    viewer: 'Viewer'
  };

  const roleDescriptions: Record<AppRole, string> = {
    project_owner: 'Full system access, can create other admins and manage all projects',
    project_manager: 'Manage projects, sites, and assign team members',
    lead_engineer: 'Technical lead with access to all engineering tasks',
    engineer: 'Execute engineering tasks and update project status',
    viewer: 'Read-only access to view project and site information'
  };

  const getRoleIcon = (role: AppRole) => {
    const icons = {
      project_owner: Crown,
      project_manager: Settings,
      lead_engineer: Shield,
      engineer: Users,
      viewer: Eye
    };
    return icons[role];
  };

  const getRoleColor = (role: AppRole): string => {
    const colors = {
      project_owner: 'destructive',
      project_manager: 'default',
      lead_engineer: 'secondary',
      engineer: 'outline',
      viewer: 'outline'
    };
    return colors[role];
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFirstName || !newUserLastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Create user account via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: newUserFirstName,
            last_name: newUserLastName,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user returned');
      }

      // Wait for profile creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign the initial role
      try {
        await supabase.rpc('assign_initial_user_role', {
          _user_id: authData.user.id,
          _role: newUserRole,
          _scope_type: scopeType,
          _scope_id: scopeId
        });

        toast({
          title: "Success",
          description: `User ${newUserEmail} created successfully with ${roleLabels[newUserRole]} role`,
        });

        // Reset form
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserFirstName('');
        setNewUserLastName('');
        setNewUserRole('viewer');
        setShowCreateDialog(false);

      } catch (roleError) {
        console.error('Role assignment error:', roleError);
        toast({
          title: "User created but role assignment failed",
          description: "The user was created but their role couldn't be assigned. Please assign manually.",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignRole = async () => {
    if (!newUserEmail || !newUserRole) return;

    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUserEmail)
        .single();

      if (profileError || !userProfile) {
        throw new Error('User not found. Please ensure the user has an account.');
      }

      await assignRole.mutateAsync({
        user_id: userProfile.id,
        role: newUserRole,
        scope_type: scopeType,
        scope_id: scopeId
      });

      await logRoleEvent('assigned', newUserRole, userProfile.id, scopeType, scopeId);

      setNewUserEmail('');
      setNewUserRole('viewer');
      setShowAssignDialog(false);
      
      toast({
        title: "Success",
        description: `Role ${roleLabels[newUserRole]} assigned successfully`,
      });
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const filteredRoles = userRoles?.filter(role => 
    role.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading user roles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Team Management
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage user roles and permissions across projects and sites with granular access control
            and role-based security for your NAC deployment teams.
          </p>
        </div>
        {canManage && (
          <div className="flex gap-3">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90 shadow-lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User & Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User Account</DialogTitle>
                  <DialogDescription>
                    Create a new user account and assign their initial role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        placeholder="John"
                        value={newUserFirstName}
                        onChange={(e) => setNewUserFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        placeholder="Doe"
                        value={newUserLastName}
                        onChange={(e) => setNewUserLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="john.doe@company.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Initial Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign Role</label>
                    <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([role, label]) => {
                          const Icon = getRoleIcon(role as AppRole);
                          return (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div className="flex flex-col">
                                  <span>{label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {roleDescriptions[role as AppRole]}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={isCreating || !newUserEmail || !newUserPassword || !newUserFirstName || !newUserLastName}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      {isCreating ? 'Creating...' : 'Create User'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Role to Existing User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign User Role</DialogTitle>
                  <DialogDescription>
                    Assign a role to an existing user for this {scopeType === 'global' ? 'system' : scopeType}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">User Email</label>
                    <Input
                      placeholder="Enter user email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: User must already have an account in the system
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([role, label]) => {
                          const Icon = getRoleIcon(role as AppRole);
                          return (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div className="flex flex-col">
                                  <span>{label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {roleDescriptions[role as AppRole]}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignRole} disabled={!newUserEmail || assignRole.isPending}>
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
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            User Roles & Permissions ({filteredRoles?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRoles && filteredRoles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role & Permissions</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Assigned By</TableHead>
                  {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((userRole) => {
                  const Icon = getRoleIcon(userRole.role);
                  return (
                    <TableRow key={userRole.id}>
                      <TableCell className="font-medium">
                        {userRole.user_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <Badge variant={getRoleColor(userRole.role) as any}>
                            {roleLabels[userRole.role]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {roleDescriptions[userRole.role]}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {userRole.scope_type === 'global' ? 'Global System' : 
                         `${userRole.scope_type}: ${userRole.scope_id || 'Unknown'}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(userRole.assigned_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {userRole.assigned_by || 'System'}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove User Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove the {roleLabels[userRole.role]} role from this user? 
                                  This action cannot be undone and will immediately revoke their access.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeRole.mutate(userRole.id)}
                                  className="bg-red-600 hover:bg-red-700"
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
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No users match your search criteria.' : 'No users have been assigned roles yet.'}
              </p>
              {canManage && !searchTerm && (
                <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-primary hover:opacity-90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create First User
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserManagement;