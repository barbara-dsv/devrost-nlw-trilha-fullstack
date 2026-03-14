import * as React from "react";
import { tv } from "tailwind-variants";

const navbarVariants = tv({
  base: "flex items-center justify-between h-14 px-6 border-b border-border bg-background",
});

// Root Component
const NavbarRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ className, children, ...props }, ref) => {
  return (
    <nav ref={ref} className={navbarVariants({ className })} {...props}>
      {children}
    </nav>
  );
});
NavbarRoot.displayName = "NavbarRoot";

// Brand Component (Logo area)
const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
});
NavbarBrand.displayName = "NavbarBrand";

// Nav Component (Links area)
const NavbarNav = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});
NavbarNav.displayName = "NavbarNav";

export const Navbar = {
  Root: NavbarRoot,
  Brand: NavbarBrand,
  Nav: NavbarNav,
};

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
