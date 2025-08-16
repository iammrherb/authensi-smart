import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Users, Plus, Edit, Trash2, Mail, Phone, Building, 
  UserCheck, Star, Bell, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  responsibilities: string[];
  is_primary_contact: boolean;
  can_receive_notifications: boolean;
  created_at: string;
}

interface CustomerTeamManagementProps {
  projectId: string;
  customerRole: string;
  onEventLog: (eventType: string, eventData: any) => void;
}

const roleOptions = [
  { value: 'project_owner', label: 'Project Owner', description: 'Overall project responsibility' },
  { value: 'site_owner', label: 'Site Owner', description: 'Site-specific management' },
  { value: 'team_member', label: 'Team Member', description: 'Project team participant' },
  { value: 'stakeholder', label: 'Stakeholder', description: 'Project stakeholder' }
];

const CustomerTeamManagement: React.FC<CustomerTeamManagementProps> = ({
  projectId,
  customerRole,
  onEventLog
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    responsibilities: '',
    is_primary_contact: false,
    can_receive_notifications: true
  });

  useEffect(() => {
    fetchTeamMembers();
  }, [projectId]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customer_team_members')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers((data || []).map(member => ({
        ...member,
        responsibilities: Array.isArray(member.responsibilities) ? member.responsibilities : []
      })));
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsAddingMember(true);
      
      const responsibilities = newMember.responsibilities
        .split('\n')
        .filter(r => r.trim())
        .map(r => r.trim());

      const { data, error } = await supabase
        .from('customer_team_members')
        .insert({
          project_id: projectId,
          name: newMember.name,
          email: newMember.email,
          role: newMember.role,
          department: newMember.department || null,
          phone: newMember.phone || null,
          responsibilities: responsibilities,
          is_primary_contact: newMember.is_primary_contact,
          can_receive_notifications: newMember.can_receive_notifications
        })
        .select()
        .single();

      if (error) throw error;

      setTeamMembers(prev => [data, ...prev]);
      setNewMember({
        name: '',
        email: '',
        role: '',
        department: '',
        phone: '',
        responsibilities: '',
        is_primary_contact: false,
        can_receive_notifications: true
      });

      onEventLog('team_member_added', {
        member_id: data.id,
        member_role: data.role
      });

      toast.success('Team member added successfully');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<TeamMember>) => {
    try {
      const { error } = await supabase
        .from('customer_team_members')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, ...updates } : member
        )
      );

      onEventLog('team_member_updated', {
        member_id: memberId,
        updates: Object.keys(updates)
      });

      toast.success('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customer_team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      
      onEventLog('team_member_removed', {
        member_id: memberId
      });

      toast.success('Team member removed successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_owner': return 'bg-primary text-primary-foreground';
      case 'site_owner': return 'bg-blue-500 text-white';
      case 'team_member': return 'bg-green-500 text-white';
      case 'stakeholder': return 'bg-purple-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const canManageTeam = customerRole === 'admin' || customerRole === 'manager';

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Management
          </h2>
          <p className="text-muted-foreground">
            Manage your project team members and their roles
          </p>
        </div>
        
        {canManageTeam && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Add a new team member to your project
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select 
                      value={newMember.role} 
                      onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newMember.department}
                      onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="IT, Operations, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={newMember.responsibilities}
                    onChange={(e) => setNewMember(prev => ({ ...prev, responsibilities: e.target.value }))}
                    placeholder="Enter each responsibility on a new line"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Primary Contact</Label>
                      <p className="text-xs text-muted-foreground">
                        Mark as primary contact for this project
                      </p>
                    </div>
                    <Switch
                      checked={newMember.is_primary_contact}
                      onCheckedChange={(checked) => 
                        setNewMember(prev => ({ ...prev, is_primary_contact: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Receive Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow this member to receive project notifications
                      </p>
                    </div>
                    <Switch
                      checked={newMember.can_receive_notifications}
                      onCheckedChange={(checked) => 
                        setNewMember(prev => ({ ...prev, can_receive_notifications: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={handleAddMember} disabled={isAddingMember}>
                    {isAddingMember ? 'Adding...' : 'Add Member'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team Members List */}
      <div className="grid gap-4">
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding team members to your project
              </p>
              {canManageTeam && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Member
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ) : (
          teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        {member.is_primary_contact && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                        <Badge className={getRoleColor(member.role)}>
                          {roleOptions.find(r => r.value === member.role)?.label || member.role}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {member.phone}
                            </div>
                          )}
                          {member.department && (
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2" />
                              {member.department}
                            </div>
                          )}
                        </div>
                        
                        {member.responsibilities.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium text-foreground">Responsibilities:</p>
                            <ul className="list-disc list-inside ml-2">
                              {member.responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center text-xs">
                          <Bell className={`w-3 h-3 mr-1 ${member.can_receive_notifications ? 'text-green-500' : 'text-muted-foreground'}`} />
                          {member.can_receive_notifications ? 'Notifications On' : 'Notifications Off'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Added {new Date(member.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {canManageTeam && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerTeamManagement;