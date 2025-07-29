import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, Download, Users, Plus, X, CheckCircle, 
  AlertCircle, Info, Mail, UserPlus, Shield
} from 'lucide-react';

interface BulkUserData {
  email: string;
  first_name: string;
  last_name: string;
  job_title?: string;
  department?: string;
  company?: string;
  phone?: string;
  role: 'project_viewer' | 'project_editor' | 'project_manager' | 'site_manager';
  send_invitation: boolean;
  project_specific: boolean;
  [key: string]: any;
}

interface BulkUserCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (users: BulkUserData[]) => void;
  isLoading?: boolean;
  projectId?: string;
}

const BulkUserCreator = ({ isOpen, onClose, onSubmit, isLoading, projectId }: BulkUserCreatorProps) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [users, setUsers] = useState<BulkUserData[]>([]);
  const [csvInput, setCsvInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const userRoles = [
    { value: 'project_viewer', label: 'Project Viewer', description: 'Can view project details and progress' },
    { value: 'project_editor', label: 'Project Editor', description: 'Can edit project details and manage tasks' },
    { value: 'project_manager', label: 'Project Manager', description: 'Full project management permissions' },
    { value: 'site_manager', label: 'Site Manager', description: 'Can manage site-specific information' }
  ];

  const addUser = () => {
    setUsers([...users, { 
      email: "",
      first_name: "",
      last_name: "",
      job_title: "",
      department: "",
      company: "",
      phone: "",
      role: "project_viewer",
      send_invitation: true,
      project_specific: true
    }]);
  };

  const removeUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const updateUser = (index: number, field: string, value: any) => {
    setUsers(users.map((user, i) => 
      i === index ? { ...user, [field]: value } : user
    ));
  };

  const validateUsers = () => {
    const newErrors: string[] = [];
    
    users.forEach((user, index) => {
      if (!user.email.trim()) {
        newErrors.push(`User ${index + 1}: Email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        newErrors.push(`User ${index + 1}: Invalid email format`);
      }
      if (!user.first_name.trim()) {
        newErrors.push(`User ${index + 1}: First name is required`);
      }
      if (!user.last_name.trim()) {
        newErrors.push(`User ${index + 1}: Last name is required`);
      }
      if (!user.role) {
        newErrors.push(`User ${index + 1}: Role is required`);
      }
    });

    // Check for duplicate emails
    const emails = users.map(u => u.email.toLowerCase().trim()).filter(e => e);
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
    if (duplicates.length > 0) {
      newErrors.push(`Duplicate emails found: ${duplicates.join(', ')}`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const parseCsvData = () => {
    try {
      if (!csvInput.trim()) return;
      
      const lines = csvInput.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const newUsers: BulkUserData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const user: any = {};

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header.toLowerCase()) {
            case 'email':
            case 'email address':
              user.email = value;
              break;
            case 'first name':
            case 'firstname':
              user.first_name = value;
              break;
            case 'last name':
            case 'lastname':
              user.last_name = value;
              break;
            case 'job title':
            case 'title':
              user.job_title = value;
              break;
            case 'department':
              user.department = value;
              break;
            case 'company':
              user.company = value;
              break;
            case 'phone':
            case 'phone number':
              user.phone = value;
              break;
            case 'role':
              user.role = value.toLowerCase().replace(/\s+/g, '_');
              break;
            case 'send invitation':
            case 'invite':
              user.send_invitation = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
              break;
            default:
              user[header] = value;
          }
        });

        // Set defaults
        user.role = user.role || 'project_viewer';
        user.send_invitation = user.send_invitation !== false;
        user.project_specific = true;

        newUsers.push(user);
      }

      setUsers(newUsers);
      setErrors([]);
      setActiveTab('manual');
      setCsvInput("");
    } catch (error) {
      setErrors(['Error parsing CSV data. Please check the format.']);
    }
  };

  const exportTemplate = () => {
    const headers = [
      'Email', 'First Name', 'Last Name', 'Job Title', 'Department', 
      'Company', 'Phone', 'Role', 'Send Invitation'
    ];
    
    const sampleData = [
      'john.doe@company.com', 'John', 'Doe', 'Network Engineer', 'IT',
      'Example Corp', '+1-555-0123', 'project_editor', 'true'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_users_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!validateUsers()) {
      return;
    }
    
    const validUsers = users.filter(user => user.email.trim() !== "");
    if (validUsers.length > 0) {
      onSubmit(validUsers);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Bulk User Management
            </DialogTitle>
            <DialogDescription>
              Add multiple users and assign roles for {projectId ? 'this project' : 'the system'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  CSV Import
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manual User Entry</h3>
                  <Button onClick={addUser} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>

                {users.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No users added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Click "Add User" to start adding team members and stakeholders
                      </p>
                      <Button onClick={addUser}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First User
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {users.map((user, index) => (
                      <UserEntryCard
                        key={index}
                        user={user}
                        index={index}
                        userRoles={userRoles}
                        projectSpecific={!!projectId}
                        onUpdate={updateUser}
                        onRemove={removeUser}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="csv" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={exportTemplate} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV Template
                    </Button>
                    <Button onClick={parseCsvData} disabled={!csvInput.trim()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Process CSV Data
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="csv-data">CSV Data</Label>
                    <Textarea
                      id="csv-data"
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Paste your CSV data here..."
                      className="mt-1 min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Make sure your CSV includes headers: Email, First Name, Last Name, Job Title, Department, Role, etc.
                      Download the template above for the correct format.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Please fix the following errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="pt-4 border-t bg-muted/20 rounded-b-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {users.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span>Ready to add <Badge variant="secondary">{users.length}</Badge> user(s)</span>
                    <span>|</span>
                    <span>{users.filter(u => u.send_invitation).length} invitations to send</span>
                  </div>
                ) : (
                  'No users ready for creation'
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={users.length === 0 || isLoading}
                >
                  {isLoading ? 'Adding Users...' : `Add ${users.length} User(s)`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Individual user entry card component
const UserEntryCard: React.FC<{
  user: BulkUserData;
  index: number;
  userRoles: any[];
  projectSpecific: boolean;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ user, index, userRoles, projectSpecific, onUpdate, onRemove }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">User {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`email-${index}`}>Email *</Label>
            <Input
              id={`email-${index}`}
              type="email"
              value={user.email}
              onChange={(e) => onUpdate(index, 'email', e.target.value)}
              placeholder="user@company.com"
            />
          </div>
          
          <div>
            <Label htmlFor={`first_name-${index}`}>First Name *</Label>
            <Input
              id={`first_name-${index}`}
              value={user.first_name}
              onChange={(e) => onUpdate(index, 'first_name', e.target.value)}
              placeholder="John"
            />
          </div>

          <div>
            <Label htmlFor={`last_name-${index}`}>Last Name *</Label>
            <Input
              id={`last_name-${index}`}
              value={user.last_name}
              onChange={(e) => onUpdate(index, 'last_name', e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`job_title-${index}`}>Job Title</Label>
            <Input
              id={`job_title-${index}`}
              value={user.job_title}
              onChange={(e) => onUpdate(index, 'job_title', e.target.value)}
              placeholder="Network Engineer"
            />
          </div>

          <div>
            <Label htmlFor={`department-${index}`}>Department</Label>
            <Input
              id={`department-${index}`}
              value={user.department}
              onChange={(e) => onUpdate(index, 'department', e.target.value)}
              placeholder="IT"
            />
          </div>

          <div>
            <Label htmlFor={`company-${index}`}>Company</Label>
            <Input
              id={`company-${index}`}
              value={user.company}
              onChange={(e) => onUpdate(index, 'company', e.target.value)}
              placeholder="Example Corp"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`phone-${index}`}>Phone</Label>
            <Input
              id={`phone-${index}`}
              value={user.phone}
              onChange={(e) => onUpdate(index, 'phone', e.target.value)}
              placeholder="+1-555-0123"
            />
          </div>

          <div>
            <Label htmlFor={`role-${index}`}>Role *</Label>
            <Select 
              value={user.role} 
              onValueChange={(value) => onUpdate(index, 'role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`send_invitation-${index}`}
              checked={user.send_invitation}
              onCheckedChange={(checked) => onUpdate(index, 'send_invitation', checked)}
            />
            <Label htmlFor={`send_invitation-${index}`} className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Send email invitation
            </Label>
          </div>

          {projectSpecific && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`project_specific-${index}`}
                checked={user.project_specific}
                onCheckedChange={(checked) => onUpdate(index, 'project_specific', checked)}
              />
              <Label htmlFor={`project_specific-${index}`} className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Project-specific access
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUserCreator;