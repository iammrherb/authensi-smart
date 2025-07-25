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
    title: "AI Intelligence Hub",
    icon: Brain,
    badge: "AI",
    items: [
      { title: "Command Center", url: "/", icon: Target, description: "AI-powered dashboard" },
      { title: "AI Scoping Wizard", url: "/scoping", icon: Lightbulb, description: "Intelligent project scoping" },
      { title: "Smart Recommendations", url: "/recommendations", icon: Sparkles, description: "AI-driven insights" },
    ]
  },
  {
    title: "Project Management",
    icon: Rocket,
    items: [
      { title: "POC Tracker", url: "/tracker", icon: Zap, description: "Implementation tracking" },
      { title: "Deployment Master", url: "/deployment", icon: Rocket, description: "Go-live management" },
      { title: "Analytics Hub", url: "/reports", icon: BarChart3, description: "Performance insights" },
    ]
  },
  {
    title: "Knowledge & Resources",
    icon: BookOpen,
    items: [
      { title: "Use Case Library", url: "/use-cases", icon: BookOpen, description: "200+ pre-built use cases" },
      { title: "Site Management", url: "/sites", icon: Building2, description: "Multi-site orchestration" },
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
  const [openGroups, setOpenGroups] = useState<string[]>(["AI Intelligence Hub", "Project Management"]);

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
    <Sidebar className={`${collapsed ? 'w-16' : 'w-72'} transition-all duration-300 border-r-2 border-sidebar-border bg-sidebar shadow-elevated`} collapsible="icon">
      <SidebarContent className="p-3">
        {/* Quick Dashboard Navigation */}
        <div className="mb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${
                  isActive('/dashboard') 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-glow' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } transition-all duration-200 h-12 text-base border border-sidebar-border rounded-lg`}
              >
                <Link to="/dashboard" className="flex items-center space-x-3">
                  <Target className="h-5 w-5" />
                  {!collapsed && <span>Dashboard Home</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* AI Quick Actions when not collapsed */}
        {!collapsed && (
          <div className="mb-6 p-4 bg-gradient-primary rounded-lg text-sidebar-primary-foreground border-2 border-primary/30 shadow-glow">
            <h3 className="font-bold text-base mb-3 flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick AI Actions</span>
            </h3>
            <div className="space-y-2">
              <SidebarMenuButton asChild className="w-full justify-start text-left hover:bg-white/20 border border-white/20">
                <Link to="/scoping">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start AI Scoping
                </Link>
              </SidebarMenuButton>
              <SidebarMenuButton asChild className="w-full justify-start text-left hover:bg-white/20 border border-white/20">
                <Link to="/recommendations">
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Insights
                </Link>
              </SidebarMenuButton>
            </div>
          </div>
        )}

        {/* AI Engine Status */}
        {!collapsed && (
          <div className="mb-4 p-3 bg-accent/30 rounded-lg border-2 border-accent shadow-card">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-glow"></div>
              <span className="text-sm font-bold text-accent-foreground">AI Engine Active</span>
              <Badge variant="secondary" className="ml-auto text-xs">LIVE</Badge>
            </div>
          </div>
        )}

        {/* Main Navigation Groups */}
        {navigationItems.map((group) => {
          const isGroupOpen = openGroups.includes(group.title);
          const groupHasActiveItem = isGroupActive(group.items);
          
          // Filter admin items based on user permissions
          if (group.title === "Administration" && !isAdmin) {
            return null;
          }

          return (
            <SidebarGroup key={group.title}>
              <Collapsible
                open={isGroupOpen}
                onOpenChange={() => toggleGroup(group.title)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`w-full justify-between p-3 border border-sidebar-border rounded-lg hover:border-sidebar-primary/30 transition-all duration-200 ${
                      groupHasActiveItem ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-primary/50" : "hover:bg-sidebar-accent"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <group.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="font-bold text-sm">{group.title}</span>
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
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isGroupOpen ? "rotate-90 text-primary" : "text-sidebar-foreground"
                        }`} 
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          className={`${
                            isActive(item.url)
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-glow border-l-4 border-primary' 
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-l-2 hover:border-primary/50'
                          } transition-all duration-200 h-11 border-l-2 border-transparent`}
                        >
                          <Link to={item.url} className="flex items-center space-x-3">
                            <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'text-sidebar-primary-foreground' : ''}`} />
                            {!collapsed && (
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{item.title}</span>
                                </div>
                                {item.description && (
                                  <p className={`text-xs mt-1 ${
                                    isActive(item.url) 
                                      ? 'text-sidebar-primary-foreground/80' 
                                      : 'text-sidebar-foreground/70'
                                  }`}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}

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