import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  glow?: boolean;
  pulse?: boolean;
  gradient?: 'primary' | 'accent' | 'button';
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, children, loading, glow, pulse, gradient, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          glow && "hover-glow",
          pulse && "pulse-notification",
          gradient === 'primary' && "bg-gradient-primary hover:opacity-90",
          gradient === 'accent' && "bg-gradient-accent hover:opacity-90", 
          gradient === 'button' && "bg-gradient-button hover:opacity-90",
          loading && "cursor-not-allowed",
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };