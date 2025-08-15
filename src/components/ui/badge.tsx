import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-glow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        glow: "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-glow backdrop-blur-sm",
        ai: "border-transparent bg-gradient-primary text-primary-foreground hover:shadow-glow animate-pulse-glow",
        // Enhanced Cyberpunk Badge Variants
        neon_green: "border-transparent bg-neon-green text-neon-green-foreground hover:bg-neon-green/80 hover:shadow-glow",
        neon_purple: "border-transparent bg-neon-purple text-neon-purple-foreground hover:bg-neon-purple/80 hover:shadow-glow",
        neon_orange: "border-transparent bg-neon-orange text-neon-orange-foreground hover:bg-neon-orange/80 hover:shadow-glow",
        electric: "border-transparent bg-electric-blue text-electric-blue-foreground hover:bg-electric-blue/80 hover:shadow-glow",
        cyber_pink: "border-transparent bg-cyber-pink text-cyber-pink-foreground hover:bg-cyber-pink/80 hover:shadow-glow",
        matrix: "border-transparent bg-gradient-matrix text-neon-green-foreground hover:shadow-glow animate-pulse-glow",
        status_planned: "border-transparent bg-status-planned text-white hover:bg-status-planned/80 hover:shadow-glow",
        status_progress: "border-transparent bg-status-in-progress text-white hover:bg-status-in-progress/80 hover:shadow-glow",
        status_complete: "border-transparent bg-status-complete text-white hover:bg-status-complete/80 hover:shadow-glow",
        status_delayed: "border-transparent bg-status-delayed text-white hover:bg-status-delayed/80 hover:shadow-glow",
        status_blocked: "border-transparent bg-status-blocked text-white hover:bg-status-blocked/80 hover:shadow-glow",
        status_review: "border-transparent bg-status-review text-black hover:bg-status-review/80 hover:shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
