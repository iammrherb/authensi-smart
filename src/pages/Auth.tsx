import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Building2, Eye, EyeOff, Network, Lock, Zap, CheckCircle, Mail, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import portnoxLogo from '@/assets/portnox-logo.png';

const Auth = () => {
  const { user, signIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse">Initializing Track and NAC Master Platform...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset functionality
    console.log('Password reset for:', resetEmail);
    setShowResetPassword(false);
    setResetEmail('');
  };

  const features = [
    { icon: Network, text: "Zero Trust Mastery", color: "text-cyan-400" },
    { icon: Shield, text: "Security Fortress", color: "text-emerald-400" },
    { icon: Zap, text: "Lightning Deploy", color: "text-yellow-400" },
    { icon: CheckCircle, text: "Enterprise Beast", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-4">
            <img 
              src={portnoxLogo} 
              alt="Portnox Logo" 
              className="h-20 w-auto filter drop-shadow-xl"
            />
            <div>
              <div className="text-4xl font-black bg-gradient-primary bg-clip-text text-transparent animate-fade-in leading-tight">
                TRACK AND NAC MASTER
              </div>
              <div className="text-lg font-bold text-muted-foreground animate-fade-in mt-2" style={{ animationDelay: '0.2s' }}>
                Scoping Slayer • Deployment Maestro • Config Generator Supreme
              </div>
              <div className="text-sm font-medium text-accent animate-fade-in" style={{ animationDelay: '0.4s' }}>
                🧠 Unofficial Intelligence Insights and Analytics
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-black leading-tight">
              Welcome to the Ultimate
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                NAC Intelligence Platform
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              Transform complex NAC deployments into effortless victories with our 
              AI-powered scoping slayer, deployment maestro, and config generator supreme.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">AI-Powered Scoping</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5 border border-accent/10">
                <Network className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">200+ Use Cases</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Deployment Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-6 pb-8">
              <div className="text-center lg:hidden">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src={portnoxLogo} alt="Portnox" className="h-12 w-auto filter drop-shadow-lg" />
                  <span className="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                    TRACK AND NAC MASTER
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-muted-foreground mt-2">
                  Access your deployment command center
                </p>
              </div>

            </CardHeader>

            <CardContent className="space-y-6">

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete="current-password"
                      className="pl-10 pr-10 h-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-10 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-primary hover:opacity-90 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                    </div>
                  )}
                </Button>
              </form>

              {!showResetPassword && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetPassword(true)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Forgot Password?
                  </Button>
                </div>
              )}

              {showResetPassword && (
                <form onSubmit={handlePasswordReset} className="space-y-4 border-t pt-4">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-sm">Reset Password</h3>
                    <p className="text-xs text-muted-foreground">Enter your email to receive reset instructions</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="pl-10 h-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowResetPassword(false);
                        setResetEmail('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              )}

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Need an account? Contact your administrator for an invitation.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;