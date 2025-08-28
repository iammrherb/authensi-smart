import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Sparkles, Brain, TrendingUp, CheckCircle, XCircle, 
  Info, ChevronRight, Lightbulb, Zap, RefreshCw,
  Target, Shield, Package, Link, GitBranch, ArrowRight
} from 'lucide-react';
import { useEnhancedResourceLibrary } from '@/hooks/useEnhancedResourceLibrary';
import { EnhancedResourceItem } from '@/services/resourceLibrary/EnhancedResourceLibraryService';
import { useToast } from '@/hooks/use-toast';

interface AIRelationshipSuggestionsProps {
  resource: EnhancedResourceItem;
  onSuggestionAccepted?: () => void;
}

interface RelationshipSuggestion {
  targetResource: {
    id: string;
    name: string;
    type: string;
    description?: string;
  };
  relationshipType: string;
  confidence: number;
  reasoning: string;
  benefits: string[];
}

const RELATIONSHIP_TYPE_ICONS = {
  requires: Package,
  implements: Target,
  addresses: Target,
  mitigates: Shield,
  enhances: TrendingUp,
  integrates_with: Link,
  replaces: GitBranch,
  related_to: Link
};

const AIRelationshipSuggestions: React.FC<AIRelationshipSuggestionsProps> = ({ 
  resource, 
  onSuggestionAccepted 
}) => {
  const [suggestions, setSuggestions] = useState<RelationshipSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  const {
    useSearchResources,
    createRelationship,
    isCreatingRelationship
  } = useEnhancedResourceLibrary();

  // Analyze resource and generate suggestions
  const analyzeAndSuggest = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Step 1: Analyze current resource context
      setAnalysisProgress(20);
      const context = extractResourceContext(resource);
      
      // Step 2: Find potentially related resources
      setAnalysisProgress(40);
      const candidates = await findCandidateResources(context);
      
      // Step 3: Generate AI suggestions
      setAnalysisProgress(60);
      const aiSuggestions = await generateAISuggestions(resource, candidates);
      
      // Step 4: Filter out existing relationships
      setAnalysisProgress(80);
      const filteredSuggestions = filterExistingRelationships(aiSuggestions, resource);
      
      setAnalysisProgress(100);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate relationship suggestions",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extract context from resource for analysis
  const extractResourceContext = (res: EnhancedResourceItem) => {
    return {
      type: res.type,
      name: res.name,
      description: res.description,
      tags: res.tags?.map(t => t.name) || [],
      category: res.category,
      industry: res.industry_relevance || [],
      compliance: res.compliance_frameworks || [],
      complexity: res.complexity_level
    };
  };

  // Find candidate resources for relationships
  const findCandidateResources = async (context: any) => {
    // This would typically call an API or service
    // For now, returning mock data
    return [
      {
        id: 'mock-1',
        name: 'Cisco ISE',
        type: 'vendor',
        description: 'Identity Services Engine for network access control',
        tags: ['authentication', 'nac', 'security']
      },
      {
        id: 'mock-2',
        name: 'Zero Trust Implementation',
        type: 'use_case',
        description: 'Implement zero trust security model',
        tags: ['security', 'zero-trust', 'authentication']
      },
      {
        id: 'mock-3',
        name: 'MFA Requirement',
        type: 'requirement',
        description: 'Multi-factor authentication for all users',
        tags: ['security', 'authentication', 'compliance']
      }
    ];
  };

  // Generate AI-powered suggestions
  const generateAISuggestions = async (
    source: EnhancedResourceItem,
    candidates: any[]
  ): Promise<RelationshipSuggestion[]> => {
    // This would typically call an AI service
    // For demonstration, using rule-based logic
    
    const suggestions: RelationshipSuggestion[] = [];
    
    for (const candidate of candidates) {
      // Analyze relationship potential
      const analysis = analyzeRelationshipPotential(source, candidate);
      
      if (analysis.confidence > 0.5) {
        suggestions.push({
          targetResource: candidate,
          relationshipType: analysis.type,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
          benefits: analysis.benefits
        });
      }
    }
    
    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  // Analyze relationship potential between two resources
  const analyzeRelationshipPotential = (source: any, target: any) => {
    let confidence = 0;
    let type = 'related_to';
    let reasoning = '';
    let benefits: string[] = [];
    
    // Rule-based analysis (would be replaced with AI)
    if (source.type === 'pain_point' && target.type === 'use_case') {
      confidence = 0.85;
      type = 'addresses';
      reasoning = `The use case "${target.name}" directly addresses this pain point`;
      benefits = [
        'Clear solution mapping',
        'Implementation pathway defined',
        'ROI justification'
      ];
    } else if (source.type === 'use_case' && target.type === 'vendor') {
      confidence = 0.75;
      type = 'implements';
      reasoning = `${target.name} provides capabilities for this use case`;
      benefits = [
        'Vendor selection clarity',
        'Feature alignment',
        'Implementation support'
      ];
    } else if (source.type === 'requirement' && target.type === 'vendor') {
      confidence = 0.7;
      type = 'requires';
      reasoning = `This requirement needs ${target.name} capabilities`;
      benefits = [
        'Requirement fulfillment',
        'Compliance mapping',
        'Technical alignment'
      ];
    } else {
      // Check for tag overlap
      const sourceTags = source.tags || [];
      const targetTags = target.tags || [];
      const overlap = sourceTags.filter((t: string) => targetTags.includes(t));
      
      if (overlap.length > 0) {
        confidence = 0.5 + (overlap.length * 0.1);
        reasoning = `Shared context: ${overlap.join(', ')}`;
        benefits = ['Knowledge correlation', 'Context enrichment'];
      }
    }
    
    return { confidence, type, reasoning, benefits };
  };

  // Filter out existing relationships
  const filterExistingRelationships = (
    suggestions: RelationshipSuggestion[],
    resource: EnhancedResourceItem
  ): RelationshipSuggestion[] => {
    const existingIds = new Set(
      resource.relationships?.map(r => 
        r.source_resource_id === resource.id ? r.target_resource_id : r.source_resource_id
      ) || []
    );
    
    return suggestions.filter(s => !existingIds.has(s.targetResource.id));
  };

  // Accept a suggestion and create the relationship
  const acceptSuggestion = async (suggestion: RelationshipSuggestion) => {
    try {
      await createRelationship({
        source_resource_id: resource.id,
        source_resource_type: resource.type,
        target_resource_id: suggestion.targetResource.id,
        target_resource_type: suggestion.targetResource.type,
        relationship_type: suggestion.relationshipType,
        description: suggestion.reasoning
      });
      
      toast({
        title: "Relationship Created",
        description: `Successfully linked to ${suggestion.targetResource.name}`,
      });
      
      // Remove accepted suggestion
      setSuggestions(prev => prev.filter(s => 
        s.targetResource.id !== suggestion.targetResource.id
      ));
      
      if (onSuggestionAccepted) {
        onSuggestionAccepted();
      }
    } catch (error) {
      toast({
        title: "Failed to Create Relationship",
        description: "Could not create the suggested relationship",
        variant: "destructive"
      });
    }
  };

  // Accept multiple suggestions at once
  const acceptSelectedSuggestions = async () => {
    const selected = suggestions.filter(s => 
      selectedSuggestions.has(s.targetResource.id)
    );
    
    for (const suggestion of selected) {
      await acceptSuggestion(suggestion);
    }
    
    setSelectedSuggestions(new Set());
  };

  const toggleSuggestionSelection = (suggestionId: string) => {
    const newSelection = new Set(selectedSuggestions);
    if (newSelection.has(suggestionId)) {
      newSelection.delete(suggestionId);
    } else {
      newSelection.add(suggestionId);
    }
    setSelectedSuggestions(newSelection);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Relationship Suggestions
            </CardTitle>
            <CardDescription>
              Intelligent recommendations based on content analysis and patterns
            </CardDescription>
          </div>
          <EnhancedButton
            onClick={analyzeAndSuggest}
            loading={isAnalyzing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Analyze
          </EnhancedButton>
        </div>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span>Analyzing relationships...</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}
        
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {selectedSuggestions.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedSuggestions.size} suggestion{selectedSuggestions.size > 1 ? 's' : ''} selected
                </span>
                <EnhancedButton
                  size="sm"
                  onClick={acceptSelectedSuggestions}
                  loading={isCreatingRelationship}
                >
                  Accept Selected
                </EnhancedButton>
              </div>
            )}
            
            {suggestions.map((suggestion) => {
              const Icon = RELATIONSHIP_TYPE_ICONS[suggestion.relationshipType as keyof typeof RELATIONSHIP_TYPE_ICONS] || Link;
              const isSelected = selectedSuggestions.has(suggestion.targetResource.id);
              
              return (
                <div 
                  key={suggestion.targetResource.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSuggestionSelection(suggestion.targetResource.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{suggestion.targetResource.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.relationshipType.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {suggestion.targetResource.description}
                          </p>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                                {Math.round(suggestion.confidence * 100)}%
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Confidence: {getConfidenceLabel(suggestion.confidence)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-md space-y-2">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Reasoning</p>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.reasoning}
                            </p>
                          </div>
                        </div>
                        
                        {suggestion.benefits.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Benefits</p>
                              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                                {suggestion.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-center gap-1">
                                    <ChevronRight className="h-3 w-3" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => acceptSuggestion(suggestion)}
                          disabled={isCreatingRelationship}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSuggestions(prev => prev.filter(s => 
                              s.targetResource.id !== suggestion.targetResource.id
                            ));
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !isAnalyzing && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Click "Analyze" to generate AI-powered relationship suggestions for this resource.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRelationshipSuggestions;

