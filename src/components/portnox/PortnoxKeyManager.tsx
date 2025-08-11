import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PortnoxApiService } from "@/services/PortnoxApiService";
import { toast } from "sonner";

interface Project { id: string; name: string }
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

export default function PortnoxKeyManager({ projectId }: { projectId?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creds, setCreds] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterProject, setFilterProject] = useState<string | null>(projectId ?? null);

  const [form, setForm] = useState<{
    name: string;
    base_url: string;
    api_token: string;
    is_active: boolean;
    project_id: string | null;
  }>({
    name: "",
    base_url: "https://clear.portnox.com/restapi",
    api_token: "",
    is_active: true,
    project_id: projectId ?? null,
  });

  const filteredCreds = useMemo(() => {
    const fp = projectId !== undefined ? projectId : filterProject;
    if (fp === undefined) return creds;
    if (fp === null) return creds.filter(c => c.project_id === null);
    return creds.filter(c => c.project_id === fp);
  }, [creds, filterProject, projectId]);

  async function load() {
    setLoading(true);
    try {
      const [{ data: proj }, { data: c }] = await Promise.all([
        supabase.from("projects").select("id, name").order("created_at", { ascending: false }),
        supabase.from("portnox_credentials").select("*").order("updated_at", { ascending: false }),
      ]);
      setProjects(proj || []);
      setCreds((c as any) || []);
    } catch (e: any) {
      toast.error(`Failed to load credentials: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (projectId !== undefined) {
      setForm((f) => ({ ...f, project_id: projectId ?? null }));
      setFilterProject(projectId ?? null);
    }
  }, [projectId]);
  async function saveCredential() {
    if (!form.name || !form.api_token) {
      toast.warning("Please provide a name and API token");
      return;
    }
    try {
      setLoading(true);
      // If setting active for a project, deactivate others first to satisfy unique index
      if (form.is_active) {
        const { error: updErr } = await supabase
          .from("portnox_credentials")
          .update({ is_active: false })
          .eq("is_active", true)
          .eq("project_id", form.project_id);
        if (updErr) throw updErr;
      }
      const { error } = await supabase.from("portnox_credentials").insert({
        name: form.name,
        base_url: form.base_url,
        api_token: form.api_token,
        is_active: form.is_active,
        project_id: form.project_id,
      });
      if (error) throw error;
      toast.success("Credential saved");
      setForm({ name: "", base_url: "https://clear.portnox.com/restapi", api_token: "", is_active: true, project_id: projectId ?? null });
      await load();
    } catch (e: any) {
      toast.error(`Save failed: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  async function setActive(cred: Credential) {
    try {
      setLoading(true);
      // Deactivate others in same project scope
      const { error: updErr } = await supabase
        .from("portnox_credentials")
        .update({ is_active: false })
        .eq("is_active", true)
        .eq("project_id", cred.project_id);
      if (updErr) throw updErr;
      const { error } = await supabase
        .from("portnox_credentials")
        .update({ is_active: true })
        .eq("id", cred.id);
      if (error) throw error;
      toast.success("Set as active");
      await load();
    } catch (e: any) {
      toast.error(`Update failed: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  async function remove(cred: Credential) {
    if (!confirm("Delete this credential?")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from("portnox_credentials").delete().eq("id", cred.id);
      if (error) throw error;
      toast.success("Deleted credential");
      await load();
    } catch (e: any) {
      toast.error(`Delete failed: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  async function test(cred: Credential) {
    try {
      const res = await PortnoxApiService.testConnection({ credentialId: cred.id });
      toast.success(`Test OK (status ${res?.status ?? 'ok'})`);
    } catch (e: any) {
      toast.error(`Test failed: ${e?.message || e}`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portnox Credentials Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!projectId && (
            <div className="space-y-2">
              <Label>Project</Label>
              <Select onValueChange={(v) => setForm((f) => ({ ...f, project_id: v === "__global__" ? null : v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Global (default)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__global__">Global (no project)</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Friendly name (e.g., Customer A)" />
          </div>
          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input value={form.base_url} onChange={(e) => setForm((f) => ({ ...f, base_url: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>API Token</Label>
            <Input type="password" value={form.api_token} onChange={(e) => setForm((f) => ({ ...f, api_token: e.target.value }))} />
          </div>
          <div className="flex items-center justify-between col-span-full">
            <div className="space-y-0.5">
              <Label>Set as Active</Label>
              <p className="text-sm text-muted-foreground">Only one active token per project</p>
            </div>
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button disabled={loading} onClick={saveCredential}>Save Credential</Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Existing Credentials</Label>
            {!projectId && (
              <div className="flex items-center gap-2">
                <Label>Filter by Project</Label>
                <Select onValueChange={(v) => setFilterProject(v === "__all__" ? undefined as any : v === "__global__" ? null : v)}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    <SelectItem value="__global__">Global</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Base URL</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreds.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.project_id ? (projects.find(p => p.id === c.project_id)?.name || c.project_id) : "Global"}</TableCell>
                    <TableCell className="truncate max-w-[240px]">{c.base_url}</TableCell>
                    <TableCell>{c.is_active ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => test(c)}>Test</Button>
                      {!c.is_active && (
                        <Button variant="secondary" size="sm" onClick={() => setActive(c)}>Set Active</Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => remove(c)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCreds.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No credentials found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
