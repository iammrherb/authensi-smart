import { useState } from "react";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, LayoutGrid, Table, Upload, Filter } from "lucide-react";
import { useSites, useCreateSite, useUpdateSite, useDeleteSite, Site } from "@/hooks/useSites";
import SiteCard from "@/components/sites/SiteCard";
import SitesTable from "@/components/sites/SitesTable";
import EnhancedSiteForm from "@/components/sites/EnhancedSiteForm";
import SiteDetailsDialog from "@/components/sites/SiteDetailsDialog";
import BulkSiteCreator from "@/components/sites/BulkSiteCreator";

const Sites = () => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: sites = [], isLoading } = useSites();
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const deleteSite = useDeleteSite();

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (site.location && site.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || site.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateSite = (siteData: Partial<Site>) => {
    createSite.mutate(siteData as any, {
      onSuccess: () => {
        setIsFormOpen(false);
        setSelectedSite(null);
      }
    });
  };

  const handleUpdateSite = (siteData: Partial<Site>) => {
    if (selectedSite) {
      updateSite.mutate({ id: selectedSite.id, ...siteData }, {
        onSuccess: () => {
          setIsFormOpen(false);
          setSelectedSite(null);
        }
      });
    }
  };

  const handleDeleteSite = (id: string) => {
    if (confirm("Are you sure you want to delete this site?")) {
      deleteSite.mutate(id);
    }
  };

  const handleEditSite = (site: Site) => {
    setSelectedSite(site);
    setIsFormOpen(true);
  };

  const handleViewDetails = (site: Site) => {
    setSelectedSite(site);
    setIsDetailsOpen(true);
  };

  const handleBulkCreate = async (sitesData: any[]) => {
    try {
      for (const siteData of sitesData) {
        await new Promise((resolve) => {
          createSite.mutate(siteData, {
            onSuccess: () => resolve(null),
            onError: () => resolve(null)
          });
        });
      }
      setIsBulkCreateOpen(false);
    } catch (error) {
      console.error("Bulk creation failed:", error);
    }
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "planning", label: "Planning" },
    { value: "scoping", label: "Scoping" },
    { value: "designing", label: "Designing" },
    { value: "implementing", label: "Implementing" },
    { value: "testing", label: "Testing" },
    { value: "deployed", label: "Deployed" },
    { value: "maintenance", label: "Maintenance" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 container mx-auto px-6 py-8">
          <div className="text-center">Loading sites...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🏢 Site Management
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Portnox <span className="bg-gradient-primary bg-clip-text text-transparent">Site Manager</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage all your deployment sites, track progress, and coordinate implementations 
              across your entire network infrastructure.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl">Sites ({filteredSites.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      <Table className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                  <Button variant="outline" onClick={() => setIsBulkCreateOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Create
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sites by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSites.map((site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onEdit={handleEditSite}
                      onDelete={handleDeleteSite}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <SitesTable
                  sites={filteredSites}
                  onEdit={handleEditSite}
                  onDelete={handleDeleteSite}
                  onViewDetails={handleViewDetails}
                />
              )}

              {filteredSites.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-lg font-semibold mb-2">No sites found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                      ? "Try adjusting your search or filters"
                      : "Get started by creating your first site"
                    }
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Site
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EnhancedSiteForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSite(null);
        }}
        onSubmit={selectedSite ? handleUpdateSite : handleCreateSite}
        initialData={selectedSite}
        isLoading={createSite.isPending || updateSite.isPending}
      />

      <SiteDetailsDialog
        site={selectedSite}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedSite(null);
        }}
        onEdit={(site) => {
          setSelectedSite(site);
          setIsDetailsOpen(false);
          setIsFormOpen(true);
        }}
      />

      <BulkSiteCreator
        isOpen={isBulkCreateOpen}
        onClose={() => setIsBulkCreateOpen(false)}
        onSubmit={handleBulkCreate}
        isLoading={createSite.isPending}
      />
    </div>
  );
};

export default Sites;