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
    { icon: Network, text: "Zero Trust Architecture", color: "text-blue-400" },
    { icon: Shield, text: "Advanced Security", color: "text-green-400" },
    { icon: Zap, text: "Rapid Deployment", color: "text-yellow-400" },
    { icon: CheckCircle, text: "Enterprise Ready", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Animated Data Center Background */}
      <div className="absolute inset-0">
        {/* Server racks pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-[size:80px_80px]"></div>
        </div>
        
        {/* Animated Dragons */}
        <div className="absolute top-20 left-10 w-16 h-16 text-purple-400 animate-bounce opacity-60">
          🐉
        </div>
        <div className="absolute top-40 right-20 w-12 h-12 text-purple-300 animate-pulse opacity-50" style={{ animationDelay: '1s' }}>
          🐲
        </div>
        
        {/* Animated Unicorns */}
        <div className="absolute bottom-32 left-16 w-14 h-14 text-pink-400 animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}>
          🦄
        </div>
        <div className="absolute bottom-20 right-32 w-12 h-12 text-purple-200 animate-pulse opacity-50" style={{ animationDelay: '2s' }}>
          🦄
        </div>
        
        {/* Floating server icons */}
        <div className="absolute top-32 left-1/4 w-8 h-8 text-blue-400 animate-float opacity-40">
          🖥️
        </div>
        <div className="absolute bottom-40 right-1/4 w-6 h-6 text-green-400 animate-float opacity-40" style={{ animationDelay: '1.5s' }}>
          💾
        </div>
        <div className="absolute top-1/2 left-12 w-6 h-6 text-cyan-400 animate-pulse opacity-30">
          ⚡
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-16 right-16 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-30"></div>
        <div className="absolute bottom-24 left-1/3 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-float opacity-25" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="w-full max-w-md">
          {/* Animated Logo Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="relative">
                <img 
                  src={portnoxLogo} 
                  alt="Portnox Logo" 
                  className="h-16 w-auto animate-pulse hover:animate-bounce transition-all duration-300 filter drop-shadow-lg"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 animate-fade-in bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  PORTNOX ZTAC
                </h1>
                <h2 className="text-xl lg:text-2xl font-bold text-purple-200 mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Ultimate Platform
                </h2>
                <p className="text-sm text-purple-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  🚀 POC Tracker & Deployment Manager 🚀
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 animate-scale-in">
            <CardHeader className="space-y-1 text-center pb-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {isSignUp ? 'Join the Platform' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-base">
                {isSignUp 
                  ? 'Create your account to access the ultimate Portnox ZTAC platform for comprehensive POC management and deployment tracking'
                  : 'Sign in to your Portnox ZTAC Ultimate Platform - Your command center for scoping, POC management, and deployment excellence'
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
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {isSignUp ? 'Create Account' : 'Sign In Securely'}
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
          <div className="mt-8 text-center text-xs text-purple-300">
            <p className="flex items-center justify-center gap-1 animate-fade-in" style={{ animationDelay: '0.6s' }}>
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