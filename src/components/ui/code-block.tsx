import * as React from "react";
import { tv } from "tailwind-variants";

const codeBlockVariants = tv({
  base: "rounded-lg border border-border bg-muted overflow-hidden",
});

// Root Component (Synchronous)
const CodeBlockRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={codeBlockVariants({ className })} {...props}>
      {children}
    </div>
  );
});
CodeBlockRoot.displayName = "CodeBlockRoot";

// Header Component
const CodeBlockHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between px-4 py-2 border-b border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CodeBlockHeader.displayName = "CodeBlockHeader";

// Body Component (for the code content)
const CodeBlockBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { html?: string }
>(({ className, children, html, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("overflow-x-auto p-4", className)} {...props}>
      {children}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </div>
  );
});
CodeBlockBody.displayName = "CodeBlockBody";

export const CodeBlock = {
  Root: CodeBlockRoot,
  Header: CodeBlockHeader,
  Body: CodeBlockBody,
};

// Helper to mimic cn utility
function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
