import React, { useEffect } from "react";
import UltimateIntelligentWizard from "@/components/wizard/UltimateIntelligentWizard";

const UltimateWizard: React.FC = () => {
  useEffect(() => {
    document.title = "Ultimate Intelligent Wizard | Unified Scoping & Config";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Unified wizard for project creation, sites, AI scoping, and 802.1X config generation";
    if (meta) meta.setAttribute('content', content);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-6 py-8">
        <UltimateIntelligentWizard />
      </section>
    </main>
  );
};

export default UltimateWizard;
