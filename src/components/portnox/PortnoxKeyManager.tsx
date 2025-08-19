import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PortnoxApiService } from "@/services/PortnoxApiService";
import { Loader2, Shield, Trash2, TestTube, Edit2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Credential {
  id: string;
  name: string;
  base_url: string;
  api_token: string;
  is_active: boolean;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PortnoxKeyManagerProps {
  projectId?: string;
}

const PortnoxKeyManager: React.FC<PortnoxKeyManagerProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  const [formCredName, setFormCredName] = useState("");
  const [formBaseUrl, setFormBaseUrl] = useState("https://clear.portnox.com/restapi");
  const [formToken, setFormToken] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState(projectId || "");

  const filteredCreds = useMemo(() => {
    if (!filterProject) return credentials;
    return credentials.filter(c => c.project_id === filterProject);
  }, [credentials, filterProject]);

  const load = async () => {
    try {
      setLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      const { data: credsData, error: credsError } = await supabase
        .from("portnox_credentials")
        .select("*")
        .order("created_at", { ascending: false });

      if (credsError) throw credsError;
      setCredentials(credsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveCredential = async () => {
    if (!formCredName.trim() || !formToken.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and API token are required",
      });
      return;
    }

    try {
      setFormLoading(true);

      if (formIsActive) {
        const scope = selectedProject || null;
        await supabase
          .from("portnox_credentials")
          .update({ is_active: false })
          .eq("project_id", scope);
      }

      const credData = {
        name: formCredName.trim(),
        base_url: formBaseUrl.trim(),
        api_token: formToken.trim(),
        is_active: formIsActive,
        project_id: selectedProject || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("portnox_credentials")
          .update(credData)
          .eq("id", editingId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Credential updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("portnox_credentials")
          .insert([credData]);
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Credential saved successfully",
        });
      }

      setFormCredName("");
      setFormBaseUrl("https://clear.portnox.com/restapi");
      setFormToken("");
      setFormIsActive(true);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Error saving credential:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save credential",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const test = async (cred: Credential) => {
    try {
      const result = await PortnoxApiService.testConnection({
        credentialId: cred.id,
      });

      toast({
        title: "Connection Test",
        description: result?.data ? "Connection successful!" : "Connection test completed",
      });
    } catch (error) {
      console.error("Connection test failed:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to Portnox API",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Portnox API Credentials
        </CardTitle>
        <CardDescription>
          Manage API credentials for Portnox integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 p-4 border rounded-lg">
          <h3 className="font-medium">
            {editingId ? "Edit Credential" : "Add New Credential"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="credName">Name</Label>
              <Input
                id="credName"
                value={formCredName}
                onChange={(e) => setFormCredName(e.target.value)}
                placeholder="e.g., Production API"
              />
            </div>
            
            <div>
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Global (No project)</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              value={formBaseUrl}
              onChange={(e) => setFormBaseUrl(e.target.value)}
              placeholder="https://clear.portnox.com/restapi"
            />
          </div>

          <div>
            <Label htmlFor="token">API Token</Label>
            <Input
              id="token"
              type="password"
              value={formToken}
              onChange={(e) => setFormToken(e.target.value)}
              placeholder="Enter API token"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formIsActive}
              onCheckedChange={setFormIsActive}
            />
            <Label htmlFor="active">Set as active credential</Label>
          </div>

          <Button
            onClick={saveCredential}
            disabled={formLoading}
            className="flex items-center gap-2"
          >
            {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Save"} Credential
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Base URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No credentials found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCreds.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium">{cred.name}</TableCell>
                    <TableCell>
                      {cred.project_id ? (
                        projects.find(p => p.id === cred.project_id)?.name || "Unknown"
                      ) : (
                        <span className="text-muted-foreground">Global</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {cred.base_url}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cred.is_active ? "default" : "secondary"}>
                        {cred.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => test(cred)}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortnoxKeyManager;