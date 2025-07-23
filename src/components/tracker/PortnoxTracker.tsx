import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectOverview from "./ProjectOverview";
import DeploymentPhases from "./DeploymentPhases";
import ResourceTracking from "./ResourceTracking";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ScopingWorkflow from "./ScopingWorkflow";
import TestManagement from "./TestManagement";
import ChecklistManager from "./ChecklistManager";
import POCManager from "./POCManager";
import ReportingDashboard from "./ReportingDashboard";
import TimelineManager from "./TimelineManager";
import PostSalesHandoff from "./PostSalesHandoff";

const PortnoxTracker = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Project Overview", icon: "📋" },
    { id: "scoping", label: "Scoping & Use Cases", icon: "🎯" },
    { id: "poc", label: "POC Management", icon: "🧪" },
    { id: "phases", label: "Deployment Phases", icon: "🔄" },
    { id: "timeline", label: "Timeline & Milestones", icon: "📅" },
    { id: "testing", label: "Test Management", icon: "✅" },
    { id: "checklist", label: "Implementation Checklist", icon: "📝" },
    { id: "resources", label: "Resource Tracking", icon: "👥" },
    { id: "handoff", label: "Post-Sales Handoff", icon: "🤝" },
    { id: "reporting", label: "Reports & Analytics", icon: "📊" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectOverview />;
      case "scoping":
        return <ScopingWorkflow />;
      case "poc":
        return <POCManager />;
      case "phases":
        return <DeploymentPhases />;
      case "timeline":
        return <TimelineManager />;
      case "testing":
        return <TestManagement />;
      case "checklist":
        return <ChecklistManager />;
      case "resources":
        return <ResourceTracking />;
      case "handoff":
        return <PostSalesHandoff />;
      case "reporting":
        return <ReportingDashboard />;
      default:
        return <ProjectOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Tab Navigation */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Portnox Enterprise Deployment Suite
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary/30">
              Enterprise Grade
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                    : "hover:bg-accent/50 hover:border-primary/30"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {tab.label}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PortnoxTracker;