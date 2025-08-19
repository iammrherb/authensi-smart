import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeBaseEntry {
  id: string;
  project_id: string;
  site_id?: string;
  title: string;
  content?: string;
  content_type: string;
  category: string;
  tags: string[];
  file_attachments: any[];
  external_links: any[];
  ai_analysis_results: Record<string, any>;
  priority_level: string;
  is_ai_enhanced: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_ai_analysis?: string;
  metadata: Record<string, any>;
}

export interface UploadedFile {
  id: string;
  knowledge_base_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  mime_type?: string;
  upload_status: string;
  ai_analysis_status: string;
  ai_analysis_results: Record<string, any>;
  extracted_content?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = (projectId?: string, siteId?: string) => {
  return useQuery({
    queryKey: ['knowledge-base', projectId, siteId],
    queryFn: async () => {
      let query = supabase
        .from('project_knowledge_base')
        .select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as KnowledgeBaseEntry[];
    },
    enabled: !!(projectId || siteId),
  });
};

export const useCreateKnowledgeEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (entry: Omit<KnowledgeBaseEntry, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('project_knowledge_base')
        .insert([{
          ...entry,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast({
        title: "Success",
        description: "Knowledge base entry created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create knowledge base entry: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateKnowledgeEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KnowledgeBaseEntry> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_knowledge_base')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base'] });
      toast({
        title: "Success",
        description: "Knowledge base entry updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update knowledge base entry: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ files, knowledgeBaseId }: { files: File[]; knowledgeBaseId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const uploadPromises = files.map(async (file) => {
        // Upload to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `knowledge-base/${knowledgeBaseId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('config-templates')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create file record
        const { data, error } = await supabase
          .from('uploaded_files')
          .insert([{
            knowledge_base_id: knowledgeBaseId,
            file_name: file.name,
            file_type: fileExt || 'unknown',
            file_size: file.size,
            storage_path: filePath,
            mime_type: file.type,
            created_by: user.id,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to upload files: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadedFiles = (knowledgeBaseId?: string) => {
  return useQuery({
    queryKey: ['uploaded-files', knowledgeBaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('knowledge_base_id', knowledgeBaseId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UploadedFile[];
    },
    enabled: !!knowledgeBaseId,
  });
};

export const useAnalyzeFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ fileId, analysisCriteria }: { fileId: string; analysisCriteria: Record<string, any> }) => {
      const { data, error } = await supabase.functions.invoke('ai-completion', {
        body: {
          task: 'file_analysis',
          fileId,
          analysisCriteria,
          prompt: `
# FILE ANALYSIS REQUEST

## ANALYSIS CRITERIA
${Object.entries(analysisCriteria).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

## INSTRUCTIONS
Please analyze the uploaded file and provide:

### 1. CONTENT SUMMARY
• High-level overview of file contents
• Key information and data points
• Structure and organization

### 2. TECHNICAL ANALYSIS
• Technical specifications identified
• Configuration parameters
• Version information and compatibility

### 3. SECURITY ASSESSMENT
• Security-related configurations
• Potential vulnerabilities or concerns
• Best practice compliance

### 4. TROUBLESHOOTING INSIGHTS
• Common issues that might arise
• Diagnostic information present
• Recommended monitoring points

### 5. ACTIONABLE RECOMMENDATIONS
• Immediate actions required
• Optimization opportunities
• Integration considerations

### 6. KNOWLEDGE EXTRACTION
• Key learnings from the file
• Important reference information
• Documentation that should be created

Provide detailed, structured analysis with specific technical insights.
          `
        }
      });

      if (error) throw error;

      // Update file with analysis results
      const { error: updateError } = await supabase
        .from('uploaded_files')
        .update({
          ai_analysis_status: 'completed',
          ai_analysis_results: data
        })
        .eq('id', fileId);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploaded-files'] });
      toast({
        title: "Success",
        description: "File analysis completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to analyze file: " + error.message,
        variant: "destructive",
      });
    },
  });
};