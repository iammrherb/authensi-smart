import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, Target, Zap, TrendingUp, Clock, Shield, Users, Building2,
  CheckCircle, AlertTriangle, Star, ThumbsUp, ThumbsDown, Download,
  Eye, Settings, Filter, RefreshCw, BarChart3, Layers, ArrowRight,
  Network, Server, Router, Wifi, Database, Globe, Lock, FileText,
  Plus, Minus, X, Edit, Save, Upload, ChevronDown, ChevronRight
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { 
  useGenerateSmartRecommendations,
  useTemplateRecommendations,
  useTemplatePerformanceAnalytics,
  useProvideFeedback,
  useTrackTemplateUsage
} from '@/hooks/useSmartTemplateRecommendations';
import { useProjects } from '@/hooks/useProjects';
import { useSites } from '@/hooks/useSites';
import { useIndustryOptions, useComplianceFrameworks } from '@/hooks/useResourceLibrary';
import { RecommendationContext, SmartRecommendationResult } from '@/services/SmartTemplateRecommendationEngine';
import unifiedTemplates from '@/data/unifiedTemplates';

interface SmartTemplateRecommendationEngineProps {
  projectId?: string;
  siteId?: string;
  onRecommendationApplied?: (templateId: string) => void;
  mode?: 'full' | 'embedded';
}

const SmartTemplateRecommendationEngine: React.FC<SmartTemplateRecommendationEngineProps> = ({
  projectId,
  siteId,
  onRecommendationApplied,
  mode = 'full'
}) => {
  const { toast } = useToast();
  
  // Hooks
  const generateRecommendations = useGenerateSmartRecommendations();
  const { data: existingRecommendations } = useTemplateRecommendations(projectId, siteId);
  const { data: projects } = useProjects();
  const { data: sites } = useSites();
  const { data: industryOptions } = useIndustryOptions();
  const { data: complianceFrameworks } = useComplianceFrameworks();
  const provideFeedback = useProvideFeedback();
  const trackUsage = useTrackTemplateUsage();

  // State
  const [activeTab, setActiveTab] = useState('configure');
  const [context, setContext] = useState<RecommendationContext>({
    projectId,
    siteId,
    industry: '',
    organizationSize: 'Mid-Market',
    complianceFrameworks: [],
    networkComplexity: 'Moderate',
    existingVendors: [],
    deviceInventory: {},
    securityRequirements: [],
    userExpertiseLevel: 'intermediate',
    useCases: [],
    painPoints: []
  });
  
  const [recommendations, setRecommendations] = useState<SmartRecommendationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    vendor: '',
    complexity: '',
    category: '',
    minScore: 0
  });

  useEffect(() => {
    if (projectId || siteId) {
      setContext(prev => ({ ...prev, projectId, siteId }));
    }
  }, [projectId, siteId]);

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    try {
      const result = await generateRecommendations.mutateAsync(context);
      setRecommendations(result);
      setActiveTab('recommendations');
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    try {
      await trackUsage.mutateAsync({
        templateId,
        projectId,
        siteId,
        usageContext: context,
        deploymentResults: { applied: true, timestamp: new Date().toISOString() }
      });
      
      onRecommendationApplied?.(templateId);
      toast({
        title: "Template Applied",
        description: "Template has been applied successfully",
      });
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const handleProvideFeedback = async (recommendationId: string, feedback: any) => {
    try {
      await provideFeedback.mutateAsync({ recommendationId, feedback });
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
  };

  const getTemplate = (templateId: string) => {
    return unifiedTemplates.find(t => t.id === templateId);
  };

  const filteredRecommendations = recommendations?.recommendations.filter(rec => {
    const template = getTemplate(rec.templateId);
    if (!template) return false;
    
    if (filters.vendor && !template.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) return false;
    if (filters.complexity && template.complexity_level !== filters.complexity) return false;
    if (filters.category && !template.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (rec.score < filters.minScore / 100) return false;
    
    return true;
  }) || [];

  const renderConfigurationForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={context.industry} 
                onValueChange={(value) => setContext(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions?.map(industry => (
                    <SelectItem key={industry.id} value={industry.name}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organizationSize">Organization Size</Label>
              <Select 
                value={context.organizationSize} 
                onValueChange={(value: any) => setContext(prev => ({ ...prev, organizationSize: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMB">Small-Medium Business</SelectItem>
                  <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="userExpertiseLevel">Team Expertise Level</Label>
              <Select 
                value={context.userExpertiseLevel} 
                onValueChange={(value: any) => setContext(prev => ({ ...prev, userExpertiseLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Network Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="networkComplexity">Network Complexity</Label>
              <Select 
                value={context.networkComplexity} 
                onValueChange={(value: any) => setContext(prev => ({ ...prev, networkComplexity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Complex">Complex</SelectItem>
                  <SelectItem value="Very Complex">Very Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Existing Vendors</Label>
              <div className="space-y-2">
                {['Cisco', 'Fortinet', 'Aruba', 'Juniper', 'Meraki'].map(vendor => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      checked={context.existingVendors?.includes(vendor)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setContext(prev => ({
                            ...prev,
                            existingVendors: [...(prev.existingVendors || []), vendor]
                          }));
                        } else {
                          setContext(prev => ({
                            ...prev,
                            existingVendors: prev.existingVendors?.filter(v => v !== vendor) || []
                          }));
                        }
                      }}
                    />
                    <Label>{vendor}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Requirements & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Compliance Frameworks</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {complianceFrameworks?.map(framework => (
                  <div key={framework.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={context.complianceFrameworks?.includes(framework.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setContext(prev => ({
                            ...prev,
                            complianceFrameworks: [...(prev.complianceFrameworks || []), framework.name]
                          }));
                        } else {
                          setContext(prev => ({
                            ...prev,
                            complianceFrameworks: prev.complianceFrameworks?.filter(f => f !== framework.name) || []
                          }));
                        }
                      }}
                    />
                    <Label className="text-sm">{framework.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="budgetRange">Budget Range</Label>
              <Select 
                value={context.budgetRange} 
                onValueChange={(value) => setContext(prev => ({ ...prev, budgetRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50k">Under $50K</SelectItem>
                  <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                  <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                  <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                  <SelectItem value="over-500k">Over $500K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timelineConstraints">Timeline Constraints</Label>
              <Select 
                value={context.timelineConstraints} 
                onValueChange={(value) => setContext(prev => ({ ...prev, timelineConstraints: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (< 1 month)</SelectItem>
                  <SelectItem value="fast">Fast (1-3 months)</SelectItem>
                  <SelectItem value="normal">Normal (3-6 months)</SelectItem>
                  <SelectItem value="extended">Extended (6+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases & Pain Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Use Cases & Pain Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Primary Use Cases</Label>
              <div className="space-y-2">
                {[
                  'Device Authentication',
                  'Guest Access',
                  'Network Segmentation',
                  'Compliance Monitoring',
                  'Threat Detection',
                  'Asset Management'
                ].map(useCase => (
                  <div key={useCase} className="flex items-center space-x-2">
                    <Checkbox
                      checked={context.useCases?.includes(useCase)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setContext(prev => ({
                            ...prev,
                            useCases: [...(prev.useCases || []), useCase]
                          }));
                        } else {
                          setContext(prev => ({
                            ...prev,
                            useCases: prev.useCases?.filter(uc => uc !== useCase) || []
                          }));
                        }
                      }}
                    />
                    <Label className="text-sm">{useCase}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Current Pain Points</Label>
              <div className="space-y-2">
                {[
                  'Manual device provisioning',
                  'Lack of visibility',
                  'Security incidents',
                  'Compliance gaps',
                  'Operational overhead',
                  'Integration challenges'
                ].map(painPoint => (
                  <div key={painPoint} className="flex items-center space-x-2">
                    <Checkbox
                      checked={context.painPoints?.includes(painPoint)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setContext(prev => ({
                            ...prev,
                            painPoints: [...(prev.painPoints || []), painPoint]
                          }));
                        } else {
                          setContext(prev => ({
                            ...prev,
                            painPoints: prev.painPoints?.filter(pp => pp !== painPoint) || []
                          }));
                        }
                      }}
                    />
                    <Label className="text-sm">{painPoint}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerateRecommendations}
          disabled={isGenerating}
          size="lg"
          className="min-w-48"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Smart Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderRecommendations = () => {
    if (!recommendations) {
      return (
        <div className="text-center py-8">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No recommendations available. Configure parameters and generate recommendations first.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Context Analysis Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Primary Factors</h4>
                <ul className="space-y-1">
                  {recommendations.contextAnalysis.primaryFactors.map((factor, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Assessment</h4>
                <ul className="space-y-1">
                  {recommendations.contextAnalysis.riskAssessment.map((risk, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium mb-2">Recommended Approach</h4>
              <p className="text-sm text-muted-foreground">
                {recommendations.contextAnalysis.recommendedApproach}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="vendorFilter">Vendor</Label>
                <Select value={filters.vendor} onValueChange={(value) => setFilters(prev => ({ ...prev, vendor: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All vendors</SelectItem>
                    <SelectItem value="cisco">Cisco</SelectItem>
                    <SelectItem value="fortinet">Fortinet</SelectItem>
                    <SelectItem value="aruba">Aruba</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="complexityFilter">Complexity</Label>
                <Select value={filters.complexity} onValueChange={(value) => setFilters(prev => ({ ...prev, complexity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoryFilter">Category</Label>
                <Input
                  placeholder="Filter by category"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="minScore">Min Score (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations List */}
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation, index) => {
            const template = getTemplate(recommendation.templateId);
            if (!template) return null;

            const isExpanded = expandedRecommendation === recommendation.templateId;

            return (
              <Card key={recommendation.templateId} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                        <Badge variant="outline">{Math.round(recommendation.score * 100)}% match</Badge>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{template.vendor}</Badge>
                          <Badge variant="outline">{recommendation.estimatedComplexity}</Badge>
                          <Badge 
                            variant={recommendation.confidenceLevel === 'high' ? 'default' : 
                                   recommendation.confidenceLevel === 'medium' ? 'secondary' : 'outline'}
                          >
                            {recommendation.confidenceLevel} confidence
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedRecommendation(isExpanded ? null : recommendation.templateId)}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApplyTemplate(recommendation.templateId)}
                      >
                        Apply Template
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t pt-4">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="implementation">Implementation</TabsTrigger>
                        <TabsTrigger value="risks">Risks & Requirements</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Why This Template?</h4>
                          <ul className="space-y-1">
                            {recommendation.reasons.map((reason, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-primary" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Template Description</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Estimated Deployment Time</h4>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{recommendation.estimatedDeploymentTime} hours</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Customization Level</h4>
                            <Badge variant="outline">{recommendation.customizationLevel}</Badge>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Adaptation Suggestions</h4>
                          <ul className="space-y-1">
                            {recommendation.adaptationSuggestions.map((suggestion, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <Zap className="h-3 w-3 text-warning" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="implementation" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {recommendation.requiredSkills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Dependencies</h4>
                          <ul className="space-y-1">
                            {recommendation.dependencies.map((dependency, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <ArrowRight className="h-3 w-3" />
                                {dependency}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="risks" className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Risk Factors</h4>
                          <ul className="space-y-1">
                            {recommendation.riskFactors.map((risk, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-8">
            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recommendations match your current filters. Try adjusting the filter criteria.</p>
          </div>
        )}
      </div>
    );
  };

  const renderImplementationStrategy = () => {
    if (!recommendations?.implementationStrategy) {
      return (
        <div className="text-center py-8">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Generate recommendations first to see implementation strategy.</p>
        </div>
      );
    }

    const strategy = recommendations.implementationStrategy;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Timeline</CardTitle>
            <CardDescription>
              Total estimated timeline: {strategy.totalTimeline} weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategy.phases.map((phase, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Phase {index + 1}: {phase.name}</h4>
                    <Badge variant="outline">{phase.duration} weeks</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-1">Templates</h5>
                      <ul className="space-y-1">
                        {phase.templates.map((templateId, idx) => {
                          const template = getTemplate(templateId);
                          return (
                            <li key={idx} className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              {template?.name || templateId}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Dependencies</h5>
                      <ul className="space-y-1">
                        {phase.dependencies.map((dependency, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <ArrowRight className="h-3 w-3" />
                            {dependency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Critical Path</h4>
                <ul className="space-y-1">
                  {strategy.criticalPath.map((item, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Target className="h-3 w-3 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Required Resources</h4>
                <ul className="space-y-1">
                  {strategy.resourceRequirements.map((resource, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (mode === 'embedded') {
    return (
      <div className="space-y-4">
        {/* Simplified embedded version */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Smart Template Recommendations</h3>
          <Button onClick={handleGenerateRecommendations} disabled={isGenerating} size="sm">
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
          </Button>
        </div>
        {recommendations && (
          <div className="space-y-2">
            {recommendations.recommendations.slice(0, 3).map((rec, index) => {
              const template = getTemplate(rec.templateId);
              return template ? (
                <div key={rec.templateId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">{Math.round(rec.score * 100)}% match</p>
                  </div>
                  <Button size="sm" onClick={() => handleApplyTemplate(rec.templateId)}>
                    Apply
                  </Button>
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Template Recommendation Engine</h2>
          <p className="text-muted-foreground">
            AI-powered template recommendations based on your specific requirements and context
          </p>
        </div>
        {recommendations && (
          <Badge variant="outline" className="text-sm">
            Confidence: {Math.round(recommendations.metadata.confidence * 100)}%
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Implementation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          {renderConfigurationForm()}
        </TabsContent>

        <TabsContent value="recommendations">
          {renderRecommendations()}
        </TabsContent>

        <TabsContent value="strategy">
          {renderImplementationStrategy()}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTemplateRecommendationEngine;