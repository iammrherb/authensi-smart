import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText,
  Search,
  Filter,
  Star,
  Download,
  Copy,
  Edit,
  Trash2,
  Plus,
  Eye
} from 'lucide-react';
import { useConfigTemplates } from '@/hooks/useConfigTemplates';
import { useToast } from '@/hooks/use-toast';
import CodeBlock from "@/components/ui/code-block";

interface ConfigTemplateManagerProps {
  onTemplateSelect?: (template: any) => void;
  filters: {
    search: string;
    category: string;
    complexity: string;
    vendor: string;
  };
  onFiltersChange: (filters: any) => void;
}

const ConfigTemplateManager: React.FC<ConfigTemplateManagerProps> = ({
  onTemplateSelect,
  filters,
  onFiltersChange
}) => {
  const { data: templates } = useConfigTemplates();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewDialog, setPreviewDialog] = useState(false);

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = !filters.search || 
      template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      template.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || template.category === filters.category;
    const matchesComplexity = filters.complexity === 'all' || (template as any).complexity === filters.complexity;
    const matchesVendor = filters.vendor === 'all' || (template as any).vendor === filters.vendor;
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesVendor;
  }) || [];

  const handleTemplateAction = (action: string, template: any) => {
    switch (action) {
      case 'select':
        onTemplateSelect?.(template);
        toast({
          title: "Template Selected",
          description: `${template.name} has been selected for configuration.`
        });
        break;
      case 'preview':
        setSelectedTemplate(template);
        setPreviewDialog(true);
        break;
      case 'copy':
        navigator.clipboard.writeText(template.content || '');
        toast({
          title: "Template Copied",
          description: "Template content has been copied to clipboard."
        });
        break;
      case 'download':
        const blob = new Blob([template.content || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.replace(/\s+/g, '_')}.cfg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
          title: "Template Downloaded",
          description: `${template.name} has been downloaded.`
        });
        break;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'warning';
      case 'expert': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Template Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.complexity} onValueChange={(value) => onFiltersChange({ ...filters, complexity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complexities</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.vendor} onValueChange={(value) => onFiltersChange({ ...filters, vendor: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="cisco">Cisco</SelectItem>
                <SelectItem value="juniper">Juniper</SelectItem>
                <SelectItem value="aruba">Aruba</SelectItem>
                <SelectItem value="fortinet">Fortinet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getComplexityColor((template as any).complexity || 'basic') as any}>
                        {(template as any).complexity || 'basic'}
                      </Badge>
                      <Badge variant="outline">{(template as any).vendor || 'Generic'}</Badge>
                      {(template as any).featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTemplateAction('preview', template)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm line-clamp-2">
                {template.description}
              </CardDescription>
              
              <div className="text-xs text-muted-foreground">
                Updated: {new Date(template.updated_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleTemplateAction('select', template)}
                  className="flex-1"
                >
                  Use Template
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateAction('copy', template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateAction('download', template)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
            <p className="text-muted-foreground mb-4">
              No templates match your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="outline" onClick={() => onFiltersChange({ search: '', category: 'all', complexity: 'all', vendor: 'all' })}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-96">
            <CodeBlock
              language="bash"
              code={selectedTemplate?.content || '# No content available'}
            />
          </ScrollArea>
          
            <div className="flex justify-between pt-4">
            <div className="flex items-center gap-2">
              <Badge variant={getComplexityColor((selectedTemplate as any)?.complexity || 'basic') as any}>
                {(selectedTemplate as any)?.complexity || 'basic'}
              </Badge>
              <Badge variant="outline">{(selectedTemplate as any)?.vendor || 'Generic'}</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleTemplateAction('copy', selectedTemplate)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={() => handleTemplateAction('download', selectedTemplate)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => {
                  handleTemplateAction('select', selectedTemplate);
                  setPreviewDialog(false);
                }}
              >
                Use Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigTemplateManager;