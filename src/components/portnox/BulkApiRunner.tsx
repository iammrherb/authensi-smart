import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PortnoxApiService } from "@/services/PortnoxApiService";
import { Loader2, Play, Zap } from "lucide-react";
import Papa from "papaparse";

interface RunResult {
  index: number;
  status: 'success' | 'error';
  method: string;
  path: string;
  response?: any;
  error?: string;
}

const BulkApiRunner: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("presets");
  const [selectedPreset, setSelectedPreset] = useState("create-sites");
  const [csvData, setCsvData] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[]>([]);

  const presets = [
    // ===== SITE MANAGEMENT =====
    {
      id: "create-sites",
      name: "Create Sites",
      method: "POST",
      path: "/restapi/sites",
      headers: ["name", "description", "location", "timezone", "contact_email"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description || "",
        location: row.location || "",
        timezone: row.timezone || "UTC",
        contactEmail: row.contact_email || "",
      }),
    },
    {
      id: "update-sites",
      name: "Update Sites", 
      method: "PUT",
      path: "/restapi/sites/{site_id}",
      headers: ["site_id", "name", "description", "location", "contact_email"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description,
        location: row.location,
        contactEmail: row.contact_email,
      }),
    },
    {
      id: "delete-sites",
      name: "Delete Sites",
      method: "DELETE", 
      path: "/restapi/sites/{site_id}",
      headers: ["site_id"],
      buildBody: (row: Record<string, string>) => ({}),
    },

    // ===== NAS DEVICE MANAGEMENT =====
    {
      id: "create-nas",
      name: "Create NAS Devices",
      method: "POST", 
      path: "/restapi/nas",
      headers: ["name", "ip", "shared_secret", "vendor", "model", "description", "site_id"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        ip: row.ip,
        sharedSecret: row.shared_secret || "portnox123",
        vendor: row.vendor || "Generic",
        model: row.model || "Switch",
        description: row.description || "",
        siteId: row.site_id || "",
      }),
    },
    {
      id: "update-nas",
      name: "Update NAS Devices",
      method: "PUT",
      path: "/restapi/nas/{nas_id}",
      headers: ["nas_id", "name", "ip", "vendor", "model", "description"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        ip: row.ip,
        vendor: row.vendor,
        model: row.model,
        description: row.description,
      }),
    },
    {
      id: "delete-nas",
      name: "Delete NAS Devices",
      method: "DELETE",
      path: "/restapi/nas/{nas_id}",
      headers: ["nas_id"],
      buildBody: (row: Record<string, string>) => ({}),
    },

    // ===== USER MANAGEMENT =====
    {
      id: "create-users",
      name: "Create Users",
      method: "POST",
      path: "/restapi/users", 
      headers: ["username", "email", "first_name", "last_name", "role", "groups", "password"],
      buildBody: (row: Record<string, string>) => ({
        username: row.username,
        email: row.email,
        firstName: row.first_name || "",
        lastName: row.last_name || "",
        role: row.role || "User",
        groups: row.groups ? row.groups.split(",") : [],
        password: row.password,
      }),
    },
    {
      id: "update-users",
      name: "Update Users",
      method: "PUT",
      path: "/restapi/users/{user_id}",
      headers: ["user_id", "email", "first_name", "last_name", "role", "groups"],
      buildBody: (row: Record<string, string>) => ({
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role,
        groups: row.groups ? row.groups.split(",") : [],
      }),
    },
    {
      id: "delete-users",
      name: "Delete Users",
      method: "DELETE",
      path: "/restapi/users/{user_id}",
      headers: ["user_id"],
      buildBody: (row: Record<string, string>) => ({}),
    },

    // ===== GROUP MANAGEMENT =====
    {
      id: "create-groups",
      name: "Create Groups",
      method: "POST",
      path: "/restapi/groups",
      headers: ["name", "description", "policy_id", "vlan_id"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description || "",
        policyId: row.policy_id || "",
        vlanId: row.vlan_id || "",
      }),
    },
    {
      id: "update-groups",
      name: "Update Groups",
      method: "PUT",
      path: "/restapi/groups/{group_id}",
      headers: ["group_id", "name", "description", "policy_id", "vlan_id"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description,
        policyId: row.policy_id,
        vlanId: row.vlan_id,
      }),
    },

    // ===== POLICY MANAGEMENT =====
    {
      id: "create-policies",
      name: "Create Policies",
      method: "POST",
      path: "/restapi/policies",
      headers: ["name", "description", "action", "conditions", "priority"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description || "",
        action: row.action || "ALLOW",
        conditions: row.conditions ? JSON.parse(row.conditions) : {},
        priority: parseInt(row.priority) || 100,
      }),
    },

    // ===== DEVICE MANAGEMENT =====
    {
      id: "update-devices",
      name: "Update Devices", 
      method: "PUT",
      path: "/restapi/devices/{device_id}",
      headers: ["device_id", "name", "description", "group_id", "status"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description,
        groupId: row.group_id,
        status: row.status || "active",
      }),
    },
    {
      id: "quarantine-devices",
      name: "Quarantine Devices",
      method: "POST",
      path: "/restapi/devices/{device_id}/quarantine",
      headers: ["device_id", "reason"],
      buildBody: (row: Record<string, string>) => ({
        reason: row.reason || "Security violation",
      }),
    },
    {
      id: "release-devices",
      name: "Release Devices from Quarantine",
      method: "POST",
      path: "/restapi/devices/{device_id}/release",
      headers: ["device_id", "reason"],
      buildBody: (row: Record<string, string>) => ({
        reason: row.reason || "Issue resolved",
      }),
    },

    // ===== CERTIFICATE MANAGEMENT =====
    {
      id: "create-certificates",
      name: "Create Certificates",
      method: "POST",
      path: "/restapi/certificates",
      headers: ["name", "type", "subject", "validity_days"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        type: row.type || "server",
        subject: row.subject,
        validityDays: parseInt(row.validity_days) || 365,
      }),
    },

    // ===== NETWORK CONFIGURATION =====
    {
      id: "create-vlans",
      name: "Create VLANs",
      method: "POST", 
      path: "/restapi/vlans",
      headers: ["vlan_id", "name", "description", "subnet", "gateway"],
      buildBody: (row: Record<string, string>) => ({
        vlanId: parseInt(row.vlan_id),
        name: row.name,
        description: row.description || "",
        subnet: row.subnet,
        gateway: row.gateway,
      }),
    },
    {
      id: "create-radius-clients",
      name: "Create RADIUS Clients",
      method: "POST",
      path: "/restapi/radius/clients",
      headers: ["ip", "shared_secret", "name", "vendor", "nas_type"],
      buildBody: (row: Record<string, string>) => ({
        ip: row.ip,
        sharedSecret: row.shared_secret,
        name: row.name,
        vendor: row.vendor || "Generic",
        nasType: row.nas_type || "switch",
      }),
    },

    // ===== REPORTING & ANALYTICS =====
    {
      id: "create-reports",
      name: "Create Reports",
      method: "POST",
      path: "/restapi/reports", 
      headers: ["name", "type", "parameters", "schedule"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        type: row.type || "device_summary",
        parameters: row.parameters ? JSON.parse(row.parameters) : {},
        schedule: row.schedule || "daily",
      }),
    },

    // ===== CUSTOM API CALLS =====
    {
      id: "custom-get",
      name: "Custom GET Requests",
      method: "GET",
      path: "/restapi/{endpoint}",
      headers: ["endpoint", "query_params"],
      buildBody: (row: Record<string, string>) => ({}),
    },
    {
      id: "custom-post", 
      name: "Custom POST Requests",
      method: "POST",
      path: "/restapi/{endpoint}",
      headers: ["endpoint", "body_json"],
      buildBody: (row: Record<string, string>) => 
        row.body_json ? JSON.parse(row.body_json) : {},
    },
  ];

  const parseCsv = (csvText: string): Record<string, string>[] => {
    const result = Papa.parse(csvText.trim(), {
      header: true,
      skipEmptyLines: true,
    });
    
    if (result.errors.length > 0) {
      throw new Error(`CSV parsing error: ${result.errors[0].message}`);
    }
    
    return result.data as Record<string, string>[];
  };

  const run = async () => {
    if (!csvData.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide CSV data",
      });
      return;
    }

    try {
      setRunning(true);
      setResults([]);

      const rows = parseCsv(csvData);
      if (rows.length === 0) {
        throw new Error("No data rows found in CSV");
      }

      const newResults: RunResult[] = [];
      const preset = presets.find(p => p.id === selectedPreset);
      if (!preset) {
        throw new Error("Selected preset not found");
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const body = preset.buildBody(row);

        const result: RunResult = {
          index: i,
          status: 'success',
          method: preset.method,
          path: preset.path,
        };

        try {
          if (dryRun) {
            result.response = { message: "Dry run - request not executed", body };
          } else {
            const response = await PortnoxApiService.proxy(
              preset.method,
              preset.path,
              undefined,
              body,
              { projectId }
            );
            
            result.response = response;
          }
        } catch (error) {
          result.status = 'error';
          result.error = String(error);
        }

        newResults.push(result);
        setResults([...newResults]);
      }

      const successCount = newResults.filter(r => r.status === 'success').length;
      const errorCount = newResults.filter(r => r.status === 'error').length;

      toast({
        title: dryRun ? "Dry Run Complete" : "Bulk Operation Complete",
        description: `${successCount} succeeded, ${errorCount} failed`,
      });

    } catch (error) {
      console.error("Bulk operation error:", error);
      toast({
        variant: "destructive",
        title: "Bulk Operation Failed",
        description: String(error),
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Bulk API Runner
        </CardTitle>
        <CardDescription>
          Execute multiple API requests from CSV data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Preset</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedPreset === preset.id ? "default" : "outline"}
                onClick={() => setSelectedPreset(preset.id)}
                className="justify-start"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="csvData">CSV Data</Label>
          <Textarea
            id="csvData"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder={`name,description\nSite 1,Main office\nSite 2,Branch office`}
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={dryRun}
            onCheckedChange={setDryRun}
          />
          <Label>Dry run (don't execute)</Label>
        </div>

        <Button
          onClick={run}
          disabled={running || !selectedPreset}
          className="flex items-center gap-2"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {dryRun ? "Test Run" : "Execute"} Bulk Operation
        </Button>

        {results.length > 0 && (
          <div>
            <Label>Results ({results.length} operations)</Label>
            <div className="border rounded-lg mt-2 max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Response</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.index}>
                      <TableCell>{result.index + 1}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={result.status === 'success' ? 'default' : 'destructive'}
                        >
                          {result.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{result.path}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-xs font-mono truncate">
                          {result.error || JSON.stringify(result.response)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkApiRunner;