import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Search, Download, Eye, Edit, Trash2, Share2, Tag, Clock, User, Filter, FolderOpen, File, Image, Video, Archive, Star, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'img' | 'video' | 'txt' | 'archive';
  size: number;
  category: 'requirements' | 'design' | 'technical' | 'business' | 'compliance' | 'reports';
  tags: string[];
  author: string;
  lastModified: Date;
  version: string;
  isLocked: boolean;
  isStarred: boolean;
  downloadCount: number;
  collaborators: string[];
  aiSummary?: string;
  extractedText?: string;
  securityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Project Requirements Document v2.1',
    type: 'pdf',
    size: 2500000,
    category: 'requirements',
    tags: ['requirements', 'v2.1', 'approved'],
    author: 'John Smith',
    lastModified: new Date('2024-01-15'),
    version: '2.1',
    isLocked: true,
    isStarred: true,
    downloadCount: 45,
    collaborators: ['john.smith@company.com', 'jane.doe@company.com'],
    aiSummary: 'Comprehensive project requirements covering functional and non-functional requirements for the network access control implementation.',
    securityLevel: 'internal'
  },
  {
    id: '2',
    name: 'Network Architecture Diagram',
    type: 'img',
    size: 850000,
    category: 'design',
    tags: ['architecture', 'network', 'design'],
    author: 'Jane Doe',
    lastModified: new Date('2024-01-18'),
    version: '1.3',
    isLocked: false,
    isStarred: false,
    downloadCount: 23,
    collaborators: ['jane.doe@company.com'],
    aiSummary: 'Visual representation of the proposed network architecture including security zones and access points.',
    securityLevel: 'confidential'
  },
  {
    id: '3',
    name: 'Implementation Timeline',
    type: 'xlsx',
    size: 156000,
    category: 'business',
    tags: ['timeline', 'implementation', 'planning'],
    author: 'Mike Johnson',
    lastModified: new Date('2024-01-20'),
    version: '1.0',
    isLocked: false,
    isStarred: true,
    downloadCount: 67,
    collaborators: ['mike.johnson@company.com', 'sarah.wilson@company.com'],
    securityLevel: 'internal'
  }
];

const IntelligentDocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.aiSummary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, selectedCategory, selectedType, documents]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx': return <FileText className="h-5 w-5 text-green-500" />;
      case 'img': return <Image className="h-5 w-5 text-purple-500" />;
      case 'video': return <Video className="h-5 w-5 text-orange-500" />;
      case 'archive': return <Archive className="h-5 w-5 text-gray-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'public': return 'default';
      case 'internal': return 'secondary';
      case 'confidential': return 'destructive';
      case 'restricted': return 'destructive';
      default: return 'default';
    }
  };

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Add new document to list
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.name.split('.').pop() as any || 'txt',
      size: file.size,
      category: 'technical',
      tags: ['uploaded', 'new'],
      author: 'Current User',
      lastModified: new Date(),
      version: '1.0',
      isLocked: false,
      isStarred: false,
      downloadCount: 0,
      collaborators: ['current.user@company.com'],
      securityLevel: 'internal'
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsUploading(false);
    setUploadProgress(0);

    toast({
      title: "Upload Successful",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const toggleStar = (docId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
      )
    );
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: "Document has been removed successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Document Manager</h2>
          <p className="text-muted-foreground">
            Intelligent document management with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg,.mp4,.zip"
          />
          <Button 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="requirements">Requirements</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="doc">Documents</SelectItem>
                <SelectItem value="xlsx">Spreadsheets</SelectItem>
                <SelectItem value="img">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Documents ({filteredDocuments.length})</TabsTrigger>
          <TabsTrigger value="starred">Starred ({filteredDocuments.filter(d => d.isStarred).length})</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === 'list' ? (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.type)}
                          {doc.isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{doc.name}</h3>
                            <Badge variant={getSecurityBadgeColor(doc.securityLevel)} className="text-xs">
                              {doc.securityLevel}
                            </Badge>
                            {doc.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {doc.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {doc.lastModified.toLocaleDateString()}
                            </span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>v{doc.version}</span>
                          </div>
                          {doc.aiSummary && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              AI Summary: {doc.aiSummary}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        <Button size="sm" variant="ghost" onClick={() => toggleStar(doc.id)}>
                          <Star className={`h-4 w-4 ${doc.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => deleteDocument(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.type)}
                          {doc.isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => toggleStar(doc.id)}
                        >
                          <Star className={`h-4 w-4 ${doc.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium truncate" title={doc.name}>
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getSecurityBadgeColor(doc.securityLevel)} className="text-xs">
                            {doc.securityLevel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            v{doc.version}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>By {doc.author}</p>
                        <p>{doc.lastModified.toLocaleDateString()}</p>
                        <p>{formatFileSize(doc.size)}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or upload new documents
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="starred">
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Starred Documents</h3>
            <p className="text-muted-foreground">
              Documents you've starred will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Recent Documents</h3>
            <p className="text-muted-foreground">
              Recently accessed documents will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Shared Documents</h3>
            <p className="text-muted-foreground">
              Documents shared with you will appear here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentDocumentManager;