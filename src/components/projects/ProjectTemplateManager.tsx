import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Copy, Edit, Save, Download, Upload, Eye, Star, 
  Settings, Code, Zap, Plus, Search, Filter,
  Clock, User, CheckCircle, AlertCircle, Layers, Network
} from 'lucide-react';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { useTemplateCustomizations, useCreateTemplateCustomization, useCloneTemplate } from '@/hooks/useTemplateCustomizations';
import { useVendors } from '@/hooks/useVendors';
import CodeBlock from '@/components/ui/code-block';
import { toast } from 'sonner';

interface ProjectTemplateManagerProps {
  projectId: string;
  onTemplateAssigned?: (templateId: string) => void;
}

const ProjectTemplateManager: React.FC<ProjectTemplateManagerProps> = ({
  projectId,
  onTemplateAssigned
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: templates = [], isLoading } = useConfigTemplates();
  const { data: customizations = [], refetch } = useTemplateCustomizations(projectId);
  const { data: vendors = [] } = useVendors();
  const createCustomization = useCreateTemplateCustomization();
  const cloneTemplate = useCloneTemplate();

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = !selectedVendor || template.vendor_id === selectedVendor;
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    
    return matchesSearch && matchesVendor && matchesCategory;
  });

  // Get unique categories
  const categories = [...new Set(templates.map(t => t.category))];

  const handleCustomizeTemplate = async (template: any) => {
    try {
      await createCustomization.mutateAsync({
        base_template_id: template.id,
        project_id: projectId,
        customization_name: `${template.name} - Project Customization`,
        custom_content: template.template_content,
        custom_variables: template.template_variables || {},
        customization_type: 'project_specific',
        tags: [],
        version: 1,
        is_active: true
      });
      
      toast.success('Template customized successfully');
      refetch();
      setIsCustomizing(false);
    } catch (error) {
      toast.error('Failed to customize template');
    }
  };

  const handleCloneTemplate = async (template: any, newName: string) => {
    try {
      await cloneTemplate.mutateAsync({
        templateId: template.id,
        projectId
      });
      
      toast.success('Template cloned successfully');
      refetch();
      setShowCloneDialog(false);
    } catch (error) {
      toast.error('Failed to clone template');
    }
  };

  const handleAssignTemplate = (templateId: string) => {
    if (onTemplateAssigned) {
      onTemplateAssigned(templateId);
    }
    toast.success('Template assigned to project');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading templates...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Project Templates</h3>
            <p className="text-sm text-muted-foreground">
              Manage and customize configuration templates for this project
            </p>
          </div>
          <Button
            onClick={() => setIsCustomizing(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Customize Template
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedVendor} onValueChange={setSelectedVendor}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.vendor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="library">Template Library</TabsTrigger>
          <TabsTrigger value="customizations">
            Project Customizations ({customizations.length})
          </TabsTrigger>
          <TabsTrigger value="assigned">Assigned Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {template.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Network className="w-3 h-3" />
                        {vendors.find(v => v.id === template.vendor_id)?.vendor_name || 'Generic'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {template.rating || 0}/5
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTemplate(template)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCustomizeTemplate(template)}
                        disabled={createCustomization.isPending}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Customize
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAssignTemplate(template.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Templates Found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="customizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customizations.map((customization) => (
              <Card key={customization.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {customization.customization_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Based on: {customization.base_template?.name}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(customization.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Project Custom
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTemplate(customization)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCloneDialog(true)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Clone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {customizations.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Customizations Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create customized versions of templates for this project
                </p>
                <Button onClick={() => setIsCustomizing(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Customize First Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assigned">
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Template Assignments</h3>
              <p className="text-sm text-muted-foreground">
                View and manage templates assigned to project sites and phases
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Viewer Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedTemplate.customization_name || selectedTemplate.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="content" className="h-full flex flex-col">
                <TabsList>
                  <TabsTrigger value="content">Template Content</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <CodeBlock
                      code={selectedTemplate.custom_content || selectedTemplate.template_content}
                      language="bash"
                    />
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="variables" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <CodeBlock
                      code={JSON.stringify(
                        selectedTemplate.custom_variables || selectedTemplate.template_variables || {},
                        null,
                        2
                      )}
                      language="json"
                    />
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="metadata" className="flex-1">
                  <div className="space-y-4">
                    {selectedTemplate.notes && (
                      <div>
                        <Label className="text-sm font-medium">Notes</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedTemplate.notes}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.category || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedTemplate.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Clone Template Dialog */}
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clone-name">New Template Name</Label>
              <Input
                id="clone-name"
                placeholder="Enter name for cloned template"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCloneDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                const input = document.getElementById('clone-name') as HTMLInputElement;
                if (selectedTemplate && input.value) {
                  handleCloneTemplate(selectedTemplate, input.value);
                }
              }}>
                Clone Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTemplateManager;