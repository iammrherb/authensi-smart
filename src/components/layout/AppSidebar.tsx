import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Brain, Target, Rocket, BarChart3, Settings, BookOpen, 
  Building2, Users, Network, FolderOpen, Bot, Sparkles,
  Command, PieChart, TestTube, ChevronRight, Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import portnoxLogo from '@/assets/portnox-logo.png';

const primaryNavItems = [
  { 
    title: "Command Center", 
    url: "/", 
    icon: Command,
    description: "AI-Powered Dashboard",
    badge: "AI"
  },
  { 
    title: "Project Hub", 
    url: "/projects", 
    icon: Target,
    description: "Project Lifecycle Management"
  },
  { 
    title: "Analytics", 
    url: "/reports", 
    icon: PieChart,
    description: "Performance Insights"
  }
];

const lifecycleItems = [
  {
    title: "Planning & Scoping",
    items: [
      { title: "Smart Wizard", url: "/wizard", icon: Sparkles, badge: "AI" },
      { title: "AI Scoping", url: "/scoping", icon: Brain },
      { title: "Requirements", url: "/requirements", icon: BookOpen }
    ]
  },
  {
    title: "Configuration & Setup",
    items: [
      { title: "AI Config Gen", url: "/ai-config", icon: Settings, badge: "1X" },
      { title: "Site Management", url: "/sites", icon: Building2 },
      { title: "Vendor Configs", url: "/vendors", icon: Network }
    ]
  },
  {
    title: "Implementation & Tracking",
    items: [
      { title: "Project Tracking", url: "/tracking", icon: BarChart3 },
      { title: "Deployment", url: "/deployment", icon: Rocket },
      { title: "Testing", url: "/testing", icon: TestTube }
    ]
  }
];

const managementItems = [
  { title: "User Management", url: "/users", icon: Users },
  { title: "Resource Library", url: "/resource-library", icon: FolderOpen },
  { title: "AI Providers", url: "/settings?tab=ai", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (isActive: boolean) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground shadow-glow" 
      : "hover:bg-sidebar-accent text-sidebar-foreground/80";

  return (
    <Sidebar
      className={`${collapsed ? "w-18" : "w-72"} border-r border-sidebar-border bg-sidebar-background`}
      collapsible="icon"
    >
      <SidebarContent className="overflow-y-auto">
        {/* Logo and Brand */}
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? "px-2" : ""}`}>
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img src={portnoxLogo} alt="Portnox" className="h-8 w-auto" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-primary rounded-full animate-pulse"></div>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Intelligence Hub
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  AI-Powered NAC Platform
                </p>
              </div>
            )}
          </NavLink>
        </div>

        {/* Primary Navigation */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Main Dashboard</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-sidebar-foreground/50">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Lifecycle */}
        {lifecycleItems.map((section) => (
          <SidebarGroup key={section.title}>
            {!collapsed && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{item.title}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-xs bg-accent/20 text-accent-foreground">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Enterprise Management */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Enterprise Management</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls(isActive(item.url))} group relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sidebar Toggle */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarTrigger className="w-full justify-center" />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}