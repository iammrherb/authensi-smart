import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Brain, ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 bg-navigation border-b-2 border-navigation-border shadow-elevated">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-navigation-foreground hover:text-navigation-active hover:bg-navigation-hover p-2 rounded-lg transition-all duration-200" />
        
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-navigation-foreground hover:text-navigation-active hover:bg-navigation-hover transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={portnoxLogo} alt="Portnox" className="h-10 w-auto" />
            <div className="flex items-center space-x-2">
              <Brain className="h-7 w-7 text-primary animate-pulse-glow" />
              <div>
                <h1 className="text-xl font-bold text-navigation-foreground">AI NAC DESIGNER</h1>
                <p className="text-sm text-navigation-foreground/80">Intelligent Network Access Control Platform</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-navigation-foreground">
              {user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-navigation-foreground/70">
              {user.user_metadata?.role || 'User'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="border-navigation-border bg-navigation hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;