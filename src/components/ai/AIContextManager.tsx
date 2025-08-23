import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAIContextEngine } from '@/hooks/useAIContextEngine';
import { Brain, MessageSquare, Settings, TrendingUp, History, Lightbulb, Clock, Users } from 'lucide-react';

const AIContextManager: React.FC = () => {
  const {
    currentSessionToken,
    createSession,
    isCreatingSession,
    conversationHistory,
    isLoadingHistory,
    userPreferences,
    isLoadingPreferences,
    updatePreferences,
    isUpdatingPreferences,
    userPatterns,
    isLoadingPatterns,
    recommendations,
    getRecommendations,
    isGettingRecommendations
  } = useAIContextEngine();

  const [preferencesForm, setPreferencesForm] = useState({
    technicalExpertiseLevel: 'intermediate',
    contextRetentionDays: 90,
    autoContextBuilding: true,
    communicationStyle: {}
  });

  React.useEffect(() => {
    if (userPreferences) {
      setPreferencesForm({
        technicalExpertiseLevel: userPreferences.technicalExpertiseLevel,
        contextRetentionDays: userPreferences.contextRetentionDays,
        autoContextBuilding: userPreferences.autoContextBuilding,
        communicationStyle: userPreferences.communicationStyle
      });
    }
  }, [userPreferences]);

  const handleUpdatePreferences = () => {
    updatePreferences(preferencesForm);
  };

  const handleGetRecommendations = () => {
    const context = {
      currentSessionToken,
      timestamp: new Date().toISOString(),
      userPreferences
    };
    getRecommendations(context);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Context Engine</h1>
          <p className="text-muted-foreground">
            Intelligent conversation memory and contextual learning system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {currentSessionToken ? 'Active Session' : 'No Session'}
          </Badge>
          <Button
            onClick={() => createSession({ sessionType: 'conversation' })}
            disabled={isCreatingSession}
            size="sm"
          >
            New Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="conversation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Conversation History
              </CardTitle>
              <CardDescription>
                Recent AI conversations and contextual memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading conversation history...
                </div>
              ) : conversationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No conversation history found. Start a new conversation to build context.
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversationHistory.map((message, index) => (
                    <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                        {message.role}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        {message.metadata && Object.keys(message.metadata).length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Context: {JSON.stringify(message.metadata, null, 2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Patterns
              </CardTitle>
              <CardDescription>
                AI-identified patterns in your workflow and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPatterns ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading pattern analysis...
                </div>
              ) : userPatterns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No patterns identified yet. Continue using the system to build intelligent patterns.
                </div>
              ) : (
                <div className="grid gap-4">
                  {userPatterns.map((pattern) => (
                    <Card key={pattern.id} className="border border-border/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{pattern.patternType}</Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Confidence: {(pattern.confidenceScore * 100).toFixed(0)}%
                            </span>
                            <Badge variant="secondary">
                              Used {pattern.frequencyCount} times
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <pre className="text-xs bg-muted p-2 rounded">
                            {JSON.stringify(pattern.patternData, null, 2)}
                          </pre>
                          <div className="flex flex-wrap gap-1">
                            {pattern.contextTags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Preferences
              </CardTitle>
              <CardDescription>
                Configure how the AI learns and adapts to your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expertise-level">Technical Expertise Level</Label>
                  <Select
                    value={preferencesForm.technicalExpertiseLevel}
                    onValueChange={(value) => 
                      setPreferencesForm(prev => ({ ...prev, technicalExpertiseLevel: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-days">Context Retention (Days)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={preferencesForm.contextRetentionDays}
                    onChange={(e) => 
                      setPreferencesForm(prev => ({ 
                        ...prev, 
                        contextRetentionDays: parseInt(e.target.value) || 90 
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Context Building</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically build context from your projects and activities
                  </p>
                </div>
                <Switch
                  checked={preferencesForm.autoContextBuilding}
                  onCheckedChange={(checked) =>
                    setPreferencesForm(prev => ({ ...prev, autoContextBuilding: checked }))
                  }
                />
              </div>

              <Button 
                onClick={handleUpdatePreferences}
                disabled={isUpdatingPreferences}
                className="w-full"
              >
                {isUpdatingPreferences ? 'Updating...' : 'Update Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Insights & Recommendations
              </CardTitle>
              <CardDescription>
                Intelligent recommendations based on your patterns and context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGetRecommendations}
                disabled={isGettingRecommendations}
                className="w-full"
              >
                {isGettingRecommendations ? 'Analyzing...' : 'Get AI Recommendations'}
              </Button>

              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Current Recommendations:</h4>
                  {recommendations.map((recommendation, index) => (
                    <Card key={index} className="border border-primary/20 bg-primary/5">
                      <CardContent className="pt-4">
                        <p className="text-sm">{recommendation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Session Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentSessionToken ? 'Active' : 'No active session'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-4">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      {conversationHistory.length} in history
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-4">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Patterns</h4>
                    <p className="text-sm text-muted-foreground">
                      {userPatterns.length} identified
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIContextManager;