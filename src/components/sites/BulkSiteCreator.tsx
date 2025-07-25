import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, Download, FileText, MapPin, Building2, Plus, X, 
  CheckCircle, AlertCircle, Info, Users, Globe
} from 'lucide-react';
import { useCountries, useRegionsByCountry } from '@/hooks/useCountriesRegions';

interface BulkSiteData {
  name: string;
  location?: string;
  address?: string;
  country: string;
  region?: string;
  site_type: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  device_count: number;
  network_segments: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  timeline_start?: string;
  notes?: string;
  [key: string]: any;
}

interface BulkSiteCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sites: BulkSiteData[]) => void;
  isLoading?: boolean;
  projectId?: string;
}

const BulkSiteCreator = ({ isOpen, onClose, onSubmit, isLoading, projectId }: BulkSiteCreatorProps) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [sites, setSites] = useState<BulkSiteData[]>([]);
  const [csvInput, setCsvInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const { data: countries = [] } = useCountries();

  const siteTypes = [
    'headquarters', 'branch-office', 'data-center', 'warehouse', 
    'manufacturing', 'retail', 'remote-office', 'temporary', 'other'
  ];

  const addSite = () => {
    setSites([...sites, { 
      name: "", 
      location: "", 
      address: "",
      country: "",
      region: "",
      site_type: "branch-office", 
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      device_count: 0,
      network_segments: 1,
      status: "planning", 
      priority: "medium",
      timeline_start: "",
      notes: ""
    }]);
  };

  const removeSite = (index: number) => {
    setSites(sites.filter((_, i) => i !== index));
  };

  const updateSite = (index: number, field: string, value: any) => {
    setSites(sites.map((site, i) => 
      i === index ? { ...site, [field]: value } : site
    ));
  };

  const validateSites = () => {
    const newErrors: string[] = [];
    
    sites.forEach((site, index) => {
      if (!site.name.trim()) {
        newErrors.push(`Site ${index + 1}: Name is required`);
      }
      if (!site.country) {
        newErrors.push(`Site ${index + 1}: Country is required`);
      }
      if (!site.site_type) {
        newErrors.push(`Site ${index + 1}: Site type is required`);
      }
      if (site.device_count < 0) {
        newErrors.push(`Site ${index + 1}: Device count cannot be negative`);
      }
      if (site.network_segments < 1) {
        newErrors.push(`Site ${index + 1}: Network segments must be at least 1`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const parseCsvData = () => {
    try {
      if (!csvInput.trim()) return;
      
      const lines = csvInput.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const newSites: BulkSiteData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const site: any = {};

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          // Map common CSV headers to our data structure
          switch (header.toLowerCase()) {
            case 'site name':
            case 'name':
              site.name = value;
              break;
            case 'location':
              site.location = value;
              break;
            case 'address':
              site.address = value;
              break;
            case 'country':
              site.country = value;
              break;
            case 'region':
            case 'state':
            case 'province':
              site.region = value;
              break;
            case 'site type':
            case 'type':
              site.site_type = value.toLowerCase().replace(/\s+/g, '-');
              break;
            case 'contact name':
            case 'contact':
              site.contact_name = value;
              break;
            case 'contact email':
            case 'email':
              site.contact_email = value;
              break;
            case 'contact phone':
            case 'phone':
              site.contact_phone = value;
              break;
            case 'device count':
            case 'devices':
              site.device_count = parseInt(value) || 0;
              break;
            case 'network segments':
            case 'segments':
              site.network_segments = parseInt(value) || 1;
              break;
            case 'priority':
              site.priority = value.toLowerCase();
              break;
            case 'status':
              site.status = value.toLowerCase();
              break;
            case 'go live date':
            case 'start date':
              site.timeline_start = value;
              break;
            case 'notes':
            case 'comments':
              site.notes = value;
              break;
            default:
              site[header] = value;
          }
        });

        // Set defaults
        site.site_type = site.site_type || 'branch-office';
        site.priority = site.priority || 'medium';
        site.status = site.status || 'planning';
        site.device_count = site.device_count || 0;
        site.network_segments = site.network_segments || 1;

        newSites.push(site);
      }

      setSites(newSites);
      setErrors([]);
      setActiveTab('manual'); // Switch to manual tab to review
      setCsvInput("");
    } catch (error) {
      setErrors(['Error parsing CSV data. Please check the format.']);
    }
  };

  const exportTemplate = () => {
    const headers = [
      'Site Name', 'Location', 'Address', 'Country', 'Region', 'Site Type',
      'Contact Name', 'Contact Email', 'Contact Phone', 'Device Count',
      'Network Segments', 'Priority', 'Status', 'Go Live Date', 'Notes'
    ];
    
    const sampleData = [
      'New York Office', 'New York', '123 Business Ave, New York, NY 10001',
      'US', 'New York', 'branch-office', 'John Smith', 'john@company.com',
      '+1-555-0123', '150', '2', 'medium', 'planning', '2024-03-01', 'Main branch office'
    ];

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_sites_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!validateSites()) {
      return;
    }
    
    const validSites = sites.filter(site => site.name.trim() !== "");
    if (validSites.length > 0) {
      onSubmit(validSites);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Bulk Site Creator
            </DialogTitle>
            <DialogDescription>
              Create multiple sites quickly using manual entry or CSV import
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  CSV Import
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manual Site Entry</h3>
                  <Button onClick={addSite} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </div>

                {sites.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No sites added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Click "Add Site" to start creating sites manually
                      </p>
                      <Button onClick={addSite}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Site
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {sites.map((site, index) => (
                      <SiteEntryCard
                        key={index}
                        site={site}
                        index={index}
                        countries={countries}
                        siteTypes={siteTypes}
                        onUpdate={updateSite}
                        onRemove={removeSite}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="csv" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={exportTemplate} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV Template
                    </Button>
                    <Button onClick={parseCsvData} disabled={!csvInput.trim()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Process CSV Data
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="csv-data">CSV Data</Label>
                    <Textarea
                      id="csv-data"
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Paste your CSV data here..."
                      className="mt-1 min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Make sure your CSV includes headers: Site Name, Location, Address, Country, Region, Site Type, etc.
                      Download the template above for the correct format.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Please fix the following errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t bg-muted/20 rounded-b-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {sites.length > 0 ? (
                  <>Ready to create <Badge variant="secondary">{sites.length}</Badge> site(s)</>
                ) : (
                  'No sites ready for creation'
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={sites.length === 0 || isLoading}
                >
                  {isLoading ? 'Creating Sites...' : `Create ${sites.length} Site(s)`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Separate component for individual site entry cards
const SiteEntryCard: React.FC<{
  site: BulkSiteData;
  index: number;
  countries: any[];
  siteTypes: string[];
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ site, index, countries, siteTypes, onUpdate, onRemove }) => {
  const { data: regions = [] } = useRegionsByCountry(site.country);

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Site {index + 1}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`name-${index}`}>Site Name *</Label>
            <Input
              id={`name-${index}`}
              value={site.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="Site name"
            />
          </div>
          
          <div>
            <Label htmlFor={`location-${index}`}>Location</Label>
            <Input
              id={`location-${index}`}
              value={site.location}
              onChange={(e) => onUpdate(index, 'location', e.target.value)}
              placeholder="City, State"
            />
          </div>

          <div>
            <Label htmlFor={`site_type-${index}`}>Site Type</Label>
            <Select 
              value={site.site_type} 
              onValueChange={(value) => onUpdate(index, 'site_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {siteTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`country-${index}`}>Country *</Label>
            <Select 
              value={site.country} 
              onValueChange={(value) => onUpdate(index, 'country', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_code} value={country.country_code}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`region-${index}`}>Region</Label>
            <Select 
              value={site.region} 
              onValueChange={(value) => onUpdate(index, 'region', value)}
              disabled={!site.country}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.region_name} value={region.region_name}>
                    {region.region_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor={`device_count-${index}`}>Device Count</Label>
            <Input
              id={`device_count-${index}`}
              type="number"
              value={site.device_count}
              onChange={(e) => onUpdate(index, 'device_count', parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          <div>
            <Label htmlFor={`network_segments-${index}`}>Network Segments</Label>
            <Input
              id={`network_segments-${index}`}
              type="number"
              value={site.network_segments}
              onChange={(e) => onUpdate(index, 'network_segments', parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>

          <div>
            <Label htmlFor={`priority-${index}`}>Priority</Label>
            <Select 
              value={site.priority} 
              onValueChange={(value) => onUpdate(index, 'priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`timeline_start-${index}`}>Go Live Date</Label>
            <Input
              id={`timeline_start-${index}`}
              type="date"
              value={site.timeline_start}
              onChange={(e) => onUpdate(index, 'timeline_start', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkSiteCreator;