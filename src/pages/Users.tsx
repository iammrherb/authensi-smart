import Header from "@/components/Header";
import EnhancedUserManagement from "@/components/admin/EnhancedUserManagement";
import { Badge } from "@/components/ui/badge";

const Users = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              👥 User Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Team <span className="bg-gradient-primary bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage user roles and permissions across projects and sites with granular access control
              and role-based security for your NAC deployment teams.
            </p>
          </div>
          
          <EnhancedUserManagement />
        </div>
      </div>
    </div>
  );
};

export default Users;