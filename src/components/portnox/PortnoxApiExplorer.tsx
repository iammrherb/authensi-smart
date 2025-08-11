import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PortnoxOpenApi } from "@/services/PortnoxOpenApi";
import { supabase } from "@/integrations/supabase/client";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface Credential { id: string; name: string; project_id: string | null }

interface OperationRef {
  method: string;
  path: string;
  summary?: string;
  tags?: string[];
  parameters?: any[];
  requestBody?: any;
}

export default function PortnoxApiExplorer() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState<Credential[]>([]);
  const [selectedCred, setSelectedCred] = useState<string | "__active__">("__active__");
  const [filter, setFilter] = useState("");
  const [selectedOp, setSelectedOp] = useState<OperationRef | null>(null);
  const [query, setQuery] = useState<string>("");
  const [pathParams, setPathParams] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [s, c] = await Promise.all([
          PortnoxOpenApi.fetchSpec(),
          supabase.from("portnox_credentials").select("id, name, project_id").order("updated_at", { ascending: false }),
        ]);
        setSpec(s);
        setCreds(c.data || []);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load spec");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const operations: OperationRef[] = useMemo(() => {
    if (!spec?.paths) return [];
    const ops: OperationRef[] = [];
    Object.entries(spec.paths).forEach(([p, methods]: any) => {
      Object.entries(methods).forEach(([m, op]: any) => {
        ops.push({ method: m.toUpperCase(), path: p, summary: op.summary, tags: op.tags, parameters: op.parameters, requestBody: op.requestBody });
      });
    });
    return ops
      .sort((a, b) => (a.tags?.[0] || "").localeCompare(b.tags?.[0] || "") || a.path.localeCompare(b.path));
  }, [spec]);

  const filtered = useMemo(() => {
    const f = filter.toLowerCase();
    return operations.filter((op) =>
      (op.summary || "").toLowerCase().includes(f) || op.path.toLowerCase().includes(f) || (op.tags || []).join(",").toLowerCase().includes(f)
    );
  }, [operations, filter]);

  async function execute() {
    if (!selectedOp) return;
    try {
      setLoading(true);
      let path = selectedOp.path;
      // Apply path params from simple JSON map {id:"..."}
      if (pathParams.trim()) {
        try {
          const map = JSON.parse(pathParams);
          Object.entries(map).forEach(([k, v]) => {
            path = path.replace(new RegExp(`{${k}}`, "g"), encodeURIComponent(String(v)));
          });
        } catch {
          toast.warning("Path params must be valid JSON map");
        }
      }
      const queryObj = query.trim() ? JSON.parse(query) : undefined;
      const bodyObj = body.trim() ? JSON.parse(body) : undefined;
      const opts = selectedCred !== "__active__" ? { credentialId: selectedCred } : undefined;
      const res = await PortnoxApiService.proxy(selectedOp.method, path, queryObj, bodyObj, opts);
      setResponse(res);
      toast.success("Executed");
    } catch (e: any) {
      toast.error(e?.message || "Execution failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portnox API Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1 space-y-3">
            <div className="space-y-2">
              <Label>Credential</Label>
              <Select value={selectedCred} onValueChange={setSelectedCred as any}>
                <SelectTrigger>
                  <SelectValue placeholder="Use active credential" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__active__">Use active credential</SelectItem>
                  {creds.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search endpoints</Label>
              <Input placeholder="Filter by path, tag, or summary" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="border rounded-md h-[420px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((op) => (
                    <TableRow key={`${op.method}-${op.path}`} onClick={() => setSelectedOp(op)} className="cursor-pointer hover:bg-muted/40">
                      <TableCell>
                        <div className="text-xs text-muted-foreground">{op.tags?.[0] || "General"}</div>
                        <div className="font-mono text-sm"><span className="font-semibold mr-2">{op.method}</span>{op.path}</div>
                        <div className="text-xs">{op.summary}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Selected</div>
              <div className="font-mono"><span className="font-semibold mr-2">{selectedOp?.method || "METHOD"}</span>{selectedOp?.path || "/api/..."}</div>
              <div className="text-sm">{selectedOp?.summary}</div>
            </div>
            <Separator />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Query (JSON)</Label>
                <Textarea rows={6} placeholder='{"limit": 20}' value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Path Params (JSON map)</Label>
                <Textarea rows={6} placeholder='{"id": "123"}' value={pathParams} onChange={(e) => setPathParams(e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Body (JSON)</Label>
                <Textarea rows={10} placeholder='{"name": "New Site"}' value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={execute} disabled={loading || !selectedOp}>Execute</Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Response</Label>
              <pre className="bg-muted rounded-md p-3 overflow-auto max-h-[360px] text-sm">
                {response ? JSON.stringify(response, null, 2) : "Run a request to see the response."}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
