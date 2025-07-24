import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Shield, Database, Activity, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, hasRole, profile } = useAuth();
  const { data: allUserRoles } = useUserRoles();
  const { toast } = useToast();

  // Initialize global admin if none exists
  useEffect(() => {
    const initializeGlobalAdmin = async () => {
      if (!user || !hasRole('project_owner')) return;

      try {
        // Check if user already has global admin role
        const hasGlobalAdmin = allUserRoles?.some(
          role => role.role === 'project_owner' && role.scope_type === 'global'
        );

        if (!hasGlobalAdmin) {
          // Call the function to create initial admin
          const { error } = await supabase.rpc('create_initial_admin', {
            _user_id: user.id
          });

          if (error) {
            console.error('Error creating initial admin:', error);
          } else {
            toast({
              title: "Global Admin Role Created",
              description: "You've been granted global administrator privileges.",
            });
          }
        }
      } catch (error) {
        console.error('Error initializing global admin:', error);
      }
    };

    initializeGlobalAdmin();
  }, [user, allUserRoles, hasRole, toast]);

  const adminCards = [
    {
      title: "User Management",
      description: "Manage user roles and permissions across the entire platform",
      icon: Users,
      href: "/users",
      color: "bg-blue-500/10 text-blue-600",
      count: allUserRoles?.length || 0
    },
    {
      title: "System Settings",
      description: "Configure global system settings and preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-purple-500/10 text-purple-600",
      count: null
    },
    {
      title: "Security & Compliance",
      description: "Monitor security policies and compliance requirements",
      icon: Shield,
      href: "/security",
      color: "bg-red-500/10 text-red-600",
      count: null
    },
    {
      title: "Data Management",
      description: "Manage libraries, templates, and global configurations",
      icon: Database,
      href: "/vendors",
      color: "bg-green-500/10 text-green-600",
      count: null
    }
  ];

  if (!hasRole('project_owner') && !hasRole('project_manager')) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            You don't have the required permissions to access the admin dashboard.
          </p>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Administration Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage global settings, users, and system configuration for Portnox NAC Deployment Tracker
            </p>
          </div>
          <Badge variant="glow" className="text-sm">
            <Activity className="h-4 w-4 mr-1" />
            System Admin
          </Badge>
        </div>
      </div>

      {/* Welcome Card */}
      <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Welcome, {profile?.first_name || user?.email}
              </h3>
              <p className="text-muted-foreground">
                You have administrative access to manage the entire Portnox deployment platform.
                Use the tools below to configure users, settings, and system-wide preferences.
              </p>
            </div>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/users">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminCards.map((card) => (
          <Card key={card.title} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <Link to={card.href}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  {card.count !== null && (
                    <Badge variant="outline" className="text-xs">
                      {card.count}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" />
              User Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="font-medium">{allUserRoles?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Admins</span>
                <span className="font-medium">
                  {allUserRoles?.filter(role => role.role === 'project_owner').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Project Managers</span>
                <span className="font-medium">
                  {allUserRoles?.filter(role => role.role === 'project_manager').length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Database</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Authentication</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Storage</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">RLS Policies</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Role-based Access</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Data Encryption</span>
                <Badge variant="default" className="text-xs bg-green-500/10 text-green-600">SSL/TLS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;