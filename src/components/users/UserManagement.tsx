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
import { Plus, Trash2, Search, Users, Shield, UserPlus, Mail, Lock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { logRoleEvent } from "@/lib/security";
import { useToast } from "@/hooks/use-toast";

interface UserManagementProps {
  scopeType?: ScopeType;
  scopeId?: string;
  scopeName?: string;
}

const UserManagement = ({ scopeType = 'global', scopeId, scopeName }: UserManagementProps) => {
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
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    analyst: 'Analyst',
    customer_admin: 'Customer Admin',
    customer_user: 'Customer User',
    vendor_admin: 'Vendor Admin',
    vendor_user: 'Vendor User',
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

  const roleDescriptions: Record<AppRole, string> = {
    super_admin: 'Full access to all project/site functionality and user management',
    project_creator: 'Can create and manage projects they create',
    project_viewer: 'Read-only access to assigned projects',
    product_manager: 'Full project lifecycle management with scoping and tracking',
    sales_engineer: 'Technical sales with scoping and project creation capabilities',
    technical_account_manager: 'Manage specific projects, stakeholders, and implementation phases',
    technical_seller: 'Pre-sales technical activities and project scoping',
    sales: 'Sales activities with basic scoping capabilities',
    lead_engineer: 'Technical lead with access to all engineering tasks',
    engineer: 'Execute engineering tasks and update project status',
    viewer: 'Read-only access to view project and site information'
  };

  const getRoleColor = (role: AppRole): string => {
    const colors = {
      super_admin: 'destructive',
      project_creator: 'default',
      project_viewer: 'outline',
      product_manager: 'success',
      sales_engineer: 'default',
      technical_account_manager: 'default',
      technical_seller: 'secondary',
      sales: 'secondary',
      lead_engineer: 'default',
      engineer: 'secondary',
      viewer: 'outline'
    };
    return colors[role] || 'outline';
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

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assign the initial role
      try {
        // Use the direct mutation instead of the RPC function
        await assignRole.mutateAsync({
          user_id: authData.user.id,
          role: newUserRole,
          scope_type: scopeType,
          scope_id: scopeId
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
      // Create a user lookup from profiles table by email
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

      // Log the role assignment
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
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" />
            User Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage user roles and permissions for{' '}
            {scopeType === 'global' ? 'the entire system' : 
             scopeType === 'project' ? `project: ${scopeName}` : 
             `site: ${scopeName}`}
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account and assign their initial role.
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
                    <label className="text-sm font-medium">Email</label>
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
                    <label className="text-sm font-medium">Password</label>
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
                    <label className="text-sm font-medium">Initial Role</label>
                    <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([role, label]) => (
                          <SelectItem key={role} value={role}>
                            <div className="flex flex-col">
                              <span>{label}</span>
                              <span className="text-xs text-muted-foreground">
                                {roleDescriptions[role as AppRole]}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={isCreating || !newUserEmail || !newUserPassword || !newUserFirstName || !newUserLastName}
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
                  Assign Role
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign User Role</DialogTitle>
                <DialogDescription>
                  Assign a role to a user for this {scopeType === 'global' ? 'system' : scopeType}.
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
                    Note: User must have an account in the system
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([role, label]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex flex-col">
                            <span>{label}</span>
                            <span className="text-xs text-muted-foreground">
                              {roleDescriptions[role as AppRole]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
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
              placeholder="Search users by email..."
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
            User Roles ({filteredRoles?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRoles && filteredRoles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Assigned By</TableHead>
                  {canManage && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell className="font-medium">
                      {userRole.user_id}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(userRole.role) as any}>
                        {roleLabels[userRole.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {userRole.scope_type === 'global' ? 'Global' : 
                       `${userRole.scope_type}: ${userRole.scope_id || 'Unknown'}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(userRole.assigned_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {userRole.assigned_by || 'System'}
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove User Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove the {roleLabels[userRole.role]} role 
                                from this user? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                           <AlertDialogAction 
                                 onClick={async () => {
                                   await logRoleEvent('removed', userRole.role, userRole.user_id, userRole.scope_type, userRole.scope_id);
                                   removeRole.mutate(userRole.id);
                                 }}
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
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <div className="text-muted-foreground mb-4">
                {userRoles?.length === 0 
                  ? "No user roles assigned yet. Assign roles to team members to get started."
                  : "No users match your current search."
                }
              </div>
              {userRoles?.length === 0 && canManage && (
                <Button onClick={() => setShowAssignDialog(true)} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign First Role
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;