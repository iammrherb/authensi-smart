import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building, FileText, Copy, Edit, Save, Download, Upload, Eye, 
  Settings, Code, Zap, Plus, Search, CheckCircle,
  Clock, User, Network, Shield, Database, Layers
} from 'lucide-react';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { useTemplateCustomizations, useCreateTemplateCustomization } from '@/hooks/useTemplateCustomizations';
import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import CodeBlock from '@/components/ui/code-block';
import { toast } from 'sonner';

interface SiteTemplateManagerProps {
  siteId: string;
  projectId?: string;
  onTemplateAssigned?: (templateId: string) => void;
}

const SiteTemplateManager: React.FC<SiteTemplateManagerProps> = ({
  siteId,
  projectId,
  onTemplateAssigned
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const { data: templates = [], isLoading } = useConfigTemplates();
  const { data: siteCustomizations = [], refetch } = useTemplateCustomizations(undefined, siteId);
  const { data: projectCustomizations = [] } = useTemplateCustomizations(projectId);
  const { data: vendors = [] } = useUnifiedVendors({});
  const createCustomization = useCreateTemplateCustomization();

  // Combine all available templates (library + project customizations)
  const allTemplates = [
    ...templates.map(t => ({ ...t, source: 'library' })),
    ...projectCustomizations.map(t => ({ ...t, source: 'project' }))
  ];

  // Filter templates
  const filteredTemplates = allTemplates.filter(template => {
    const name = (template as any).customization_name || (template as any).name;
    const description = (template as any).notes || (template as any).description;
    
    const matchesSearch = name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = !selectedVendor || (template as any).vendor_id === selectedVendor;
    const matchesCategory = !selectedCategory || (template as any).category === selectedCategory;
    
    return matchesSearch && matchesVendor && matchesCategory;
  });

  // Get unique categories from both sources
  const categories = [...new Set(allTemplates.map(t => (t as any).category).filter(Boolean))];

  const handleCustomizeForSite = async (template: any) => {
    try {
      const baseTemplateId = (template as any).base_template_id || (template as any).id;
      const templateName = (template as any).customization_name || (template as any).name;
      
      await createCustomization.mutateAsync({
        base_template_id: baseTemplateId,
        site_id: siteId,
        project_id: projectId,
        customization_name: `${templateName} - Site Customization`,
        custom_content: (template as any).custom_content || (template as any).template_content,
        custom_variables: (template as any).custom_variables || (template as any).template_variables || {},
        customization_type: 'site_specific',
        tags: [],
        version: 1,
        is_active: true
      });
      
      toast.success('Template customized for site');
      refetch();
    } catch (error) {
      toast.error('Failed to customize template');
    }
  };

  const handleAssignToSite = (templateId: string) => {
    if (onTemplateAssigned) {
      onTemplateAssigned(templateId);
    }
    toast.success('Template assigned to site');
    setShowAssignDialog(false);
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
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5" />
              Site Templates
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage configuration templates for this site
            </p>
          </div>
          <Button
            onClick={() => setShowAssignDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Assign Template
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  {vendor.name}
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

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Templates</TabsTrigger>
          <TabsTrigger value="site-custom">
            Site Customizations ({siteCustomizations.length})
          </TabsTrigger>
          <TabsTrigger value="assigned">Assigned & Active</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={`${template.source}-${template.id}`} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {(template as any).source === 'project' ? (
                          <Layers className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {(template as any).customization_name || (template as any).name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {(template as any).notes || (template as any).description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="text-xs">
                        {(template as any).category}
                      </Badge>
                      {(template as any).source === 'project' && (
                        <Badge variant="secondary" className="text-xs">
                          Project
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Network className="w-3 h-3" />
                        {vendors.find(v => v.id === (template as any).vendor_id)?.name || 'Generic'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date((template as any).created_at).toLocaleDateString()}
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
                        onClick={() => handleCustomizeForSite(template)}
                        disabled={createCustomization.isPending}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Customize
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAssignToSite((template as any).id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="site-custom" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteCustomizations.map((customization) => (
              <Card key={customization.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="w-4 h-4 text-green-500" />
                    {customization.customization_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Site-specific customization
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
                        Site Custom
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
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAssignToSite(customization.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {siteCustomizations.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Site Customizations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create site-specific template customizations
                </p>
                <Button onClick={() => setShowAssignDialog(true)}>
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
              <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Active Templates</h3>
              <p className="text-sm text-muted-foreground">
                Templates currently assigned and active for this site
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
                        <Label className="text-sm font-medium">Source</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.source === 'project' ? 'Project Template' : 'Library Template'}
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
    </div>
  );
};

export default SiteTemplateManager;