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
    if (path.startsWith('/ai-config')) return 'AI Config Generator';
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
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="h-8 w-8" />
          
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-muted-foreground">
              {getPageDescription()}
            </p>
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

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* AI Status Indicator */}
          <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 bg-muted/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">AI Active</span>
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-600">
              v2.0
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