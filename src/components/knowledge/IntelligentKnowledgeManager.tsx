import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain,
  FileText, 
  Upload, 
  Link, 
  Search, 
  Plus, 
  Eye,
  Edit,
  Download,
  Trash2,
  Wand2,
  Activity,
  FileCode,
  FileImage,
  FileCog,
  AlertTriangle,
  CheckCircle,
  Clock,
  Tag,
  Database,
  Network,
  Shield,
  Settings,
  Target,
  Zap,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useKnowledgeBase, useCreateKnowledgeEntry, useUploadFiles, useAnalyzeFile, useUploadedFiles } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/use-toast';
import CodeBlock from '@/components/ui/code-block';

interface IntelligentKnowledgeManagerProps {
  projectId?: string;
  siteId?: string;
  showAIFeatures?: boolean;
}

const IntelligentKnowledgeManager: React.FC<IntelligentKnowledgeManagerProps> = ({
  projectId,
  siteId,
  showAIFeatures = true
}) => {
  const { data: knowledgeEntries } = useKnowledgeBase(projectId, siteId);
  const createEntry = useCreateKnowledgeEntry();
  const uploadFiles = useUploadFiles();
  const analyzeFile = useAnalyzeFile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState('notes');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priority: 'all',
    contentType: 'all'
  });

  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    content_type: 'note',
    category: 'general',
    tags: [],
    priority_level: 'medium',
    external_links: [],
    metadata: {}
  });

  const contentTypeIcons = {
    note: FileText,
    documentation: BookOpen,
    troubleshooting: AlertTriangle,
    configuration: Settings,
    analysis: Brain,
    log: Activity,
    pcap: Network,
    script: FileCode
  };

  const categoryColors = {
    general: 'bg-gray-100 text-gray-800',
    network: 'bg-blue-100 text-blue-800',
    security: 'bg-red-100 text-red-800',
    configuration: 'bg-green-100 text-green-800',
    troubleshooting: 'bg-yellow-100 text-yellow-800',
    documentation: 'bg-purple-100 text-purple-800',
    analysis: 'bg-indigo-100 text-indigo-800'
  };

  const filteredEntries = knowledgeEntries?.filter(entry => {
    if (filters.search && !entry.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category !== 'all' && entry.category !== filters.category) {
      return false;
    }
    if (filters.priority !== 'all' && entry.priority_level !== filters.priority) {
      return false;
    }
    if (filters.contentType !== 'all' && entry.content_type !== filters.contentType) {
      return false;
    }
    return true;
  });

  const handleCreateEntry = async () => {
    if (!projectId && !siteId) {
      toast({
        title: "Error",
        description: "Project or Site ID required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createEntry.mutateAsync({
        ...newEntry,
        project_id: projectId!,
        site_id: siteId,
        file_attachments: [],
        ai_analysis_results: {},
        is_ai_enhanced: false
      });
      setIsCreating(false);
      setNewEntry({
        title: '',
        content: '',
        content_type: 'note',
        category: 'general',
        tags: [],
        priority_level: 'medium',
        external_links: [],
        metadata: {}
      });
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const handleFileUpload = async (knowledgeBaseId: string) => {
    if (!fileInputRef.current?.files?.length) return;

    const files = Array.from(fileInputRef.current.files);
    try {
      await uploadFiles.mutateAsync({ files, knowledgeBaseId });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
    }
  };

  const handleAnalyzeWithAI = async (entryId: string, analysisType: string) => {
    const analysisCriteria = {
      type: analysisType,
      focus: analysisType === 'security' ? 'vulnerabilities and threats' :
             analysisType === 'performance' ? 'bottlenecks and optimization' :
             analysisType === 'troubleshooting' ? 'issues and solutions' :
             'general technical analysis',
      depth: 'comprehensive'
    };

    try {
      await analyzeFile.mutateAsync({
        fileId: entryId,
        analysisCriteria
      });
    } catch (error) {
      console.error('Failed to analyze with AI:', error);
    }
  };

  const renderEntryCard = (entry: any) => {
    const IconComponent = contentTypeIcons[entry.content_type as keyof typeof contentTypeIcons] || FileText;
    
    return (
      <Card key={entry.id} className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-muted rounded-lg">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-1">{entry.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Badge className={categoryColors[entry.category as keyof typeof categoryColors] || categoryColors.general}>
                    {entry.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {entry.content_type}
                  </Badge>
                  {entry.is_ai_enhanced && (
                    <Badge variant="secondary" className="text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Enhanced
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
            <Badge variant={
              entry.priority_level === 'high' ? 'destructive' :
              entry.priority_level === 'medium' ? 'default' : 'secondary'
            }>
              {entry.priority_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.content && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {entry.content}
            </p>
          )}
          
          {entry.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
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

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(entry.updated_at).toLocaleDateString()}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setSelectedEntry(entry)}>
                <Eye className="w-3 h-3" />
              </Button>
              {showAIFeatures && (
                <Button size="sm" variant="outline" onClick={() => handleAnalyzeWithAI(entry.id, 'general')}>
                  <Brain className="w-3 h-3" />
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Intelligent Knowledge Manager</h2>
          <p className="text-muted-foreground">
            AI-enhanced documentation and file analysis for comprehensive project knowledge
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".txt,.log,.pcap,.cfg,.conf,.json,.xml,.csv"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* AI Features Banner */}
      {showAIFeatures && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            AI-powered analysis available for uploaded files including PCAPs, logs, and configuration files.
            Get detailed technical insights, security assessments, and troubleshooting recommendations.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="configuration">Configuration</SelectItem>
            <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.contentType} onValueChange={(value) => setFilters({ ...filters, contentType: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
            <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
            <SelectItem value="configuration">Configuration</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="log">Logs</SelectItem>
            <SelectItem value="pcap">PCAP Files</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Knowledge Base Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">
            <FileText className="w-4 h-4 mr-2" />
            Notes & Docs
          </TabsTrigger>
          <TabsTrigger value="files">
            <Upload className="w-4 h-4 mr-2" />
            Uploaded Files
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="links">
            <Link className="w-4 h-4 mr-2" />
            External Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries?.map(renderEntryCard)}
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries?.filter(entry => entry.file_attachments?.length > 0).map(renderEntryCard)}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries?.filter(entry => entry.is_ai_enhanced).map(renderEntryCard)}
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries?.filter(entry => entry.external_links?.length > 0).map(renderEntryCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Entry Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Knowledge Entry</DialogTitle>
            <DialogDescription>
              Add documentation, notes, or upload files for AI analysis
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="entry-title">Title</Label>
                <Input
                  id="entry-title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="Enter descriptive title"
                />
              </div>
              <div>
                <Label htmlFor="entry-category">Category</Label>
                <Select 
                  value={newEntry.category}
                  onValueChange={(value) => setNewEntry({...newEntry, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="entry-type">Content Type</Label>
                <Select 
                  value={newEntry.content_type}
                  onValueChange={(value) => setNewEntry({...newEntry, content_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="troubleshooting">Troubleshooting Guide</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="analysis">Analysis Report</SelectItem>
                    <SelectItem value="log">Log Analysis</SelectItem>
                    <SelectItem value="pcap">Network Capture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="entry-priority">Priority Level</Label>
                <Select 
                  value={newEntry.priority_level}
                  onValueChange={(value) => setNewEntry({...newEntry, priority_level: value})}
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
            </div>
            <div>
              <Label htmlFor="entry-content">Content</Label>
              <Textarea
                id="entry-content"
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                placeholder="Enter detailed content, notes, or paste configuration..."
                rows={12}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEntry} disabled={createEntry.isPending}>
              {createEntry.isPending ? 'Creating...' : 'Create Entry'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Entry Detail Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {React.createElement(contentTypeIcons[selectedEntry.content_type as keyof typeof contentTypeIcons] || FileText, { className: "w-5 h-5" })}
                {selectedEntry.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Badge className={categoryColors[selectedEntry.category as keyof typeof categoryColors] || categoryColors.general}>
                  {selectedEntry.category}
                </Badge>
                <Badge variant="outline">
                  {selectedEntry.content_type}
                </Badge>
                {selectedEntry.is_ai_enhanced && (
                  <Badge variant="secondary">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {selectedEntry.content && (
                  <div>
                    <h4 className="font-medium mb-2">Content</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{selectedEntry.content}</pre>
                    </div>
                  </div>
                )}

                {selectedEntry.ai_analysis_results && Object.keys(selectedEntry.ai_analysis_results).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Analysis Results
                    </h4>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <CodeBlock
                        code={JSON.stringify(selectedEntry.ai_analysis_results, null, 2)}
                        language="json"
                      />
                    </div>
                  </div>
                )}

                {selectedEntry.tags?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.external_links?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">External Links</h4>
                    <div className="space-y-2">
                      {selectedEntry.external_links.map((link: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {link.title || link.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-between">
              <div className="flex gap-2">
                {showAIFeatures && (
                  <>
                    <Button variant="outline" onClick={() => handleAnalyzeWithAI(selectedEntry.id, 'security')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Security Analysis
                    </Button>
                    <Button variant="outline" onClick={() => handleAnalyzeWithAI(selectedEntry.id, 'performance')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Performance Analysis
                    </Button>
                    <Button variant="outline" onClick={() => handleAnalyzeWithAI(selectedEntry.id, 'troubleshooting')}>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Troubleshooting Analysis
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IntelligentKnowledgeManager;