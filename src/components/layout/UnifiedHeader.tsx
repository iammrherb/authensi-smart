import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHasRole } from '@/hooks/useUserRoles';
import { LogOut, User, Users, Settings, Shield, ChevronDown, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link, useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PortnoxMiniLogo } from '@/components/common/PortnoxBranding';

export function UnifiedHeader() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const { data: isAdmin } = useHasRole('super_admin', 'global');
  const { data: canManageUsers } = useHasRole('product_manager', 'global');

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Command Center';
    if (path.startsWith('/projects')) return 'Project Hub';
    if (path.startsWith('/scoping')) return 'AI Scoping';
    if (path.startsWith('/tracking')) return 'Project Tracking';
    if (path.startsWith('/reports')) return 'Analytics & Reports';
    if (path.startsWith('/sites')) return 'Site Management';
    if (path.startsWith('/vendors')) return 'Vendor Management';
    if (path.startsWith('/users')) return 'User Management';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/wizard')) return 'Smart Wizard';
    if (path.startsWith('/ai-config')) return 'Smart Config Generator';
    return 'NAC Intelligence Hub';
  };

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === '/') return 'AI-powered dashboard and intelligence center';
    if (path.startsWith('/projects')) return 'Unified project lifecycle management';
    if (path.startsWith('/scoping')) return 'Intelligent project scoping and analysis';
    if (path.startsWith('/tracking')) return 'Real-time project tracking and insights';
    if (path.startsWith('/reports')) return 'Performance analytics and reporting';
    return 'Enterprise-grade network access control platform';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Fixed Portnox branding that never collapses */}
        <div className="flex items-center space-x-6 min-w-0 flex-1">
          <SidebarTrigger className="h-10 w-10 hover:bg-primary/10 rounded-lg transition-colors duration-200 flex-shrink-0" />
          
          {/* Fixed Portnox Logo and Branding */}
          <div className="flex items-center space-x-4 min-w-0">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <PortnoxMiniLogo />
              <div className="hidden sm:block min-w-0">
                <h1 className="text-xl font-bold text-foreground truncate">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {getPageDescription()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, sites, or documentation..."
              className="pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Right side - Enhanced with Portnox branding */}
        <div className="flex items-center space-x-4">
          {/* Enhanced AI Status Indicator */}
          <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-card to-primary/5 border border-primary/20 rounded-xl shadow-sm">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_5px_hsl(var(--neon-green))]"></div>
            <span className="text-sm font-bold text-foreground">Portnox AI</span>
            <Badge variant="secondary" className="text-xs bg-neon-green/20 text-neon-green border-neon-green/30">
              Intelligence v3.0
            </Badge>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">
                      {user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? 'Super Admin' : (canManageUsers ? 'Manager' : 'User')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
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
                    <Link to="/users" className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {isAdmin && (
                  <DropdownMenuItem className="flex items-center space-x-2 text-purple-600">
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
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
}