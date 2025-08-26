import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Building2, Network, Shield, Users, Target, Clock, Brain, CheckCircle, 
  AlertTriangle, Globe, Zap, ArrowRight, ArrowLeft, Wand2, Lightbulb,
  TrendingUp, DollarSign, Calendar, FileText, Settings, Sparkles
} from 'lucide-react';

import { useUnifiedVendors } from '@/hooks/useUnifiedVendors';
import { useUseCases } from '@/hooks/useUseCases';
import { useRequirements } from '@/hooks/useRequirements';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { useToast } from '@/hooks/use-toast';
import { AIContext } from '@/services/ai/EnhancedAIService';
import AIRecommendationPanel from '@/components/ai/AIRecommendationPanel';

interface ScopingData {
  // Organization Details
  organizationName: string;
  industry: string;
  organizationSize: 'small' | 'medium' | 'large' | 'enterprise';
  organizationType: 'public' | 'private' | 'non-profit' | 'government';
  locations: string[];
  
  // Business Context
  painPoints: string[];
  businessObjectives: string[];
  budgetRange: string;
  timelineRequirements: string;
  complianceRequirements: string[];
  
  // Technical Context
  existingVendors: string[];
  networkArchitecture: string;
  deviceCount: number;
  securityPosture: 'basic' | 'intermediate' | 'advanced' | 'enterprise';
  
  // Project Context
  projectPhase: 'discovery' | 'scoping' | 'design' | 'implementation' | 'testing' | 'deployment';
  stakeholderRole: 'sales' | 'sales_engineer' | 'customer_success' | 'implementation' | 'support';
}

interface AIEnhancedScopingWizardProps {
  onComplete?: (scopingData: ScopingData) => void;
  onSave?: (scopingData: ScopingData) => void;
  initialData?: Partial<ScopingData>;
  mode?: 'create' | 'edit';
}

const AIEnhancedScopingWizard: React.FC<AIEnhancedScopingWizardProps> = ({
  onComplete,
  onSave,
  initialData = {},
  mode = 'create'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scopingData, setScopingData] = useState<ScopingData>({
    organizationName: '',
    industry: '',
    organizationSize: 'medium',
    organizationType: 'private',
    locations: [],
    painPoints: [],
    businessObjectives: [],
    budgetRange: '',
    timelineRequirements: '',
    complianceRequirements: [],
    existingVendors: [],
    networkArchitecture: '',
    deviceCount: 0,
    securityPosture: 'intermediate',
    projectPhase: 'scoping',
    stakeholderRole: 'sales_engineer',
    ...initialData
  });

  const [aiInsights, setAiInsights] = useState<any>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [autoAnalyzeEnabled, setAutoAnalyzeEnabled] = useState(true);

  const { data: vendors = [] } = useUnifiedVendors({});
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();
  const { toast } = useToast();

  const {
    generateScopingRecommendations,
    generateVendorRecommendations,
    generateUseCaseRecommendations,
    generateSalesRecommendations,
    generateSERecommendations,
    isLoading: aiLoading,
    lastResponse: aiResponse,
    confidence: aiConfidence,
    acceptRecommendation,
    rejectRecommendation,
    clearError
  } = useEnhancedAI();

  const steps = [
    { id: 'organization', title: 'Organization', icon: Building2 },
    { id: 'business', title: 'Business Context', icon: Target },
    { id: 'technical', title: 'Technical Context', icon: Network },
    { id: 'ai_analysis', title: 'AI Analysis', icon: Brain },
    { id: 'review', title: 'Review & Complete', icon: CheckCircle }
  ];

  // Build AI context from current scoping data
  const buildAIContext = useCallback((): AIContext => {
    return {
      industry: scopingData.industry,
      organizationSize: scopingData.organizationSize,
      organizationType: scopingData.organizationType,
      locations: scopingData.locations,
      painPoints: scopingData.painPoints,
      businessObjectives: scopingData.businessObjectives,
      budget: scopingData.budgetRange,
      timeline: scopingData.timelineRequirements,
      complianceRequirements: scopingData.complianceRequirements,
      existingVendors: scopingData.existingVendors,
      networkArchitecture: scopingData.networkArchitecture,
      deviceCount: scopingData.deviceCount,
      securityPosture: scopingData.securityPosture,
      projectPhase: scopingData.projectPhase,
      stakeholderRole: scopingData.stakeholderRole
    };
  }, [scopingData]);

  // Auto-analyze when data changes (if enabled)
  useEffect(() => {
    if (autoAnalyzeEnabled && currentStep >= 2) {
      const timer = setTimeout(() => {
        generateIntelligentInsights();
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [scopingData, autoAnalyzeEnabled, currentStep]);

  const generateIntelligentInsights = async () => {
    if (!scopingData.industry || !scopingData.organizationSize) return;

    try {
      const context = buildAIContext();
      
      // Generate different types of recommendations based on stakeholder role
      let response;
      switch (scopingData.stakeholderRole) {
        case 'sales':
          response = await generateSalesRecommendations(context);
          break;
        case 'sales_engineer':
          response = await generateSERecommendations(context);
          break;
        default:
          response = await generateScopingRecommendations(context);
      }

      setAiInsights(response);
      setShowAIPanel(true);

    } catch (error) {
      console.error('AI Analysis Error:', error);
    }
  };

  const handleStepChange = (step: number) => {
    if (step > currentStep && !validateCurrentStep()) {
      return;
    }
    setCurrentStep(step);
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Organization
        return !!(scopingData.organizationName && scopingData.industry && scopingData.organizationSize);
      case 1: // Business
        return !!(scopingData.painPoints.length > 0 && scopingData.businessObjectives.length > 0);
      case 2: // Technical
        return !!(scopingData.networkArchitecture && scopingData.securityPosture);
      default:
        return true;
    }
  };

  const updateScopingData = (updates: Partial<ScopingData>) => {
    setScopingData(prev => ({ ...prev, ...updates }));
  };

  const addToArray = (field: keyof ScopingData, value: string) => {
    const currentArray = scopingData[field] as string[];
    if (!currentArray.includes(value)) {
      updateScopingData({
        [field]: [...currentArray, value]
      });
    }
  };

  const removeFromArray = (field: keyof ScopingData, value: string) => {
    const currentArray = scopingData[field] as string[];
    updateScopingData({
      [field]: currentArray.filter(item => item !== value)
    });
  };

  const renderOrganizationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Organization Details</h3>
        <p className="text-muted-foreground">Tell us about your organization to get personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            value={scopingData.organizationName}
            onChange={(e) => updateScopingData({ organizationName: e.target.value })}
            placeholder="Enter organization name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select value={scopingData.industry} onValueChange={(value) => updateScopingData({ industry: value })}>
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
          <Select value={scopingData.organizationSize} onValueChange={(value: any) => updateScopingData({ organizationSize: value })}>
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
          <Select value={scopingData.organizationType} onValueChange={(value: any) => updateScopingData({ organizationType: value })}>
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

      <div className="space-y-2">
        <Label>Locations</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {scopingData.locations.map((location) => (
            <Badge key={location} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('locations', location)}>
              {location} <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Add location (e.g., New York, London)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  addToArray('locations', value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      </div>

      {/* AI Insight Preview */}
      {scopingData.industry && scopingData.organizationSize && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>AI is analyzing your organization profile for industry-specific insights...</span>
              <EnhancedButton
                size="sm"
                variant="outline"
                onClick={generateIntelligentInsights}
                loading={aiLoading}
                className="ml-4"
              >
                <Brain className="h-4 w-4 mr-1" />
                Get Insights
              </EnhancedButton>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  const renderBusinessStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Business Context</h3>
        <p className="text-muted-foreground">Define your business objectives and challenges</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Pain Points & Challenges *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {scopingData.painPoints.map((painPoint) => (
              <Badge key={painPoint} variant="destructive" className="cursor-pointer" onClick={() => removeFromArray('painPoints', painPoint)}>
                {painPoint} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <Textarea
            placeholder="Describe your current pain points and challenges (press Enter to add each one)"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = (e.target as HTMLTextAreaElement).value.trim();
                if (value) {
                  addToArray('painPoints', value);
                  (e.target as HTMLTextAreaElement).value = '';
                }
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Business Objectives *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {scopingData.businessObjectives.map((objective) => (
              <Badge key={objective} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('businessObjectives', objective)}>
                {objective} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <Textarea
            placeholder="What are your key business objectives? (press Enter to add each one)"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = (e.target as HTMLTextAreaElement).value.trim();
                if (value) {
                  addToArray('businessObjectives', value);
                  (e.target as HTMLTextAreaElement).value = '';
                }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Budget Range</Label>
            <Select value={scopingData.budgetRange} onValueChange={(value) => updateScopingData({ budgetRange: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50k">Under $50K</SelectItem>
                <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="over-1m">Over $1M</SelectItem>
              </SelectTrigger>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timeline Requirements</Label>
            <Select value={scopingData.timelineRequirements} onValueChange={(value) => updateScopingData({ timelineRequirements: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
                <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                <SelectItem value="long-term">Long-term (12+ months)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Compliance Requirements</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {scopingData.complianceRequirements.map((requirement) => (
              <Badge key={requirement} variant="outline" className="cursor-pointer" onClick={() => removeFromArray('complianceRequirements', requirement)}>
                {requirement} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['HIPAA', 'PCI DSS', 'SOX', 'GDPR', 'FISMA', 'FERPA', 'ISO 27001', 'NIST'].map((compliance) => (
              <Button
                key={compliance}
                variant={scopingData.complianceRequirements.includes(compliance) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  if (scopingData.complianceRequirements.includes(compliance)) {
                    removeFromArray('complianceRequirements', compliance);
                  } else {
                    addToArray('complianceRequirements', compliance);
                  }
                }}
              >
                {compliance}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechnicalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Network className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Technical Context</h3>
        <p className="text-muted-foreground">Help us understand your technical environment</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Existing Vendors</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {scopingData.existingVendors.map((vendor) => (
              <Badge key={vendor} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('existingVendors', vendor)}>
                {vendor} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add existing vendors (press Enter to add)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  addToArray('existingVendors', value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Network Architecture *</Label>
            <Select value={scopingData.networkArchitecture} onValueChange={(value) => updateScopingData({ networkArchitecture: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select architecture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traditional">Traditional (On-premises)</SelectItem>
                <SelectItem value="hybrid">Hybrid (Cloud + On-premises)</SelectItem>
                <SelectItem value="cloud-first">Cloud-first</SelectItem>
                <SelectItem value="multi-cloud">Multi-cloud</SelectItem>
                <SelectItem value="edge-computing">Edge Computing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Security Posture *</Label>
            <Select value={scopingData.securityPosture} onValueChange={(value: any) => updateScopingData({ securityPosture: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select security level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Minimal security controls)</SelectItem>
                <SelectItem value="intermediate">Intermediate (Standard security)</SelectItem>
                <SelectItem value="advanced">Advanced (Strong security controls)</SelectItem>
                <SelectItem value="enterprise">Enterprise (Military-grade security)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Approximate Device Count</Label>
          <Input
            type="number"
            value={scopingData.deviceCount || ''}
            onChange={(e) => updateScopingData({ deviceCount: parseInt(e.target.value) || 0 })}
            placeholder="Enter total number of devices"
          />
        </div>
      </div>
    </div>
  );

  const renderAIAnalysisStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">AI-Powered Analysis</h3>
        <p className="text-muted-foreground">Get intelligent recommendations based on your context</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <EnhancedButton
            onClick={generateIntelligentInsights}
            loading={aiLoading}
            gradient="primary"
            className="relative"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Analysis
          </EnhancedButton>
          
          {aiConfidence > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Badge variant={aiConfidence > 0.8 ? 'default' : aiConfidence > 0.6 ? 'secondary' : 'destructive'}>
                {Math.round(aiConfidence * 100)}%
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-analyze" className="text-sm">Auto-analyze</Label>
          <input
            id="auto-analyze"
            type="checkbox"
            checked={autoAnalyzeEnabled}
            onChange={(e) => setAutoAnalyzeEnabled(e.target.checked)}
            className="rounded"
          />
        </div>
      </div>

      {aiResponse && (
        <AIRecommendationPanel
          response={aiResponse}
          isLoading={aiLoading}
          onAcceptRecommendation={acceptRecommendation}
          onRejectRecommendation={rejectRecommendation}
        />
      )}

      {!aiResponse && !aiLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Wand2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h4 className="text-lg font-medium mb-2">Ready for AI Analysis</h4>
              <p className="text-muted-foreground mb-4">
                Click "Generate AI Analysis" to get personalized recommendations based on your context.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Review & Complete</h3>
        <p className="text-muted-foreground">Review your scoping information and AI recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Organization Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Name:</strong> {scopingData.organizationName}</div>
            <div><strong>Industry:</strong> {scopingData.industry}</div>
            <div><strong>Size:</strong> {scopingData.organizationSize}</div>
            <div><strong>Type:</strong> {scopingData.organizationType}</div>
            {scopingData.locations.length > 0 && (
              <div><strong>Locations:</strong> {scopingData.locations.join(', ')}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Business Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Pain Points:</strong> {scopingData.painPoints.length}</div>
            <div><strong>Objectives:</strong> {scopingData.businessObjectives.length}</div>
            <div><strong>Budget:</strong> {scopingData.budgetRange || 'Not specified'}</div>
            <div><strong>Timeline:</strong> {scopingData.timelineRequirements || 'Not specified'}</div>
            <div><strong>Compliance:</strong> {scopingData.complianceRequirements.length} requirements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="h-5 w-5 mr-2" />
              Technical Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Architecture:</strong> {scopingData.networkArchitecture}</div>
            <div><strong>Security Posture:</strong> {scopingData.securityPosture}</div>
            <div><strong>Device Count:</strong> {scopingData.deviceCount || 'Not specified'}</div>
            <div><strong>Existing Vendors:</strong> {scopingData.existingVendors.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiResponse ? (
              <>
                <div><strong>Recommendations:</strong> {aiResponse.recommendations.length}</div>
                <div><strong>Confidence:</strong> {Math.round(aiResponse.confidence * 100)}%</div>
                <div><strong>Analysis:</strong> {aiResponse.summary}</div>
              </>
            ) : (
              <div className="text-muted-foreground">No AI analysis performed yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4 pt-6">
        <Button variant="outline" onClick={() => onSave?.(scopingData)}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <EnhancedButton
          onClick={() => onComplete?.(scopingData)}
          gradient="primary"
          size="lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete Scoping
        </EnhancedButton>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderOrganizationStep();
      case 1: return renderBusinessStep();
      case 2: return renderTechnicalStep();
      case 3: return renderAIAnalysisStep();
      case 4: return renderReviewStep();
      default: return renderOrganizationStep();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge variant="glow" className="mb-4">
          <Sparkles className="h-4 w-4 mr-1" />
          AI-Enhanced Scoping
        </Badge>
        <h1 className="text-3xl font-bold mb-2">
          Intelligent Project <span className="bg-gradient-primary bg-clip-text text-transparent">Scoping Wizard</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get AI-powered recommendations and insights tailored to your specific context and requirements.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => handleStepChange(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : isCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        <div className="text-center mt-2 text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Main Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleStepChange(currentStep - 1)}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length - 1 && (
          <Button
            onClick={() => handleStepChange(currentStep + 1)}
            disabled={!validateCurrentStep()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIEnhancedScopingWizard;
