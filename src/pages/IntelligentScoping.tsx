import React from 'react';
import Header from '@/components/Header';
import IntelligentScopingWizard from '@/components/scoping/IntelligentScopingWizard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntelligentScoping = () => {
  const navigate = useNavigate();

  const handleScopingComplete = (projectId: string, scopingData: any) => {
    // Navigate to the project tracker with the new project
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "AI-Powered Analysis",
      description: "Smart questionnaire adapts based on your answers for personalized recommendations"
    },
    {
      icon: <Target className="h-6 w-6 text-green-500" />,
      title: "Automated Recommendations", 
      description: "Get deployment approach, phases, timeline estimates, and risk assessment"
    },
    {
      icon: <Zap className="h-6 w-6 text-orange-500" />,
      title: "Instant Project Creation",
      description: "Automatically creates a project with all scoping insights and recommendations"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      title: "Best Practice Framework",
      description: "Based on 1000+ successful Portnox deployments and industry standards"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <Badge variant="glow" className="mb-4">
                <Brain className="h-4 w-4 mr-2" />
                AI-Powered Scoping
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold">
                Intelligent NAC <span className="bg-gradient-primary bg-clip-text text-transparent">Scoping Wizard</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Let our AI analyze your environment and create a personalized deployment plan. 
                Get expert recommendations, timeline estimates, and risk assessments in minutes.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scoping Wizard */}
            <IntelligentScopingWizard 
              onComplete={handleScopingComplete}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentScoping;