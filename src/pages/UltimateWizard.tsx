import React, { useEffect } from "react";
import RevolutionaryWorkflowOrchestrator from "@/components/unified/RevolutionaryWorkflowOrchestrator";

const UltimateWizard: React.FC = () => {
  useEffect(() => {
    document.title = "Revolutionary Workflow Orchestrator | AI-Driven Project Management";
    const meta = document.querySelector('meta[name="description"]');
    const content = "AI-powered workflow orchestrator for intelligent project genesis, site creation, and implementation tracking";
    if (meta) meta.setAttribute('content', content);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-dark">
      <section className="container mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Revolutionary Workflow Orchestrator
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered workflow orchestrator for intelligent project genesis, site creation, and implementation tracking
          </p>
        </div>
        <RevolutionaryWorkflowOrchestrator 
          workflowType="project_genesis"
          onComplete={(result) => {
            console.log('Workflow completed:', result);
          }}
        />
      </section>
    </main>
  );
};

export default UltimateWizard;
