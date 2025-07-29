import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  lift?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, glass, lift, glow, gradient, ...props }, ref) => {
    return (
      <Card
        className={cn(
          "transition-all duration-300",
          glass && "glass",
          lift && "hover-lift",
          glow && "hover-glow",
          gradient && "bg-gradient-card",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard };