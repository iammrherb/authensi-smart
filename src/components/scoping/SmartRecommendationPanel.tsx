import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Plus, Search, AlertTriangle, CheckSquare, FileText, 
  X, Lightbulb, TrendingUp, Shield, Network
} from "lucide-react";
import EnhancedLibrarySelector from "../library/EnhancedLibrarySelector";
import UnifiedRequirementsManager from "../requirements/UnifiedRequirementsManager";
import { usePainPoints } from "@/hooks/usePainPoints";
import { useRequirements } from "@/hooks/useRequirements";
import { useUseCases } from "@/hooks/useUseCases";

interface SmartRecommendation {
  id: string;
  type: 'pain_point' | 'use_case' | 'requirement';
  title: string;
  description: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  actionable: boolean;
  relatedItems?: {
    painPoints?: string[];
    useCases?: string[];
    requirements?: string[];
  };
}

interface SmartRecommendationPanelProps {
  scopingData: any;
  selectedPainPoints: string[];
  selectedUseCases: string[];
  selectedRequirements: string[];
  onPainPointsChange: (painPoints: string[]) => void;
  onUseCasesChange: (useCases: string[]) => void;
  onRequirementsChange: (requirements: string[]) => void;
}

const SmartRecommendationPanel: React.FC<SmartRecommendationPanelProps> = ({
  scopingData,
  selectedPainPoints,
  selectedUseCases,
  selectedRequirements,
  onPainPointsChange,
  onUseCasesChange,
  onRequirementsChange
}) => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([]);

  const { data: painPoints = [] } = usePainPoints();
  const { data: useCases = [] } = useUseCases();
  const { data: requirements = [] } = useRequirements();

  // Generate intelligent recommendations based on scoping data
  useEffect(() => {
    if (!scopingData) return;

    const newRecommendations: SmartRecommendation[] = [];

    // Industry-specific recommendations
    if (scopingData.organization?.industry) {
      const industry = scopingData.organization.industry;
      
      switch (industry.toLowerCase()) {
        case 'healthcare':
          newRecommendations.push({
            id: 'healthcare_hipaa',
            type: 'requirement',
            title: 'HIPAA Compliance Requirements',
            description: 'Healthcare organizations must implement strict access controls and audit trails for patient data protection.',
            reason: `Based on your ${industry} industry selection`,
            priority: 'critical',
            category: 'compliance',
            actionable: true,
            relatedItems: {
              painPoints: ['compliance_challenges', 'audit_trail_gaps'],
              useCases: ['medical_device_segmentation', 'patient_data_protection']
            }
          });
          break;
        case 'finance':
          newRecommendations.push({
            id: 'finance_pci',
            type: 'requirement',
            title: 'PCI-DSS Compliance',
            description: 'Financial institutions require network segmentation for payment card data environments.',
            reason: `Based on your ${industry} industry selection`,
            priority: 'critical',
            category: 'compliance',
            actionable: true,
            relatedItems: {
              useCases: ['payment_processing_security', 'financial_data_isolation']
            }
          });
          break;
        case 'government':
          newRecommendations.push({
            id: 'gov_security',
            type: 'use_case',
            title: 'Government Security Framework',
            description: 'Implement NIST-based security controls with enhanced monitoring and reporting.',
            reason: `Based on your ${industry} industry selection`,
            priority: 'high',
            category: 'security',
            actionable: true
          });
          break;
      }
    }

    // Organization size-based recommendations
    if (scopingData.organization?.total_users) {
      const userCount = parseInt(scopingData.organization.total_users);
      
      if (userCount > 1000) {
        newRecommendations.push({
          id: 'enterprise_byod',
          type: 'use_case',
          title: 'Enterprise BYOD Management',
          description: 'Large organizations benefit from comprehensive device profiling and policy enforcement.',
          reason: `Based on your organization size (${userCount} users)`,
          priority: 'high',
          category: 'access_control',
          actionable: true,
          relatedItems: {
            painPoints: ['byod_security', 'device_visibility'],
            requirements: ['device_profiling', 'policy_enforcement']
          }
        });
      }

      if (userCount > 500) {
        newRecommendations.push({
          id: 'network_segmentation',
          type: 'requirement',
          title: 'Advanced Network Segmentation',
          description: 'Medium to large organizations should implement micro-segmentation for enhanced security.',
          reason: `Based on your organization size (${userCount} users)`,
          priority: 'medium',
          category: 'security',
          actionable: true
        });
      }
    }

    // Pain point-based recommendations
    if (scopingData.organization?.pain_points) {
      const painPointTitles = scopingData.organization.pain_points
        .map((pp: any) => typeof pp === 'object' ? pp.title : pp)
        .filter(Boolean);

      painPointTitles.forEach((painPoint: string) => {
        if (painPoint.toLowerCase().includes('iot') || painPoint.toLowerCase().includes('device')) {
          newRecommendations.push({
            id: 'iot_management',
            type: 'use_case',
            title: 'IoT Device Profiling & Control',
            description: 'Automatically discover, profile, and secure IoT devices on your network.',
            reason: `Based on your pain point: ${painPoint}`,
            priority: 'high',
            category: 'device_management',
            actionable: true,
            relatedItems: {
              requirements: ['automated_discovery', 'device_classification']
            }
          });
        }

        if (painPoint.toLowerCase().includes('visibility') || painPoint.toLowerCase().includes('discovery')) {
          newRecommendations.push({
            id: 'network_discovery',
            type: 'use_case',
            title: 'Comprehensive Network Discovery',
            description: 'Gain complete visibility into all devices and assets on your network.',
            reason: `Based on your pain point: ${painPoint}`,
            priority: 'high',
            category: 'visibility',
            actionable: true
          });
        }

        if (painPoint.toLowerCase().includes('compliance') || painPoint.toLowerCase().includes('audit')) {
          newRecommendations.push({
            id: 'compliance_reporting',
            type: 'requirement',
            title: 'Automated Compliance Reporting',
            description: 'Generate compliance reports and audit trails automatically.',
            reason: `Based on your pain point: ${painPoint}`,
            priority: 'medium',
            category: 'compliance',
            actionable: true
          });
        }
      });
    }

    // Vendor ecosystem recommendations
    if (scopingData.vendor_ecosystem) {
      const vendors = Object.values(scopingData.vendor_ecosystem).flat().filter(Boolean);
      
      if (vendors.some((v: any) => v.includes?.('Cisco') || v === 'Cisco')) {
        newRecommendations.push({
          id: 'cisco_integration',
          type: 'requirement',
          title: 'Cisco ISE Integration',
          description: 'Leverage existing Cisco infrastructure for enhanced network access control.',
          reason: 'Based on your Cisco infrastructure',
          priority: 'medium',
          category: 'integration',
          actionable: true
        });
      }

      if (vendors.some((v: any) => v.includes?.('Microsoft') || v === 'Microsoft Azure AD')) {
        newRecommendations.push({
          id: 'azure_ad_integration',
          type: 'requirement',
          title: 'Azure AD Integration',
          description: 'Integrate with Microsoft Azure AD for seamless identity management.',
          reason: 'Based on your Microsoft Azure AD environment',
          priority: 'medium',
          category: 'identity',
          actionable: true
        });
      }
    }

    // Filter out dismissed recommendations
    const filteredRecommendations = newRecommendations.filter(
      rec => !dismissedRecommendations.includes(rec.id)
    );

    setRecommendations(filteredRecommendations);
  }, [scopingData, dismissedRecommendations]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      default: return <CheckSquare className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pain_point': return <AlertTriangle className="h-4 w-4" />;
      case 'use_case': return <FileText className="h-4 w-4" />;
      case 'requirement': return <CheckSquare className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const applyRecommendation = (recommendation: SmartRecommendation) => {
    // Find the actual item in the library data
    let foundItem = null;
    let targetArray: string[] = [];
    let updateFunction: (items: string[]) => void = () => {};

    if (recommendation.type === 'pain_point') {
      foundItem = painPoints.find(p => 
        p.title.toLowerCase().includes(recommendation.title.toLowerCase()) ||
        p.category === recommendation.category
      );
      targetArray = selectedPainPoints;
      updateFunction = onPainPointsChange;
    } else if (recommendation.type === 'use_case') {
      foundItem = useCases.find(u => 
        u.name.toLowerCase().includes(recommendation.title.toLowerCase()) ||
        u.category === recommendation.category
      );
      targetArray = selectedUseCases;
      updateFunction = onUseCasesChange;
    } else if (recommendation.type === 'requirement') {
      foundItem = requirements.find(r => 
        r.title.toLowerCase().includes(recommendation.title.toLowerCase()) ||
        r.category === recommendation.category
      );
      targetArray = selectedRequirements;
      updateFunction = onRequirementsChange;
    }

    if (foundItem && !targetArray.includes(foundItem.id)) {
      updateFunction([...targetArray, foundItem.id]);
    }

    // Remove the recommendation after applying
    setDismissedRecommendations(prev => [...prev, recommendation.id]);
  };

  const dismissRecommendation = (recommendationId: string) => {
    setDismissedRecommendations(prev => [...prev, recommendationId]);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary animate-pulse" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">Smart Recommendations</span>
          <Badge variant="glow" className="ml-auto">
            {recommendations.length} suggestions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            AI-powered suggestions based on your project scoping data
          </p>
              <Dialog open={showLibraryDialog} onOpenChange={setShowLibraryDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Library
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Enterprise Resource Library</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <EnhancedLibrarySelector
                      selectedPainPoints={selectedPainPoints}
                      selectedRequirements={selectedRequirements}
                      selectedUseCases={selectedUseCases}
                      onPainPointsChange={onPainPointsChange}
                      onRequirementsChange={onRequirementsChange}
                      onUseCasesChange={onUseCasesChange}
                    />
                  </div>
                </DialogContent>
              </Dialog>
        </div>

        <div className="space-y-3">
          {recommendations.slice(0, 4).map((recommendation) => (
            <Card key={recommendation.id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getTypeIcon(recommendation.type)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{recommendation.title}</h4>
                        <Badge variant={getPriorityColor(recommendation.priority) as any} className="text-xs">
                          {recommendation.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {recommendation.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Lightbulb className="h-3 w-3" />
                        <span>{recommendation.reason}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => applyRecommendation(recommendation)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissRecommendation(recommendation.id)}
                      className="text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recommendations.length > 4 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowLibraryDialog(true)}
          >
            View All {recommendations.length} Recommendations
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationPanel;