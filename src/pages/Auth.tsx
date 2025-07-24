import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Users, Building2, Eye, EyeOff, Network, Lock, Zap, CheckCircle } from 'lucide-react';
import portnoxLogo from '@/assets/portnox-logo.png';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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
          <p className="text-muted-foreground animate-pulse">Initializing Portnox ZTAC Platform...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      } else {
        await signIn(formData.email, formData.password);
      }
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
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000"></div>
            <div className="absolute bottom-20 left-40 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000"></div>
          </div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
          {/* Logo and branding */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={portnoxLogo} 
                alt="Portnox Logo" 
                className="h-16 w-auto filter brightness-0 invert opacity-90"
              />
            </div>
            <h1 className="font-display text-5xl font-black text-white mb-2 leading-tight tracking-wider">
              🚀 SCOPE SLAYER
            </h1>
            <h2 className="font-tech text-3xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                POC TRACKER • DEPLOYMENT MASTER
              </span>
            </h2>
            <h3 className="font-display text-2xl font-bold text-yellow-300 mb-6">
              🎯 USE CASE MAESTRO 🎯
            </h3>
            <p className="font-tech text-lg text-blue-100 mb-8 max-w-md leading-relaxed font-medium">
              The ultimate Zero Trust command center that turns complex enterprise deployments 
              into streamlined victories. Master your POCs, dominate deployments, and orchestrate success.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in hover:bg-white/15 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <feature.icon className={`h-6 w-6 ${feature.color} mb-2`} />
                <span className="text-white text-sm font-tech font-semibold text-center">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={portnoxLogo} 
                alt="Portnox Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="font-display text-2xl font-black text-foreground">
                  SCOPE SLAYER
                </h1>
                <p className="font-tech text-sm text-muted-foreground font-semibold">POC Tracker • Deployment Master</p>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 animate-scale-in">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="font-display text-3xl font-black bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {isSignUp ? '🚀 JOIN THE ELITE' : '⚡ WELCOME BACK, WARRIOR'}
              </CardTitle>
              <CardDescription className="font-tech text-base font-medium">
                {isSignUp 
                  ? 'Unlock your access to the ultimate deployment mastery platform. Scope like a pro, track like a boss, deploy like a legend.'
                  : 'Access your command center for POC domination and deployment excellence. Time to slay those scopes and master those use cases.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-2">
              <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
                <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                  <TabsTrigger value="signin" className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <TabsContent value="signup" className="space-y-5 mt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required={isSignUp}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required={isSignUp}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your secure password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        className="h-11 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        }
                      </Button>
                    </div>
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Password must be at least 8 characters long for enterprise security
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                        {isSignUp ? 'Creating Your Account...' : 'Signing You In...'}
                      </div>
                    ) : (
                       <div className="flex items-center gap-2 font-tech font-bold">
                        <Shield className="h-5 w-5" />
                        {isSignUp ? '🚀 ACTIVATE ACCOUNT' : '⚡ DEPLOY SECURE ACCESS'}
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <TabsContent value="signin" className="mt-0">
                    <span className="text-muted-foreground">Don't have an account?</span>{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold text-primary hover:text-primary-glow"
                      onClick={() => setIsSignUp(true)}
                    >
                      Create one now
                    </Button>
                  </TabsContent>
                  <TabsContent value="signup" className="mt-0">
                    <span className="text-muted-foreground">Already have an account?</span>{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-semibold text-primary hover:text-primary-glow"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign in instead
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              © 2024 Portnox ZTAC Ultimate Platform - Enterprise Zero Trust Access Control
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;