import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground enabled:hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90",
      outline:
        "border border-input bg-background enabled:hover:bg-accent enabled:hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80",
      ghost: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
      link: "text-primary underline-offset-4 enabled:hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Button Root - Container base
const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);
ButtonRoot.displayName = "ButtonRoot";

// Variantes como sub-componentes
const ButtonDefault = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="default" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonDefault.displayName = "ButtonDefault";

const ButtonDestructive = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="destructive" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonDestructive.displayName = "ButtonDestructive";

const ButtonOutline = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="outline" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonOutline.displayName = "ButtonOutline";

const ButtonSecondary = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="secondary" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonSecondary.displayName = "ButtonSecondary";

const ButtonGhost = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="ghost" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonGhost.displayName = "ButtonGhost";

const ButtonLink = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  ({ className, size, ...props }, ref) => {
    return <ButtonRoot variant="link" size={size} className={className} ref={ref} {...props} />;
  },
);
ButtonLink.displayName = "ButtonLink";

// Tamanhos como sub-componentes
const ButtonSm = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "size">>(
  ({ className, variant, ...props }, ref) => {
    return <ButtonRoot variant={variant} size="sm" className={className} ref={ref} {...props} />;
  },
);
ButtonSm.displayName = "ButtonSm";

const ButtonLg = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "size">>(
  ({ className, variant, ...props }, ref) => {
    return <ButtonRoot variant={variant} size="lg" className={className} ref={ref} {...props} />;
  },
);
ButtonLg.displayName = "ButtonLg";

const ButtonIcon = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "size">>(
  ({ className, variant, ...props }, ref) => {
    return <ButtonRoot variant={variant} size="icon" className={className} ref={ref} {...props} />;
  },
);
ButtonIcon.displayName = "ButtonIcon";

export const Button = {
  Root: ButtonRoot,
  Default: ButtonDefault,
  Destructive: ButtonDestructive,
  Outline: ButtonOutline,
  Secondary: ButtonSecondary,
  Ghost: ButtonGhost,
  Link: ButtonLink,
  Sm: ButtonSm,
  Lg: ButtonLg,
  Icon: ButtonIcon,
};
