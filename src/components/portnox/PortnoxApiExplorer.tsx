import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PortnoxApiService } from "@/services/PortnoxApiService";
import { PortnoxOpenApi } from "@/services/PortnoxOpenApi";
import { Loader2, Search, Play, Code } from "lucide-react";

interface OperationRef {
  method: string;
  path: string;
  summary?: string;
  tags?: string[];
  parameters?: any[];
  requestBody?: any;
}

const PortnoxApiExplorer: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const { toast } = useToast();
  const [spec, setSpec] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [selectedOp, setSelectedOp] = useState<OperationRef | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const specData = await PortnoxOpenApi.fetchSpec();
        setSpec(specData.data || specData);
        setMeta(PortnoxOpenApi.getMeta());
      } catch (error) {
        console.error("Error loading API explorer data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load API specification",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const operations = useMemo(() => {
    if (!spec?.paths) return [];
    
    const ops: OperationRef[] = [];
    
    Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (typeof operation === 'object' && operation.summary) {
          ops.push({
            method: method.toUpperCase(),
            path,
            summary: operation.summary,
            tags: operation.tags || [],
            parameters: operation.parameters || [],
            requestBody: operation.requestBody,
          });
        }
      });
    });
    
    return ops.sort((a, b) => {
      const aTag = a.tags?.[0] || 'Other';
      const bTag = b.tags?.[0] || 'Other';
      if (aTag !== bTag) return aTag.localeCompare(bTag);
      return a.path.localeCompare(b.path);
    });
  }, [spec]);

  const filtered = useMemo(() => {
    if (!searchFilter) return operations;
    const lower = searchFilter.toLowerCase();
    return operations.filter(op => 
      op.path.toLowerCase().includes(lower) ||
      op.summary?.toLowerCase().includes(lower) ||
      op.tags?.some(tag => tag.toLowerCase().includes(lower))
    );
  }, [operations, searchFilter]);

  const execute = async () => {
    if (!selectedOp) return;

    try {
      setExecuting(true);
      setResponse(null);

      const query = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v.trim())
      );

      let finalPath = selectedOp.path;
      Object.entries(pathParams).forEach(([param, value]) => {
        if (value.trim()) {
          finalPath = finalPath.replace(`{${param}}`, encodeURIComponent(value.trim()));
        }
      });

      let body = undefined;
      if (requestBody.trim()) {
        try {
          body = JSON.parse(requestBody);
        } catch {
          body = requestBody;
        }
      }

      const result = await PortnoxApiService.proxy(
        selectedOp.method,
        finalPath,
        query,
        body,
        { projectId }
      );

      setResponse(result);

      toast({
        title: "Request Executed",
        description: `${selectedOp.method} ${finalPath}`,
      });
    } catch (error) {
      console.error("API execution error:", error);
      setResponse({ error: String(error) });
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "Check the response panel for details",
      });
    } finally {
      setExecuting(false);
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
          <Code className="h-5 w-5" />
          Portnox API Explorer
        </CardTitle>
        <CardDescription>
          Explore and test Portnox API endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="search">Search Operations</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by path, summary, or tag"
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-lg max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((op, idx) => (
                <TableRow
                  key={`${op.method}-${op.path}-${idx}`}
                  className={`cursor-pointer ${
                    selectedOp === op ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedOp(op)}
                >
                  <TableCell>
                    <Badge 
                      variant={
                        op.method === 'GET' ? 'secondary' :
                        op.method === 'POST' ? 'default' :
                        op.method === 'PUT' ? 'outline' :
                        op.method === 'DELETE' ? 'destructive' : 'secondary'
                      }
                    >
                      {op.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{op.path}</TableCell>
                  <TableCell>{op.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedOp && (
          <div className="space-y-4">
            <h3 className="font-medium">
              {selectedOp.method} {selectedOp.path}
            </h3>

            {selectedOp.requestBody && (
              <div>
                <Label htmlFor="requestBody">Request Body (JSON)</Label>
                <Textarea
                  id="requestBody"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{"name": "example"}'
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            )}

            <Button
              onClick={execute}
              disabled={executing}
              className="flex items-center gap-2"
            >
              {executing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Execute Request
            </Button>
          </div>
        )}

        {response && (
          <div>
            <Label>Response</Label>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 mt-2">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortnoxApiExplorer;