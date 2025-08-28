import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Tags, Plus, ExternalLink, Edit, Trash2, Search, Filter, Star, 
  CheckCircle, AlertCircle, Info, Link, Globe, FileText, Zap,
  Target, Shield, Settings, BarChart3, TrendingUp, Users, Clock,
  Bookmark, Eye, EyeOff, Lightbulb, Award, Flag, Heart, Share2
} from 'lucide-react';

import { useEnhancedResourceLibrary } from '@/hooks/useEnhancedResourceLibrary';
import { EnhancedResourceItem, ResourceTag, ResourceLabel, ExternalResourceLink } from '@/services/resourceLibrary/EnhancedResourceLibraryService';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import ResourceRelationshipsManager from './ResourceRelationshipsManager'; // Import the new component
import AIRelationshipSuggestions from './AIRelationshipSuggestions'; // Import AI suggestions
import WebContentEnrichment from './WebContentEnrichment'; // Import web enrichment

interface EnhancedResourceManagerProps {
  resourceType: string;
  resourceId: string;
  onResourceUpdated?: (resource: EnhancedResourceItem) => void;
}

const EnhancedResourceManager: React.FC<EnhancedResourceManagerProps> = ({
  resourceType,
  resourceId,
  onResourceUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tags' | 'labels' | 'links' | 'relationships' | 'analytics'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);
  const [showAddLabelDialog, setShowAddLabelDialog] = useState(false);
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', category: 'custom', color: '#3B82F6', description: '' });
  const [newLabel, setNewLabel] = useState({ name: '', type: 'custom', value: '', description: '' });
  const [newLink, setNewLink] = useState({
    link_title: '',
    link_url: '',
    link_type: 'documentation',
    description: '',
    relevance_score: 5,
    tags: [] as string[]
  });

  const {
    useEnhancedResource,
    useResourceTags,
    useResourceLabels,
    createTag,
    createLabel,
    addTagToResource,
    removeTagFromResource,
    addLabelToResource,
    addExternalLink,
    updateExternalLink,
    verifyExternalLink,
    updateResourceUsage,
    isCreatingTag,
    isCreatingLabel,
    isAddingTag,
    isRemovingTag,
    isAddingLabel,
    isAddingLink,
    isUpdatingLink,
    isVerifyingLink
  } = useEnhancedResourceLibrary();

  const { data: resource, isLoading: resourceLoading } = useEnhancedResource(resourceType, resourceId);
  const { data: allTags = [] } = useResourceTags();
  const { data: allLabels = [] } = useResourceLabels();

  // Track resource usage
  useEffect(() => {
    if (resource) {
      updateResourceUsage(resourceType, resourceId, 'select');
    }
  }, [resource, resourceType, resourceId, updateResourceUsage]);

  const handleAddTag = async () => {
    try {
      const createdTag = await createTag(newTag);
      await addTagToResource(resourceType, resourceId, createdTag.id);
      setNewTag({ name: '', category: 'custom', color: '#3B82F6', description: '' });
      setShowAddTagDialog(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleAddLabel = async () => {
    try {
      const createdLabel = await createLabel({
        ...newLabel,
        applies_to: [resourceType]
      });
      await addLabelToResource(resourceType, resourceId, createdLabel.id);
      setNewLabel({ name: '', type: 'custom', value: '', description: '' });
      setShowAddLabelDialog(false);
    } catch (error) {
      console.error('Error adding label:', error);
    }
  };

  const handleAddLink = async () => {
    try {
      await addExternalLink({
        resource_type: resourceType,
        resource_id: resourceId,
        ...newLink
      });
      setNewLink({
        link_title: '',
        link_url: '',
        link_type: 'documentation',
        description: '',
        relevance_score: 5,
        tags: []
      });
      setShowAddLinkDialog(false);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeTagFromResource(resourceType, resourceId, tagId);
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const handleVerifyLink = async (linkId: string) => {
    try {
      await verifyExternalLink(linkId);
    } catch (error) {
      console.error('Error verifying link:', error);
    }
  };

  const getComplexityIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'high': return <Flag className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMaturityIcon = (level: string) => {
    switch (level) {
      case 'experimental': return <Lightbulb className="h-4 w-4 text-orange-500" />;
      case 'beta': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'stable': return <Award className="h-4 w-4 text-green-500" />;
      case 'deprecated': return <Trash2 className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'kb_article': return <Bookmark className="h-4 w-4" />;
      case 'troubleshooting': return <Settings className="h-4 w-4" />;
      case 'configuration': return <Target className="h-4 w-4" />;
      case 'security_advisory': return <Shield className="h-4 w-4" />;
      case 'api_docs': return <Globe className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm text-muted-foreground mt-1">{resource?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Type</Label>
              <p className="text-sm text-muted-foreground mt-1 capitalize">{resource?.type?.replace('_', ' ')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <p className="text-sm text-muted-foreground mt-1">{resource?.category || 'N/A'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Version</Label>
              <p className="text-sm text-muted-foreground mt-1">{resource?.version}</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm text-muted-foreground mt-1">{resource?.description || 'No description available'}</p>
          </div>

          {/* Quality & Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    {getComplexityIcon(resource?.complexity_level || 'medium')}
                    <span className="text-sm font-medium capitalize">{resource?.complexity_level}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Complexity Level: Indicates implementation difficulty</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    {getMaturityIcon(resource?.maturity_level || 'stable')}
                    <span className="text-sm font-medium capitalize">{resource?.maturity_level}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maturity Level: Development and stability status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{resource?.quality_score}/10</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quality Score: Overall resource quality rating</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">{resource?.usage_statistics.selection_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Usage Count: Times this resource has been selected</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Industry & Compliance */}
      {(resource?.industry_relevance?.length || resource?.compliance_frameworks?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Industry & Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resource?.industry_relevance?.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Industry Relevance</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resource.industry_relevance.map((industry, index) => (
                    <Badge key={index} variant="secondary">{industry}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {resource?.compliance_frameworks?.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Compliance Frameworks</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {resource.compliance_frameworks.map((framework, index) => (
                    <Badge key={index} variant="outline" className="border-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      {framework}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderTagsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resource Tags</h3>
        <Dialog open={showAddTagDialog} onOpenChange={setShowAddTagDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>
                Create a new tag to categorize this resource.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label htmlFor="tag-category">Category</Label>
                <Select value={newTag.category} onValueChange={(value) => setNewTag({ ...newTag, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="complexity">Complexity</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tag-color">Color</Label>
                <Input
                  id="tag-color"
                  type="color"
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tag-description">Description</Label>
                <Textarea
                  id="tag-description"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddTagDialog(false)}>
                  Cancel
                </Button>
                <EnhancedButton
                  onClick={handleAddTag}
                  loading={isCreatingTag || isAddingTag}
                  disabled={!newTag.name.trim()}
                >
                  Add Tag
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resource?.tags.map((tag) => (
          <Card key={tag.id} className="relative">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTag(tag.id)}
                  disabled={isRemovingTag}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {tag.category}
                </Badge>
                {tag.description && (
                  <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Used {tag.usage_count} times
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!resource?.tags || resource.tags.length === 0) && (
        <Alert>
          <Tags className="h-4 w-4" />
          <AlertDescription>
            No tags assigned to this resource. Tags help categorize and organize resources for better searchability.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderLinksTab = () => (
    <div className="space-y-6">
      <WebContentEnrichment resource={resource} onEnrichmentComplete={() => {
        // Refresh the resource data after enrichment
        updateResourceUsage(resourceType, resourceId, 'select');
      }} />
      
      <Separator className="my-6" />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">External Links</h3>
        <Dialog open={showAddLinkDialog} onOpenChange={setShowAddLinkDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add External Link</DialogTitle>
              <DialogDescription>
                Add a link to external documentation, articles, or resources.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-title">Title</Label>
                <Input
                  id="link-title"
                  value={newLink.link_title}
                  onChange={(e) => setNewLink({ ...newLink, link_title: e.target.value })}
                  placeholder="Link title"
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  type="url"
                  value={newLink.link_url}
                  onChange={(e) => setNewLink({ ...newLink, link_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="link-type">Type</Label>
                <Select value={newLink.link_type} onValueChange={(value) => setNewLink({ ...newLink, link_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="kb_article">Knowledge Base Article</SelectItem>
                    <SelectItem value="troubleshooting">Troubleshooting Guide</SelectItem>
                    <SelectItem value="configuration">Configuration Guide</SelectItem>
                    <SelectItem value="best_practices">Best Practices</SelectItem>
                    <SelectItem value="vendor_guide">Vendor Guide</SelectItem>
                    <SelectItem value="community">Community Resource</SelectItem>
                    <SelectItem value="api_docs">API Documentation</SelectItem>
                    <SelectItem value="video_tutorial">Video Tutorial</SelectItem>
                    <SelectItem value="whitepaper">Whitepaper</SelectItem>
                    <SelectItem value="case_study">Case Study</SelectItem>
                    <SelectItem value="security_advisory">Security Advisory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="link-description">Description</Label>
                <Textarea
                  id="link-description"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="relevance-score">Relevance Score (1-10)</Label>
                <Input
                  id="relevance-score"
                  type="number"
                  min="1"
                  max="10"
                  value={newLink.relevance_score}
                  onChange={(e) => setNewLink({ ...newLink, relevance_score: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddLinkDialog(false)}>
                  Cancel
                </Button>
                <EnhancedButton
                  onClick={handleAddLink}
                  loading={isAddingLink}
                  disabled={!newLink.link_title.trim() || !newLink.link_url.trim()}
                >
                  Add Link
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {resource?.external_links.map((link) => (
          <Card key={link.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getLinkTypeIcon(link.link_type)}
                    <h4 className="font-medium">{link.link_title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {link.link_type.replace('_', ' ')}
                    </Badge>
                    {link.is_verified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Link verified and accessible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  
                  <a
                    href={link.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {link.link_url}
                  </a>
                  
                  {link.description && (
                    <p className="text-sm text-muted-foreground mt-2">{link.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{link.relevance_score}/10</span>
                    </div>
                    {link.last_checked_at && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground">
                          Checked {new Date(link.last_checked_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerifyLink(link.id)}
                          disabled={isVerifyingLink}
                        >
                          {isVerifyingLink ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verify link accessibility</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!resource?.external_links || resource.external_links.length === 0) && (
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            No external links added. External links provide additional documentation, guides, and resources related to this item.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Usage Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {resource?.usage_statistics.selection_count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Selections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {resource?.usage_statistics.project_usage_count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Project Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {resource?.usage_statistics.success_rate?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {resource?.quality_score || 0}/10
              </div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>
          </div>
          
          {resource?.usage_statistics.last_used && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last used: {new Date(resource.usage_statistics.last_used).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {resource?.related_resources && resource.related_resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Related Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resource.related_resources.map((related, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{related.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {related.type.replace('_', ' ')} • {related.relationship_type.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={related.strength * 10} className="w-16" />
                    <span className="text-sm text-muted-foreground">{related.strength}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (resourceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Resource not found or failed to load.
        </AlertDescription>
      </Alert>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'tags', label: 'Tags', icon: Tags, count: resource.tags?.length },
    { id: 'labels', label: 'Labels', icon: Bookmark, count: resource.labels?.length },
    { id: 'links', label: 'Links', icon: ExternalLink, count: resource.external_links?.length },
    { id: 'relationships', label: 'Relationships', icon: Share2, count: resource.relationships?.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{resource.name}</h2>
          <p className="text-muted-foreground capitalize">{resource.type.replace('_', ' ')} Resource</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={resource.validation_status === 'validated' ? 'default' : 'secondary'}>
            {resource.validation_status}
          </Badge>
          <Badge variant="outline">v{resource.version}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'tags' && renderTagsTab()}
        {activeTab === 'links' && renderLinksTab()}
        {activeTab === 'relationships' && (
          <div className="space-y-6">
            <ResourceRelationshipsManager resource={resource} />
            <AIRelationshipSuggestions resource={resource} />
          </div>
        )}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default EnhancedResourceManager;
