import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface DevicesExplorerProps {
  projectId: string;
}

const DevicesExplorer: React.FC<DevicesExplorerProps> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<any>({ limit: 50 });
  const [deviceType, setDeviceType] = useState<string>("");
  const [lastFrom, setLastFrom] = useState<string>("");
  const [lastTo, setLastTo] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [items, setItems] = useState<any[]>([]);

  const builtQuery = useMemo(() => {
    const q: any = { ...(query || {}) };
    if (deviceType) q.deviceType = deviceType;
    if (lastFrom) q.lastConnectedFrom = lastFrom;
    if (lastTo) q.lastConnectedTo = lastTo;
    if (search) q.search = search;
    return q;
  }, [query, deviceType, lastFrom, lastTo, search]);

  async function fetchDevices() {
    try {
      setLoading(true);
      const res = await PortnoxApiService.listDevices(builtQuery, { projectId });
      const data = (res?.items || res?.data || res) as any[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exportCsv() {
    if (!items.length) return;
    const keys = Object.keys(items[0] || {});
    const rows = [keys.join(",")].concat(
      items.map((it) => keys.map((k) => JSON.stringify(it[k] ?? "")).join(","))
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devices.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-5 gap-3">
          <div className="space-y-1">
            <Label>Device Type</Label>
            <Input value={deviceType} onChange={(e) => setDeviceType(e.target.value)} placeholder="e.g., Windows, Printer" />
          </div>
          <div className="space-y-1">
            <Label>Last Connected From</Label>
            <Input type="date" value={lastFrom} onChange={(e) => setLastFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Last Connected To</Label>
            <Input type="date" value={lastTo} onChange={(e) => setLastTo(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Search</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="hostname, mac, user..." />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={fetchDevices} disabled={loading}>{loading ? "Loading..." : "Apply"}</Button>
            <Button variant="outline" onClick={exportCsv} disabled={!items.length}>Export CSV</Button>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identifier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Connected</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Raw</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs">{it.id || it.mac || it.deviceId || it.device_id || '-'}</TableCell>
                  <TableCell className="text-xs">{it.deviceType || it.type || '-'}</TableCell>
                  <TableCell className="text-xs">{it.lastConnected || it.last_seen || '-'}</TableCell>
                  <TableCell className="text-xs">{it.owner?.email || it.user || '-'}</TableCell>
                  <TableCell className="text-xs max-w-[380px] truncate">{JSON.stringify(it)}</TableCell>
                </TableRow>
              ))}
              {!items.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No devices</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicesExplorer;
