import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, MapPin, Users } from 'lucide-react';
import { useSites, useCreateSite, useUpdateSite, useDeleteSite } from '@/hooks/useSites';
import SitesTable from '@/components/sites/SitesTable';
import SiteForm from '@/components/sites/SiteForm';
import SiteDetailsDialog from '@/components/sites/SiteDetailsDialog';
import BulkSiteCreator from '@/components/sites/BulkSiteCreator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

const Sites = () => {
  const location = useLocation();
  const { toast } = useToast();
  const projectId = location.state?.projectId;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isBulkCreatorOpen, setIsBulkCreatorOpen] = useState(false);

  const { data: sites = [], isLoading } = useSites();
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const deleteSite = useDeleteSite();

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSite = (siteData: any) => {
    createSite.mutate({
      ...siteData,
      ...(projectId && { project_id: projectId })
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Site created successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create site",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateSite = (siteData: any) => {
    if (!selectedSite) return;
    
    updateSite.mutate({
      id: selectedSite.id,
      ...siteData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setSelectedSite(null);
        toast({
          title: "Success",
          description: "Site updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update site",
          variant: "destructive",
        });
      }
    });
  };

  const handleDeleteSite = (id: string) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      deleteSite.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Site deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "Failed to delete site",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleBulkCreate = (sitesData: any[]) => {
    // Handle bulk site creation
    Promise.all(
      sitesData.map(siteData => 
        createSite.mutateAsync({
          ...siteData,
          ...(projectId && { project_id: projectId })
        })
      )
    ).then(() => {
      setIsBulkCreatorOpen(false);
      toast({
        title: "Success",
        description: `${sitesData.length} sites created successfully`,
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to create some sites",
        variant: "destructive",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Site Management</h1>
                <p className="text-muted-foreground">
                  Manage your deployment sites and locations
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsBulkCreatorOpen(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Bulk Create
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Site
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sites.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sites.filter(s => s.status === 'deployed').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sites.filter(s => ['implementing', 'testing'].includes(s.status)).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planning</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {sites.filter(s => ['planning', 'scoping'].includes(s.status)).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {projectId && (
                <Badge variant="outline">
                  Project Filtered
                </Badge>
              )}
            </div>

            {/* Sites Table */}
            <Card>
              <CardHeader>
                <CardTitle>Sites</CardTitle>
              </CardHeader>
              <CardContent>
                <SitesTable
                  sites={filteredSites}
                  onEdit={(site) => {
                    setSelectedSite(site);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={handleDeleteSite}
                  onViewDetails={(site) => {
                    setSelectedSite(site);
                    setIsDetailsDialogOpen(true);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Site Dialog */}
      <SiteForm
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSite}
        isLoading={createSite.isPending}
      />

      {/* Edit Site Dialog */}
      <SiteForm
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateSite}
        initialData={selectedSite}
        isLoading={updateSite.isPending}
      />

      {/* Site Details Dialog */}
      {selectedSite && (
        <SiteDetailsDialog
          site={selectedSite}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedSite(null);
          }}
          onEdit={() => {
            setIsDetailsDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
        />
      )}

      {/* Bulk Site Creator */}
      <BulkSiteCreator
        isOpen={isBulkCreatorOpen}
        onClose={() => setIsBulkCreatorOpen(false)}
        onSubmit={handleBulkCreate}
        isLoading={createSite.isPending}
        projectId={projectId}
      />
    </div>
  );
};

export default Sites;