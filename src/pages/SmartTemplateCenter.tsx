import React, { useEffect } from 'react';
import SmartTemplateRecommendationEngine from '@/components/templates/SmartTemplateRecommendationEngine';

const SmartTemplateCenter: React.FC = () => {
  useEffect(() => {
    document.title = "Smart Template Center | AI-Powered Template Recommendations";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Advanced AI-powered template recommendation engine for intelligent network configuration and deployment planning";
    if (meta) meta.setAttribute('content', content);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        <SmartTemplateRecommendationEngine />
      </div>
    </main>
  );
};

export default SmartTemplateCenter;