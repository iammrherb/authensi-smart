
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VendorSelector from "./VendorSelector";
import DiagramCanvas from "./DiagramCanvas";
import ComponentLibrary from "./ComponentLibrary";
import PolicyMatrix from "./PolicyMatrix";
import WorkflowTimeline from "./WorkflowTimeline";

const ArchitectureDesigner = () => {
  const [selectedVendor, setSelectedVendor] = useState("portnox");
  const [activeTab, setActiveTab] = useState("design");
  const [components, setComponents] = useState([]);
  const [policies, setPolicies] = useState([]);

  const tabs = [
    { id: "design", label: "Design", icon: "🎨" },
    { id: "components", label: "Components", icon: "🔧" },
    { id: "policies", label: "Policies", icon: "🛡️" },
    { id: "workflow", label: "Workflow", icon: "📋" },
    { id: "export", label: "Export", icon: "📤" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <VendorSelector 
              selectedVendor={selectedVendor}
              onVendorChange={setSelectedVendor}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Design Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {activeTab === "components" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Component Library</CardTitle>
            </CardHeader>
            <CardContent>
              <ComponentLibrary vendor={selectedVendor} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {activeTab === "design" && "Architecture Canvas"}
                {activeTab === "components" && "Component Configuration"}
                {activeTab === "policies" && "Policy Management"}
                {activeTab === "workflow" && "Deployment Workflow"}
                {activeTab === "export" && "Export Configuration"}
              </CardTitle>
              <div className="flex space-x-2">
                <Badge variant="glow">
                  {selectedVendor.charAt(0).toUpperCase() + selectedVendor.slice(1)}
                </Badge>
                <Button variant="outline" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {activeTab === "design" && (
              <DiagramCanvas 
                components={components}
                onComponentsChange={setComponents}
                vendor={selectedVendor}
              />
            )}
            {activeTab === "components" && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold mb-4">Select Components from Library</h3>
                <p className="text-muted-foreground">
                  Choose components from the sidebar to add to your architecture
                </p>
              </div>
            )}
            {activeTab === "policies" && (
              <PolicyMatrix 
                policies={policies}
                onPoliciesChange={setPolicies}
                vendor={selectedVendor}
              />
            )}
            {activeTab === "workflow" && (
              <WorkflowTimeline vendor={selectedVendor} />
            )}
            {activeTab === "export" && (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold mb-4">Export Configuration</h3>
                <p className="text-muted-foreground mb-6">
                  Generate configuration files for your selected vendor
                </p>
                <Button variant="hero">
                  Generate Configuration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchitectureDesigner;
