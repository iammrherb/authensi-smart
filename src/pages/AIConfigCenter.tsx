import React from 'react';
import OneXerConfigWizard from "@/components/config/OneXerConfigWizard";
import { Badge } from "@/components/ui/badge";

const AIConfigCenter = () => {
  const handleSave = (config: any) => {
    console.log('Configuration saved:', config);
    // Handle saving the configuration
  };

  const handleCancel = () => {
    // Handle cancellation if needed
    console.log('Configuration cancelled');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🤖 AI Configuration Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Intelligent <span className="bg-gradient-primary bg-clip-text text-transparent">Config Generation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered network configuration generation with comprehensive templates, 
              vendor-specific optimization, and intelligent recommendations.
            </p>
          </div>

          <OneXerConfigWizard 
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default AIConfigCenter;