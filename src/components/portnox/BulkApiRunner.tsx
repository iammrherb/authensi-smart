import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import Papa from "papaparse";
import { toast } from "sonner";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface BulkApiRunnerProps {
  projectId?: string;
}

interface RunResult {
  index: number;
  status: "success" | "error";
  request: any;
  response?: any;
  error?: string;
}

const presets = [
  {
    key: "create_sites",
    label: "Create Sites",
    method: "POST",
    path: "/sites",
    templateHeaders: ["name", "description"],
    buildBody: (row: Record<string, any>) => ({ name: row.name, description: row.description || undefined }),
  },
  {
    key: "create_nas",
    label: "Create NAS",
    method: "POST",
    path: "/nas",
    templateHeaders: ["name", "ip", "description"],
    buildBody: (row: Record<string, any>) => ({ name: row.name, ip: row.ip || undefined, description: row.description || undefined }),
  },
  {
    key: "delete_device",
    label: "Delete Device by ID",
    method: "DELETE",
    path: "/devices/{id}",
    templateHeaders: ["id"],
    buildBody: (_row: Record<string, any>) => undefined,
  },
  {
    key: "update_device",
    label: "Update Device by ID",
    method: "PATCH",
    path: "/devices/{id}",
    templateHeaders: ["id", "body"],
    buildBody: (row: Record<string, any>) => {
      try { return row.body ? JSON.parse(row.body) : undefined } catch { return undefined }
    },
  },
];

const BulkApiRunner: React.FC<BulkApiRunnerProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<string>("preset");
  const [selectedPreset, setSelectedPreset] = useState<string>(presets[0].key);
  const [csvText, setCsvText] = useState<string>("");
  const [customMethod, setCustomMethod] = useState<string>("POST");
  const [customPath, setCustomPath] = useState<string>("/path");
  const [customBodyColumn, setCustomBodyColumn] = useState<string>("body");
  const [dryRun, setDryRun] = useState<boolean>(true);
  const [results, setResults] = useState<RunResult[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  // Temporary token usage (not stored in DB)
  const [useTemp, setUseTemp] = useState<boolean>(false);
  const [tempBase, setTempBase] = useState<string>("https://clear.portnox.com:8081/CloudPortalBackEnd");
  const [tempToken, setTempToken] = useState<string>("");

  const preset = useMemo(() => presets.find(p => p.key === selectedPreset)!, [selectedPreset]);

  function downloadTemplate(headers: string[]) {
    const sample = headers.map(h => (h === "body" ? "{\"field\":\"value\"}" : ""));
    const csv = [headers.join(","), sample.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function parseCsv(text: string): Record<string, any>[] {
    const parsed = Papa.parse(text.trim(), { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) {
      throw new Error(parsed.errors.map(e => e.message).join("; "));
    }
    return parsed.data as any[];
  }

  async function run() {
    try {
      if (!csvText.trim()) {
        toast.warning("Paste CSV data first");
        return;
      }
      const rows = parseCsv(csvText);
      if (rows.length === 0) {
        toast.warning("No rows found in CSV");
        return;
      }
      setRunning(true);
      setResults([]);

      const method = activeTab === "preset" ? preset.method : customMethod.toUpperCase();
      const pathTemplate = activeTab === "preset" ? preset.path : customPath;

      const runOne = async (row: any, index: number): Promise<RunResult> => {
        // Build path by replacing {placeholders} from row
        let path = pathTemplate;
        const placeholders = Array.from(path.matchAll(/\{(.*?)\}/g)).map(m => m[1]);
        placeholders.forEach(ph => {
          const token = `{${ph}}`;
          const value = encodeURIComponent(String(row[ph] ?? ""));
          path = path.split(token).join(value);
        });

        // Build body
        let body: any;
        if (activeTab === "preset") {
          body = preset.buildBody(row);
        } else {
          body = row[customBodyColumn] ? (() => { try { return JSON.parse(row[customBodyColumn]); } catch { return undefined } })() : undefined;
        }

        const request = { method, path, body };
        if (dryRun) {
          return { index, status: "success", request };
        }
        try {
          const res = await PortnoxApiService.proxy(
            method,
            path,
            undefined,
            body,
            {
              projectId,
              ...(useTemp && tempToken ? { directToken: tempToken, baseUrl: tempBase } : {}),
            }
          );
          return { index, status: "success", request, response: res };
        } catch (e: any) {
          return { index, status: "error", request, error: e?.message || String(e) };
        }
      };

      const out: RunResult[] = [];
      for (let i = 0; i < rows.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const r = await runOne(rows[i], i);
        out.push(r);
        setResults(prev => [...prev, r]);
      }

      const ok = out.filter(r => r.status === "success").length;
      const fail = out.length - ok;
      toast.success(`Completed ${out.length} ops (${ok} ok, ${fail} failed)`);
    } catch (e: any) {
      toast.error(e?.message || "Run failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preset">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Operation</Label>
                <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map(p => (
                      <SelectItem key={p.key} value={p.key}>{p.label} ({p.method} {p.path})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CSV Template</Label>
                <Button variant="outline" onClick={() => downloadTemplate(preset.templateHeaders)}>Download Template</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CSV Data</Label>
              <Textarea rows={8} value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder={preset.templateHeaders.join(", ")} />
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Method</Label>
                <Select value={customMethod} onValueChange={setCustomMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['GET','POST','PUT','PATCH','DELETE'].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Path (use {"{placeholder}"} to map CSV columns)</Label>
                <Input value={customPath} onChange={(e) => setCustomPath(e.target.value)} placeholder="/devices/{id}" />
              </div>
              <div className="space-y-2">
                <Label>Body Column (JSON)</Label>
                <Input value={customBodyColumn} onChange={(e) => setCustomBodyColumn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>CSV Template</Label>
                <Button variant="outline" onClick={() => downloadTemplate([customBodyColumn])}>Download Template</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>CSV Data</Label>
              <Textarea rows={8} value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder={`${customBodyColumn}`} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-3 gap-4 border rounded-md p-3">
          <div className="flex items-center justify-between md:col-span-3">
            <div className="space-y-0.5">
              <Label>Use temporary token (not stored)</Label>
              <p className="text-xs text-muted-foreground">Pass a one-time token and optional base URL for this run only.</p>
            </div>
            <Switch checked={useTemp} onCheckedChange={setUseTemp} />
          </div>
          {useTemp && (
            <>
              <div className="md:col-span-2 space-y-2">
                <Label>Base URL</Label>
                <Input value={tempBase} onChange={(e) => setTempBase(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>API Token</Label>
                <Input type="password" value={tempToken} onChange={(e) => setTempToken(e.target.value)} />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={dryRun} onCheckedChange={setDryRun} />
            <span className="text-sm">Dry run (validate only)</span>
          </div>
          <Button onClick={run} disabled={running}>{running ? "Running..." : "Run"}</Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.index}>
                  <TableCell>{r.index + 1}</TableCell>
                  <TableCell className={r.status === 'success' ? 'text-green-600' : 'text-red-600'}>{r.status}</TableCell>
                  <TableCell>{r.request.method}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[320px] truncate">{r.request.path}</TableCell>
                  <TableCell className="text-xs max-w-[420px] truncate">
                    {r.error ? r.error : (r.response ? JSON.stringify(r.response) : (r.request.body ? JSON.stringify(r.request.body) : ''))}
                  </TableCell>
                </TableRow>
              ))}
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No results yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkApiRunner;
