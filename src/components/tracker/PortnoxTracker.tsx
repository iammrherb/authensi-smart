
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectOverview from "./ProjectOverview";
import DeploymentPhases from "./DeploymentPhases";
import ResourceTracking from "./ResourceTracking";
import AnalyticsDashboard from "./AnalyticsDashboard";

const PortnoxTracker = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Project Overview", icon: "📋" },
    { id: "phases", label: "Deployment Phases", icon: "🔄" },
    { id: "resources", label: "Resource Tracking", icon: "👥" },
    { id: "analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Portnox Deployment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex-shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <ProjectOverview />}
        {activeTab === "phases" && <DeploymentPhases />}
        {activeTab === "resources" && <ResourceTracking />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default PortnoxTracker;
