import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Brain } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import portnoxLogo from "@/assets/portnox-logo.png";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left - Logo & Menu */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center space-x-3">
            <img 
              src={portnoxLogo} 
              alt="Portnox" 
              className="h-8 w-auto"
            />
            <div className="border-l border-border pl-3">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI NAC DESIGNER
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Intelligent Network Access Control Platform
              </div>
            </div>
          </div>
        </div>

        {/* Right - User Menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">
                  {user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-muted-foreground">
                  AI NAC Designer
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;