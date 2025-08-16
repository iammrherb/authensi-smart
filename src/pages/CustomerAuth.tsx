import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Lock, Mail, User, Building } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CustomerAuth: React.FC = () => {
  const navigate = useNavigate();
  const { portalId } = useParams<{ portalId: string }>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate customer user
      const { data, error } = await supabase
        .rpc('authenticate_customer_user', {
          p_email: formData.email,
          p_password: formData.password
        });

      if (error) {
        console.error('Authentication error:', error);
        toast.error('Invalid email or password');
        return;
      }

      if (!data || data.length === 0) {
        toast.error('Invalid credentials or account inactive');
        return;
      }

      const user = data[0];
      
      // Store customer session data
      localStorage.setItem('customer_session', JSON.stringify({
        user_id: user.user_id,
        project_id: user.project_id,
        role: user.role,
        project_name: user.project_name,
        customer_organization: user.customer_organization,
        authenticated_at: new Date().toISOString()
      }));

      // Log the login activity
      await supabase.from('customer_analytics').insert({
        project_id: user.project_id,
        customer_user_id: user.user_id,
        event_type: 'login',
        event_data: {
          portal_id: portalId,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      toast.success(`Welcome, ${user.project_name}!`);
      navigate(`/customer-dashboard/${user.project_id}`);

    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="glow" className="mb-4">
            <Building className="w-4 h-4 mr-2" />
            Customer Portal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Access your project dashboard and track implementation progress
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your project portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-9 pr-9"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help accessing your account?
              </p>
              <Button variant="link" className="text-sm p-0 h-auto">
                Contact Your Project Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This portal is secured with enterprise-grade encryption.<br />
            Your data and privacy are our top priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;