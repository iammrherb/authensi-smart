import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Eye, EyeOff, Globe, Calendar, Clock, Users, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CustomerPortalAccessProps {
  project: {
    id: string;
    name: string;
    customer_portal_id?: string;
    customer_portal_enabled?: boolean;
    customer_access_expires_at?: string;
    customer_organization?: string;
  };
  onUpdate?: () => void;
}

const CustomerPortalAccess: React.FC<CustomerPortalAccessProps> = ({ project, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPortalId, setShowPortalId] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [customerUsers, setCustomerUsers] = useState<any[]>([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'viewer',
    password: ''
  });

  // Fetch customer users when component mounts
  React.useEffect(() => {
    if (project.customer_portal_enabled) {
      fetchCustomerUsers();
    }
  }, [project.id, project.customer_portal_enabled]);

  const fetchCustomerUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_users')
        .select('*')
        .eq('project_id', project.id);

      if (error) throw error;
      setCustomerUsers(data || []);
    } catch (error) {
      console.error('Error fetching customer users:', error);
    }
  };
  
  const portalUrl = project.customer_portal_id 
    ? `${window.location.origin}/customer-portal/${project.customer_portal_id}`
    : null;

  const copyPortalUrl = () => {
    if (portalUrl) {
      navigator.clipboard.writeText(portalUrl);
      toast.success('Portal URL copied to clipboard');
    }
  };

  const generateNewPortalId = async () => {
    setIsGenerating(true);
    try {
      const newPortalId = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 6); // 6 months from now
      
      const { error } = await supabase
        .from('projects')
        .update({
          customer_portal_id: newPortalId,
          customer_access_expires_at: expiresAt.toISOString(),
          customer_portal_enabled: true
        })
        .eq('id', project.id);

      if (error) throw error;
      
      toast.success('New portal access ID generated');
      onUpdate?.();
    } catch (error) {
      console.error('Error generating portal ID:', error);
      toast.error('Failed to generate new portal ID');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePortalAccess = async () => {
    setIsToggling(true);
    try {
      const newEnabled = !project.customer_portal_enabled;
      let updateData: any = {
        customer_portal_enabled: newEnabled
      };

      // If enabling and no portal ID exists, generate one
      if (newEnabled && !project.customer_portal_id) {
        updateData.customer_portal_id = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 6);
        updateData.customer_access_expires_at = expiresAt.toISOString();
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id);

      if (error) throw error;
      
      toast.success(newEnabled ? 'Portal access enabled' : 'Portal access disabled');
      onUpdate?.();
      
      if (newEnabled) {
        fetchCustomerUsers();
      }
    } catch (error) {
      console.error('Error updating portal access:', error);
      toast.error('Failed to update portal access');
    } finally {
      setIsToggling(false);
    }
  };

  const updateCustomerOrganization = async (organization: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ customer_organization: organization } as any)
        .eq('id', project.id);

      if (error) throw error;
      
      toast.success('Customer organization updated');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating customer organization:', error);
      toast.error('Failed to update customer organization');
    }
  };

  const addCustomerUser = async () => {
    try {
      // Generate password hash (simplified - in production use proper bcrypt)
      const passwordHash = await hashPassword(newUser.password);
      
      const { error } = await supabase
        .from('customer_users')
        .insert({
          project_id: project.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
          password_hash: passwordHash,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      toast.success('Customer user added successfully');
      setShowAddUserDialog(false);
      setNewUser({ email: '', first_name: '', last_name: '', role: 'viewer', password: '' });
      fetchCustomerUsers();
    } catch (error) {
      console.error('Error adding customer user:', error);
      toast.error('Failed to add customer user');
    }
  };

  const removeCustomerUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('customer_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Customer user removed');
      fetchCustomerUsers();
    } catch (error) {
      console.error('Error removing customer user:', error);
      toast.error('Failed to remove customer user');
    }
  };

  // Simple password hashing (in production, use proper bcrypt)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return 'Never expires';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Customer Portal Access
            </CardTitle>
            <CardDescription>
              Provide your customer with secure access to track project progress
            </CardDescription>
          </div>
          <Badge 
            variant={project.customer_portal_enabled ? "default" : "secondary"}
            className="ml-auto"
          >
            {project.customer_portal_enabled ? 'Active' : 'Disabled'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="access" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="access">Portal Access</TabsTrigger>
            <TabsTrigger value="users">Customer Users</TabsTrigger>
          </TabsList>

          <TabsContent value="access" className="space-y-6">
            {/* Portal Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Portal Status</Label>
                <Button
                  variant={project.customer_portal_enabled ? "destructive" : "default"}
                  size="sm"
                  onClick={togglePortalAccess}
                  disabled={isToggling}
                >
                  {isToggling ? 'Updating...' : (project.customer_portal_enabled ? 'Disable Access' : 'Enable Access')}
                </Button>
              </div>
              
              {project.customer_portal_enabled && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Expires: {formatExpiryDate(project.customer_access_expires_at)}
                </div>
              )}
            </div>

            <Separator />

            {/* Portal URL */}
            {project.customer_portal_enabled && portalUrl && (
              <div className="space-y-3">
                <Label>Customer Portal URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={portalUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyPortalUrl}
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this URL with your customer to give them access to their project portal
                </p>
              </div>
            )}

            <Separator />

            {/* Portal ID Management */}
            <div className="space-y-3">
              <Label>Portal Access ID</Label>
              <div className="flex gap-2">
                <Input
                  value={showPortalId ? (project.customer_portal_id || 'Not generated') : '••••••••-••••-••••-••••-••••••••••••'}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPortalId(!showPortalId)}
                  title={showPortalId ? "Hide ID" : "Show ID"}
                >
                  {showPortalId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateNewPortalId}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate New ID'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (project.customer_portal_id) {
                      navigator.clipboard.writeText(project.customer_portal_id);
                      toast.success('Portal ID copied to clipboard');
                    }
                  }}
                  className="flex-1"
                >
                  Copy ID
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Generate a new ID if the current one has been compromised or shared inappropriately
              </p>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="space-y-3">
              <Label>Customer Organization</Label>
              <div className="flex gap-2">
                <Input
                  defaultValue={project.customer_organization || ''}
                  placeholder="Enter customer organization name"
                  onBlur={(e) => {
                    if (e.target.value !== project.customer_organization) {
                      updateCustomerOrganization(e.target.value);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This information will be displayed in the customer portal header
              </p>
            </div>

            {/* Security Notes */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Security Notes:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Portal access is read-only for customers</li>
                <li>• URLs expire automatically based on project timeline</li>
                <li>• All customer activity is logged for security</li>
                <li>• Regenerate IDs if sharing with new stakeholders</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Customer Users</h3>
                <p className="text-sm text-muted-foreground">
                  Manage customer users who can access the portal
                </p>
              </div>
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Customer User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newUser.first_name}
                          onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newUser.last_name}
                          onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCustomerUser}>
                        Add User
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Customer Users List */}
            <div className="space-y-3">
              {customerUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No customer users added yet</p>
                  <p className="text-sm">Add users to give them access to the customer portal</p>
                </div>
              ) : (
                customerUsers.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <Badge variant="outline" className="mt-1">
                          {user.role}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCustomerUser(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomerPortalAccess;