import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnifiedProjectManager from "./UnifiedProjectManager";
import ScopingWorkflow from "./ScopingWorkflow";
import TestManagement from "./TestManagement";
import ChecklistManager from "./ChecklistManager";
import ReportingDashboard from "./ReportingDashboard";
import TimelineManager from "./TimelineManager";
import PostSalesHandoff from "./PostSalesHandoff";
import ResourceTracking from "./ResourceTracking";
import AnalyticsDashboard from "./AnalyticsDashboard";

const PortnoxTracker = () => {
  const [activeTab, setActiveTab] = useState("projects");

  const tabs = [
    { id: "projects", label: "Project Workflow", icon: "🎯" },
    { id: "scoping", label: "Scoping & Analysis", icon: "🔍" },
    { id: "testing", label: "Testing & Validation", icon: "✅" },
    { id: "checklist", label: "Implementation Tasks", icon: "📝" },
    { id: "timeline", label: "Timeline & Milestones", icon: "📅" },
    { id: "resources", label: "Team & Resources", icon: "👥" },
    { id: "handoff", label: "Handoff & Transition", icon: "🤝" },
    { id: "analytics", label: "Analytics & Insights", icon: "📊" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return <UnifiedProjectManager />;
      case "scoping":
        return <ScopingWorkflow />;
      case "testing":
        return <TestManagement />;
      case "checklist":
        return <ChecklistManager />;
      case "timeline":
        return <TimelineManager />;
      case "resources":
        return <ResourceTracking />;
      case "handoff":
        return <PostSalesHandoff />;
      case "analytics":
        return <AnalyticsDashboard />;
      default:
        return <UnifiedProjectManager />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Modern Tab Navigation */}
      <Card className="bg-card/30 backdrop-blur-xl border-border/30 shadow-elevated">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent mb-2 animate-fade-in">
                NAC Tracker Management Suite
              </CardTitle>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Comprehensive project lifecycle management from scoping to deployment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="glow" className="text-sm px-3 py-1">
                <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                Live Status
              </Badge>
              <Badge variant="outline" className="text-primary border-primary/30">
                Enterprise v2.0
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Tab Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab, index) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`group flex flex-col items-center p-6 h-auto space-y-3 transition-all duration-500 ease-out ${
                  activeTab === tab.id 
                    ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105 border-0" 
                    : "hover:bg-accent/60 hover:border-primary/20 hover:shadow-md hover:scale-102 border border-border/50"
                }`}
                onClick={() => setActiveTab(tab.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110"
                }`}>
                  <span className="text-2xl">{tab.icon}</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold leading-tight block">
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="w-8 h-0.5 bg-primary-foreground/50 mx-auto mt-2 rounded-full"></div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tab Content with Animation */}
      <div className="min-h-[700px] animate-fade-in">
        <div className="relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl blur-3xl"></div>
          
          {/* Content Container */}
          <div className="relative">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortnoxTracker;