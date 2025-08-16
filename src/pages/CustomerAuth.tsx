import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building, Lock, Mail } from 'lucide-react';

const CustomerAuth = () => {
  const { portalId } = useParams<{ portalId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalId || !credentials.email || !credentials.password) return;

    setIsLoading(true);
    try {
      // Authenticate customer user
      const { data, error } = await supabase
        .rpc('authenticate_customer_user', {
          p_email: credentials.email,
          p_password: credentials.password
        });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('Invalid email or password');
        return;
      }

      const user = data[0];
      
      // Verify the portal ID matches
      if (user.project_id !== portalId) {
        toast.error('Access denied for this portal');
        return;
      }

      // Store session info in localStorage (simple auth for demo)
      localStorage.setItem('customer_portal_session', JSON.stringify({
        user_id: user.user_id,
        project_id: user.project_id,
        role: user.role,
        project_name: user.project_name,
        customer_organization: user.customer_organization
      }));

      toast.success('Login successful');
      navigate(`/customer-portal/${portalId}`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Customer Portal</CardTitle>
          <p className="text-muted-foreground">
            Sign in to access your project portal
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="pl-10"
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
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help accessing your portal?{' '}
              <span className="text-primary cursor-pointer hover:underline">
                Contact support
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAuth;