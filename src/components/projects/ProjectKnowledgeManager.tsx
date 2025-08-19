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
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Plus, Upload, FileText, Link, Search, Filter,
  Brain, Zap, Download, Eye, Edit, Trash2, Clock, User,
  File, Image, Code, Database, AlertCircle, CheckCircle,
  TrendingUp, Activity, Network, Shield, FileSearch
} from 'lucide-react';
import { useKnowledgeBase, useCreateKnowledgeEntry, useUploadFiles, useAnalyzeFile } from '@/hooks/useKnowledgeBase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface ProjectKnowledgeManagerProps {
  projectId: string;
}

const ProjectKnowledgeManager: React.FC<ProjectKnowledgeManagerProps> = ({
  projectId
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: 'documentation'
  });

  const { data: knowledgeEntries = [], isLoading, refetch } = useKnowledgeBase(projectId);
  const createEntry = useCreateKnowledgeEntry();
  const uploadFiles = useUploadFiles();
  const analyzeFile = useAnalyzeFile();

  // Filter entries
  const filteredEntries = knowledgeEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || entry.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = [...new Set(knowledgeEntries.flatMap(entry => entry.tags || []))];

  const handleCreateEntry = async () => {
    try {
      await createEntry.mutateAsync({
        project_id: projectId,
        title: newEntry.title,
        content: newEntry.content,
        tags: newEntry.tags,
        category: newEntry.category,
        metadata: {},
        content_type: 'text/plain',
        ai_analysis_results: null,
        external_links: [],
        version: 1,
        is_public: false
      });
      
      toast.success('Knowledge entry created');
      setShowCreateDialog(false);
      setNewEntry({ title: '', content: '', tags: [], category: 'documentation' });
      refetch();
    } catch (error) {
      toast.error('Failed to create entry');
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      const result = await uploadFiles.mutateAsync({
        files,
        knowledgeBaseId: knowledgeEntries[0]?.id // You might want to create a default knowledge base entry
      });
      
      toast.success(`${files.length} file(s) uploaded successfully`);
      refetch();
      
      // Trigger AI analysis for uploaded files
      for (const file of result.uploadedFiles) {
        analyzeFile.mutate({
          fileId: file.id,
          criteria: 'network_security_analysis'
        });
      }
    } catch (error) {
      toast.error('Failed to upload files');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'text/*': ['.txt', '.log', '.pcap', '.cap'],
      'application/*': ['.pdf', '.doc', '.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading knowledge base...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Project Knowledge Base
          </h3>
          <p className="text-sm text-muted-foreground">
            Centralized documentation, notes, and file analysis for the project
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Knowledge Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="Enter entry title"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    placeholder="Enter entry content"
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    onChange={(e) => setNewEntry({ 
                      ...newEntry, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    placeholder="security, configuration, documentation"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateEntry}
                    disabled={createEntry.isPending || !newEntry.title}
                  >
                    Create Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-semibold mb-2">Upload Files for Analysis</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drop PCAP files, logs, documentation, or images here for AI analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">.pcap/.cap</Badge>
              <Badge variant="outline">.log/.txt</Badge>
              <Badge variant="outline">.pdf/.doc</Badge>
              <Badge variant="outline">images</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Entries */}
      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">
            Knowledge Entries ({filteredEntries.length})
          </TabsTrigger>
          <TabsTrigger value="files">Uploaded Files</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="insights">Project Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {entry.title}
                  </CardTitle>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Owner
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEntry(entry)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Knowledge Entries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start building your project knowledge base
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <File className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Uploaded Files</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage uploaded files and their analysis status
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analysis Results
                  </h4>
                  <Badge variant="outline">
                    <Activity className="w-3 h-3 mr-1" />
                    Auto-Analysis Enabled
                  </Badge>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload files to see AI-powered analysis results including security insights,
                    configuration recommendations, and network topology analysis.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        Security Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        Automated security assessment of uploaded files
                      </p>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        No files analyzed yet
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Network className="w-4 h-4 text-blue-500" />
                        Network Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        Network topology and traffic pattern analysis
                      </p>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        No network data processed
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Project Insights</h3>
                <p className="text-sm text-muted-foreground">
                  AI-generated insights and recommendations based on your project knowledge base
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Knowledge Entry Viewer */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedEntry.title}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
                  </div>
                  <div className="border-t pt-4 text-sm text-muted-foreground">
                    <p>Created: {new Date(selectedEntry.created_at).toLocaleString()}</p>
                    {selectedEntry.updated_at !== selectedEntry.created_at && (
                      <p>Updated: {new Date(selectedEntry.updated_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectKnowledgeManager;