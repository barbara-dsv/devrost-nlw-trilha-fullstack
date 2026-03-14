import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
      success: "border-transparent bg-accent-green text-white hover:opacity-90",
      warning: "border-transparent bg-accent-amber text-white hover:opacity-90",
      critical: "border-transparent bg-accent-red text-white hover:opacity-90",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Badge Root - Container base
const BadgeRoot = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={badgeVariants({ variant, className })}
        {...props}
      />
    );
  },
);
BadgeRoot.displayName = "BadgeRoot";

// Variantes como sub-componentes
const BadgeDefault = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="default" className={className} ref={ref} {...props} />;
  },
);
BadgeDefault.displayName = "BadgeDefault";

const BadgeSecondary = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="secondary" className={className} ref={ref} {...props} />;
  },
);
BadgeSecondary.displayName = "BadgeSecondary";

const BadgeDestructive = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="destructive" className={className} ref={ref} {...props} />;
  },
);
BadgeDestructive.displayName = "BadgeDestructive";

const BadgeOutline = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="outline" className={className} ref={ref} {...props} />;
  },
);
BadgeOutline.displayName = "BadgeOutline";

const BadgeSuccess = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="success" className={className} ref={ref} {...props} />;
  },
);
BadgeSuccess.displayName = "BadgeSuccess";

const BadgeWarning = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="warning" className={className} ref={ref} {...props} />;
  },
);
BadgeWarning.displayName = "BadgeWarning";

const BadgeCritical = React.forwardRef<HTMLDivElement, Omit<BadgeProps, "variant">>(
  ({ className, ...props }, ref) => {
    return <BadgeRoot variant="critical" className={className} ref={ref} {...props} />;
  },
);
BadgeCritical.displayName = "BadgeCritical";

export const Badge = {
  Root: BadgeRoot,
  Default: BadgeDefault,
  Secondary: BadgeSecondary,
  Destructive: BadgeDestructive,
  Outline: BadgeOutline,
  Success: BadgeSuccess,
  Warning: BadgeWarning,
  Critical: BadgeCritical,
};
