import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  useVendorModels, 
  useCreateVendorModel, 
  useUpdateVendorModel, 
  useDeleteVendorModel,
  type VendorModel 
} from "@/hooks/useVendorModels";
import { useVendors } from "@/hooks/useVendors";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  HardDrive, 
  Settings, 
  AlertCircle,
  CheckCircle,
  Calendar,
  Book,
  Tag,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedVendorModelManagerProps {
  vendorId?: string;
  searchTerm?: string;
}

const EnhancedVendorModelManager: React.FC<EnhancedVendorModelManagerProps> = ({ 
  vendorId, 
  searchTerm = "" 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedModel, setSelectedModel] = useState<VendorModel | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VendorModel | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: models = [], isLoading } = useVendorModels(vendorId);
  const { data: vendors = [] } = useVendors();
  const createModel = useCreateVendorModel();
  const updateModel = useUpdateVendorModel();
  const deleteModel = useDeleteVendorModel();
  const { toast } = useToast();

  const [newModelForm, setNewModelForm] = useState({
    vendor_id: vendorId || "",
    model_name: "",
    model_series: "",
    firmware_versions: [] as string[],
    hardware_specs: {} as Record<string, any>,
    port_configurations: {} as Record<string, any>,
    supported_features: [] as string[],
    eol_date: "",
    eos_date: "",
    documentation_links: [] as any[],
    configuration_notes: ""
  });

  const filteredModels = models.filter(model =>
    model.model_name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    model.model_series?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    model.vendor?.vendor_name.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  const handleCreateModel = async () => {
    try {
      await createModel.mutateAsync(newModelForm);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Vendor model created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create vendor model.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateModel = async () => {
    if (!editingModel) return;
    try {
      await updateModel.mutateAsync(editingModel);
      setIsEditDialogOpen(false);
      setEditingModel(null);
      toast({
        title: "Success",
        description: "Vendor model updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor model.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;
    try {
      await deleteModel.mutateAsync(selectedModel.id);
      setIsDeleteDialogOpen(false);
      setSelectedModel(null);
      toast({
        title: "Success",
        description: "Vendor model deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete vendor model.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewModelForm({
      vendor_id: vendorId || "",
      model_name: "",
      model_series: "",
      firmware_versions: [],
      hardware_specs: {},
      port_configurations: {},
      supported_features: [],
      eol_date: "",
      eos_date: "",
      documentation_links: [],
      configuration_notes: ""
    });
  };

  const addTag = (tag: string) => {
    if (tag && !newTags.includes(tag)) {
      setNewTags([...newTags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Vendor Models</h3>
          <p className="text-sm text-muted-foreground">
            {filteredModels.length} models available
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vendor Model</DialogTitle>
                <DialogDescription>
                  Create a comprehensive vendor model profile with specifications and documentation.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor_id">Vendor *</Label>
                    <Select 
                      value={newModelForm.vendor_id} 
                      onValueChange={(value) => setNewModelForm(prev => ({ ...prev, vendor_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.vendor_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model_name">Model Name *</Label>
                    <Input
                      id="model_name"
                      value={newModelForm.model_name}
                      onChange={(e) => setNewModelForm(prev => ({ ...prev, model_name: e.target.value }))}
                      placeholder="e.g., Catalyst 9300, CX 6300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model_series">Model Series</Label>
                    <Input
                      id="model_series"
                      value={newModelForm.model_series}
                      onChange={(e) => setNewModelForm(prev => ({ ...prev, model_series: e.target.value }))}
                      placeholder="e.g., 9300 Series, CX 6300 Series"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firmware_versions">Firmware Versions (comma-separated)</Label>
                    <Input
                      id="firmware_versions"
                      placeholder="e.g., 16.12.10, 17.03.08"
                      onChange={(e) => setNewModelForm(prev => ({ 
                        ...prev, 
                        firmware_versions: e.target.value.split(',').map(v => v.trim()).filter(v => v)
                      }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eol_date">End of Life Date</Label>
                    <Input
                      id="eol_date"
                      type="date"
                      value={newModelForm.eol_date}
                      onChange={(e) => setNewModelForm(prev => ({ ...prev, eol_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eos_date">End of Support Date</Label>
                    <Input
                      id="eos_date"
                      type="date"
                      value={newModelForm.eos_date}
                      onChange={(e) => setNewModelForm(prev => ({ ...prev, eos_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supported_features">Supported Features (comma-separated)</Label>
                  <Input
                    id="supported_features"
                    placeholder="e.g., 802.1X, MAB, Dynamic VLAN, PoE+"
                    onChange={(e) => setNewModelForm(prev => ({ 
                      ...prev, 
                      supported_features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="configuration_notes">Configuration Notes</Label>
                  <Textarea
                    id="configuration_notes"
                    value={newModelForm.configuration_notes}
                    onChange={(e) => setNewModelForm(prev => ({ ...prev, configuration_notes: e.target.value }))}
                    placeholder="Special configuration notes, limitations, or recommendations..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateModel} disabled={createModel.isPending}>
                    {createModel.isPending ? "Creating..." : "Create Model"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Models Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model) => (
            <Card key={model.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    {model.model_name}
                  </CardTitle>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingModel(model);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedModel(model);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {model.vendor?.vendor_name}
                  </Badge>
                  {model.model_series && (
                    <Badge variant="outline" className="text-xs">
                      {model.model_series}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {model.firmware_versions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Firmware Versions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.firmware_versions.slice(0, 2).map((version, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {version}
                        </Badge>
                      ))}
                      {model.firmware_versions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{model.firmware_versions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {model.supported_features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Key Features</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {model.supported_features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {model.supported_features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{model.supported_features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {model.eol_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>EOL: {new Date(model.eol_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {model.documentation_links.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Book className="h-4 w-4" />
                      <span>{model.documentation_links.length} docs</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor Model</DialogTitle>
            <DialogDescription>
              Update vendor model information and specifications.
            </DialogDescription>
          </DialogHeader>
          
          {editingModel && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_model_name">Model Name *</Label>
                  <Input
                    id="edit_model_name"
                    value={editingModel.model_name}
                    onChange={(e) => setEditingModel(prev => prev ? ({ ...prev, model_name: e.target.value }) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_model_series">Model Series</Label>
                  <Input
                    id="edit_model_series"
                    value={editingModel.model_series || ""}
                    onChange={(e) => setEditingModel(prev => prev ? ({ ...prev, model_series: e.target.value }) : null)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Configuration Notes</Label>
                <Textarea
                  value={editingModel.configuration_notes || ""}
                  onChange={(e) => setEditingModel(prev => prev ? ({ ...prev, configuration_notes: e.target.value }) : null)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateModel} disabled={updateModel.isPending}>
                  {updateModel.isPending ? "Updating..." : "Update Model"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vendor Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedModel?.model_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteModel}
              disabled={deleteModel.isPending}
            >
              {deleteModel.isPending ? "Deleting..." : "Delete Model"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredModels.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No models found</h3>
            <p className="text-muted-foreground mb-4">
              No vendor models match your search criteria.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Model
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedVendorModelManager;