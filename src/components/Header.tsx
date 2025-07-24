
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Users } from "lucide-react";
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/sites", label: "Sites", icon: "🏢" },
    { path: "/questionnaires", label: "Scoping", icon: "📋" },
    { path: "/tracker", label: "Implementation", icon: "⚙️" },
    { path: "/deployment", label: "Deployment", icon: "🚀" },
    { path: "/requirements", label: "Library", icon: "📚" },
    { path: "/reports", label: "Reports", icon: "📊" },
    { path: "/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={portnoxLogo} 
              alt="Portnox" 
              className="h-8 w-auto"
            />
            <div className="border-l border-border pl-3">
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                NAC Deployment Tracker
              </span>
              <div className="text-sm text-muted-foreground">
                Enterprise Network Access Control Platform
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {typeof item.icon === 'string' ? (
                  <span className="text-sm">{item.icon}</span>
                ) : (
                  item.icon
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
