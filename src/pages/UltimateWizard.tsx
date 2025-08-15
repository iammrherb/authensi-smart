import React, { useEffect } from "react";
import UltimateIntelligentWizard from "@/components/wizard/UltimateIntelligentWizard";

const UltimateWizard: React.FC = () => {
  useEffect(() => {
    document.title = "Ultimate Intelligent Wizard | AI-Driven Project Management";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Complete project setup wizard with AI-powered guidance for site creation, scoping, and configuration generation";
    if (meta) meta.setAttribute('content', content);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <UltimateIntelligentWizard />
    </main>
  );
};

export default UltimateWizard;
