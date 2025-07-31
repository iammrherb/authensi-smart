import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlus, Mail, Clock, CheckCircle, XCircle, Eye, Send,
  Shield, Globe, Building2
} from 'lucide-react';

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
}

interface UserInvitation {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'used';
  created_at: string;
  expires_at: string;
  custom_roles: CustomRole;
  invited_by_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
  scope_type: string;
  metadata: {
    personal_message?: string;
  };
}

const InvitationManagement: React.FC = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [scopeType, setScopeType] = useState('global');
  const [personalMessage, setPersonalMessage] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch custom roles
  const { data: customRoles = [] } = useQuery({
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

  // Fetch pending invitations
  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ['user-invitations'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('user-invitation/pending', {
        method: 'GET'
      });
      
      if (error) throw error;
      return data.invitations as UserInvitation[];
    }
  });

  // Send invitation mutation
  const inviteMutation = useMutation({
    mutationFn: async (inviteData: {
      email: string;
      custom_role_id: string;
      scope_type: string;
      personal_message?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('user-invitation/invite', {
        body: inviteData
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Invitation Sent",
        description: "User invitation has been sent and is pending approval.",
      });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setPersonalMessage('');
      setSelectedRoleId('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive"
      });
    }
  });

  // Approve/reject invitation mutation
  const approvalMutation = useMutation({
    mutationFn: async ({ invitation_id, action }: { invitation_id: string; action: 'approve' | 'reject' }) => {
      const { data, error } = await supabase.functions.invoke('user-invitation/approve', {
        body: { invitation_id, action }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: `Invitation ${variables.action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The invitation has been ${variables.action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invitation",
        variant: "destructive"
      });
    }
  });

  const handleSendInvitation = () => {
    if (!inviteEmail || !selectedRoleId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    inviteMutation.mutate({
      email: inviteEmail,
      custom_role_id: selectedRoleId,
      scope_type: scopeType,
      personal_message: personalMessage || undefined
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary', icon: Clock },
      approved: { label: 'Approved', variant: 'default', icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
      expired: { label: 'Expired', variant: 'outline', icon: Clock },
      used: { label: 'Used', variant: 'default', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'global': return Globe;
      case 'project': return Building2;
      case 'site': return Shield;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Invitations</h2>
          <p className="text-muted-foreground">
            Invite new users and manage pending invitations
          </p>
        </div>

        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to a new user with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address *</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@company.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{role.name}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Access Scope</Label>
                <Select value={scopeType} onValueChange={setScopeType}>
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
                        <Shield className="h-4 w-4" />
                        Site Specific
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Add a personal welcome message..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                  disabled={inviteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendInvitation}
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Pending Invitations</span>
            <Badge variant="secondary">{invitations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending invitations</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const ScopeIcon = getScopeIcon(invitation.scope_type);
                  return (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">{invitation.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{invitation.custom_roles.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {invitation.custom_roles.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ScopeIcon className="h-4 w-4" />
                          <span className="capitalize">{invitation.scope_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        {invitation.invited_by_profile?.first_name} {invitation.invited_by_profile?.last_name}
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invitation.status === 'pending' && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approvalMutation.mutate({ 
                                invitation_id: invitation.id, 
                                action: 'approve' 
                              })}
                              disabled={approvalMutation.isPending}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approvalMutation.mutate({ 
                                invitation_id: invitation.id, 
                                action: 'reject' 
                              })}
                              disabled={approvalMutation.isPending}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
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

export default InvitationManagement;