import React from 'react';
import OneXerConfigWizard from "@/components/config/OneXerConfigWizard";
import { Badge } from "@/components/ui/badge";

interface OneXerWizardPageProps {
  projectId?: string;
  siteId?: string;
}

const OneXerWizardPage: React.FC<OneXerWizardPageProps> = ({ projectId, siteId }) => {
  const handleSave = (config: any) => {
    console.log('Configuration saved:', config);
    // Handle save logic here
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <Badge variant="glow" className="mb-4">
              🔧 Configuration Wizard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              DotXer <span className="bg-gradient-primary bg-clip-text text-transparent">Config Gen</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Generate comprehensive 802.1X configurations with AI-powered recommendations, 
              industry best practices, and full lifecycle management integration.
            </p>
          </div>
          
          <OneXerConfigWizard 
            projectId={projectId}
            siteId={siteId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default OneXerWizardPage;