import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useCreateIndustryOption,
  useCreateComplianceFramework,
  useCreateDeploymentType,
  useCreateSecurityLevel,
  useCreateBusinessDomain,
  useCreateAuthenticationMethod,
  useCreateNetworkSegment
} from '@/hooks/useResourceLibrary';
import { useCreateUnifiedVendor } from '@/hooks/useUnifiedVendors';
import { useCreateUseCase } from '@/hooks/useUseCases';
import { useCreateRequirement } from '@/hooks/useRequirements';

interface ResourceCreationDialogProps {
  resourceType: 'industry' | 'compliance' | 'deployment' | 'security' | 'business' | 'authentication' | 'network' | 'vendor' | 'usecase' | 'requirement';
  onResourceCreated?: (resource: any) => void;
  children: React.ReactNode;
}

export const ResourceCreationDialog: React.FC<ResourceCreationDialogProps> = ({
  resourceType,
  onResourceCreated,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Mutation hooks
  const createIndustryMutation = useCreateIndustryOption();
  const createComplianceMutation = useCreateComplianceFramework();
  const createDeploymentMutation = useCreateDeploymentType();
  const createSecurityMutation = useCreateSecurityLevel();
  const createBusinessMutation = useCreateBusinessDomain();
  const createAuthMutation = useCreateAuthenticationMethod();
  const createNetworkMutation = useCreateNetworkSegment();
  const createVendorMutation = useCreateUnifiedVendor();
  const createUseCaseMutation = useCreateUseCase();
  const createRequirementMutation = useCreateRequirement();

  // Form states
  const [formData, setFormData] = useState<any>({
    name: '',
    title: '',
    description: '',
    category: '',
    vendor_type: '',
    method_type: '',
    segment_type: '',
    complexity_level: 'medium',
    priority: 'medium',
    security_level: 'medium',
    portnox_integration_level: 'supported',
    support_level: 'full',
    status: 'active',
    requirements: [],
    industry_specific: [],
    typical_use_cases: [],
    industry_alignment: [],
    vendor_support: [],
    documentation_links: [],
    portnox_integration: {},
    security_requirements: [],
    vendor_considerations: [],
    tags: []
  });

  const [arrayInputs, setArrayInputs] = useState<{ [key: string]: string }>({
    requirements: '',
    industry_specific: '',
    typical_use_cases: '',
    industry_alignment: '',
    vendor_support: '',
    security_requirements: '',
    vendor_considerations: '',
    tags: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      category: '',
      vendor_type: '',
      method_type: '',
      segment_type: '',
      complexity_level: 'medium',
      priority: 'medium',
      security_level: 'medium',
      portnox_integration_level: 'supported',
      support_level: 'full',
      status: 'active',
      requirements: [],
      industry_specific: [],
      typical_use_cases: [],
      industry_alignment: [],
      vendor_support: [],
      documentation_links: [],
      portnox_integration: {},
      security_requirements: [],
      vendor_considerations: [],
      tags: []
    });
    setArrayInputs({
      requirements: '',
      industry_specific: '',
      typical_use_cases: '',
      industry_alignment: '',
      vendor_support: '',
      security_requirements: '',
      vendor_considerations: '',
      tags: ''
    });
  };

  const addArrayItem = (field: string) => {
    const value = arrayInputs[field]?.trim();
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
      setArrayInputs(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const renderArrayField = (field: string, label: string, placeholder: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={arrayInputs[field] || ''}
          onChange={(e) => setArrayInputs(prev => ({ ...prev, [field]: e.target.value }))}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addArrayItem(field);
            }
          }}
        />
        <Button type="button" size="sm" onClick={() => addArrayItem(field)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {formData[field]?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {formData[field].map((item: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      let result;
      switch (resourceType) {
        case 'industry':
          result = await createIndustryMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            category: formData.category
          });
          break;
        case 'compliance':
          result = await createComplianceMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            requirements: formData.requirements,
            industry_specific: formData.industry_specific
          });
          break;
        case 'deployment':
          result = await createDeploymentMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            complexity_level: formData.complexity_level,
            typical_timeline: formData.typical_timeline,
            requirements: formData.requirements
          });
          break;
        case 'security':
          result = await createSecurityMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            requirements: formData.requirements,
            compliance_mappings: formData.compliance_mappings
          });
          break;
        case 'business':
          result = await createBusinessMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            typical_use_cases: formData.typical_use_cases,
            industry_alignment: formData.industry_alignment
          });
          break;
        case 'authentication':
          result = await createAuthMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            method_type: formData.method_type,
            security_level: formData.security_level,
            vendor_support: formData.vendor_support,
            configuration_complexity: formData.complexity_level,
            documentation_links: formData.documentation_links,
            portnox_integration: formData.portnox_integration
          });
          break;
        case 'network':
          result = await createNetworkMutation.mutateAsync({
            name: formData.name,
            segment_type: formData.segment_type,
            description: formData.description,
            typical_size_range: formData.typical_size_range,
            security_requirements: formData.security_requirements,
            vendor_considerations: formData.vendor_considerations
          });
          break;
        case 'vendor':
          result = await createVendorMutation.mutateAsync({
            name: formData.name,
            subcategory: formData.vendor_type,
            category: formData.category,
            description: formData.description,
            portnox_integration_level: formData.portnox_integration_level,
            support_level: formData.support_level,
            status: formData.status
          });
          break;
        case 'usecase':
          result = await createUseCaseMutation.mutateAsync({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            technical_requirements: [],
            prerequisites: [],
            test_scenarios: [],
            supported_vendors: [],
            portnox_features: [],
            complexity: formData.complexity_level,
            dependencies: [],
            authentication_methods: [],
            deployment_scenarios: [],
            tags: formData.tags,
            status: 'active'
          });
          break;
        case 'requirement':
          result = await createRequirementMutation.mutateAsync({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            priority: formData.priority,
            requirement_type: 'functional',
            acceptance_criteria: [],
            verification_methods: [],
            test_cases: [],
            related_use_cases: [],
            dependencies: [],
            assumptions: [],
            constraints: [],
            vendor_requirements: {},
            portnox_features: [],
            documentation_references: [],
            tags: formData.tags,
            status: 'draft'
          });
          break;
      }

      setOpen(false);
      resetForm();
      onResourceCreated?.(result);
      
      toast({
        title: "Resource Created",
        description: `New ${resourceType} has been added to the library`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${resourceType}`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getResourceTitle = () => {
    const titles = {
      industry: 'Industry Option',
      compliance: 'Compliance Framework',
      deployment: 'Deployment Type',
      security: 'Security Level',
      business: 'Business Domain',
      authentication: 'Authentication Method',
      network: 'Network Segment',
      vendor: 'Vendor',
      usecase: 'Use Case',
      requirement: 'Requirement'
    };
    return titles[resourceType] || 'Resource';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {getResourceTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>
                {resourceType === 'vendor' ? 'Vendor Name' : 
                 resourceType === 'requirement' ? 'Title' : 'Name'}
              </Label>
              <Input
                value={resourceType === 'vendor' ? formData.name : 
                       resourceType === 'requirement' ? formData.title : formData.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  [resourceType === 'vendor' ? 'name' : 
                    resourceType === 'requirement' ? 'title' : 'name']: e.target.value 
                }))}
                placeholder={`Enter ${resourceType === 'vendor' ? 'vendor name' : 
                               resourceType === 'requirement' ? 'title' : 'name'}`}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            {(resourceType === 'vendor' || resourceType === 'usecase' || resourceType === 'requirement' || resourceType === 'industry') && (
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>
            )}

            {resourceType === 'vendor' && (
              <div>
                <Label>Vendor Type</Label>
                <Input
                  value={formData.vendor_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor_type: e.target.value }))}
                  placeholder="e.g., Network Access Control"
                />
              </div>
            )}

            {resourceType === 'authentication' && (
              <div>
                <Label>Method Type</Label>
                <Input
                  value={formData.method_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, method_type: e.target.value }))}
                  placeholder="e.g., 802.1X, Certificate-based"
                />
              </div>
            )}

            {resourceType === 'network' && (
              <div>
                <Label>Segment Type</Label>
                <Input
                  value={formData.segment_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, segment_type: e.target.value }))}
                  placeholder="e.g., VLAN, Subnet"
                />
              </div>
            )}

            {['deployment', 'usecase', 'requirement', 'authentication'].includes(resourceType) && (
              <div>
                <Label>Complexity Level</Label>
                <Select value={formData.complexity_level} onValueChange={(value) => setFormData(prev => ({ ...prev, complexity_level: value }))}>
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
            )}

            {resourceType === 'requirement' && (
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
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
            )}

            {resourceType === 'vendor' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Support Level</Label>
                  <Select value={formData.support_level} onValueChange={(value) => setFormData(prev => ({ ...prev, support_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Support</SelectItem>
                      <SelectItem value="partial">Partial Support</SelectItem>
                      <SelectItem value="limited">Limited Support</SelectItem>
                      <SelectItem value="none">No Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Portnox Integration</Label>
                  <Select value={formData.portnox_integration_level} onValueChange={(value) => setFormData(prev => ({ ...prev, portnox_integration_level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="certified">Certified</SelectItem>
                      <SelectItem value="supported">Supported</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {['compliance', 'deployment', 'security'].includes(resourceType) && 
              renderArrayField('requirements', 'Requirements', 'Add requirement')}

            {['compliance'].includes(resourceType) && 
              renderArrayField('industry_specific', 'Industry Specific', 'Add industry')}

            {['business'].includes(resourceType) && (
              <>
                {renderArrayField('typical_use_cases', 'Typical Use Cases', 'Add use case')}
                {renderArrayField('industry_alignment', 'Industry Alignment', 'Add industry')}
              </>
            )}

            {['authentication'].includes(resourceType) && 
              renderArrayField('vendor_support', 'Vendor Support', 'Add vendor')}

            {['network'].includes(resourceType) && (
              <>
                {renderArrayField('security_requirements', 'Security Requirements', 'Add security requirement')}
                {renderArrayField('vendor_considerations', 'Vendor Considerations', 'Add consideration')}
              </>
            )}

            {['usecase', 'requirement'].includes(resourceType) && 
              renderArrayField('tags', 'Tags', 'Add tag')}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={isCreating || !(formData.name || formData.name || formData.title)}
            >
              {isCreating ? 'Creating...' : `Create ${getResourceTitle()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};