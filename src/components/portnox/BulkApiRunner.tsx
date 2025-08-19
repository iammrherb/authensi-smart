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
    {
      id: "create-sites",
      name: "Create Sites",
      method: "POST",
      path: "/restapi/sites",
      headers: ["name", "description"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        description: row.description || "",
      }),
    },
    {
      id: "create-nas",
      name: "Create NAS Devices",
      method: "POST", 
      path: "/restapi/nas",
      headers: ["name", "ip", "description"],
      buildBody: (row: Record<string, string>) => ({
        name: row.name,
        ip: row.ip || "",
        description: row.description || "",
      }),
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