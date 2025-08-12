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
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  useConfigTemplates, 
  useCreateConfigTemplate, 
  useUpdateConfigTemplate, 
  useDeleteConfigTemplate,
  useGenerateConfigWithAI,
  type ConfigTemplate 
} from "@/hooks/useConfigTemplates";
import { useVendors } from "@/hooks/useVendors";
import { useVendorModels } from "@/hooks/useVendorModels";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText, 
  Settings, 
  Download,
  Copy,
  Play,
  Sparkles,
  Tag,
  X,
  Code,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedConfigTemplateManagerProps {
  searchTerm?: string;
}

const EnhancedConfigTemplateManager: React.FC<EnhancedConfigTemplateManagerProps> = ({ 
  searchTerm = "" 
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ConfigTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ConfigTemplate | null>(null);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: templates = [], isLoading } = useConfigTemplates();
  const { data: vendors = [] } = useVendors();
  const { data: models = [] } = useVendorModels();
  const createTemplate = useCreateConfigTemplate();
  const updateTemplate = useUpdateConfigTemplate();
  const deleteTemplate = useDeleteConfigTemplate();
  const generateWithAI = useGenerateConfigWithAI();
  const { toast } = useToast();

  const [newTemplateForm, setNewTemplateForm] = useState({
    name: "",
    description: "",
    vendor_id: "",
    model_id: "",
    category: "",
    subcategory: "",
    configuration_type: "",
    template_content: "",
    template_variables: {},
    tags: [] as string[],
    complexity_level: "intermediate",
    validation_commands: [] as string[],
    best_practices: [] as string[]
  });

  const categories = ["all", "802.1X", "Switch Configuration", "Wireless", "Security", "VLAN", "QoS", "Monitoring"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(localSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = async () => {
    try {
      await createTemplate.mutateAsync({
        ...newTemplateForm,
        tags: JSON.stringify(newTags)
      } as any);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Configuration template created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create configuration template.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    try {
      await updateTemplate.mutateAsync(editingTemplate);
      setIsEditDialogOpen(false);
      setEditingTemplate(null);
      toast({
        title: "Success", 
        description: "Configuration template updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update configuration template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    try {
      await deleteTemplate.mutateAsync(selectedTemplate.id);
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
      toast({
        title: "Success",
        description: "Configuration template deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete configuration template.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateWithAI = async () => {
    try {
      const result = await generateWithAI.mutateAsync({
        vendor: newTemplateForm.vendor_id,
        model: newTemplateForm.model_id,
        configType: newTemplateForm.configuration_type,
        requirements: "Generate comprehensive 802.1X configuration",
        variables: newTemplateForm.template_variables
      });
      
      if (result) {
        setNewTemplateForm(prev => ({
          ...prev,
          template_content: result.content || ""
        }));
        toast({
          title: "Success",
          description: "AI configuration generated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI configuration.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewTemplateForm({
      name: "",
      description: "",
      vendor_id: "",
      model_id: "",
      category: "",
      subcategory: "",
      configuration_type: "",
      template_content: "",
      template_variables: {},
      tags: [],
      complexity_level: "intermediate",
      validation_commands: [],
      best_practices: []
    });
    setNewTags([]);
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Configuration Templates</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTemplates.length} templates available
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Configuration Template</DialogTitle>
                <DialogDescription>
                  Create a comprehensive configuration template with AI assistance and best practices.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name *</Label>
                      <Input
                        id="name"
                        value={newTemplateForm.name}
                        onChange={(e) => setNewTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Cisco 9300 802.1X Basic"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={newTemplateForm.category} 
                        onValueChange={(value) => setNewTemplateForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(cat => cat !== "all").map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendor_id">Vendor</Label>
                      <Select 
                        value={newTemplateForm.vendor_id} 
                        onValueChange={(value) => setNewTemplateForm(prev => ({ ...prev, vendor_id: value }))}
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
                      <Label htmlFor="complexity_level">Complexity Level</Label>
                      <Select 
                        value={newTemplateForm.complexity_level} 
                        onValueChange={(value) => setNewTemplateForm(prev => ({ ...prev, complexity_level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTemplateForm.description}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the template and its use case..."
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="config" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateWithAI}
                      disabled={generateWithAI.isPending}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {generateWithAI.isPending ? "Generating..." : "Generate with AI"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Test Config
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template_content">Configuration Content *</Label>
                    <Textarea
                      id="template_content"
                      value={newTemplateForm.template_content}
                      onChange={(e) => setNewTemplateForm(prev => ({ ...prev, template_content: e.target.value }))}
                      placeholder="Enter your configuration template here..."
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variables" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Template Variables (JSON)</Label>
                    <Textarea
                      placeholder='{"radius_server_ip": "192.168.1.100", "shared_secret": "secret123"}'
                      onChange={(e) => {
                        try {
                          const variables = JSON.parse(e.target.value || "{}");
                          setNewTemplateForm(prev => ({ ...prev, template_variables: variables }));
                        } catch (error) {
                          // Invalid JSON, ignore
                        }
                      }}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(tagInput);
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => addTag(tagInput)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Best Practices (one per line)</Label>
                    <Textarea
                      placeholder="Always test RADIUS connectivity first&#10;Use monitor sessions for troubleshooting&#10;Implement gradual rollout"
                      onChange={(e) => setNewTemplateForm(prev => ({ 
                        ...prev, 
                        best_practices: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Validation Commands (one per line)</Label>
                    <Textarea
                      placeholder="show dot1x all summary&#10;show authentication sessions&#10;show radius statistics"
                      onChange={(e) => setNewTemplateForm(prev => ({ 
                        ...prev, 
                        validation_commands: e.target.value.split('\n').filter(line => line.trim())
                      }))}
                      rows={5}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate} disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? "Creating..." : "Create Template"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Templates Grid */}
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
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge className={`text-xs ${getComplexityColor(template.complexity_level)}`}>
                    {template.complexity_level}
                  </Badge>
                  {template.vendor && (
                    <Badge variant="outline" className="text-xs">
                      {template.vendor.vendor_name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>

                {template.tags && template.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Used: {template.usage_count || 0}x</span>
                    {template.rating && (
                      <span>⭐ {template.rating.toFixed(1)}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Template Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Configuration template details and content
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <Badge>{selectedTemplate.category}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Complexity</h4>
                  <Badge className={getComplexityColor(selectedTemplate.complexity_level)}>
                    {selectedTemplate.complexity_level}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage</h4>
                  <span className="text-sm">{selectedTemplate.usage_count || 0} times</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Configuration Content</h4>
                <ScrollArea className="h-96 w-full border rounded-md p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {selectedTemplate.template_content}
                  </pre>
                </ScrollArea>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Template
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
            <DialogTitle>Delete Configuration Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTemplate?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTemplate}
              disabled={deleteTemplate.isPending}
            >
              {deleteTemplate.isPending ? "Deleting..." : "Delete Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredTemplates.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              No configuration templates match your search criteria.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedConfigTemplateManager;