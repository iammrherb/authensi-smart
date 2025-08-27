import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, Target, Rocket, BarChart3, Settings, BookOpen, Building2, Users, Network, FolderOpen, Bot, Sparkles, Command, PieChart, TestTube, ChevronRight, Home, Database, Zap, FileText, Globe, Tag, Presentation } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import portnoxLogo from '@/assets/portnox-logo.png';
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
  title: "Analytics",
  url: "/reports",
  icon: PieChart,
  description: "Advanced Performance Insights & Reports",
  tooltip: "Comprehensive analytics and reporting dashboard"
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
  title: "Enterprise Reports",
  url: "/dev/reports",
  icon: FileText,
  badge: "NEW",
  tooltip: "AI-powered enterprise report generation with Firecrawler integration"
}, {
  title: "Enhanced Resources",
  url: "/dev/resource/vendor/1",
  icon: Tag,
  badge: "NEW",
  tooltip: "Advanced resource management with tagging, labeling, and external links"
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
  const {
    state
  } = useSidebar();
  const { isAdmin } = useAuth();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };
  const getNavCls = (isActive: boolean) => isActive ? "bg-gradient-primary text-primary-foreground shadow-glow" : "hover:bg-sidebar-accent text-sidebar-foreground/80";
  return <TooltipProvider delayDuration={300}>
      <Sidebar className={`${collapsed ? "w-18" : "w-72"} border-r border-sidebar-border bg-sidebar-background transition-all duration-300`} collapsible="icon">
        <SidebarContent className="overflow-y-auto">
          {/* Persistent Portnox Branding - Always Visible */}
          <div className={`${collapsed ? "p-2" : "p-4"} border-b border-sidebar-border bg-gradient-to-br from-primary/5 to-primary/10`}>
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="relative flex-shrink-0">
                <div className="relative rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-2 transition-all duration-300 hover:from-primary/20 hover:to-primary/10 hover:scale-105 hover:shadow-lg">
                  <img 
                    src={portnoxLogo} 
                    alt="Portnox" 
                    className={`${collapsed ? "h-12 w-12" : "h-14 w-14"} object-contain transition-all duration-300 hover:scale-110`} 
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full animate-pulse shadow-glow"></div>
              </div>
              {!collapsed && <div className="min-w-0 flex-1">
                  
                  <h2 className="text-lg font-bold text-sidebar-foreground leading-tight">
                    Intelligence Hub
                  </h2>
                  <p className="text-xs text-sidebar-foreground/70 font-medium">AI-Powered NAC Track Master</p>
                </div>}
            </NavLink>
            
            {/* Persistent AI Status Indicator */}
            <div className={`${collapsed ? "mt-2" : "mt-3"} flex items-center ${collapsed ? "justify-center" : "justify-start"} space-x-2`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {!collapsed && <span className="text-xs font-semibold text-green-700">AI ENGINE ACTIVE</span>}
            </div>
          </div>

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

        {/* Sidebar Toggle */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="w-full justify-center hover-scale transition-all duration-200" />
            </TooltipTrigger>
            <TooltipContent side={collapsed ? "right" : "top"} className="bg-popover border border-border">
              <span className="text-sm">{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarContent>
    </Sidebar>
  </TooltipProvider>;
}