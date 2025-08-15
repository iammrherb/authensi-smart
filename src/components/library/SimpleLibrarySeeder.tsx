import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBulkImportUseCases } from "@/hooks/useUseCases";
import { useBulkImportRequirements } from "@/hooks/useRequirements";
import { useBulkImportPainPoints } from "@/hooks/usePainPoints";
import { comprehensivePainPoints, comprehensiveRequirements, comprehensiveUseCases } from "@/data/comprehensiveLibraryData";

interface SeedingProgress {
  phase: 'idle' | 'seeding' | 'complete' | 'error';
  progress: number;
  currentItem: string;
  completed: number;
  total: number;
}

const SimpleLibrarySeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState<SeedingProgress>({
    phase: 'idle',
    progress: 0,
    currentItem: '',
    completed: 0,
    total: 0
  });

  const { toast } = useToast();
  const bulkImportUseCases = useBulkImportUseCases();
  const bulkImportRequirements = useBulkImportRequirements();
  const bulkImportPainPoints = useBulkImportPainPoints();

  const seedLibraries = async () => {
    setIsSeeding(true);
    setProgress({ phase: 'seeding', progress: 10, currentItem: 'Preparing data...', completed: 0, total: 100 });

    try {
      // Transform pain points to match database schema
      setProgress(prev => ({ ...prev, progress: 25, currentItem: 'Processing pain points...', completed: 20 }));
      
      const painPoints = comprehensivePainPoints.map(pp => ({
        title: pp.title,
        description: pp.description,
        category: pp.category,
        severity: pp.severity,
        recommended_solutions: pp.recommended_solutions,
        industry_specific: pp.industry_specific
      }));

      // Import pain points
      setProgress(prev => ({ ...prev, progress: 40, currentItem: 'Importing pain points...', completed: 35 }));
      await bulkImportPainPoints.mutateAsync(painPoints);

      // Transform requirements to match database schema
      setProgress(prev => ({ ...prev, progress: 55, currentItem: 'Processing requirements...', completed: 50 }));
      
      const requirements = comprehensiveRequirements.map(req => ({
        title: req.title,
        description: req.description,
        category: req.category,
        priority: req.priority,
        requirement_type: req.requirement_type || 'security',
        rationale: req.rationale || "Follow industry best practices for implementation",
        acceptance_criteria: req.acceptance_criteria || [],
        verification_methods: req.verification_methods || ['Security testing', 'Compliance audit'],
        test_cases: req.test_cases || [],
        related_use_cases: req.related_use_cases || [],
        dependencies: req.dependencies || [],
        assumptions: req.assumptions || [],
        constraints: req.constraints || [],
        compliance_frameworks: req.compliance_frameworks || [],
        vendor_requirements: req.vendor_requirements || {},
        portnox_features: req.portnox_features || [],
        documentation_references: req.documentation_references || [],
        tags: req.tags || [],
        status: 'approved' as const
      }));

      // Import requirements
      setProgress(prev => ({ ...prev, progress: 70, currentItem: 'Importing requirements...', completed: 65 }));
      await bulkImportRequirements.mutateAsync(requirements);

      // Transform use cases to match database schema
      setProgress(prev => ({ ...prev, progress: 85, currentItem: 'Processing use cases...', completed: 80 }));
      
      const useCases = comprehensiveUseCases.map(uc => ({
        name: uc.name,
        description: uc.description,
        category: uc.category,
        complexity: uc.complexity,
        business_value: uc.business_value,
        technical_requirements: uc.technical_requirements || [],
        authentication_methods: uc.authentication_methods || ['multi_factor'],
        prerequisites: uc.prerequisites || [],
        status: 'active' as const,
        deployment_scenarios: uc.deployment_scenarios || [uc.category],
        dependencies: uc.dependencies || [],
        portnox_features: uc.portnox_features || [],
        test_scenarios: uc.test_scenarios || [],
        supported_vendors: uc.supported_vendors || [],
        tags: uc.tags || [uc.category]
      }));

      // Import use cases
      setProgress(prev => ({ ...prev, progress: 95, currentItem: 'Importing use cases...', completed: 90 }));
      await bulkImportUseCases.mutateAsync(useCases);

      setProgress({
        phase: 'complete',
        progress: 100,
        currentItem: 'Seeding complete!',
        completed: 100,
        total: 100
      });

      toast({
        title: "Library Seeding Complete",
        description: `Successfully added ${useCases.length} use cases, ${requirements.length} requirements, and ${painPoints.length} pain points to your comprehensive library.`
      });

    } catch (error) {
      console.error('Seeding error:', error);
      setProgress(prev => ({ ...prev, phase: 'error', currentItem: 'Seeding failed' }));
      toast({
        title: "Seeding Failed",
        description: error instanceof Error ? error.message : "An error occurred during seeding",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const getPhaseIcon = () => {
    switch (progress.phase) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'seeding':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      default:
        return <Database className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Comprehensive Library Seeding
        </CardTitle>
        <CardDescription>
          Import curated enterprise-grade use cases, requirements, and pain points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{comprehensiveUseCases.length}</div>
            <div className="text-sm text-muted-foreground">Use Cases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{comprehensiveRequirements.length}</div>
            <div className="text-sm text-muted-foreground">Requirements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{comprehensivePainPoints.length}</div>
            <div className="text-sm text-muted-foreground">Pain Points</div>
          </div>
        </div>

        {isSeeding && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getPhaseIcon()}
              <span className="text-sm font-medium">{progress.currentItem}</span>
            </div>
            <Progress value={progress.progress} className="w-full" />
            <div className="text-xs text-muted-foreground text-center">
              {progress.progress}% complete
            </div>
          </div>
        )}

        {progress.phase === 'complete' && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Seeding Completed Successfully!</span>
            </div>
            <p className="text-sm text-success/80 mt-1">
              Your library has been populated with comprehensive enterprise resources.
            </p>
          </div>
        )}

        {progress.phase === 'error' && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Seeding Failed</span>
            </div>
            <p className="text-sm text-destructive/80 mt-1">
              Please try again or contact support if the problem persists.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">What will be created:</div>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-start">
              <Database className="w-3 h-3 mr-1" />
              Enterprise Use Cases
            </Badge>
            <Badge variant="outline" className="justify-start">
              <Database className="w-3 h-3 mr-1" />
              Technical Requirements
            </Badge>
            <Badge variant="outline" className="justify-start">
              <Database className="w-3 h-3 mr-1" />
              Compliance Scenarios
            </Badge>
            <Badge variant="outline" className="justify-start">
              <Database className="w-3 h-3 mr-1" />
              Industry Pain Points
            </Badge>
          </div>
        </div>

        <Button 
          onClick={seedLibraries}
          disabled={isSeeding || progress.phase === 'complete'}
          className="w-full"
          size="lg"
        >
          {isSeeding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Seeding Library...
            </>
          ) : progress.phase === 'complete' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Seeding Complete
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Library Seeding
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleLibrarySeeder;