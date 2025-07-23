import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Download } from "lucide-react";

interface BulkSiteData {
  name: string;
  location?: string;
  site_type: string;
  status: string;
  priority: string;
}

interface BulkSiteCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sites: BulkSiteData[]) => void;
  isLoading?: boolean;
}

const BulkSiteCreator = ({ isOpen, onClose, onSubmit, isLoading }: BulkSiteCreatorProps) => {
  const [sites, setSites] = useState<BulkSiteData[]>([
    { name: "", location: "", site_type: "office", status: "planning", priority: "medium" }
  ]);
  const [csvInput, setCsvInput] = useState("");

  const addSite = () => {
    setSites([...sites, { name: "", location: "", site_type: "office", status: "planning", priority: "medium" }]);
  };

  const removeSite = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  const updateSite = (index: number, field: keyof BulkSiteData, value: string) => {
    setSites(sites.map((site, i) => 
      i === index ? { ...site, [field]: value } : site
    ));
  };

  const parseCsvData = () => {
    if (!csvInput.trim()) return;
    
    const lines = csvInput.trim().split('\n');
    const parsedSites: BulkSiteData[] = [];
    
    lines.forEach((line, index) => {
      if (index === 0) return; // Skip header if present
      
      const [name, location, site_type, status, priority] = line.split(',').map(s => s.trim());
      if (name) {
        parsedSites.push({
          name,
          location: location || "",
          site_type: site_type || "office",
          status: status || "planning",
          priority: priority || "medium"
        });
      }
    });
    
    setSites(parsedSites);
    setCsvInput("");
  };

  const exportTemplate = () => {
    const template = "Name,Location,Site Type,Status,Priority\nExample Site,New York,office,planning,medium\n";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_sites_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    const validSites = sites.filter(site => site.name.trim() !== "");
    if (validSites.length > 0) {
      onSubmit(validSites);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Create Sites</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* CSV Import Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Import from CSV</Label>
              <Button variant="outline" size="sm" onClick={exportTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
            <Textarea
              placeholder="Paste CSV data here (Name,Location,Site Type,Status,Priority)"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              rows={3}
            />
            <Button onClick={parseCsvData} disabled={!csvInput.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Parse CSV Data
            </Button>
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sites to Create ({sites.length})</Label>
              <Button onClick={addSite} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sites.map((site, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Site {index + 1}</Badge>
                    {sites.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSite(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Name *</Label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={site.name}
                        onChange={(e) => updateSite(index, "name", e.target.value)}
                        placeholder="Site name"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Location</Label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={site.location}
                        onChange={(e) => updateSite(index, "location", e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Site Type</Label>
                      <Select value={site.site_type} onValueChange={(value) => updateSite(index, "site_type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="data_center">Data Center</SelectItem>
                          <SelectItem value="remote_site">Remote Site</SelectItem>
                          <SelectItem value="branch">Branch</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label>Status</Label>
                      <Select value={site.status} onValueChange={(value) => updateSite(index, "status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="scoping">Scoping</SelectItem>
                          <SelectItem value="designing">Designing</SelectItem>
                          <SelectItem value="implementing">Implementing</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="deployed">Deployed</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label>Priority</Label>
                      <Select value={site.priority} onValueChange={(value) => updateSite(index, "priority", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || sites.every(site => !site.name.trim())}
            >
              {isLoading ? "Creating..." : `Create ${sites.filter(site => site.name.trim()).length} Sites`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkSiteCreator;