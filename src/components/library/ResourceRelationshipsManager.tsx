import React, { useState, useMemo } from 'react';
import { useEnhancedResourceLibrary } from '@/hooks/useEnhancedResourceLibrary';
import { EnhancedResourceItem, ResourceRelationship } from '@/services/resourceLibrary/EnhancedResourceLibraryService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DlgDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trash2, Plus, Link, Search, ArrowRight, GitBranch, 
  Target, Shield, Zap, Package, Settings, AlertTriangle,
  CheckCircle, XCircle, Info, Network, Database, Layers,
  FileText, Users, Building, Briefcase, Code, Cloud
} from 'lucide-react';

interface ResourceRelationshipsManagerProps {
  resource: EnhancedResourceItem;
}

// Relationship type configurations with icons and colors
const RELATIONSHIP_TYPES = {
  related_to: { label: 'Related To', icon: Link, color: 'blue', description: 'General relationship' },
  requires: { label: 'Requires', icon: Package, color: 'orange', description: 'Dependency relationship' },
  implements: { label: 'Implements', icon: Code, color: 'green', description: 'Implementation relationship' },
  addresses: { label: 'Addresses', icon: Target, color: 'purple', description: 'Solution relationship' },
  mitigates: { label: 'Mitigates', icon: Shield, color: 'cyan', description: 'Risk mitigation' },
  competes_with: { label: 'Competes With', icon: Zap, color: 'red', description: 'Competition relationship' },
  enhances: { label: 'Enhances', icon: ArrowRight, color: 'emerald', description: 'Enhancement relationship' },
  replaces: { label: 'Replaces', icon: GitBranch, color: 'amber', description: 'Replacement relationship' },
  integrates_with: { label: 'Integrates With', icon: Network, color: 'indigo', description: 'Integration relationship' }
};

// Resource type icons
const RESOURCE_TYPE_ICONS = {
  vendor: Building,
  use_case: Briefcase,
  requirement: FileText,
  pain_point: AlertTriangle,
  test_case: CheckCircle,
  project_template: Layers
};

const ResourceRelationshipsManager: React.FC<ResourceRelationshipsManagerProps> = ({ resource }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<EnhancedResourceItem | null>(null);
  const [relationshipType, setRelationshipType] = useState<keyof typeof RELATIONSHIP_TYPES>('related_to');
  const [relationshipDescription, setRelationshipDescription] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const {
    useSearchResources,
    createRelationship,
    deleteRelationship,
    isCreatingRelationship,
    isDeletingRelationship,
  } = useEnhancedResourceLibrary();

  // Search with debouncing
  const searchFilters = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return {};
    return {
      text_search: searchQuery,
      types: filterType === 'all' 
        ? ['vendor', 'use_case', 'requirement', 'pain_point', 'test_case', 'project_template']
        : [filterType]
    };
  }, [searchQuery, filterType]);

  const { data: searchResults = [], isLoading: isSearching } = useSearchResources(searchFilters);

  // Group relationships by type
  const groupedRelationships = useMemo(() => {
    if (!resource.relationships) return {};
    
    return resource.relationships.reduce((acc, rel) => {
      const type = rel.relationship_type || 'related_to';
      if (!acc[type]) acc[type] = [];
      acc[type].push(rel);
      return acc;
    }, {} as Record<string, ResourceRelationship[]>);
  }, [resource.relationships]);

  const handleCreateRelationship = async () => {
    if (!selectedTarget) return;
    
    try {
      await createRelationship({
        source_resource_id: resource.id,
        source_resource_type: resource.type,
        target_resource_id: selectedTarget.id,
        target_resource_type: selectedTarget.type,
        relationship_type: relationshipType,
        description: relationshipDescription || undefined,
      });
      
      // Reset form
      setShowAddDialog(false);
      setSelectedTarget(null);
      setSearchQuery('');
      setRelationshipDescription('');
      setRelationshipType('related_to');
    } catch (error) {
      console.error("Failed to create relationship", error);
    }
  };
  
  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to remove this relationship?')) return;
    
    try {
      await deleteRelationship(relationshipId);
    } catch (error) {
      console.error("Failed to delete relationship", error);
    }
  };

  const getRelationshipIcon = (type: string) => {
    const config = RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES];
    return config ? config.icon : Link;
  };

  const getRelationshipColor = (type: string) => {
    const config = RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES];
    return config ? config.color : 'gray';
  };

  const getResourceIcon = (type: string) => {
    return RESOURCE_TYPE_ICONS[type as keyof typeof RESOURCE_TYPE_ICONS] || Database;
  };

  const totalRelationships = resource.relationships?.length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Resource Relationships
              </CardTitle>
              <CardDescription className="mt-1">
                Manage connections between resources to build your knowledge graph
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Relationship
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Relationship</DialogTitle>
                  <DlgDescription>
                    Connect this {resource.type.replace('_', ' ')} to another resource
                  </DlgDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Search and Filter */}
                  <div className="space-y-2">
                    <Label>Search Resources</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name or description..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="vendor">Vendors</SelectItem>
                          <SelectItem value="use_case">Use Cases</SelectItem>
                          <SelectItem value="requirement">Requirements</SelectItem>
                          <SelectItem value="pain_point">Pain Points</SelectItem>
                          <SelectItem value="test_case">Test Cases</SelectItem>
                          <SelectItem value="project_template">Templates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Search Results */}
                  <div className="space-y-2">
                    <Label>Select Target Resource</Label>
                    <ScrollArea className="h-[200px] border rounded-lg">
                      {isSearching ? (
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2 space-y-1">
                          {searchResults
                            .filter(item => item.id !== resource.id)
                            .map(item => {
                              const Icon = getResourceIcon(item.type);
                              return (
                                <div
                                  key={item.id}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedTarget?.id === item.id 
                                      ? 'bg-primary/10 border border-primary' 
                                      : 'hover:bg-muted border border-transparent'
                                  }`}
                                  onClick={() => setSelectedTarget(item)}
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {item.description}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                          {item.type.replace('_', ' ')}
                                        </Badge>
                                        {item.category && (
                                          <Badge variant="outline" className="text-xs">
                                            {item.category}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : searchQuery.length >= 2 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                          <Search className="h-8 w-8 mb-2" />
                          <p>No resources found</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                          <Info className="h-8 w-8 mb-2" />
                          <p>Type at least 2 characters to search</p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                  
                  {/* Relationship Configuration */}
                  {selectedTarget && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Creating relationship:</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{resource.name}</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="font-medium">{selectedTarget.name}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Relationship Type</Label>
                        <Select value={relationshipType} onValueChange={(v) => setRelationshipType(v as keyof typeof RELATIONSHIP_TYPES)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(RELATIONSHIP_TYPES).map(([key, config]) => {
                              const Icon = config.icon;
                              return (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{config.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {RELATIONSHIP_TYPES[relationshipType].description}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                          placeholder="Provide additional context for this relationship..."
                          value={relationshipDescription}
                          onChange={(e) => setRelationshipDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <EnhancedButton
                    onClick={handleCreateRelationship}
                    loading={isCreatingRelationship}
                    disabled={!selectedTarget}
                  >
                    Create Relationship
                  </EnhancedButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalRelationships}</p>
              <p className="text-sm text-muted-foreground">Total Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Object.keys(groupedRelationships).length}</p>
              <p className="text-sm text-muted-foreground">Relationship Types</p>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {Object.entries(groupedRelationships).slice(0, 3).map(([type, rels]) => {
                  const config = RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES];
                  if (!config) return null;
                  return (
                    <Badge key={type} variant="secondary" className="gap-1">
                      <config.icon className="h-3 w-3" />
                      {config.label} ({rels.length})
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relationships by Type */}
      {totalRelationships > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedRelationships).map(([type, relationships]) => {
            const config = RELATIONSHIP_TYPES[type as keyof typeof RELATIONSHIP_TYPES] || {
              label: type,
              icon: Link,
              color: 'gray'
            };
            const Icon = config.icon;
            
            return (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 text-${config.color}-500`} />
                    <CardTitle className="text-base">
                      {config.label} ({relationships.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relationships.map((rel) => {
                      const isSource = rel.source_resource_id === resource.id;
                      const targetName = isSource ? rel.target_resource_name : rel.source_resource_name;
                      const targetId = isSource ? rel.target_resource_id : rel.source_resource_id;
                      const targetType = isSource ? rel.target_resource_type : rel.source_resource_type;
                      const TargetIcon = getResourceIcon(targetType || '');
                      
                      return (
                        <div 
                          key={rel.id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all group"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <TargetIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{targetName || targetId}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {targetType?.replace('_', ' ')}
                                </Badge>
                                {isSource ? (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" />
                                    Outgoing
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3 rotate-180" />
                                    Incoming
                                  </span>
                                )}
                              </div>
                              {rel.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {rel.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteRelationship(rel.id)}
                                  disabled={isDeletingRelationship}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove relationship</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Network className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Relationships Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Start building your knowledge graph by connecting this resource to related items in your library.
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Relationship
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceRelationshipsManager;