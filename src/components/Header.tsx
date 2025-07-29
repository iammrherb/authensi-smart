import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Brain, ArrowLeft, Target, Zap, BarChart3, BookOpen, Building2, Users, Settings, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  const navigationItems = [
    { title: "Command Center", url: "/", icon: Target, active: ["/", "/dashboard"] },
    { title: "AI Scoping", url: "/scoping", icon: Sparkles, active: ["/scoping"] },
    { title: "Project Tracker", url: "/tracker", icon: Zap, active: ["/tracker", "/project"] },
    { title: "Analytics", url: "/reports", icon: BarChart3, active: ["/reports"] },
    { title: "Use Cases", url: "/use-cases", icon: BookOpen, active: ["/use-cases"] },
    { title: "Sites", url: "/sites", icon: Building2, active: ["/sites"] },
  ];

  const adminItems = [
    { title: "Users", url: "/users", icon: Users, active: ["/users"] },
    { title: "Settings", url: "/settings", icon: Settings, active: ["/settings"] },
  ];

  const isItemActive = (item: any) => {
    return item.active.some((path: string) => 
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Header Row */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-accent transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src={portnoxLogo} alt="Portnox" className="h-8 w-auto" />
              <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary animate-pulse" />
                <div>
                  <h1 className="text-lg font-bold text-foreground">Intelligence Tracker Hub</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Project & Deployment Management</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* AI Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">AI Engine Active</span>
            <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800">LIVE</Badge>
          </div>

          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.user_metadata?.role || 'User'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs Row */}
      <div className="h-12 flex items-center px-6 bg-accent/30 border-b border-border/30">
        <nav className="flex items-center space-x-1 w-full overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive = isItemActive(item);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
          
          {isAdmin && (
            <>
              <div className="w-px h-6 bg-border mx-2" />
              {adminItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;