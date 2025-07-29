import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Building2, Eye, EyeOff, Network, Lock, Zap, CheckCircle, Mail, ArrowRight, Sparkles } from 'lucide-react';
import portnoxLogo from '@/assets/portnox-logo.png';

const Auth = () => {
  const { user, signIn, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
          <p className="text-muted-foreground animate-pulse">Initializing NAC Tracker Platform...</p>
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
              className="h-12 w-auto"
            />
            <div>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                NAC TRACKER
              </div>
              <div className="text-sm text-muted-foreground font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
                🧠 AI-Powered • 🎯 Workflow Master • 📊 Analytics • 🚀 Deployment Expert
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to the Ultimate
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                NAC Implementation Platform
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transform complex NAC deployments into manageable, repeatable successes with 
              AI-powered scoping, comprehensive use case library, and intelligent tracking.
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
                  <img src={portnoxLogo} alt="Portnox" className="h-8 w-auto" />
                  <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
                    NAC TRACKER
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
              
              {/* Quick Auth Options */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-11 relative overflow-hidden group hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 border-blue-200 hover:border-blue-400 transition-all"
                  onClick={() => {/* TODO: Implement Azure auth */}}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                    <span className="font-medium">Continue with Microsoft Azure</span>
                  </div>
                  <ArrowRight className="h-4 w-4 absolute right-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-11 relative overflow-hidden group hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 border-primary/20 hover:border-primary/40 transition-all"
                  onClick={() => {/* TODO: Implement Magic Link */}}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium">Magic Link (Passwordless)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 absolute right-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

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

              <div className="text-center mt-4">
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