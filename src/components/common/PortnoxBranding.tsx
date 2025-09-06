import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import portnoxLogo from '@/assets/portnox-logo.png';

interface PortnoxBrandingProps {
  collapsed?: boolean;
  showVersion?: boolean;
  className?: string;
}

export function PortnoxBranding({ collapsed = false, showVersion = true, className = "" }: PortnoxBrandingProps) {
  return (
    <div className={`${collapsed ? "p-3" : "p-6"} border-b border-sidebar-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <NavLink to="/" className="relative flex items-center space-x-4 group">
        <div className="relative flex-shrink-0">
          <div className="relative rounded-xl bg-gradient-to-br from-background to-card p-3 transition-all duration-300 hover:from-primary/10 hover:to-primary/5 hover:scale-105 hover:shadow-glow border border-primary/20 hover:border-primary/40">
            <img 
              src={portnoxLogo} 
              alt="Portnox NAC Intelligence Platform" 
              className={`${collapsed ? "h-8 w-8" : "h-12 w-12"} object-contain transition-all duration-300 hover:scale-110 filter brightness-110`} 
            />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--neon-green))]"></div>
        </div>
        
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-sidebar-foreground leading-tight tracking-tight">
              Portnox Intelligence
            </h2>
            <p className="text-sm text-sidebar-foreground/80 font-medium">NAC Deployment Platform</p>
            {showVersion && (
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border border-primary/30">
                  Enterprise
                </Badge>
                <Badge variant="outline" className="text-xs bg-neon-green/10 text-neon-green border-neon-green/30">
                  v3.0
                </Badge>
              </div>
            )}
          </div>
        )}
      </NavLink>
      
      {/* Enhanced AI Status Indicator */}
      <div className={`${collapsed ? "mt-3" : "mt-4"} flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-[0_0_5px_hsl(var(--neon-green))]"></div>
          {!collapsed && <span className="text-xs font-bold text-neon-green">AI INTELLIGENCE ACTIVE</span>}
        </div>
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/60">
            Real-time Analytics
          </div>
        )}
      </div>
    </div>
  );
}

export function PortnoxMiniLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={portnoxLogo} 
        alt="Portnox" 
        className="h-8 w-8 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}