import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateUseCase } from "@/hooks/useUseCases";
import { useCreateRequirement } from "@/hooks/useRequirements";
import { useCreatePainPoint } from "@/hooks/usePainPoints";
import { useEnhancedAI } from "@/hooks/useEnhancedAI";

export type LibraryType = 'use_case' | 'requirement' | 'pain_point';

interface AIEnhancedLibraryManagerProps {
  type: LibraryType;
  onItemCreated?: (item: any) => void;
  initialData?: Partial<any>;
}

interface FormData {
  name?: string;
  title?: string;
  description?: string;
  category: string;
  complexity?: string;
  priority?: string;
  severity?: string;
  tags: string[];
  industry_specific?: string[];
  recommended_solutions?: string[];
  prerequisites?: string[];
  related_pain_points?: string[];
}

const categoryOptions = {
  use_case: ['authentication', 'byod', 'iot', 'guest_access', 'compliance', 'security', 'network'],
  requirement: ['infrastructure', 'security', 'network', 'monitoring', 'performance', 'compliance'],
  pain_point: ['compliance', 'security', 'performance', 'management', 'cost', 'integration']
};

const AIEnhancedLibraryManager: React.FC<AIEnhancedLibraryManagerProps> = ({
  type,
  onItemCreated,
  initialData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    complexity: initialData?.complexity || 'medium',
    priority: initialData?.priority || 'medium',
    severity: initialData?.severity || 'medium',
    tags: initialData?.tags || [],
    industry_specific: initialData?.industry_specific || [],
    recommended_solutions: initialData?.recommended_solutions || [],
    prerequisites: initialData?.prerequisites || [],
    related_pain_points: initialData?.related_pain_points || []
  });
  const [newTag, setNewTag] = useState('');

  const { toast } = useToast();
  const { generateCompletion } = useEnhancedAI();
  const createUseCase = useCreateUseCase();
  const createRequirement = useCreateRequirement();
  const createPainPoint = useCreatePainPoint();

  const handleAIEnhance = async () => {
    if (!formData.name && !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name or title before AI enhancement.",
        variant: "destructive"
      });
      return;
    }

    setIsAIEnhancing(true);
    
    try {
      const prompt = `Enhance this ${type.replace('_', ' ')} for network access control and authentication:
        
${type === 'use_case' ? 'Name' : 'Title'}: ${formData.name || formData.title}
Description: ${formData.description}
Category: ${formData.category}

Please provide:
1. Enhanced description (2-3 sentences)
2. Relevant tags (5-7 tags)
3. Industry applications
4. ${type === 'pain_point' ? 'Recommended solutions' : type === 'requirement' ? 'Prerequisites' : 'Technical requirements'}
5. ${type === 'use_case' ? 'Business value and complexity assessment' : 'Implementation considerations'}

Format as JSON with fields: description, tags, industry_specific, ${type === 'pain_point' ? 'recommended_solutions' : 'prerequisites'}, additional_notes`;

      const response = await generateCompletion({
        prompt,
        taskType: 'analysis',
        context: `Enhancing ${type} for NAC/authentication library`
      });

      try {
        const enhanced = JSON.parse(response.content);
        
        setFormData(prev => ({
          ...prev,
          description: enhanced.description || prev.description,
          tags: enhanced.tags || prev.tags,
          industry_specific: enhanced.industry_specific || prev.industry_specific,
          recommended_solutions: enhanced.recommended_solutions || prev.recommended_solutions,
          prerequisites: enhanced.prerequisites || prev.prerequisites
        }));

        toast({
          title: "AI Enhancement Complete",
          description: "Your item has been enhanced with AI-generated content."
        });
      } catch (parseError) {
        toast({
          title: "Enhancement Applied",
          description: "AI suggestions applied manually due to formatting."
        });
      }
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance with AI. Please continue manually.",
        variant: "destructive"
      });
    } finally {
      setIsAIEnhancing(false);
    }
  };

  const handleSubmit = async () => {
    const requiredField = type === 'use_case' ? 'name' : 'title';
    if (!formData[requiredField] || !formData.category) {
      toast({
        title: "Missing Required Fields",
        description: `Please provide ${requiredField} and category.`,
        variant: "destructive"
      });
      return;
    }

    try {
      let createdItem;
      
      if (type === 'use_case') {
        createdItem = await createUseCase.mutateAsync({
          name: formData.name!,
          description: formData.description || '',
          category: formData.category,
          complexity: formData.complexity as any,
          tags: formData.tags || [],
          business_value: 'Enhanced through AI optimization',
          status: 'active',
          technical_requirements: formData.prerequisites || [],
          prerequisites: [],
          test_scenarios: [],
          supported_vendors: [],
          portnox_features: [],
          dependencies: [],
          authentication_methods: [],
          deployment_scenarios: []
        });
      } else if (type === 'requirement') {
        createdItem = await createRequirement.mutateAsync({
          title: formData.title!,
          description: formData.description || '',
          category: formData.category,
          priority: formData.priority as any,
          tags: formData.tags || [],
          requirement_type: 'functional',
          status: 'draft',
          acceptance_criteria: [],
          verification_methods: [],
          test_cases: [],
          related_use_cases: [],
          dependencies: [],
          assumptions: [],
          constraints: [],
          vendor_requirements: {},
          portnox_features: [],
          documentation_references: []
        });
      } else {
        createdItem = await createPainPoint.mutateAsync({
          title: formData.title!,
          description: formData.description,
          category: formData.category,
          severity: formData.severity as any,
          recommended_solutions: formData.recommended_solutions,
          industry_specific: formData.industry_specific
        });
      }

      onItemCreated?.(createdItem);
      setIsOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        title: '',
        description: '',
        category: '',
        complexity: 'medium',
        priority: 'medium',
        severity: 'medium',
        tags: [],
        industry_specific: [],
        recommended_solutions: [],
        prerequisites: [],
        related_pain_points: []
      });
    } catch (error) {
      // Error handling is done by the mutation hooks
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create New {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Add a new item to your library with AI enhancement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            {type === 'use_case' ? 'Name' : 'Title'} *
          </label>
          <Input
            value={formData.name || formData.title || ''}
            onChange={(e) => setFormData(prev => 
              type === 'use_case' 
                ? { ...prev, name: e.target.value }
                : { ...prev, title: e.target.value }
            )}
            placeholder={`Enter ${type === 'use_case' ? 'name' : 'title'}...`}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Category *</label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions[type].map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the item..."
            rows={3}
          />
        </div>

        {type === 'use_case' && (
          <div>
            <label className="text-sm font-medium">Complexity</label>
            <Select 
              value={formData.complexity} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, complexity: value }))}
            >
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

        {type === 'requirement' && (
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {type === 'pain_point' && (
          <div>
            <label className="text-sm font-medium">Severity</label>
            <Select 
              value={formData.severity} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <Button onClick={addTag} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1">×</button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleAIEnhance}
            variant="outline"
            disabled={isAIEnhancing}
            className="flex-1"
          >
            {isAIEnhancing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Enhance
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createUseCase.isPending || createRequirement.isPending || createPainPoint.isPending}
            className="flex-1"
          >
            Create Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIEnhancedLibraryManager;