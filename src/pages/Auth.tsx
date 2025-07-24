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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <img 
                src={portnoxLogo} 
                alt="Portnox Logo" 
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white tracking-wider">
                p<span className="text-cyan-400">o</span>rtnox™
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-white tracking-[0.3em]">
                  SCOPE SLAYER
                </span>
                <div className="text-xs text-gray-400 tracking-wide mt-1">
                  POC Tracker • Deployment Master
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="h-7 w-7 text-cyan-400" />
              <h2 className="text-3xl font-bold text-cyan-400 tracking-wide">
                WELCOME BACK,
              </h2>
            </div>
            <h2 className="text-3xl font-bold text-cyan-400 tracking-wide mb-6">
              WARRIOR
            </h2>
            <p className="text-gray-300 text-base leading-relaxed max-w-md mx-auto">
              Access your command center for POC domination and 
              deployment excellence. Time to slay those scopes and 
              master those use cases.
            </p>
          </div>
        </div>

        {/* Auth Tabs */}
        <div className="mb-6">
          <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignUp 
                  ? 'bg-slate-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignUp 
                  ? 'bg-slate-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Sign Up
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 h-12"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 h-12 pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-cyan-400/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-medium">
              Password
            </Label>
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
                className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 h-12 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-6 h-6 bg-cyan-400/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded"></div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-transparent text-cyan-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4" /> : 
                    <Eye className="h-4 w-4" />
                  }
                </Button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold text-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <Zap className="h-4 w-4" />
                DEPLOY SECURE ACCESS
              </div>
            )}
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm">
          {!isSignUp ? (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                type="button"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
                onClick={() => setIsSignUp(true)}
              >
                Create one now
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                type="button"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
                onClick={() => setIsSignUp(false)}
              >
                Sign in instead
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;