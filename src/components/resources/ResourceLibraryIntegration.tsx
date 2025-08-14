import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useUseCases, useCreateUseCase, useUpdateUseCase } from '@/hooks/useUseCases';
import { useRequirements, useCreateRequirement } from '@/hooks/useRequirements';
import { useProjectTemplates, useCreateProjectTemplate } from '@/hooks/useProjectTemplates';
import { useUpdateRequirement, useDeleteRequirement } from '@/hooks/useUpdateRequirement';
import { useDeleteUseCase } from '@/hooks/useUpdateUseCase';
import { useToast } from '@/hooks/use-toast';
import type { UseCase } from '@/hooks/useUseCases';
import type { Requirement } from '@/hooks/useRequirements';
import type { ProjectTemplate } from '@/hooks/useProjectTemplates';

interface ResourceLibraryIntegrationProps {
  onUseCaseSelect?: (useCase: UseCase) => void;
  onRequirementSelect?: (requirement: Requirement) => void;
  onTemplateSelect?: (template: ProjectTemplate) => void;
  selectedItems?: {
    useCases?: string[];
    requirements?: string[];
    templates?: string[];
  };
  mode?: 'select' | 'manage';
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  filters?: {
    categories?: string[];
    complexity?: string[];
    priority?: string[];
  };
}

const ResourceLibraryIntegration: React.FC<ResourceLibraryIntegrationProps> = ({
  onUseCaseSelect,
  onRequirementSelect,
  onTemplateSelect,
  selectedItems = {},
  mode = 'manage',
  allowCreate = true,
  allowEdit = true,
  allowDelete = false,
  filters = {}
}) => {
  const [activeTab, setActiveTab] = useState('usecases');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const { data: useCases = [], isLoading: useCasesLoading } = useUseCases();
  const { data: requirements = [], isLoading: requirementsLoading } = useRequirements();
  const { data: templates = [], isLoading: templatesLoading } = useProjectTemplates();

  const createUseCase = useCreateUseCase();
  const updateUseCase = useUpdateUseCase();
  const deleteUseCase = useDeleteUseCase();
  const createRequirement = useCreateRequirement();
  const updateRequirement = useUpdateRequirement();
  const deleteRequirement = useDeleteRequirement();
  const createTemplate = useCreateProjectTemplate();

  const { toast } = useToast();

  const filteredUseCases = useCases.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequirements = requirements.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (type: string, id: string) => {
    return selectedItems[type as keyof typeof selectedItems]?.includes(id) || false;
  };

  const handleCreate = async () => {
    try {
      if (activeTab === 'usecases') {
        await createUseCase.mutateAsync({
          name: formData.name || '',
          category: formData.category || 'General',
          description: formData.description || '',
          business_value: formData.business_value || '',
          technical_requirements: formData.technical_requirements || [],
          prerequisites: formData.prerequisites || [],
          test_scenarios: formData.test_scenarios || [],
          supported_vendors: formData.supported_vendors || [],
          portnox_features: formData.portnox_features || [],
          complexity: formData.complexity || 'medium',
          estimated_effort_weeks: formData.estimated_effort_weeks || 1,
          dependencies: formData.dependencies || [],
          compliance_frameworks: formData.compliance_frameworks || [],
          authentication_methods: formData.authentication_methods || [],
          deployment_scenarios: formData.deployment_scenarios || [],
          tags: formData.tags || [],
          status: 'active'
        });
      } else if (activeTab === 'requirements') {
        await createRequirement.mutateAsync({
          title: formData.title || '',
          category: formData.category || 'General',
          priority: formData.priority || 'medium',
          requirement_type: formData.requirement_type || 'functional',
          description: formData.description || '',
          rationale: formData.rationale || '',
          acceptance_criteria: formData.acceptance_criteria || [],
          verification_methods: formData.verification_methods || [],
          test_cases: formData.test_cases || [],
          related_use_cases: formData.related_use_cases || [],
          dependencies: formData.dependencies || [],
          assumptions: formData.assumptions || [],
          constraints: formData.constraints || [],
          compliance_frameworks: formData.compliance_frameworks || [],
          vendor_requirements: formData.vendor_requirements || {},
          portnox_features: formData.portnox_features || [],
          documentation_references: formData.documentation_references || [],
          tags: formData.tags || [],
          status: 'draft'
        });
      } else if (activeTab === 'templates') {
        await createTemplate.mutateAsync({
          name: formData.name || '',
          description: formData.description || '',
          industry: formData.industry || 'General',
          deployment_type: formData.deployment_type || 'hybrid',
          security_level: formData.security_level || 'standard',
          complexity: formData.complexity || 'medium',
          estimated_duration: formData.estimated_duration || '8-12 weeks',
          sites_supported: formData.sites_supported || '1-10',
          template_data: {
            use_cases: formData.use_cases || [],
            requirements: formData.requirements || [],
            vendor_configurations: formData.vendor_configurations || [],
            timeline_template: formData.timeline_template || {},
            deployment_phases: formData.deployment_phases || [],
            success_criteria: formData.success_criteria || [],
            risk_factors: formData.risk_factors || [],
            automation_level: formData.automation_level || 'manual',
            compliance_frameworks: formData.compliance_frameworks || []
          },
          metadata: {
            usage_count: 0,
            success_rate: 0,
            tags: formData.tags || []
          },
          is_active: true,
          is_validated: false
        });
      }
      setIsCreateDialogOpen(false);
      setFormData({});
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const handleEdit = async (item: any) => {
    try {
      if (activeTab === 'usecases') {
        await updateUseCase.mutateAsync({ id: item.id, ...formData });
      } else if (activeTab === 'requirements') {
        await updateRequirement.mutateAsync({ id: item.id, ...formData });
      }
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.name || item.title}"?`)) return;
    
    try {
      if (activeTab === 'usecases') {
        await deleteUseCase.mutateAsync(item.id);
      } else if (activeTab === 'requirements') {
        await deleteRequirement.mutateAsync(item.id);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const renderResourceCard = (item: any, type: string) => {
    const selected = isSelected(type, item.id);
    const isEditing = editingItem?.id === item.id;

    if (isEditing) {
      return (
        <Card key={item.id} className="border-primary">
          <CardHeader>
            <div className="space-y-2">
              <Input
                value={formData.name || formData.title || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  [item.name !== undefined ? 'name' : 'title']: e.target.value 
                }))}
                placeholder="Name/Title"
              />
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(item)}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={item.id} className={`cursor-pointer transition-all ${selected ? 'border-primary bg-primary/5' : 'hover:shadow-md'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{item.name || item.title}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </div>
            <div className="flex gap-1">
              {mode === 'select' && (
                <Button
                  size="sm"
                  variant={selected ? "secondary" : "default"}
                  onClick={() => {
                    if (type === 'usecases' && onUseCaseSelect) onUseCaseSelect(item);
                    if (type === 'requirements' && onRequirementSelect) onRequirementSelect(item);
                    if (type === 'templates' && onTemplateSelect) onTemplateSelect(item);
                  }}
                >
                  {selected ? 'Selected' : 'Select'}
                </Button>
              )}
              {mode === 'manage' && allowEdit && (
                <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {mode === 'manage' && allowDelete && (
                <Button size="sm" variant="ghost" onClick={() => handleDelete(item)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description || item.business_value}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="secondary">{item.complexity || item.priority}</Badge>
            {item.status && <Badge variant="outline">{item.status}</Badge>}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCreateForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{activeTab === 'requirements' ? 'Title' : 'Name'}</Label>
            <Input
              value={formData.name || formData.title || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                [activeTab === 'requirements' ? 'title' : 'name']: e.target.value 
              }))}
              placeholder={`Enter ${activeTab === 'requirements' ? 'title' : 'name'}`}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={formData.category || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        {activeTab === 'usecases' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Complexity</Label>
              <Select value={formData.complexity || 'medium'} onValueChange={(value) => setFormData(prev => ({ ...prev, complexity: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Effort (weeks)</Label>
              <Input
                type="number"
                value={formData.estimated_effort_weeks || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_effort_weeks: parseInt(e.target.value) || 1 }))}
                placeholder="1"
              />
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={formData.priority || 'medium'} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={formData.requirement_type || 'functional'} onValueChange={(value) => setFormData(prev => ({ ...prev, requirement_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="non-functional">Non-Functional</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create {activeTab.slice(0, -1)}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        
        {allowCreate && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {activeTab.slice(0, -1)}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New {activeTab.slice(0, -1)}</DialogTitle>
              </DialogHeader>
              {renderCreateForm()}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="usecases">Use Cases</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="usecases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUseCases.map(item => renderResourceCard(item, 'usecases'))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequirements.map(item => renderResourceCard(item, 'requirements'))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(item => renderResourceCard(item, 'templates'))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceLibraryIntegration;