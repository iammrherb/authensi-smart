import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Template, 
  Settings, 
  Copy, 
  Edit, 
  Save, 
  Download, 
  Upload, 
  Eye, 
  Star,
  Filter,
  Search,
  Plus,
  Layers,
  Network,
  Shield,
  Database,
  Code,
  Wand2,
  Target,
  FileText,
  GitBranch,
  Clock
} from 'lucide-react';
import { useConfigTemplates, useCreateConfigTemplate, useUpdateConfigTemplate } from '@/hooks/useConfigTemplates';
import { useTemplateCustomizations, useCreateTemplateCustomization, useCloneTemplate } from '@/hooks/useTemplateCustomizations';
import { useVendors } from '@/hooks/useVendors';
import { useToast } from '@/hooks/use-toast';
import CodeBlock from '@/components/ui/code-block';

interface EnhancedTemplateManagerProps {
  projectId?: string;
  siteId?: string;
  onTemplateSelect?: (template: any) => void;
  allowCustomization?: boolean;
}

const EnhancedTemplateManager: React.FC<EnhancedTemplateManagerProps> = ({
  projectId,
  siteId,
  onTemplateSelect,
  allowCustomization = true
}) => {
  const { data: templates } = useConfigTemplates();
  const { data: customizations } = useTemplateCustomizations(projectId, siteId);
  const { data: vendors } = useVendors();
  const createTemplate = useCreateConfigTemplate();
  const updateTemplate = useUpdateConfigTemplate();
  const createCustomization = useCreateTemplateCustomization();
  const cloneTemplate = useCloneTemplate();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<'library' | 'customizations' | 'assignments'>('library');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    vendor: 'all',
    complexity: 'all'
  });

  const [customizationForm, setCustomizationForm] = useState({
    customization_name: '',
    customization_type: 'modification',
    custom_content: '',
    custom_variables: {},
    modification_notes: '',
    tags: []
  });

  const filteredTemplates = templates?.filter(template => {
    if (filters.search && !template.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category !== 'all' && template.category !== filters.category) {
      return false;
    }
    if (filters.vendor !== 'all' && template.vendor_id !== filters.vendor) {
      return false;
    }
    if (filters.complexity !== 'all' && template.complexity_level !== filters.complexity) {
      return false;
    }
    return true;
  });

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    onTemplateSelect?.(template);
  };

  const handleCustomizeTemplate = (template: any) => {
    setCustomizationForm({
      ...customizationForm,
      customization_name: `${template.name} - Custom`,
      custom_content: template.template_content,
      custom_variables: template.template_variables || {}
    });
    setIsEditing(true);
  };

  const handleSaveCustomization = async () => {
    if (!selectedTemplate) return;

    try {
      await createCustomization.mutateAsync({
        base_template_id: selectedTemplate.id,
        project_id: projectId,
        site_id: siteId,
        ...customizationForm,
        is_active: true,
        version: 1
      });
      setIsEditing(false);
      setCustomizationForm({
        customization_name: '',
        customization_type: 'modification',
        custom_content: '',
        custom_variables: {},
        modification_notes: '',
        tags: []
      });
    } catch (error) {
      console.error('Failed to save customization:', error);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      await cloneTemplate.mutateAsync({
        templateId,
        projectId,
        siteId
      });
    } catch (error) {
      console.error('Failed to clone template:', error);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Template Manager</h2>
          <p className="text-muted-foreground">
            Manage, customize, and deploy configuration templates with full vendor support
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new configuration template with vendor-specific settings
                </DialogDescription>
              </DialogHeader>
              {/* Template creation form */}
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors?.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.vendor_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authentication">Authentication</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="routing">Routing</SelectItem>
                        <SelectItem value="switching">Switching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the template purpose and use case"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complexity">Complexity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Template Library
          </TabsTrigger>
          <TabsTrigger value="customizations" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Customizations
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="routing">Routing</SelectItem>
              <SelectItem value="switching">Switching</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.vendor} onValueChange={(value) => setFilters({ ...filters, vendor: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              {vendors?.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.vendor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.complexity} onValueChange={(value) => setFilters({ ...filters, complexity: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="library" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates?.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.vendor?.vendor_name} • {template.category}
                      </CardDescription>
                    </div>
                    <Badge className={getComplexityColor(template.complexity_level)}>
                      {template.complexity_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-current" />
                      {template.rating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleTemplateSelect(template)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      {allowCustomization && (
                        <Button size="sm" variant="outline" onClick={() => handleCustomizeTemplate(template)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleCloneTemplate(template.id)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customizations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customizations?.map(customization => (
              <Card key={customization.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customization.customization_name}</CardTitle>
                      <CardDescription>
                        Based on: {customization.base_template?.name}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">v{customization.version}</Badge>
                      <Badge variant={customization.customization_type === 'clone' ? 'default' : 'secondary'}>
                        {customization.customization_type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customization.modification_notes && (
                    <p className="text-sm text-muted-foreground">
                      {customization.modification_notes}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {customization.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(customization.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Assignments</CardTitle>
              <CardDescription>
                Manage template assignments to projects and sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Template assignment management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                {selectedTemplate.vendor?.vendor_name} • {selectedTemplate.category} • {selectedTemplate.complexity_level}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Configuration Content</h4>
                  <CodeBlock
                    code={selectedTemplate.template_content}
                    language="bash"
                    showLineNumbers={true}
                  />
                </div>

                {selectedTemplate.template_variables && Object.keys(selectedTemplate.template_variables).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Template Variables</h4>
                    <CodeBlock
                      code={JSON.stringify(selectedTemplate.template_variables, null, 2)}
                      language="json"
                      showLineNumbers={true}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Customization Editor */}
      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Customize Template</DialogTitle>
              <DialogDescription>
                Create a customized version of this template for your project/site
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-name">Customization Name</Label>
                  <Input
                    id="custom-name"
                    value={customizationForm.customization_name}
                    onChange={(e) => setCustomizationForm({...customizationForm, customization_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-type">Customization Type</Label>
                  <Select 
                    value={customizationForm.customization_type}
                    onValueChange={(value) => setCustomizationForm({...customizationForm, customization_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modification">Modification</SelectItem>
                      <SelectItem value="enhancement">Enhancement</SelectItem>
                      <SelectItem value="clone">Clone</SelectItem>
                      <SelectItem value="variant">Variant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="custom-notes">Modification Notes</Label>
                  <Textarea
                    id="custom-notes"
                    value={customizationForm.modification_notes}
                    onChange={(e) => setCustomizationForm({...customizationForm, modification_notes: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="custom-content">Custom Configuration</Label>
                <Textarea
                  id="custom-content"
                  value={customizationForm.custom_content}
                  onChange={(e) => setCustomizationForm({...customizationForm, custom_content: e.target.value})}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomization}>
                <Save className="w-4 h-4 mr-2" />
                Save Customization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnhancedTemplateManager;