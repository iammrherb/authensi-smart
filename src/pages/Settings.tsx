import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHasRole } from "@/hooks/useUserRoles";
import EnhancedUserManagement from "@/components/admin/EnhancedUserManagement";
import InvitationManagement from "@/components/admin/InvitationManagement";
import CustomRoleManager from "@/components/admin/CustomRoleManager";
import AISettings from "@/components/ai/AISettings";
import AIProviderSetup from "@/components/ai/AIProviderSetup";
import SimpleAIKeyManager from "@/components/ai/SimpleAIKeyManager";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Globe, Users, Brain } from "lucide-react";
import TaxonomySeederPanel from "@/components/admin/TaxonomySeederPanel";
const Settings = () => {
  const { data: isAdmin } = useHasRole('super_admin', 'global');
  const { data: canManageUsers } = useHasRole('product_manager', 'global');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              ⚙️ System Configuration
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Platform <span className="bg-gradient-primary bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Configure your NAC deployment platform settings, preferences, and system integrations
              for optimal performance and user experience.
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="flex flex-wrap justify-center lg:grid lg:grid-cols-6 gap-1">
              <TabsTrigger value="general" className="flex items-center space-x-2 text-sm">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center space-x-2 text-sm">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center space-x-2 text-sm">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Data</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2 text-sm">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
              {(isAdmin || canManageUsers) && (
                <TabsTrigger value="admin" className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Organization Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" placeholder="Your Organization" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern Time</SelectItem>
                          <SelectItem value="pst">Pacific Time</SelectItem>
                          <SelectItem value="cst">Central Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Organization Description</Label>
                    <Textarea id="description" placeholder="Brief description of your organization" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-save drafts</Label>
                      <p className="text-sm text-muted-foreground">Automatically save questionnaire drafts</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email updates on project changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme interface</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-factor authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Session timeout</Label>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="30 mins" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 mins</SelectItem>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>External Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">J</span>
                      </div>
                      <div>
                        <Label>Jira Integration</Label>
                        <p className="text-sm text-muted-foreground">Sync project tasks with Jira</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                      </div>
                      <div>
                        <Label>Slack Integration</Label>
                        <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>

                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Backup frequency</Label>
                      <p className="text-sm text-muted-foreground">How often to backup your data</p>
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Daily" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <SimpleAIKeyManager />
        </TabsContent>

            {(isAdmin || canManageUsers) && (
              <TabsContent value="admin" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <EnhancedUserManagement />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Invitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InvitationManagement />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Custom Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CustomRoleManager />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Taxonomy Seeder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TaxonomySeederPanel />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button className="bg-gradient-primary hover:opacity-90">
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;