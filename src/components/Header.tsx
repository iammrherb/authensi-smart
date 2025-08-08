import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHasRole } from "@/hooks/useUserRoles";
import { LogOut, Brain, ArrowLeft, Target, Zap, BarChart3, BookOpen, Building2, Settings, Sparkles, Shield, Network, FileText, ChevronDown, User, Users, Rocket, FolderOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    { title: "Ultimate Wizard", url: "/wizard", icon: Rocket, active: ["/wizard"], description: "Unified Scoping • Sites • Config" },
    { title: "AI Scoping", url: "/scoping", icon: Sparkles, active: ["/scoping"], description: "Intelligent Project Scoping" },
    { title: "Project Tracker", url: "/tracker", icon: Zap, active: ["/tracker", "/project"], description: "Live Project Management" },
    { title: "AI Config Gen1Xer", url: "/ai-config", icon: Settings, active: ["/ai-config", "/onexer-wizard"], description: "Intelligent 802.1X Config" },
    { title: "Analytics", url: "/reports", icon: BarChart3, active: ["/reports"], description: "Performance Insights" },
  ];

  const secondaryNavItems = [
    { title: "Resource Library", url: "/resource-library", icon: FolderOpen, active: ["/resource-library"], description: "Resource Library" },
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
      <div className="h-20 flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-nav-hover text-nav-foreground transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity group">
              <img src={portnoxLogo} alt="Portnox" className="h-10 w-auto" />
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
                  <Brain className="h-6 w-6 text-primary-foreground animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Intelligence Tracker Hub
                  </h1>
                  <p className="text-sm text-nav-foreground/70">
                    AI-Powered Project & Deployment Management
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced AI Status */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-glow rounded-xl border border-nav-border/50 shadow-card">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-glow"></div>
              <span className="text-sm font-medium text-nav-foreground">AI Engine</span>
              <Badge variant="secondary" className="ml-1 text-xs bg-green-500/20 text-green-400 border-green-500/30">
                ACTIVE
              </Badge>
            </div>
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
              <DropdownMenuContent align="end" className="w-56">
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
                    <Link to="/settings?tab=users" className="flex items-center space-x-2">
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

      {/* Primary Navigation - No Scrolling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"></div>
        <nav className="relative px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Primary Navigation Items */}
            <div className="flex items-center space-x-1">
              {primaryNavItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={`group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow' 
                        : 'text-nav-foreground/80 hover:text-nav-foreground hover:bg-nav-hover/50'
                    }`}
                  >
                    <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : ''}`} />
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.title}</span>
                      <span className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-nav-foreground/50'}`}>
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-foreground rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Secondary Navigation Dropdown */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-nav-foreground/80 hover:text-nav-foreground hover:bg-nav-hover/50">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Resource Library</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Resource Library</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {secondaryNavItems.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link to={item.url} className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;