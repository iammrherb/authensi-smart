import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, Target, Rocket, BarChart3, Settings, BookOpen, Building2, Users, Network, FolderOpen, Bot, Sparkles, Command, PieChart, TestTube, ChevronRight, Home, Database, Zap, FileText, Globe, Tag, Presentation, Activity, UserCheck } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { PortnoxBranding } from '@/components/common/PortnoxBranding';
const primaryNavItems = [{
  title: "Command Center",
  url: "/",
  icon: Command,
  description: "AI-Powered Project Management Dashboard",
  badge: "AI",
  tooltip: "Central hub for all project activities with AI insights"
}, {
  title: "Project Manager",
  url: "/projects",
  icon: Target,
  description: "Simple Project Creation & Management",
  tooltip: "Create, scope, and manage your NAC projects"
}, {
  title: "Analytics & Reports",
  url: "/analytics",
  icon: BarChart3,
  description: "Comprehensive Analytics & Reporting Center",
  tooltip: "Advanced analytics, reporting, and system monitoring"
}];
const lifecycleItems = [{
  title: "Planning & Scoping",
  items: [{
    title: "Smart Wizard",
    url: "/wizard",
    icon: Sparkles,
    badge: "AI",
    tooltip: "AI-powered project creation wizard"
  }, {
    title: "AI Scoping",
    url: "/scoping",
    icon: Brain,
    tooltip: "Intelligent project scoping with AI recommendations"
  }, {
    title: "Requirements",
    url: "/requirements",
    icon: BookOpen,
    tooltip: "Comprehensive requirements management"
  }]
}, {
  title: "Configuration & Setup",
  items: [{
    title: "AI Config Gen",
    url: "/ai-config",
    icon: Settings,
    badge: "1X",
    tooltip: "Automated configuration generation for 802.1X"
  }, {
    title: "Vendor Configs",
    url: "/vendors",
    icon: Network,
    tooltip: "Vendor-specific configuration templates"
  }]
}, {
  title: "Deployment & Testing",
  items: [{
    title: "Deployment",
    url: "/deployment",
    icon: Rocket,
    tooltip: "Automated deployment orchestration"
  }, {
    title: "Testing",
    url: "/testing",
    icon: TestTube,
    tooltip: "Comprehensive testing and validation"
  }]
}];
const managementItems = [{
  title: "User Management",
  url: "/users",
  icon: Users,
  tooltip: "Manage users, roles, and permissions"
}, {
  title: "AI Context Engine",
  url: "/ai-context",
  icon: Brain,
  badge: "AI",
  tooltip: "Intelligent conversation memory and contextual learning"
}, {
  title: "Smart Template Center",
  url: "/smart-templates",
  icon: Zap,
  badge: "AI",
  tooltip: "AI-powered template recommendations and optimization"
}, {
  title: "Resource Library",
  url: "/resource-library",
  icon: FolderOpen,
  tooltip: "Centralized templates, use cases, and vendor resources"
}, {
  title: "System Health",
  url: "/system-health",
  icon: Activity,
  badge: "NEW",
  tooltip: "Comprehensive system monitoring, configuration, and health checks"
}, {
  title: "User Management Center",
  url: "/user-management",
  icon: UserCheck,
  badge: "NEW",
  tooltip: "Comprehensive user and role management"
}, {
  title: "Features Showcase",
  url: "/showcase",
  icon: Presentation,
  badge: "NEW",
  tooltip: "Comprehensive showcase of all new AI Intelligence Engine features"
}, {
  title: "AI Providers",
  url: "/settings?tab=ai",
  icon: Bot,
  tooltip: "Configure AI models and providers"
}, {
  title: "Demo Data",
  url: "/demo-data",
  icon: Database,
  tooltip: "Generate comprehensive demo data for testing"
}, {
  title: "Settings",
  url: "/settings",
  icon: Settings,
  tooltip: "System configuration and preferences"
}];
export function AppSidebar() {
  const { state, open, setOpen } = useSidebar();
  const { isAdmin } = useAuth();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };
  
  const getNavCls = (isActive: boolean) => 
    isActive 
      ? "bg-gradient-primary text-primary-foreground shadow-glow border border-primary/30" 
      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground border border-transparent hover:border-sidebar-border/30";
  return <TooltipProvider delayDuration={300}>
      <Sidebar className={`${collapsed ? "w-20" : "w-80"} border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out`} collapsible="icon">
        <SidebarContent className="overflow-y-auto">
          {/* Enhanced Portnox Branding - Always Visible */}
          <PortnoxBranding collapsed={collapsed} />

        {/* Primary Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-primary font-semibold">Main Dashboard</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map(item => {
                const menuItem = <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover-scale`}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium truncate">{item.title}</span>
                              {item.badge && <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                  {item.badge}
                                </Badge>}
                            </div>
                            {item.description && <p className="text-xs text-sidebar-foreground/50 truncate">
                                {item.description}
                              </p>}
                          </div>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
                return collapsed ? <Tooltip key={item.title}>
                    <TooltipTrigger asChild>
                      {menuItem}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover border border-border p-3 shadow-xl">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{item.title}</span>
                          {item.badge && <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip> : menuItem;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Lifecycle */}
        {lifecycleItems.map(section => <SidebarGroup key={section.title}>
            {!collapsed && <SidebarGroupLabel className="text-primary font-semibold">{section.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => {
                const menuItem = <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover-scale`}>
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && <div className="flex items-center space-x-2 min-w-0">
                              <span className="text-sm truncate">{item.title}</span>
                              {item.badge && <Badge variant="outline" className="text-xs bg-accent/20 text-accent-foreground">
                                  {item.badge}
                                </Badge>}
                            </div>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>;
                return collapsed && item.tooltip ? <Tooltip key={item.title}>
                      <TooltipTrigger asChild>
                        {menuItem}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-popover border border-border p-3 shadow-xl">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{item.title}</span>
                            {item.badge && <Badge variant="outline" className="text-xs">
                                {item.badge}
                              </Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip> : menuItem;
              })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>)}

        {/* Enterprise Management */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-primary font-semibold">Enterprise Management</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
            {managementItems.filter(item => {
                // Only show AI Context Engine for super admins
                if (item.title === "AI Context Engine") {
                  return isAdmin;
                }
                return true;
              }).map(item => {
                const menuItem = <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover-scale`}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                         {!collapsed && <div className="flex items-center space-x-2 min-w-0">
                             <span className="text-sm truncate">{item.title}</span>
                             {item.badge && <Badge variant="outline" className="text-xs bg-accent/20 text-accent-foreground">
                                 {item.badge}
                               </Badge>}
                           </div>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
                return collapsed && item.tooltip ? <Tooltip key={item.title}>
                    <TooltipTrigger asChild>
                      {menuItem}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover border border-border p-3 shadow-xl">
                      <div className="space-y-1">
                        <span className="font-semibold">{item.title}</span>
                        <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip> : menuItem;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Enhanced Sidebar Toggle */}
        <div className="mt-auto p-4 border-t border-sidebar-border bg-gradient-to-t from-primary/5 to-transparent">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="w-full justify-center hover-scale transition-all duration-200 bg-card/50 hover:bg-primary/10 border border-sidebar-border hover:border-primary/30 rounded-lg p-3" />
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"} className="bg-popover border border-border shadow-lg">
              <span className="text-sm font-medium">{collapsed ? "Expand Navigation" : "Collapse Navigation"}</span>
            </TooltipContent>
          </Tooltip>
          
          {!collapsed && (
            <div className="mt-3 text-center">
              <p className="text-xs text-sidebar-foreground/60">© 2024 Portnox Ltd.</p>
              <p className="text-xs text-sidebar-foreground/40">Enterprise NAC Platform</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  </TooltipProvider>;
}