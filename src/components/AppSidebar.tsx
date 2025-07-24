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
    <Sidebar className={`border-r border-border ${collapsed ? "w-16" : "w-64"}`} collapsible="icon">
      <SidebarContent className="bg-background">
        {/* AI Quick Actions - Always visible when expanded */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary font-semibold flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Quick AI Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <Link to="/scoping">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-primary/10 hover:bg-gradient-primary/20 transition-all cursor-pointer">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Start AI Scoping</span>
                  </div>
                </Link>
                <Link to="/use-cases">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-all cursor-pointer">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm">Browse Use Cases</span>
                  </div>
                </Link>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
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
                    className={`w-full justify-between ${
                      groupHasActiveItem ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <group.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="font-medium">{group.title}</span>
                          {group.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {group.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${
                          isGroupOpen ? "rotate-90" : ""
                        }`} 
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.url}
                            className={`flex items-center space-x-3 ${
                              isActive(item.url) 
                                ? "bg-gradient-primary text-white font-medium shadow-md" 
                                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {!collapsed && (
                              <div className="flex-1">
                                <div className="text-sm">{item.title}</div>
                                {item.description && (
                                  <div className="text-xs opacity-70">{item.description}</div>
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