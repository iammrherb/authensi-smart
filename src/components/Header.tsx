import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHasRole } from "@/hooks/useUserRoles";
import { LogOut, Brain, Menu, Target, Zap, BarChart3, BookOpen, Building2, Settings, Sparkles, Shield, Network, FileText, ChevronDown, User, Users, Rocket, FolderOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user has admin privileges
  const { data: isAdmin } = useHasRole('super_admin', 'global');
  const { data: canManageUsers } = useHasRole('product_manager', 'global');
  
  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  const primaryNavItems = [
    { title: "Command Center", url: "/", icon: Target, active: ["/", "/dashboard"], description: "AI Hub & Overview" },
    { title: "AI Scoping", url: "/scoping", icon: Sparkles, active: ["/scoping"], description: "Intelligent Project Scoping" },
    { title: "Project Tracker", url: "/tracker", icon: Zap, active: ["/tracker", "/project"], description: "Live Project Management" },
    { title: "Implementation", url: "/implementation", icon: Rocket, active: ["/implementation"], description: "Deployment Center" },
    { title: "Analytics", url: "/reports", icon: BarChart3, active: ["/reports"], description: "Performance Insights" },
  ];

  const secondaryNavItems = [
    { title: "Resources", url: "/resources", icon: FolderOpen, active: ["/resources"], description: "Resource Center" },
    { title: "1Xer Generator", url: "/onexer-wizard", icon: Settings, active: ["/onexer-wizard"], description: "802.1X Config Generator" },
    { title: "Use Cases", url: "/use-cases", icon: BookOpen, active: ["/use-cases"], description: "Knowledge Library" },
    { title: "Sites", url: "/sites", icon: Building2, active: ["/sites"], description: "Network Sites" },
    { title: "Requirements", url: "/requirements", icon: FileText, active: ["/requirements"], description: "Project Requirements" },
    { title: "Vendors", url: "/vendors", icon: Network, active: ["/vendors"], description: "Vendor Management" },
  ];

  const isItemActive = (item: any) => {
    return item.active.some((path: string) => 
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-nav-background via-nav-background to-nav-background/95 backdrop-blur supports-[backdrop-filter]:bg-nav-background/80 shadow-elevated">
      {/* Main Header */}
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="hover:bg-nav-hover text-nav-foreground" />
          
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
              <img src={portnoxLogo} alt="Portnox" className="h-8 w-auto" />
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gradient-primary shadow-glow">
                  <Brain className="h-5 w-5 text-primary-foreground animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Intelligence Tracker Hub
                  </h1>
                  <p className="text-xs text-nav-foreground/70">
                    AI-Powered Project & Deployment Management
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced AI Status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-glow rounded-lg border border-nav-border/50 shadow-card">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-glow"></div>
            <span className="text-xs font-medium text-nav-foreground">AI Engine</span>
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
              ACTIVE
            </Badge>
          </div>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-nav-hover">
                  <div className="text-right">
                    <p className="text-sm font-medium text-nav-foreground">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-nav-foreground/60">
                      {isAdmin ? 'Super Admin' : (canManageUsers ? 'Manager' : 'User')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-nav-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border z-50">
                <DropdownMenuLabel className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings & Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                {(isAdmin || canManageUsers) && (
                  <DropdownMenuItem asChild>
                    <Link to="/users" className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {isAdmin && (
                  <DropdownMenuItem className="flex items-center space-x-2 text-purple-600">
                    <Shield className="h-4 w-4" />
                    <span>Impersonate User</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="flex items-center space-x-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;