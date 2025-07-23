
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PolicyMatrixProps {
  policies: any[];
  onPoliciesChange: (policies: any[]) => void;
  vendor: string;
}

const PolicyMatrix = ({ policies, onPoliciesChange, vendor }: PolicyMatrixProps) => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const samplePolicies = [
    {
      id: "1",
      name: "Employee Access",
      type: "802.1X",
      vlan: "100",
      status: "active",
      description: "Standard employee device access",
      conditions: ["Domain joined", "Healthy device", "Certificate auth"],
    },
    {
      id: "2",
      name: "Guest Access",
      type: "Guest Portal",
      vlan: "200",
      status: "active",
      description: "Temporary visitor access",
      conditions: ["Web portal", "Sponsor approval", "Time limited"],
    },
    {
      id: "3",
      name: "BYOD Policy",
      type: "Certificate",
      vlan: "150",
      status: "active",
      description: "Bring your own device policy",
      conditions: ["Device registration", "Mobile cert", "Compliance check"],
    },
    {
      id: "4",
      name: "IoT Devices",
      type: "MAC Auth",
      vlan: "300",
      status: "warning",
      description: "Internet of Things devices",
      conditions: ["MAC whitelist", "Device profiling", "Restricted access"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Network Access Policies</h3>
        <Button variant="outline" size="sm">
          Add Policy
        </Button>
      </div>

      <div className="grid gap-4">
        {samplePolicies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{policy.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {policy.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      VLAN {policy.vlan}
                    </Badge>
                    <Badge 
                      variant={policy.status === "active" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {policy.status}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPolicy(policy)}
                >
                  Configure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {policy.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Conditions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {policy.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPolicy && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">
              Policy Configuration: {selectedPolicy.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Authentication Type</label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  {selectedPolicy.type}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">VLAN Assignment</label>
                <div className="mt-1 p-2 bg-muted rounded text-sm">
                  VLAN {selectedPolicy.vlan}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Access Rules</label>
                <div className="mt-1 p-3 bg-muted rounded text-sm">
                  <div className="space-y-1">
                    <div>• Allow: HTTP, HTTPS, DNS</div>
                    <div>• Deny: Administrative protocols</div>
                    <div>• Monitor: All traffic</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedPolicy(null)}>
                Cancel
              </Button>
              <Button variant="default" size="sm">
                Save Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PolicyMatrix;
