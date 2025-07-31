import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, QrCode, Key, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TwoFactorSettings = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);

  // Check current 2FA status
  const { data: twoFactorStatus, isLoading } = useQuery({
    queryKey: ['two-factor-status', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled, two_factor_secret')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Generate 2FA secret and QR code
  const generate2FASecretMutation = useMutation({
    mutationFn: async () => {
      // Generate a base32 secret
      const secret = Array.from({ length: 32 }, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
      ).join('');
      
      return { secret };
    },
    onSuccess: (data) => {
      setIsEnabling(true);
      queryClient.setQueryData(['two-factor-setup'], data);
    }
  });

  // Enable 2FA mutation
  const enable2FAMutation = useMutation({
    mutationFn: async (params: { secret: string; code: string }) => {
      const { data, error } = await supabase.rpc('enable_two_factor_auth' as any, {
        p_user_id: user?.id,
        p_secret: params.secret,
        p_verification_code: params.code
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });
      setIsEnabling(false);
      setVerificationCode('');
      queryClient.invalidateQueries({ queryKey: ['two-factor-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enable 2FA",
        variant: "destructive"
      });
    }
  });

  // Disable 2FA mutation
  const disable2FAMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('disable_two_factor_auth' as any, {
        p_user_id: user?.id
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled",
      });
      queryClient.invalidateQueries({ queryKey: ['two-factor-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disable 2FA",
        variant: "destructive"
      });
    }
  });

  const { data: setupData } = useQuery({
    queryKey: ['two-factor-setup'],
    queryFn: () => null,
    enabled: false
  });

  const handleEnable2FA = () => {
    generate2FASecretMutation.mutate();
  };

  const handleVerifyAndEnable = () => {
    if (!setupData?.secret || !verificationCode) {
      toast({
        title: "Missing Information",
        description: "Please enter the verification code from your authenticator app",
        variant: "destructive"
      });
      return;
    }

    enable2FAMutation.mutate({
      secret: setupData.secret,
      code: verificationCode
    });
  };

  const handleDisable2FA = () => {
    disable2FAMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Secret key copied to clipboard",
    });
  };

  const generateQRCodeUrl = (secret: string) => {
    const issuer = 'Track and NAC Master';
    const accountName = user?.email || '';
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </div>
            </div>
            <Badge variant={twoFactorStatus?.two_factor_enabled ? "default" : "secondary"}>
              {twoFactorStatus?.two_factor_enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!twoFactorStatus?.two_factor_enabled && !isEnabling && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Enhance Your Account Security
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Two-factor authentication adds an extra layer of security by requiring a verification code from your authenticator app in addition to your password.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleEnable2FA}
                disabled={generate2FASecretMutation.isPending}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}

          {isEnabling && setupData?.secret && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Set up Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Scan the QR code below with your authenticator app or enter the secret key manually
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <img 
                    src={generateQRCodeUrl(setupData.secret)}
                    alt="2FA QR Code"
                    className="w-48 h-48"
                  />
                </div>
                
                <div className="w-full max-w-md">
                  <Label className="text-sm font-medium">Manual Entry Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input 
                      value={setupData.secret}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(setupData.secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="verification-code" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code from your app"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEnabling(false);
                      setVerificationCode('');
                      queryClient.removeQueries({ queryKey: ['two-factor-setup'] });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerifyAndEnable}
                    disabled={enable2FAMutation.isPending || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {enable2FAMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify & Enable
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {twoFactorStatus?.two_factor_enabled && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Two-Factor Authentication is Active
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is protected with an additional layer of security. You'll need to provide a verification code when signing in.
                  </p>
                </div>
              </div>

              <Button 
                variant="destructive"
                onClick={handleDisable2FA}
                disabled={disable2FAMutation.isPending}
                className="w-full"
              >
                {disable2FAMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    Disabling...
                  </div>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Disable Two-Factor Authentication
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorSettings;