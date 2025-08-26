import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import {
  Brain, CheckCircle, XCircle, AlertTriangle, Lightbulb, 
  TrendingUp, Clock, DollarSign, Users, Shield, Zap,
  ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';
import { AIResponse, AIRecommendation } from '@/services/ai/EnhancedAIService';

interface AIRecommendationPanelProps {
  response: AIResponse;
  isLoading?: boolean;
  onAcceptRecommendation?: (recommendationId: string, feedback?: string) => void;
  onRejectRecommendation?: (recommendationId: string, reason?: string) => void;
  onRequestAlternatives?: (recommendationId: string) => void;
  className?: string;
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'text-green-500';
  if (confidence >= 0.6) return 'text-yellow-500';
  return 'text-red-500';
};

const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.7) return 'Good';
  if (confidence >= 0.6) return 'Moderate';
  if (confidence >= 0.5) return 'Low';
  return 'Very Low';
};

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'vendor': return Users;
    case 'use_case': return Lightbulb;
    case 'requirement': return Shield;
    case 'configuration': return Zap;
    case 'timeline': return Clock;
    case 'approach': return TrendingUp;
    default: return Brain;
  }
};

const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RecommendationCard: React.FC<{
  recommendation: AIRecommendation;
  onAccept?: (id: string, feedback?: string) => void;
  onReject?: (id: string, reason?: string) => void;
  onRequestAlternatives?: (id: string) => void;
}> = ({ recommendation, onAccept, onReject, onRequestAlternatives }) => {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [actionTaken, setActionTaken] = useState<'accepted' | 'rejected' | null>(null);

  const Icon = getRecommendationIcon(recommendation.type);

  const handleAccept = () => {
    onAccept?.(recommendation.id, feedback || undefined);
    setActionTaken('accepted');
    setShowFeedback(false);
  };

  const handleReject = () => {
    onReject?.(recommendation.id, feedback || undefined);
    setActionTaken('rejected');
    setShowFeedback(false);
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      actionTaken === 'accepted' ? 'ring-2 ring-green-500 bg-green-50' :
      actionTaken === 'rejected' ? 'ring-2 ring-red-500 bg-red-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{recommendation.title}</CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {recommendation.type.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getComplexityColor(recommendation.implementationComplexity)}>
                  {recommendation.implementationComplexity} complexity
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <span className={`font-semibold ${getConfidenceColor(recommendation.confidence)}`}>
                {Math.round(recommendation.confidence * 100)}%
              </span>
            </div>
            <Progress 
              value={recommendation.confidence * 100} 
              className="w-20 h-2 mt-1"
            />
            <span className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
              {getConfidenceLabel(recommendation.confidence)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.description}
          </p>

          {/* Business Value */}
          {recommendation.businessValue && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Business Value</span>
              </div>
              <p className="text-sm text-blue-700">{recommendation.businessValue}</p>
            </div>
          )}

          {/* Reasoning */}
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">AI Reasoning</span>
            </div>
            <p className="text-sm text-amber-700">{recommendation.reasoning}</p>
          </div>

          {/* Next Steps */}
          {recommendation.nextSteps.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Recommended Next Steps
              </h4>
              <ul className="space-y-1">
                {recommendation.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-primary mr-2 font-medium">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expandable Details */}
          {(recommendation.evidence.length > 0 || recommendation.risks?.length > 0 || 
            recommendation.dependencies?.length > 0) && (
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground"
              >
                {expanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                {expanded ? 'Hide Details' : 'Show Details'}
              </Button>

              {expanded && (
                <div className="mt-4 space-y-4">
                  {/* Evidence */}
                  {recommendation.evidence.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Supporting Evidence</h5>
                      <ul className="space-y-1">
                        {recommendation.evidence.map((evidence, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Risks */}
                  {recommendation.risks && recommendation.risks.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                        Risk Factors
                      </h5>
                      <ul className="space-y-1">
                        {recommendation.risks.map((risk, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-yellow-500 mr-2">⚠</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dependencies */}
                  {recommendation.dependencies && recommendation.dependencies.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Dependencies</h5>
                      <ul className="space-y-1">
                        {recommendation.dependencies.map((dependency, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-blue-500 mr-2">→</span>
                            {dependency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Estimates */}
                  {(recommendation.estimatedEffort || recommendation.estimatedCost) && (
                    <div className="grid grid-cols-2 gap-4">
                      {recommendation.estimatedEffort && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-sm font-medium">Estimated Effort</div>
                          <div className="text-sm text-muted-foreground">{recommendation.estimatedEffort}</div>
                        </div>
                      )}
                      {recommendation.estimatedCost && (
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-sm font-medium">Estimated Cost</div>
                          <div className="text-sm text-muted-foreground">{recommendation.estimatedCost}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!actionTaken && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                <EnhancedButton
                  onClick={handleAccept}
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Accept
                </EnhancedButton>
                <Button
                  onClick={handleReject}
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  onClick={() => setShowFeedback(!showFeedback)}
                  size="sm"
                  variant="ghost"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Feedback
                </Button>
              </div>

              {onRequestAlternatives && (
                <Button
                  onClick={() => onRequestAlternatives(recommendation.id)}
                  size="sm"
                  variant="outline"
                >
                  Show Alternatives
                </Button>
              )}
            </div>
          )}

          {/* Feedback Input */}
          {showFeedback && !actionTaken && (
            <div className="pt-4 border-t">
              <Textarea
                placeholder="Share your thoughts on this recommendation..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => setShowFeedback(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setShowFeedback(false)}>
                  Save Feedback
                </Button>
              </div>
            </div>
          )}

          {/* Action Taken Indicator */}
          {actionTaken && (
            <div className={`flex items-center space-x-2 pt-4 border-t ${
              actionTaken === 'accepted' ? 'text-green-600' : 'text-red-600'
            }`}>
              {actionTaken === 'accepted' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                Recommendation {actionTaken}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({
  response,
  isLoading = false,
  onAcceptRecommendation,
  onRejectRecommendation,
  onRequestAlternatives,
  className = ''
}) => {
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-lg font-medium mb-2">AI Analysis in Progress</h3>
            <p className="text-muted-foreground">Analyzing context and generating intelligent recommendations...</p>
            <div className="mt-4">
              <Progress value={undefined} className="w-64 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response || response.recommendations.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
            <p className="text-muted-foreground">Provide more context to get AI-powered recommendations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Recommendations</span>
            <Badge variant="secondary">{response.recommendations.length}</Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Confidence</div>
              <div className="flex items-center space-x-2">
                <Progress value={response.confidence * 100} className="w-20 h-2" />
                <span className={`font-semibold ${getConfidenceColor(response.confidence)}`}>
                  {Math.round(response.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {response.summary && (
          <p className="text-muted-foreground mt-2">{response.summary}</p>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-4">
            {response.recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onAccept={onAcceptRecommendation}
                onReject={onRejectRecommendation}
                onRequestAlternatives={onRequestAlternatives}
              />
            ))}
          </div>
        </ScrollArea>

        {response.nextSteps.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              Suggested Next Steps
            </h4>
            <ul className="space-y-2">
              {response.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-primary mr-2 font-medium">{index + 1}.</span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {response.metadata && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Analysis completed in {response.metadata.processingTime}ms • 
              Model: {response.metadata.modelVersion} • 
              Context factors: {response.metadata.contextFactors.length}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationPanel;
