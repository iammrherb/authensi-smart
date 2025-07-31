import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, Building2, Eye, EyeOff, Network, Lock, Zap, CheckCircle, Mail, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import portnoxLogo from '@/assets/portnox-logo.png';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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
    
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('request_password_reset', {
        p_email: resetEmail
      });

      if (error) throw error;

      toast({
        title: "Reset Email Sent",
        description: "If an account with this email exists, you will receive a password reset link.",
      });

      setShowResetPassword(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    }
  };

  const features = [
    { icon: Network, text: "Zero Trust Mastery", color: "text-cyan-400" },
    { icon: Shield, text: "Security Fortress", color: "text-emerald-400" },
    { icon: Zap, text: "Lightning Deploy", color: "text-yellow-400" },
    { icon: CheckCircle, text: "Enterprise Beast", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-primary/5 via-transparent to-accent/5 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 items-center">
          
          {/* Left Side - Hero Branding */}
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            
            {/* Logo and Main Title */}
            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <div className="relative">
                  <img 
                    src={portnoxLogo} 
                    alt="Portnox Logo" 
                    className="h-24 w-auto filter drop-shadow-2xl animate-float relative z-10"
                  />
                  <div className="absolute -inset-6 bg-gradient-primary opacity-5 blur-2xl rounded-full animate-pulse-glow -z-10"></div>
                </div>
                <div className="space-y-2">
                  <div className="font-display text-6xl lg:text-8xl font-black bg-gradient-to-r from-white via-primary-glow to-accent bg-clip-text text-transparent leading-tight tracking-tight">
                    TRACK
                  </div>
                  <div className="font-display text-3xl lg:text-4xl font-bold text-primary-glow tracking-wide">
                    AND NAC MASTER
                  </div>
                </div>
              </div>

              {/* Subtitle Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full border border-primary/30 backdrop-blur-sm">
                  <span className="font-tech text-lg font-bold text-primary-glow">SCOPING SLAYER</span>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-accent/20 to-accent/10 rounded-full border border-accent/30 backdrop-blur-sm">
                  <span className="font-tech text-lg font-bold text-accent">DEPLOYMENT MAESTRO</span>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-full border border-green-500/30 backdrop-blur-sm">
                  <span className="font-tech text-lg font-bold text-green-400">CONFIG GENERATOR SUPREME</span>
                </div>
              </div>

              {/* AI Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/30 backdrop-blur-lg">
                  <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                  <span className="font-tech text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    UNOFFICIAL INTELLIGENCE INSIGHTS
                  </span>
                  <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="font-display text-5xl lg:text-7xl font-black leading-none">
                <span className="text-white">UNLEASH THE</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  ULTIMATE NAC
                </span>
                <br />
                <span className="text-white">INTELLIGENCE</span>
              </h1>
              
              <p className="text-2xl lg:text-3xl font-tech font-medium text-slate-300 leading-relaxed max-w-3xl">
                Transform complex NAC deployments into <span className="text-primary-glow font-bold">effortless victories</span> with our 
                AI-powered arsenal of destruction and creation.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
                <Network className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-tech text-lg font-bold text-white mb-2">ZERO TRUST MASTERY</h3>
                <p className="text-slate-400 text-sm">Dominate network security with precision</p>
              </div>
              
              <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
                <Zap className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-tech text-lg font-bold text-white mb-2">LIGHTNING DEPLOY</h3>
                <p className="text-slate-400 text-sm">Deploy at the speed of thought</p>
              </div>
              
              <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-green-500/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <Shield className="h-8 w-8 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-tech text-lg font-bold text-white mb-2">SECURITY FORTRESS</h3>
                <p className="text-slate-400 text-sm">Impenetrable protection layers</p>
              </div>
              
              <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
                <CheckCircle className="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-tech text-lg font-bold text-white mb-2">ENTERPRISE BEAST</h3>
                <p className="text-slate-400 text-sm">Scale beyond imagination</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl"></div>
              
              <Card className="relative shadow-2xl border-0 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-950/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                {/* Card glow border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl p-[1px]">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl"></div>
                </div>
                
                <CardHeader className="relative space-y-8 pb-8 pt-12">
                  {/* Mobile logo */}
                  <div className="text-center lg:hidden">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <img src={portnoxLogo} alt="Portnox" className="h-16 w-auto filter drop-shadow-xl animate-float relative z-10" />
                      <span className="font-display text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        TRACK AND NAC MASTER
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <h2 className="font-display text-4xl font-black text-white">COMMAND CENTER</h2>
                    <div className="space-y-2">
                      <p className="font-tech text-xl font-bold text-primary-glow">
                        ACCESS GRANTED
                      </p>
                      <p className="text-slate-400 font-medium">
                        Enter your credentials to unleash the power
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-8 px-8 pb-12">

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-3">
                      <Label htmlFor="email" className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                        Email Access Key
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="commander@nexus.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          autoComplete="email"
                          className="pl-12 h-14 bg-slate-800/50 border-slate-600 focus:border-primary text-white placeholder:text-slate-500 font-tech text-lg rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="password" className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                        Security Protocol
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter security protocol"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          autoComplete="current-password"
                          className="pl-12 pr-14 h-14 bg-slate-800/50 border-slate-600 focus:border-primary text-white placeholder:text-slate-500 font-tech text-lg rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3 hover:bg-transparent text-slate-400 hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 
                            <EyeOff className="h-5 w-5" /> : 
                            <Eye className="h-5 w-5" />
                          }
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-16 bg-gradient-primary hover:opacity-90 text-white font-tech font-black text-xl uppercase tracking-wider transition-all shadow-2xl hover:shadow-glow rounded-xl relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {isLoading ? (
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="animate-spin rounded-full h-6 w-6 border-3 border-current border-t-transparent"></div>
                          INITIALIZING...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 relative z-10">
                          <Shield className="h-6 w-6" />
                          ACTIVATE SYSTEM
                          <ArrowRight className="h-6 w-6" />
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
                        className="text-primary hover:text-primary/80 font-tech font-bold uppercase tracking-wider"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Protocol Reset
                      </Button>
                    </div>
                  )}

                  {showResetPassword && (
                    <form onSubmit={handlePasswordReset} className="space-y-6 border-t border-slate-700 pt-6">
                      <div className="text-center mb-6">
                        <h3 className="font-tech text-lg font-bold text-white uppercase">Security Reset</h3>
                        <p className="text-sm text-slate-400 font-tech">Enter access key for protocol reset</p>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="resetEmail" className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                          Email Access Key
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            id="resetEmail"
                            type="email"
                            placeholder="commander@nexus.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            className="pl-12 h-12 bg-slate-800/50 border-slate-600 focus:border-primary text-white placeholder:text-slate-500 font-tech rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowResetPassword(false);
                            setResetEmail('');
                          }}
                          className="flex-1 h-12 border-slate-600 text-slate-300 hover:bg-slate-800 font-tech font-bold uppercase"
                        >
                          Abort
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="flex-1 h-12 bg-gradient-primary hover:opacity-90 font-tech font-bold uppercase"
                        >
                          Execute Reset
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="text-center pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400 font-tech">
                      <span className="text-primary">ACCESS DENIED?</span> Contact your system administrator for clearance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;