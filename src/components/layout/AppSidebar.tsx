import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, Building2, FileText, Settings, Users, Briefcase, 
  BarChart3, MapPin, Clipboard, Zap, Shield, BookOpen,
  LogOut, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, roles: [] },
  { title: "Sites", url: "/sites", icon: Building2, roles: [] },
  { title: "Projects", url: "/projects", icon: Briefcase, roles: [] },
  { title: "Questionnaires", url: "/questionnaires", icon: FileText, roles: [] },
  { title: "Implementation", url: "/tracker", icon: Clipboard, roles: [] },
  { title: "Deployment", url: "/deployment", icon: Zap, roles: [] },
  { title: "Progress", url: "/progress", icon: BarChart3, roles: [] },
  { title: "Requirements", url: "/requirements", icon: BookOpen, roles: [] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: [] },
];

const adminItems = [
  { title: "User Management", url: "/users", icon: Users, roles: ['admin', 'project_owner'] },
  { title: "Vendor Management", url: "/vendors", icon: Shield, roles: ['admin', 'project_owner'] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ['admin', 'project_owner'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, profile, userRoles, signOut, hasRole } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const filteredAdminItems = adminItems.filter(item => 
    item.roles.length === 0 || item.roles.some(role => hasRole(role))
  );

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(profile?.first_name, profile?.last_name)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : user?.email
                  }
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {profile?.job_title || 'Team Member'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/'} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {filteredAdminItems.length > 0 && (
          <>
            <Separator className="mx-4" />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredAdminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              asChild
            >
              <NavLink to="/profile" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                {!collapsed && <span>Profile</span>}
              </NavLink>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-destructive hover:text-destructive"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}