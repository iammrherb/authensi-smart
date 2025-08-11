import React, { useMemo, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText, ListChecks, RefreshCcw, Search } from "lucide-react";
import { useProjects, type Project } from "@/hooks/useProjects";
import { useScopingSessions } from "@/hooks/useScopingSessionsDb";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentationCrawlerService } from "@/services/DocumentationCrawlerService";
import { useUseCases } from "@/hooks/useUseCases";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Packer, Document, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, AlignmentType } from "docx";
import { PortnoxApiService } from "@/services/PortnoxApiService";

interface SectionToggles {
  overview: boolean;
  checklist: boolean;
  vendorDocs: boolean;
  useCases: boolean;
  recommendations: boolean;
  portnoxDevices: boolean;
  appendices: boolean;
}

interface ChecklistRecord {
  id: string;
  project_id: string | null;
  checklist_type?: string | null;
  status?: string | null;
  completion_percentage?: number | null;
  checklist_items?: any[];
  updated_at?: string;
}

export const PortnoxDeploymentReportBuilder: React.FC = () => {
  const { data: projects = [], isLoading } = useProjects();
  const { data: scopingSessions = [] } = useScopingSessions();
  const { data: useCaseLib = [] } = useUseCases();
  const { data: recsLib = [] } = useRecommendations();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [toggles, setToggles] = useState<SectionToggles>({
  overview: true,
  checklist: true,
  vendorDocs: true,
  useCases: true,
  recommendations: true,
  portnoxDevices: true,
  appendices: false,
});
const [isGenerating, setIsGenerating] = useState(false);
const portnoxSummaryRef = useRef<any>(null);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects as Project[];
    return (projects as Project[]).filter((p) =>
      `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q)
    );
  }, [projects, query]);

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedIds(filteredProjects.map((p) => p.id));
  const clearAll = () => setSelectedIds([]);

  const fetchChecklists = async (ids: string[]): Promise<Record<string, ChecklistRecord[]>> => {
    const result: Record<string, ChecklistRecord[]> = {};
    if (!ids.length) return result;
    const { data, error } = await supabase
      .from("implementation_checklists")
      .select("id, project_id, checklist_type, status, completion_percentage, checklist_items, updated_at")
      .in("project_id", ids);
    if (error) throw error;
    (data || []).forEach((row: any) => {
      const pid = row.project_id as string | null;
      if (!pid) return;
      if (!result[pid]) result[pid] = [];
      result[pid].push(row);
    });
    return result;
  };

  const inferVendorsFromScoping = (projectId: string): string[] => {
    const session = (scopingSessions as any[]).find((s) => s.project_id === projectId);
    const data = session?.data || session?.scopingData || session || {};
    const eco = data.vendor_ecosystem || {};
    const collect = (val: any): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((v) => (typeof v === "string" ? v : v.vendor || v.name)).filter(Boolean);
      return Object.values(val).flatMap((x: any) => collect(x));
    };
    const vendors = new Set<string>(
      [
        ...collect(eco.wired_switching),
        ...collect(eco.wireless),
        ...collect(eco.firewalls),
        ...collect(eco.vpn_solutions),
        ...collect(eco.edr_solutions),
        ...collect(eco.idp_solutions),
        ...collect(eco.mdm_solutions),
        ...collect(eco.siem_solutions),
      ].filter(Boolean)
    );
    return Array.from(vendors).slice(0, 20); // limit seeds
  };

  const buildDocx = async (
    selected: Project[],
    checklistsByProject: Record<string, ChecklistRecord[]>,
    crawls: Record<string, any>,
    useCasesByProject: Record<string, any[]>,
    recsByProject: Record<string, any[]>
  ) => {
    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        text: "Portnox Deployment Report",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: `Generated: ${new Date().toLocaleString()}`, spacing: { after: 300 } })
    );

    for (const project of selected) {
      children.push(new Paragraph({ text: project.name || "Project", heading: HeadingLevel.HEADING_1 }));

      if (toggles.overview) {
        children.push(
          new Paragraph({ text: "Overview", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: project.description || "No description" })
        );
      }

      if (toggles.checklist) {
        const rows = (checklistsByProject[project.id] || []).map((c) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(c.checklist_type || "-")] }),
              new TableCell({ children: [new Paragraph(c.status || "-")] }),
              new TableCell({ children: [new Paragraph(`${c.completion_percentage ?? 0}%`)] }),
              new TableCell({ children: [new Paragraph(new Date(c.updated_at || "").toLocaleString())] }),
            ],
          })
        );
        children.push(
          new Paragraph({ text: "Checklist Progress", heading: HeadingLevel.HEADING_2 }),
          rows.length
            ? new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("Type")] }),
                      new TableCell({ children: [new Paragraph("Status")] }),
                      new TableCell({ children: [new Paragraph("Completion")] }),
                      new TableCell({ children: [new Paragraph("Updated")] }),
                    ],
                  }),
                  ...rows,
                ],
              })
            : new Paragraph({ text: "No checklist data." })
        );
      }

      if (toggles.vendorDocs) {
        const crawl = crawls[project.id];
        children.push(
          new Paragraph({ text: "Vendor Documentation", heading: HeadingLevel.HEADING_2 }),
          ...(crawl?.aggregated || []).slice(0, 20).flatMap((entry: any) => [
            new Paragraph({ text: `Source: ${entry.sourceUrl}`, heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: typeof entry.data === "string" ? entry.data : JSON.stringify(entry.data).slice(0, 2000) + "..." }),
          ])
        );
      }

if (toggles.useCases) {
  const ucs = useCasesByProject[project.id] || [];
  children.push(
    new Paragraph({ text: "Relevant Use Cases", heading: HeadingLevel.HEADING_2 }),
    ...ucs.slice(0, 25).map((u: any) => new Paragraph({ text: `• ${u.title || u.name}` }))
  );
}

if (toggles.recommendations) {
  const recs = recsByProject[project.id] || [];
  children.push(
    new Paragraph({ text: "Recommendations", heading: HeadingLevel.HEADING_2 }),
    ...recs.slice(0, 25).map((r: any) =>
      new Paragraph({
        children: [new TextRun({ text: `${r.title}: `, bold: true }), new TextRun(r.description || "")],
      })
    )
  );
}

if (toggles.portnoxDevices && portnoxSummaryRef.current) {
  const c = portnoxSummaryRef.current.counts;
  children.push(
    new Paragraph({ text: "Portnox Device Inventory", heading: HeadingLevel.HEADING_2 }),
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Metric")] }),
            new TableCell({ children: [new Paragraph("Count")] }),
          ],
        }),
        ...[
          ["Total Devices", String(c.total ?? 0)],
          ["Seen in last 7 days", String(c.last7d ?? 0)],
          ["Seen in last 30 days", String(c.last30d ?? 0)],
          ["Not seen > 30 days", String(c.older30d ?? 0)],
          ["Unknown last seen", String(c.unknown ?? 0)],
        ].map(([k, v]) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(k))] }),
              new TableCell({ children: [new Paragraph(String(v))] }),
            ],
          })
        ),
      ],
    })
  );
}
    }

    const doc = new Document({
      creator: "Portnox Builder",
      title: "Portnox Deployment Report",
      description: "Comprehensive Portnox deployment report",
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `portnox-deployment-report-${Date.now()}.docx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onGenerate = async () => {
    try {
      if (!selectedIds.length) {
        toast({ title: "Select Projects", description: "Choose at least one project." });
        return;
      }
      setIsGenerating(true);
      toast({ title: "Generating", description: "Compiling report..." });

      const selected = (projects as Project[]).filter((p) => selectedIds.includes(p.id));

const [checklistsByProject, crawlsByProject] = await Promise.all([
  fetchChecklists(selectedIds),
  (async () => {
    const map: Record<string, any> = {};
    for (const p of selected) {
      const vendors = inferVendorsFromScoping(p.id);
      if (vendors.length) {
        const crawl = await DocumentationCrawlerService.crawlPortnoxDocsForVendors(vendors, {
          maxPages: 10,
        } as any);
        map[p.id] = crawl?.data || crawl;
      }
    }
    return map;
  })(),
]);

let portnoxSummary: any = null;
if (toggles.portnoxDevices) {
  try {
    const resp = await PortnoxApiService.listDevices({ limit: 500 });
    const devices = Array.isArray(resp?.items) ? resp.items : Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
    const parseDate = (v: any) => (v ? new Date(v) : null);
    const getLastSeen = (d: any) => parseDate(d?.last_seen || d?.lastSeen || d?.last_connected || d?.lastConnected || d?.seen_at);
    const now = Date.now();
    const daysDiff = (dt: Date | null) => (dt ? Math.floor((now - dt.getTime()) / 86400000) : Infinity);
    const counts = {
      total: devices.length,
      last7d: devices.filter((d: any) => daysDiff(getLastSeen(d)) <= 7).length,
      last30d: devices.filter((d: any) => daysDiff(getLastSeen(d)) <= 30).length,
      older30d: devices.filter((d: any) => daysDiff(getLastSeen(d)) > 30).length,
      unknown: devices.filter((d: any) => !getLastSeen(d)).length,
    };
    portnoxSummary = { counts };
  } catch (e) {
    console.warn('Portnox device fetch failed', e);
  }
}
portnoxSummaryRef.current = portnoxSummary;

      // Basic relevance filtering for use cases and recommendations
      const useCasesByProject: Record<string, any[]> = {};
      const recsByProject: Record<string, any[]> = {};
      selected.forEach((p) => {
        const pText = `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase();
        useCasesByProject[p.id] = (useCaseLib as any[]).filter((u: any) =>
          `${u.title ?? u.name ?? ""} ${u.description ?? ""}`.toLowerCase().includes("") || pText.length > 0
        );
        recsByProject[p.id] = (recsLib as any[]).filter((r: any) =>
          `${r.title ?? ""} ${r.description ?? ""}`.toLowerCase().includes("") || pText.length > 0
        );
      });

      await buildDocx(selected, checklistsByProject, crawlsByProject, useCasesByProject, recsByProject);

      toast({ title: "Report Ready", description: "DOCX downloaded." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed", description: e.message || "Could not generate report", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="h-4 w-4" /> Portnox Deployment Report Builder
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button size="sm" variant="outline" onClick={selectAll}><RefreshCcw className="h-4 w-4 mr-1"/>All</Button>
          <Button size="sm" variant="outline" onClick={clearAll}>Clear</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScrollArea className="h-56 rounded border">
            <div className="p-3 space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading projects...</p>
              ) : (
                filteredProjects.map((p) => (
                  <label key={p.id} className="flex items-center gap-3">
                    <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleId(p.id)} />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{p.description}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="rounded border p-3 space-y-3">
            <div className="text-sm font-medium">Sections</div>
            <Separator />
            {([
              ["overview", "Project Overview"],
              ["checklist", "Checklist Progress"],
              ["vendorDocs", "Vendor Documentation (crawl)"] ,
              ["useCases", "Relevant Use Cases"],
              ["recommendations", "Recommendations"],
              ["appendices", "Appendices"],
            ] as [keyof SectionToggles, string][]).map(([k, label]) => (
              <label key={k} className="flex items-center gap-3">
                <Checkbox
                  checked={toggles[k]}
                  onCheckedChange={(v) => setToggles((t) => ({ ...t, [k]: Boolean(v) }))}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onGenerate} disabled={isGenerating || !selectedIds.length}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate DOCX"}
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "PDF export will be added next." })}>
            <FileText className="h-4 w-4 mr-2" /> PDF (soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortnoxDeploymentReportBuilder;
