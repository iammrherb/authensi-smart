import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Plus, X } from 'lucide-react';
import { useCreateRequirement, useBulkImportRequirements } from '@/hooks/useRequirements';

const requirementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  requirement_type: z.string().min(1, 'Requirement type is required'),
  description: z.string().optional(),
  rationale: z.string().optional(),
  status: z.enum(['draft', 'under-review', 'approved', 'deprecated']).default('draft'),
});

type RequirementFormData = z.infer<typeof requirementSchema>;

interface RequirementImportFormProps {
  bulk?: boolean;
  onSuccess?: () => void;
}

export const RequirementImportForm: React.FC<RequirementImportFormProps> = ({ bulk = false, onSuccess }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([]);
  const [currentCriterion, setCurrentCriterion] = useState('');
  const [fileContent, setFileContent] = useState<string>('');

  const createRequirement = useCreateRequirement();
  const bulkImport = useBulkImportRequirements();

  const form = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      priority: 'medium',
      status: 'draft',
    },
  });

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCriterion = () => {
    if (currentCriterion.trim() && !acceptanceCriteria.includes(currentCriterion.trim())) {
      setAcceptanceCriteria([...acceptanceCriteria, currentCriterion.trim()]);
      setCurrentCriterion('');
    }
  };

  const removeCriterion = (criterionToRemove: string) => {
    setAcceptanceCriteria(acceptanceCriteria.filter(criterion => criterion !== criterionToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const processBulkImport = () => {
    try {
      let data;
      if (fileContent.trim().startsWith('[')) {
        // JSON format
        data = JSON.parse(fileContent);
      } else {
        // CSV format - simple parsing
        const lines = fileContent.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
      }

      // Validate and transform data
      const requirements = data.map((item: any) => ({
        title: item.title || item.name,
        category: item.category || 'General',
        subcategory: item.subcategory,
        priority: item.priority || 'medium',
        requirement_type: item.requirement_type || item.type || 'functional',
        description: item.description,
        rationale: item.rationale,
        status: item.status || 'draft',
        acceptance_criteria: item.acceptance_criteria ? JSON.parse(item.acceptance_criteria) : [],
        verification_methods: [],
        test_cases: [],
        related_use_cases: [],
        dependencies: [],
        assumptions: [],
        constraints: [],
        compliance_frameworks: item.compliance_frameworks ? item.compliance_frameworks.split(';') : [],
        vendor_requirements: {},
        portnox_features: [],
        documentation_references: [],
        tags: item.tags ? item.tags.split(';') : [],
      }));

      bulkImport.mutate(requirements, {
        onSuccess: () => {
          setFileContent('');
          onSuccess?.();
        }
      });
    } catch (error) {
      console.error('Error parsing bulk import data:', error);
    }
  };

  const onSubmit = (data: RequirementFormData) => {
    const requirement = {
      title: data.title,
      category: data.category,
      subcategory: data.subcategory,
      priority: data.priority,
      requirement_type: data.requirement_type,
      description: data.description,
      rationale: data.rationale,
      status: data.status,
      acceptance_criteria: acceptanceCriteria.map(criterion => ({ criterion })),
      verification_methods: [],
      test_cases: [],
      related_use_cases: [],
      dependencies: [],
      assumptions: [],
      constraints: [],
      compliance_frameworks: [],
      vendor_requirements: {},
      portnox_features: [],
      documentation_references: [],
      tags: tags,
    };

    createRequirement.mutate(requirement, {
      onSuccess: () => {
        form.reset();
        setTags([]);
        setAcceptanceCriteria([]);
        onSuccess?.();
      }
    });
  };

  if (bulk) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File (JSON or CSV)</label>
          <Input
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
          />
        </div>
        
        {fileContent && (
          <div className="space-y-2">
            <label className="text-sm font-medium">File Content Preview</label>
            <Textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />
          </div>
        )}
        
        <Button 
          onClick={processBulkImport}
          disabled={!fileContent || bulkImport.isPending}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {bulkImport.isPending ? 'Importing...' : 'Import Requirements'}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter requirement title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requirement_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="usability">Usability</SelectItem>
                    <SelectItem value="reliability">Reliability</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter requirement description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rationale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rationale</FormLabel>
              <FormControl>
                <Textarea placeholder="Explain why this requirement is necessary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Acceptance Criteria Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Acceptance Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add acceptance criterion"
                value={currentCriterion}
                onChange={(e) => setCurrentCriterion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
              />
              <Button type="button" onClick={addCriterion} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {acceptanceCriteria.length > 0 && (
              <div className="space-y-2">
                {acceptanceCriteria.map((criterion) => (
                  <Badge key={criterion} variant="outline" className="flex items-center justify-between w-full p-2">
                    <span className="flex-1 text-left">{criterion}</span>
                    <X className="h-3 w-3 cursor-pointer ml-2" onClick={() => removeCriterion(criterion)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={createRequirement.isPending} className="w-full">
          {createRequirement.isPending ? 'Creating...' : 'Create Requirement'}
        </Button>
      </form>
    </Form>
  );
};