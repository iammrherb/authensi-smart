import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHasRole } from "@/hooks/useUserRoles";
import { LogOut, Brain, ArrowLeft, Target, Zap, BarChart3, BookOpen, Building2, Settings, Sparkles, Shield, Network, FileText, ChevronDown, User, Users } from "lucide-react";
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


  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-nav-background via-nav-background to-nav-background/95 backdrop-blur supports-[backdrop-filter]:bg-nav-background/80 shadow-elevated">
      <div className="h-16 flex items-center justify-between px-6">
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
              <img src={portnoxLogo} alt="Portnox" className="h-8 w-auto" />
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-gradient-primary shadow-glow">
                  <Brain className="h-5 w-5 text-primary-foreground animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Intelligence Tracker Hub
                  </h1>
                  <p className="text-xs text-nav-foreground/70">
                    AI-Powered Project Management
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Enhanced AI Status */}
          <div className="flex items-center space-x-3 px-3 py-1.5 bg-gradient-glow rounded-lg border border-nav-border/50 shadow-card">
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
    </header>
  );
};

export default Header;