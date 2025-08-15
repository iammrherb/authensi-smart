import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBulkImportUseCases } from "@/hooks/useUseCases";
import { useBulkImportRequirements } from "@/hooks/useRequirements";
import { useEnhancedAI } from "@/hooks/useEnhancedAI";

interface SeedingProgress {
  phase: 'idle' | 'generating' | 'importing' | 'complete' | 'error';
  progress: number;
  currentItem: string;
  completed: number;
  total: number;
}

const LibrarySeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState<SeedingProgress>({
    phase: 'idle',
    progress: 0,
    currentItem: '',
    completed: 0,
    total: 0
  });

  const { toast } = useToast();
  const { generateCompletion } = useEnhancedAI();
  const bulkImportUseCases = useBulkImportUseCases();
  const bulkImportRequirements = useBulkImportRequirements();

  const seedLibraries = async () => {
    setIsSeeding(true);
    setProgress({ phase: 'generating', progress: 10, currentItem: 'Generating use cases...', completed: 0, total: 100 });

    try {
      // Generate comprehensive use cases
      const useCasePrompt = `Generate 25 comprehensive network access control use cases for enterprise environments. Include diverse scenarios covering:

1. Authentication methods (802.1X, MAB, web auth, guest access)
2. Device types (corporate, BYOD, IoT, servers, printers)
3. Industries (healthcare, finance, education, manufacturing, retail)
4. Compliance requirements (HIPAA, PCI-DSS, SOX, GDPR)
5. Network segments (wired, wireless, VPN, cloud)

For each use case, provide:
- name: Clear, descriptive name
- category: authentication|byod|iot|guest_access|compliance|security|network
- description: 2-3 sentence description
- complexity: low|medium|high
- business_value: Business impact and benefits
- technical_requirements: Array of technical needs
- compliance_considerations: Array of compliance aspects
- industry_applications: Array of applicable industries
- implementation_timeline: Estimated timeline
- success_metrics: Array of success measurements

Format as JSON array.`;

      setProgress(prev => ({ ...prev, progress: 20, currentItem: 'AI generating use cases...' }));
      
      const useCaseResponse = await generateCompletion({
        prompt: useCasePrompt,
        taskType: 'code_generation',
        context: 'Library seeding for NAC use cases'
      });

      let useCases;
      try {
        useCases = JSON.parse(useCaseResponse.content);
      } catch {
        throw new Error('Failed to parse use cases from AI response');
      }

      setProgress(prev => ({ ...prev, progress: 40, currentItem: 'Generating requirements...', completed: 25 }));

      // Generate comprehensive requirements
      const requirementPrompt = `Generate 30 comprehensive network access control requirements for enterprise deployments. Cover:

1. Infrastructure requirements (RADIUS, directories, certificates)
2. Security requirements (encryption, authentication, authorization)
3. Network requirements (VLANs, switches, APs, controllers)
4. Monitoring requirements (logging, alerting, reporting)
5. Performance requirements (latency, throughput, availability)
6. Compliance requirements (audit trails, data protection)

For each requirement, provide:
- title: Clear requirement title
- category: infrastructure|security|network|monitoring|performance|compliance
- description: Detailed requirement description
- priority: low|medium|high|critical
- technical_details: Array of technical specifications
- validation_criteria: Array of validation methods
- industry_specific: Array of applicable industries
- prerequisites: Array of prerequisite requirements
- implementation_guidance: Implementation advice

Format as JSON array.`;

      const requirementResponse = await generateCompletion({
        prompt: requirementPrompt,
        taskType: 'code_generation',
        context: 'Library seeding for NAC requirements'
      });

      let requirements;
      try {
        requirements = JSON.parse(requirementResponse.content);
      } catch {
        throw new Error('Failed to parse requirements from AI response');
      }

      setProgress(prev => ({ ...prev, phase: 'importing', progress: 60, currentItem: 'Importing use cases...', completed: 55 }));

      // Import use cases
      await bulkImportUseCases.mutateAsync(useCases);

      setProgress(prev => ({ ...prev, progress: 80, currentItem: 'Importing requirements...', completed: 80 }));

      // Import requirements
      await bulkImportRequirements.mutateAsync(requirements);

      setProgress({
        phase: 'complete',
        progress: 100,
        currentItem: 'Seeding complete!',
        completed: 100,
        total: 100
      });

      toast({
        title: "Library Seeding Complete",
        description: `Successfully added ${useCases.length} use cases and ${requirements.length} requirements to your library.`
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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'generating':
      case 'importing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      default:
        return <Database className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI-Powered Library Seeding
        </CardTitle>
        <CardDescription>
          Generate and import comprehensive use cases and requirements using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-500">25+</div>
            <div className="text-sm text-muted-foreground">Use Cases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">30+</div>
            <div className="text-sm text-muted-foreground">Requirements</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">26</div>
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
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Seeding Completed Successfully!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Your library has been populated with comprehensive NAC resources.
            </p>
          </div>
        )}

        {progress.phase === 'error' && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Seeding Failed</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
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
              Industry Specific Items
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
              Start AI Seeding
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LibrarySeeder;