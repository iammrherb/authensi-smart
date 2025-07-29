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
import { useCreateUseCase, useBulkImportUseCases } from '@/hooks/useUseCases';

const useCaseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  business_value: z.string().optional(),
  complexity: z.enum(['low', 'medium', 'high']),
  estimated_effort_weeks: z.number().optional(),
  status: z.enum(['active', 'deprecated', 'draft']).default('active'),
});

type UseCaseFormData = z.infer<typeof useCaseSchema>;

interface UseCaseImportFormProps {
  bulk?: boolean;
  onSuccess?: () => void;
}

export const UseCaseImportForm: React.FC<UseCaseImportFormProps> = ({ bulk = false, onSuccess }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [fileContent, setFileContent] = useState<string>('');

  const createUseCase = useCreateUseCase();
  const bulkImport = useBulkImportUseCases();

  const form = useForm<UseCaseFormData>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: {
      complexity: 'medium',
      status: 'active',
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

  const addPrerequisite = () => {
    if (currentPrerequisite.trim() && !prerequisites.includes(currentPrerequisite.trim())) {
      setPrerequisites([...prerequisites, currentPrerequisite.trim()]);
      setCurrentPrerequisite('');
    }
  };

  const removePrerequisite = (prereqToRemove: string) => {
    setPrerequisites(prerequisites.filter(prereq => prereq !== prereqToRemove));
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
      const useCases = data.map((item: any) => ({
        name: item.name || item.title,
        category: item.category || 'General',
        subcategory: item.subcategory,
        description: item.description,
        business_value: item.business_value,
        complexity: item.complexity || 'medium',
        estimated_effort_weeks: item.estimated_effort_weeks ? parseInt(item.estimated_effort_weeks) : undefined,
        status: item.status || 'active',
        technical_requirements: item.technical_requirements ? JSON.parse(item.technical_requirements) : [],
        prerequisites: item.prerequisites ? JSON.parse(item.prerequisites) : [],
        test_scenarios: [],
        supported_vendors: [],
        portnox_features: [],
        dependencies: [],
        authentication_methods: [],
        deployment_scenarios: [],
        tags: item.tags ? item.tags.split(';') : [],
      }));

      bulkImport.mutate(useCases, {
        onSuccess: () => {
          setFileContent('');
          onSuccess?.();
        }
      });
    } catch (error) {
      console.error('Error parsing bulk import data:', error);
    }
  };

  const onSubmit = (data: UseCaseFormData) => {
    const useCase = {
      name: data.name,
      category: data.category,
      subcategory: data.subcategory,
      description: data.description,
      business_value: data.business_value,
      complexity: data.complexity,
      status: data.status,
      estimated_effort_weeks: data.estimated_effort_weeks || undefined,
      technical_requirements: [],
      prerequisites: prerequisites.map(p => ({ requirement: p })),
      test_scenarios: [],
      supported_vendors: [],
      portnox_features: [],
      dependencies: [],
      compliance_frameworks: [],
      authentication_methods: [],
      deployment_scenarios: [],
      tags: tags,
    };

    createUseCase.mutate(useCase, {
      onSuccess: () => {
        form.reset();
        setTags([]);
        setPrerequisites([]);
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
          {bulkImport.isPending ? 'Importing...' : 'Import Use Cases'}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter use case name" {...field} />
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
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Network Access">Network Access</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
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
            name="complexity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complexity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimated_effort_weeks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Effort (Weeks)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter weeks"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
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
                <Textarea placeholder="Enter use case description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Value</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the business value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Prerequisites Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Prerequisites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Add prerequisite"
                value={currentPrerequisite}
                onChange={(e) => setCurrentPrerequisite(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
              />
              <Button type="button" onClick={addPrerequisite} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="outline" className="flex items-center gap-1">
                    {prereq}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removePrerequisite(prereq)} />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={createUseCase.isPending} className="w-full">
          {createUseCase.isPending ? 'Creating...' : 'Create Use Case'}
        </Button>
      </form>
    </Form>
  );
};