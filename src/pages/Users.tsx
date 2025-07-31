import ComprehensiveUserManagement from "@/components/admin/ComprehensiveUserManagement";
import { Badge } from "@/components/ui/badge";

const Users = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <ComprehensiveUserManagement />
        </div>
      </div>
    </div>
  );
};

export default Users;