import { useState } from "react";
import PageLayout from '@/components/layout/PageLayout';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, LayoutGrid, Table, Upload, Filter, Building2 } from "lucide-react";
import { useSites, useCreateSite, useUpdateSite, useDeleteSite, Site } from "@/hooks/useSites";
import SiteCard from "@/components/sites/SiteCard";
import SitesTable from "@/components/sites/SitesTable";
import EnhancedSiteForm from "@/components/sites/EnhancedSiteForm";
import SiteDetailsDialog from "@/components/sites/SiteDetailsDialog";
import BulkSiteCreator from "@/components/sites/BulkSiteCreator";

export default function Sites() {
  const [activeTab, setActiveTab] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showBulkCreator, setShowBulkCreator] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const { data: sites = [], isLoading } = useSites();
  const createSiteMutation = useCreateSite();
  const updateSiteMutation = useUpdateSite();
  const deleteSiteMutation = useDeleteSite();

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSite = (siteData: Omit<Site, "id" | "created_at" | "updated_at">) => {
    createSiteMutation.mutate(siteData, {
      onSuccess: () => {
        setShowSiteForm(false);
      }
    });
  };

  const handleUpdateSite = (siteData: Omit<Site, "id" | "created_at" | "updated_at">) => {
    if (editingSite) {
      updateSiteMutation.mutate({ 
        id: editingSite.id, 
        ...siteData 
      }, {
        onSuccess: () => {
          setEditingSite(null);
        }
      });
    }
  };

  const handleDeleteSite = (siteId: string) => {
    deleteSiteMutation.mutate(siteId);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
  };

  const handleViewSite = (site: Site) => {
    setSelectedSite(site);
  };

  const handleBulkCreate = (sites: Omit<Site, "id" | "created_at" | "updated_at">[]) => {
    sites.forEach(site => {
      createSiteMutation.mutate(site);
    });
    setShowBulkCreator(false);
  };

  return (
    <PageLayout
      title="Portnox Site Manager"
      subtitle="Manage all your deployment sites, track progress, and coordinate implementations across your entire network infrastructure."
      badge={{
        text: "Site Management",
        variant: "glow",
        icon: Building2
      }}
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowBulkCreator(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button 
            onClick={() => setShowSiteForm(true)}
            className="bg-gradient-primary hover:shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </div>
      }
    >
      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sites by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sites Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-sm bg-card/50 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSites.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sites found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria." 
                    : "Get started by creating your first site."
                  }
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button onClick={() => setShowSiteForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Site
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site) => (
                <Card key={site.id}>
                  <CardHeader>
                    <CardTitle>{site.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{site.location}</p>
                    <Badge variant="secondary" className="mt-2">{site.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sites Table View</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Table view coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Simple dialogs for now */}
      {showSiteForm && (
        <Card className="fixed inset-4 bg-background z-50 p-6">
          <CardHeader>
            <CardTitle>Add New Site</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowSiteForm(false)}>Close</Button>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
