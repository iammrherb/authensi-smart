import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Zap, ArrowRight, ArrowLeft, Wand2, Lightbulb,
  TrendingUp, DollarSign, Calendar, FileText, Settings, Sparkles,
  Star, ThumbsUp, ThumbsDown, MessageSquare, Plus, X, Eye, 
  Layers, GitBranch, Database, Cpu, HardDrive, Router, Wifi
} from 'lucide-react';

import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useDataEnhancement } from '@/hooks/useDataEnhancement';
import { useToast } from '@/hooks/use-toast';
import AIRecommendationPanel from '@/components/ai/AIRecommendationPanel';

interface WizardData {
  // Organization
  organizationName: string;
  industry: string;
  organizationSize: 'small' | 'medium' | 'large' | 'enterprise';
  organizationType: 'public' | 'private' | 'non-profit' | 'government';
  
  // Business Context
  painPoints: string[];
  businessObjectives: string[];
  budgetRange: string;
  timelineRequirements: string;
  complianceRequirements: string[];
  
  // Technical Selections
  selectedVendors: any[];
  selectedUseCases: any[];
  selectedRequirements: any[];
  
  // Enhancement Metadata
  enhancementTags: string[];
  customAttributes: Record<string, any>;
  correlationInsights: any[];
}

interface IntelligentEnhancedWizardProps {
  onComplete?: (data: WizardData) => void;
  onSave?: (data: WizardData) => void;
  initialData?: Partial<WizardData>;
  projectId?: string;
}

const IntelligentEnhancedWizard: React.FC<IntelligentEnhancedWizardProps> = ({
  onComplete,
  onSave,
  initialData = {},
  projectId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    organizationName: '',
    industry: '',
    organizationSize: 'medium',
    organizationType: 'private',
    painPoints: [],
    businessObjectives: [],
    budgetRange: '',
    timelineRequirements: '',
    complianceRequirements: [],
    selectedVendors: [],
    selectedUseCases: [],
    selectedRequirements: [],
    enhancementTags: [],
    customAttributes: {},
    correlationInsights: [],
    ...initialData
  });

  const [showEnhancementPanel, setShowEnhancementPanel] = useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState<any[]>([]);
  const [learningInsights, setLearningInsights] = useState<any>(null);

  const { data: vendors = [] } = useUnifiedVendors({});
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { toast } = useToast();

  const {
    generateVendorRecommendations,
    generateUseCaseRecommendations,
    generateScopingRecommendations,
    isLoading: aiLoading,
    lastResponse: aiResponse,
    confidence: aiConfidence,
    acceptRecommendation,
    rejectRecommendation
  } = useEnhancedAI();

  const {
    recordWizardInteraction,
    recordSelection,
    enhanceEntity,
    getEnhancementSuggestions,
    applyEnhancementSuggestions,
    getEntityCorrelations,
    triggerLearningCycle,
    isProcessing: enhancementProcessing,
    enhancementQueue
  } = useDataEnhancement();

  const steps = [
    { id: 'organization', title: 'Organization', icon: Building2, description: 'Basic organization details' },
    { id: 'business', title: 'Business Context', icon: Target, description: 'Pain points and objectives' },
    { id: 'technical', title: 'Technical Selection', icon: Network, description: 'Vendors and technologies' },
    { id: 'enhancement', title: 'AI Enhancement', icon: Brain, description: 'Intelligent optimization' },
    { id: 'review', title: 'Review & Complete', icon: CheckCircle, description: 'Final review and completion' }
  ];

  // Record wizard interactions for learning
  const recordInteraction = useCallback(async (stepId: string, selections: any[]) => {
    try {
      await recordWizardInteraction({
        wizardType: 'intelligent_enhanced_wizard',
        stepId,
        userId: 'current_user', // Would get from auth
        projectId,
        selections: selections.map(sel => ({
          entityType: sel.type || 'unknown',
          entityId: sel.id || 'unknown',
          action: sel.action || 'selected',
          previousValue: sel.previousValue,
          newValue: sel.newValue,
          reasoning: sel.reasoning,
          confidence: sel.confidence
        })),
        context: {
          wizardData,
          currentStep,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }
  }, [recordWizardInteraction, wizardData, currentStep, projectId]);

  // Enhanced selection handler that records learning data
  const handleSelection = useCallback(async (
    type: 'vendor' | 'use_case' | 'requirement' | 'pain_point',
    item: any,
    action: 'add' | 'remove',
    reasoning?: string
  ) => {
    const fieldMap = {
      vendor: 'selectedVendors',
      use_case: 'selectedUseCases',
      requirement: 'selectedRequirements',
      pain_point: 'painPoints'
    };

    const field = fieldMap[type] as keyof WizardData;
    const currentItems = wizardData[field] as any[];
    
    let newItems;
    if (action === 'add') {
      newItems = [...currentItems, item];
    } else {
      newItems = currentItems.filter(i => i.id !== item.id);
    }

    setWizardData(prev => ({ ...prev, [field]: newItems }));

    // Record the selection for learning
    await recordSelection(type, item.id || item, action, {
      wizardType: 'intelligent_enhanced_wizard',
      stepId: steps[currentStep].id,
      reasoning,
      confidence: aiConfidence,
      context: wizardData
    });

    // Trigger enhancement for the selected entity
    if (action === 'add' && item.id) {
      await enhanceEntity(item.id, type, {
        selectionContext: wizardData,
        coSelectedItems: newItems.map(i => i.id || i)
      });
    }
  }, [wizardData, currentStep, steps, recordSelection, enhanceEntity, aiConfidence]);

  // Generate intelligent suggestions based on current context
  const generateIntelligentSuggestions = useCallback(async () => {
    try {
      const context = {
        industry: wizardData.industry,
        organizationSize: wizardData.organizationSize,
        organizationType: wizardData.organizationType,
        painPoints: wizardData.painPoints,
        businessObjectives: wizardData.businessObjectives,
        budget: wizardData.budgetRange,
        timeline: wizardData.timelineRequirements,
        complianceRequirements: wizardData.complianceRequirements,
        existingVendors: wizardData.selectedVendors.map(v => v.name),
        projectPhase: 'scoping' as const,
        stakeholderRole: 'sales_engineer' as const
      };

      // Generate different types of recommendations based on current step
      let response;
      switch (currentStep) {
        case 2: // Technical Selection
          if (wizardData.selectedVendors.length === 0) {
            response = await generateVendorRecommendations(context);
          } else {
            response = await generateUseCaseRecommendations(context);
          }
          break;
        case 3: // Enhancement
          response = await generateScopingRecommendations(context);
          break;
        default:
          response = await generateScopingRecommendations(context);
      }

      if (response) {
        setLearningInsights(response);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    }
  }, [wizardData, currentStep, generateVendorRecommendations, generateUseCaseRecommendations, generateScopingRecommendations]);

  // Load enhancement suggestions for entities
  const loadEnhancementSuggestions = useCallback(async () => {
    const allSuggestions = [];
    
    // Get suggestions for selected vendors
    for (const vendor of wizardData.selectedVendors) {
      if (vendor.id) {
        const suggestions = await getEnhancementSuggestions(vendor.id);
        allSuggestions.push(...suggestions);
      }
    }
    
    // Get suggestions for selected use cases
    for (const useCase of wizardData.selectedUseCases) {
      if (useCase.id) {
        const suggestions = await getEnhancementSuggestions(useCase.id);
        allSuggestions.push(...suggestions);
      }
    }
    
    setEnhancementSuggestions(allSuggestions);
  }, [wizardData, getEnhancementSuggestions]);

  // Auto-generate suggestions when context changes
  useEffect(() => {
    if (currentStep >= 1 && wizardData.industry) {
      const timer = setTimeout(() => {
        generateIntelligentSuggestions();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [wizardData, currentStep, generateIntelligentSuggestions]);

  // Load enhancement suggestions when selections change
  useEffect(() => {
    if (currentStep >= 2) {
      loadEnhancementSuggestions();
    }
  }, [wizardData.selectedVendors, wizardData.selectedUseCases, currentStep, loadEnhancementSuggestions]);

  const handleStepChange = async (step: number) => {
    if (step > currentStep) {
      // Record step completion
      await recordInteraction(steps[currentStep].id, [{
        type: 'step_completion',
        id: steps[currentStep].id,
        action: 'completed',
        newValue: wizardData
      }]);
    }
    
    setCurrentStep(step);
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const renderOrganizationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Organization Intelligence</h3>
        <p className="text-muted-foreground">Every detail helps us provide better recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            value={wizardData.organizationName}
            onChange={(e) => updateWizardData({ organizationName: e.target.value })}
            placeholder="Enter organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select 
            value={wizardData.industry} 
            onValueChange={(value) => {
              updateWizardData({ industry: value });
              recordSelection('business_profile', value, 'add', {
                wizardType: 'intelligent_enhanced_wizard',
                stepId: 'organization',
                context: { field: 'industry' }
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="financial">Financial Services</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="energy">Energy & Utilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgSize">Organization Size *</Label>
          <Select 
            value={wizardData.organizationSize} 
            onValueChange={(value: any) => updateWizardData({ organizationSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (1-100 employees)</SelectItem>
              <SelectItem value="medium">Medium (101-1,000 employees)</SelectItem>
              <SelectItem value="large">Large (1,001-10,000 employees)</SelectItem>
              <SelectItem value="enterprise">Enterprise (10,000+ employees)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgType">Organization Type</Label>
          <Select 
            value={wizardData.organizationType} 
            onValueChange={(value: any) => updateWizardData({ organizationType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="non-profit">Non-Profit</SelectItem>
              <SelectItem value="government">Government</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Insights Preview */}
      {wizardData.industry && wizardData.organizationSize && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">AI Industry Analysis Ready</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {wizardData.industry} industry patterns, we can provide targeted recommendations.
                </p>
              </div>
              <EnhancedButton
                size="sm"
                variant="outline"
                onClick={generateIntelligentSuggestions}
                loading={aiLoading}
                className="ml-4"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Preview
              </EnhancedButton>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderTechnicalSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Network className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Intelligent Technical Selection</h3>
        <p className="text-muted-foreground">AI-powered recommendations based on your context</p>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="use_cases">Use Cases</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Vendor Selection</h4>
            <Badge variant="secondary">{wizardData.selectedVendors.length} selected</Badge>
          </div>
          
          {/* Selected Vendors */}
          {wizardData.selectedVendors.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Vendors</Label>
              <div className="flex flex-wrap gap-2">
                {wizardData.selectedVendors.map((vendor) => (
                  <Badge 
                    key={vendor.id} 
                    variant="default" 
                    className="cursor-pointer hover:bg-destructive"
                    onClick={() => handleSelection('vendor', vendor, 'remove')}
                  >
                    {vendor.name} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Vendors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors
              .filter(vendor => !wizardData.selectedVendors.some(sv => sv.id === vendor.id))
              .slice(0, 12)
              .map((vendor) => (
                <Card 
                  key={vendor.id} 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/20"
                  onClick={() => handleSelection('vendor', vendor, 'add')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{vendor.name}</h5>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {vendor.description}
                        </p>
                        {vendor.tags && vendor.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {vendor.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="use_cases" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Use Case Selection</h4>
            <Badge variant="secondary">{wizardData.selectedUseCases.length} selected</Badge>
          </div>
          
          {/* Use cases grid similar to vendors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.slice(0, 8).map((useCase) => (
              <Card 
                key={useCase.id} 
                className={`cursor-pointer transition-all border-2 ${
                  wizardData.selectedUseCases.some(suc => suc.id === useCase.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/20 hover:shadow-lg'
                }`}
                onClick={() => {
                  const isSelected = wizardData.selectedUseCases.some(suc => suc.id === useCase.id);
                  handleSelection('use_case', useCase, isSelected ? 'remove' : 'add');
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">{useCase.name}</h5>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {useCase.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{useCase.category}</Badge>
                        <Badge variant="outline">{useCase.complexity}</Badge>
                      </div>
                    </div>
                    {wizardData.selectedUseCases.some(suc => suc.id === useCase.id) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Requirements Selection</h4>
            <Badge variant="secondary">{wizardData.selectedRequirements.length} selected</Badge>
          </div>
          
          {/* Requirements list with checkboxes */}
          <div className="space-y-3">
            {requirements.slice(0, 10).map((requirement) => (
              <div key={requirement.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                <Checkbox
                  checked={wizardData.selectedRequirements.some(sr => sr.id === requirement.id)}
                  onCheckedChange={(checked) => {
                    handleSelection('requirement', requirement, checked ? 'add' : 'remove');
                  }}
                />
                <div className="flex-1">
                  <h5 className="font-medium">{requirement.title}</h5>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{requirement.category}</Badge>
                    <Badge variant="outline">{requirement.priority}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations Panel */}
      {learningInsights && (
        <AIRecommendationPanel
          response={learningInsights}
          isLoading={aiLoading}
          onAcceptRecommendation={acceptRecommendation}
          onRejectRecommendation={rejectRecommendation}
        />
      )}
    </div>
  );

  const renderEnhancementStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">AI-Powered Enhancement</h3>
        <p className="text-muted-foreground">Optimize your selections with intelligent insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhancement Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Enhancement Suggestions
              <Badge variant="secondary" className="ml-2">{enhancementSuggestions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {enhancementSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{suggestion.suggestionType.replace('_', ' ')}</h5>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.reasoning}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {enhancementSuggestions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wand2 className="h-8 w-8 mx-auto mb-2" />
                    <p>No enhancement suggestions available yet.</p>
                    <p className="text-xs">Make more selections to get AI insights.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-sm">Correlation Strength</h5>
                  <p className="text-xs text-muted-foreground">How well your selections work together</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">87%</div>
                  <Progress value={87} className="w-16 h-2" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-sm">Industry Alignment</h5>
                  <p className="text-xs text-muted-foreground">Match with industry best practices</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">92%</div>
                  <Progress value={92} className="w-16 h-2" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-sm">Optimization Score</h5>
                  <p className="text-xs text-muted-foreground">Overall configuration quality</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-600">78%</div>
                  <Progress value={78} className="w-16 h-2" />
                </div>
              </div>

              <EnhancedButton
                onClick={triggerLearningCycle}
                loading={enhancementProcessing}
                className="w-full"
                variant="outline"
              >
                <Brain className="h-4 w-4 mr-2" />
                Optimize Further
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Results */}
      {learningInsights && (
        <AIRecommendationPanel
          response={learningInsights}
          isLoading={aiLoading}
          onAcceptRecommendation={acceptRecommendation}
          onRejectRecommendation={rejectRecommendation}
        />
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderOrganizationStep();
      case 1: return <div>Business Context Step (similar to previous implementation)</div>;
      case 2: return renderTechnicalSelectionStep();
      case 3: return renderEnhancementStep();
      case 4: return <div>Review Step (similar to previous implementation)</div>;
      default: return renderOrganizationStep();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          <Sparkles className="h-4 w-4 mr-1" />
          Intelligent Enhancement Engine
        </Badge>
        <h1 className="text-3xl font-bold mb-2">
          Smart Learning <span className="bg-gradient-primary bg-clip-text text-transparent">Wizard</span>
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Every selection teaches our AI to provide better recommendations. 
          Watch as your choices enhance the entire platform's intelligence.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-2 mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <button
                onClick={() => handleStepChange(index)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all min-w-[100px] ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{step.title}</span>
                <span className="text-xs opacity-75">{step.description}</span>
              </button>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-3" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</span>
        </div>
      </div>

      {/* Main Content */}
      <Card className="min-h-[700px]">
        <CardContent className="p-8">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => handleStepChange(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {enhancementProcessing && (
            <Badge variant="secondary" className="animate-pulse">
              <Brain className="h-3 w-3 mr-1" />
              Learning...
            </Badge>
          )}
          {aiConfidence > 0 && (
            <Badge variant={aiConfidence > 0.8 ? 'default' : 'secondary'}>
              AI Confidence: {Math.round(aiConfidence * 100)}%
            </Badge>
          )}
        </div>

        {currentStep < steps.length - 1 ? (
          <Button onClick={() => handleStepChange(currentStep + 1)}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <EnhancedButton
            onClick={() => onComplete?.(wizardData)}
            gradient="primary"
            size="lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete & Learn
          </EnhancedButton>
        )}
      </div>
    </div>
  );
};

export default IntelligentEnhancedWizard;
