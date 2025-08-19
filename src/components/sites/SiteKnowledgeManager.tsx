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
  Building, BookOpen, Plus, Upload, FileText, Link, Search, 
  Brain, Zap, Download, Eye, Edit, Trash2, Clock, User,
  File, Image, Code, Database, AlertCircle, CheckCircle,
  TrendingUp, Activity, Network, Shield, FileSearch, Map
} from 'lucide-react';
import { useKnowledgeBase, useCreateKnowledgeEntry, useUploadFiles, useAnalyzeFile, useUploadedFiles } from '@/hooks/useKnowledgeBase';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface SiteKnowledgeManagerProps {
  siteId: string;
  projectId?: string;
}

const SiteKnowledgeManager: React.FC<SiteKnowledgeManagerProps> = ({
  siteId,
  projectId
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: 'site_documentation'
  });

  const { data: knowledgeEntries = [], isLoading, refetch } = useKnowledgeBase(projectId, siteId);
  const { data: uploadedFiles = [], refetch: refetchFiles } = useUploadedFiles(knowledgeEntries[0]?.id);
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
        site_id: siteId,
        title: newEntry.title,
        content: newEntry.content,
        tags: newEntry.tags,
        category: newEntry.category
      });
      
      toast.success('Site knowledge entry created');
      setShowCreateDialog(false);
      setNewEntry({ title: '', content: '', tags: [], category: 'site_documentation' });
      refetch();
    } catch (error) {
      toast.error('Failed to create entry');
    }
  };

  const handleFileUpload = async (files: File[]) => {
    try {
      // Create a knowledge base entry if none exists
      let knowledgeBaseId = knowledgeEntries[0]?.id;
      
      if (!knowledgeBaseId) {
        const entry = await createEntry.mutateAsync({
          project_id: projectId,
          site_id: siteId,
          title: `Site Knowledge Base - ${siteId}`,
          content: 'Central knowledge repository for this site',
          tags: ['site', 'knowledge-base'],
          category: 'site_documentation'
        });
        knowledgeBaseId = entry.id;
      }

      const result = await uploadFiles.mutateAsync({
        files,
        knowledgeBaseId
      });
      
      toast.success(`${files.length} file(s) uploaded successfully`);
      refetch();
      refetchFiles();
      
      // Trigger AI analysis for uploaded files
      for (const file of result.uploadedFiles) {
        setActiveAnalysis(file.id);
        analyzeFile.mutate({
          fileId: file.id,
          criteria: 'site_network_analysis'
        }, {
          onSuccess: () => {
            setActiveAnalysis(null);
            refetchFiles();
          },
          onError: () => {
            setActiveAnalysis(null);
          }
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pcap':
      case 'cap':
        return <Network className="w-4 h-4 text-blue-500" />;
      case 'log':
      case 'txt':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <File className="w-4 h-4 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading site knowledge...</div>
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
            <Building className="w-5 h-5" />
            Site Knowledge & Documentation
          </h3>
          <p className="text-sm text-muted-foreground">
            Site-specific documentation, configurations, and analysis files
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Documentation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Site Documentation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="e.g., Network Configuration, Security Notes"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                    placeholder="Enter documentation content"
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
                    placeholder="configuration, network, security, troubleshooting"
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
                    Create Documentation
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
            placeholder="Search site knowledge..."
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
            <h4 className="font-semibold mb-2">Upload Site Files</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drop network captures, logs, configs, or documentation for this site
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">.pcap (Network Captures)</Badge>
              <Badge variant="outline">.log (System Logs)</Badge>
              <Badge variant="outline">.cfg (Configurations)</Badge>
              <Badge variant="outline">Documents & Images</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="documentation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documentation">
            Documentation ({filteredEntries.length})
          </TabsTrigger>
          <TabsTrigger value="files">
            Files ({uploadedFiles.length})
          </TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="network-map">Network Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="space-y-4">
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
                      <Building className="w-3 h-3" />
                      Site Specific
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
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Documentation Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start documenting site-specific information and configurations
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <Card key={file.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getFileIcon(file.file_name)}
                    {file.file_name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {file.ai_analysis_status === 'completed' && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Analyzed
                      </Badge>
                    )}
                    {file.ai_analysis_status === 'processing' && (
                      <Badge variant="outline" className="text-xs text-blue-600">
                        <Activity className="w-3 h-3 mr-1" />
                        Processing
                      </Badge>
                    )}
                    {activeAnalysis === file.id && (
                      <Badge variant="outline" className="text-xs text-orange-600">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Analyzing...
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <p>Uploaded: {new Date(file.created_at).toLocaleDateString()}</p>
                      <p>Size: {(file.file_size / 1024).toFixed(1)}KB</p>
                    </div>
                    
                    {file.ai_analysis_results && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">AI Analysis Summary:</h5>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {file.ai_analysis_results.summary || 'Analysis completed'}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      {file.ai_analysis_status === 'completed' && (
                        <Button size="sm">
                          <Brain className="w-3 h-3 mr-1" />
                          View Analysis
                        </Button>
                      )}
                      {file.ai_analysis_status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setActiveAnalysis(file.id);
                            analyzeFile.mutate({
                              fileId: file.id,
                              criteria: 'site_network_analysis'
                            });
                          }}
                          disabled={activeAnalysis === file.id}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {uploadedFiles.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <File className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Files Uploaded</h3>
                <p className="text-sm text-muted-foreground">
                  Upload site files for AI analysis and documentation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Site Analysis Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Network className="w-4 h-4 text-blue-500" />
                        Network Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Network topology mapped from PCAP files
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        Security Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Progress value={60} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Security posture and vulnerability analysis
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Network performance and utilization analysis
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload PCAP files, logs, and configuration files to enable comprehensive
                    AI-powered analysis of your site's network infrastructure.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network-map">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Map className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Network Topology Map</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-generated network topology based on uploaded packet captures and configurations
                </p>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload PCAP files to automatically generate an interactive network topology map
                    showing device relationships, traffic flows, and security zones.
                  </AlertDescription>
                </Alert>
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

export default SiteKnowledgeManager;