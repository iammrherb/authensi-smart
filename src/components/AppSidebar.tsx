import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Target, Brain, Building2, BookOpen, FileText, Zap, Rocket, 
  BarChart3, Users, Archive, Settings, ChevronRight, Plus,
  Network, Shield, Lightbulb, Sparkles, TrendingUp, MapPin
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

// Navigation structure with AI-focused organization
const navigationItems = [
  {
    title: "Intelligence Tracker Hub",
    icon: Brain,
    badge: "AI+",
    items: [
      { title: "Command Center", url: "/", icon: Target, description: "Project management hub" },
      { title: "Project Master Hub", url: "/project-master-hub", icon: TrendingUp, description: "Unified project lifecycle management" },
      { title: "Intelligence Tracker Hub", url: "/intelligence", icon: Brain, description: "Unified AI-powered intelligence & project management" },
      { title: "AI Scoping Wizard", url: "/scoping", icon: Lightbulb, description: "Intelligent project scoping" },
      { title: "Project Tracker", url: "/tracker", icon: Zap, description: "Unified project tracking" },
      { title: "AI Config Center", url: "/ai-config", icon: Sparkles, description: "AI-powered configuration generator" },
      { title: "Analytics Hub", url: "/reports", icon: BarChart3, description: "Performance insights" },
    ]
  },
  {
    title: "Knowledge & Resources",
    icon: BookOpen,
    items: [
      { title: "Use Case Library", url: "/use-cases", icon: BookOpen, description: "200+ pre-built use cases" },
      { title: "Site Management", url: "/sites", icon: Building2, description: "Site configuration (Project-based)" },
      { title: "Scoping Questionnaires", url: "/questionnaires", icon: FileText, description: "Requirements capture" },
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    items: [
      { title: "Team Management", url: "/users", icon: Users, description: "User & role management" },
      { title: "Vendor Library", url: "/vendors", icon: Archive, description: "Vendor configurations" },
      { title: "System Settings", url: "/settings", icon: Settings, description: "Platform configuration" },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [openGroups, setOpenGroups] = useState<string[]>(["Intelligence Tracker Hub", "Knowledge & Resources"]);

  const isActive = (path: string) => location.pathname === path;
  
  const isGroupActive = (items: any[]) => 
    items.some(item => isActive(item.url));

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-80'} transition-all duration-300 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm`} collapsible="icon">
      <SidebarContent className="p-4 space-y-4 h-full overflow-y-auto">
        {/* Quick Dashboard Navigation */}
        <div className="space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${
                  isActive('/dashboard') 
                    ? 'bg-primary text-primary-foreground font-semibold shadow-md' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } transition-all duration-200 h-11 text-sm rounded-lg border border-sidebar-border/50`}
              >
                <Link to="/dashboard" className="flex items-center space-x-3 px-3">
                  <Target className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>Dashboard Home</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* AI Quick Actions when not collapsed */}
        {!collapsed && (
          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-sm mb-3 flex items-center space-x-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Quick AI Actions</span>
            </h3>
            <div className="space-y-2">
              <SidebarMenuButton asChild className="w-full justify-start text-xs hover:bg-primary/10 border border-primary/20 rounded-lg h-9">
                <Link to="/scoping" className="px-2">
                  <Rocket className="h-3 w-3 mr-2" />
                  Start AI Scoping
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="w-full justify-start text-xs hover:bg-primary/10 border border-primary/20 rounded-lg h-9">
                <Link to="/project-master-hub" className="px-2">
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Project Master
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="w-full justify-start text-xs hover:bg-primary/10 border border-primary/20 rounded-lg h-9">
                <Link to="/ai-config" className="px-2">
                  <Sparkles className="h-3 w-3 mr-2" />
                  AI Config
                </Link>
              </SidebarMenuButton>
            </div>
          </div>
        )}

        {/* AI Engine Status */}
        {!collapsed && (
          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">AI Engine Active</span>
              <Badge variant="secondary" className="ml-auto text-xs">LIVE</Badge>
            </div>
          </div>
        )}

        {/* Main Navigation Groups */}
        <div className="space-y-3 flex-1">
          {navigationItems.map((group) => {
            const isGroupOpen = openGroups.includes(group.title);
            const groupHasActiveItem = isGroupActive(group.items);
            
            // Filter admin items based on user permissions
            if (group.title === "Administration" && !isAdmin) {
              return null;
            }

            return (
              <div key={group.title} className="space-y-2">
                <Collapsible
                  open={isGroupOpen}
                  onOpenChange={() => toggleGroup(group.title)}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`w-full justify-between p-3 border border-sidebar-border/50 rounded-lg hover:border-primary/30 transition-all duration-200 ${
                        groupHasActiveItem ? "bg-primary/10 text-primary border-primary/50" : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <group.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="font-semibold text-sm truncate">{group.title}</span>
                            {group.badge && (
                              <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                                {group.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      {!collapsed && (
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                            isGroupOpen ? "rotate-90 text-primary" : "text-sidebar-foreground"
                          }`} 
                        />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1">
                    <div className="ml-2 pl-3 border-l border-sidebar-border/30 space-y-1">
                      {group.items.map((item) => (
                        <SidebarMenuButton
                          key={item.url}
                          asChild
                          className={`${
                            isActive(item.url)
                              ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          } transition-all duration-200 h-10 rounded-lg border border-transparent hover:border-primary/20`}
                        >
                          <Link to={item.url} className="flex items-center space-x-3 px-3">
                            <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive(item.url) ? 'text-primary-foreground' : ''}`} />
                            {!collapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.title}</div>
                                {item.description && (
                                  <div className={`text-xs mt-0.5 leading-tight ${
                                    isActive(item.url) 
                                      ? 'text-primary-foreground/80' 
                                      : 'text-sidebar-foreground/60'
                                  }`}>
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>

        {/* AI Status Indicator - Always at bottom when expanded */}
        {!collapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-primary/5 border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs text-primary font-medium">AI Engine Active</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}