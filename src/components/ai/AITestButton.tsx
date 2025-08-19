import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const AITestButton: React.FC = () => {
  const { generateCompletion, isLoading } = useAI();
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

  const testAIConnection = async () => {
    setTestResult('idle');
    
    try {
      const response = await generateCompletion({
        prompt: 'Say "AI service is working correctly" if you can respond to this test message.',
        context: 'test',
        provider: 'openai',
        model: 'gpt-4o-mini',
        temperature: 0.1,
        maxTokens: 50
      });

      if (response && response.content) {
        setTestResult('success');
        toast.success('AI service is working correctly!');
        console.log('AI Test Success:', response);
      } else {
        setTestResult('error');
        toast.error('AI service returned empty response');
        console.error('AI Test Failed: Empty response');
      }
    } catch (error) {
      setTestResult('error');
      toast.error('AI service test failed');
      console.error('AI Test Error:', error);
    }
  };

  const getIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (testResult === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (testResult === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <TestTube className="h-4 w-4" />;
  };

  const getVariant = () => {
    if (testResult === 'success') return 'default';
    if (testResult === 'error') return 'destructive';
    return 'outline';
  };

  return (
    <Button
      onClick={testAIConnection}
      disabled={isLoading}
      variant={getVariant()}
      size="sm"
      className="gap-2"
    >
      {getIcon()}
      {isLoading ? 'Testing...' : 'Test AI Service'}
    </Button>
  );
};