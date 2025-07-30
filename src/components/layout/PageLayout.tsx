import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  noPadding?: boolean;
  fullWidth?: boolean;
}

export const PageLayout = ({
  children,
  title,
  description,
  icon,
  className,
  noPadding = false,
  fullWidth = false
}: PageLayoutProps) => {
  return (
    <div className={cn("w-full space-y-6", fullWidth ? "" : "max-w-7xl mx-auto", className)}>
      {(title || description || icon) && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 rounded-xl bg-gradient-primary shadow-glow">
                {icon}
              </div>
            )}
            {(title || description) && (
              <div>
                {title && (
                  <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={noPadding ? "" : "space-y-6"}>
        {children}
      </div>
    </div>
  );
};

export const PageCard = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentProps<typeof Card>) => {
  return (
    <Card className={cn("gradient-border p-6", className)} {...props}>
      {children}
    </Card>
  );
};