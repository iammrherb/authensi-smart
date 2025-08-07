import React, { useState } from 'react';
import AIScopingDialog from '@/components/scoping/AIScopingDialog';
import ComprehensiveAIScopingWizard from '@/components/scoping/ComprehensiveAIScopingWizard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, Zap, CheckCircle, Plus, FileText, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntelligentScoping = () => {
  const navigate = useNavigate();
  const [showScopingDialog, setShowScopingDialog] = useState(false);
  const [savedSessions, setSavedSessions] = useState<any[]>([]);

  const handleCreateProject = (scopingData: any) => {
    // Navigate to project creation with scoping data pre-filled
    navigate('/projects/create', { 
      state: { 
        scopingData,
        fromScoping: true 
      } 
    });
  };

  React.useEffect(() => {
    // Load saved scoping sessions
    const saved = localStorage.getItem('scopingSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

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
      <div className="pt-8">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowScopingDialog(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Start New AI Scoping
              </Button>
              
              {savedSessions.length > 0 && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {/* TODO: Show saved sessions */}}
                  className="flex items-center gap-2"
                >
                  <History className="h-5 w-5" />
                  View Saved Sessions ({savedSessions.length})
                </Button>
              )}
            </div>

            {/* Saved Sessions Preview */}
            {savedSessions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-center">Recent Scoping Sessions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedSessions.slice(0, 3).map((session, index) => (
                    <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {session.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {session.data.organization?.industry || 'General'}
                            </Badge>
                            <Badge variant="outline">
                              {session.data.network_infrastructure?.site_count || 0} Sites
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleCreateProject(session.data)}
                          >
                            Create Project
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* AI Scoping Wizard - Inline */}
            {showScopingDialog && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">AI Scoping Wizard</h2>
                  <Button variant="outline" onClick={() => setShowScopingDialog(false)}>
                    Close
                  </Button>
                </div>
                <ComprehensiveAIScopingWizard
                  onComplete={(projectId, scopingData) => {
                    handleCreateProject(scopingData);
                    setShowScopingDialog(false);
                  }}
                  onCancel={() => setShowScopingDialog(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentScoping;