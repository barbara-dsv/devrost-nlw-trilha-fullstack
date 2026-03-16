import * as React from "react";
import { tv } from "tailwind-variants";
import { codeToHtml } from "shiki";

const codeBlockVariants = tv({
  base: "rounded-lg border border-border bg-muted overflow-hidden",
});

export interface CodeBlockProps {
  code: string;
  language?: string;
  theme?: "dark-plus" | "light-plus" | "auto";
  maxLines?: number;
  showLineNumbers?: boolean;
  className?: string;
}

async function highlightCode(
  code: string,
  language: string,
  theme: "dark-plus" | "light-plus" = "dark-plus"
): Promise<string> {
  try {
    const html = await codeToHtml(code, {
      lang: language,
      theme: theme,
    });
    return html;
  } catch {
    return `<pre class="shiki ${theme}"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

// Export object for composition pattern (backwards compatible)
export const CodeBlock = {
  Root: CodeBlockRoot,
  Header: CodeBlockHeader,
  Body: CodeBlockBody,
} as const;

// CodeBlock with syntax highlighting (Server Component)
export async function CodeBlockWithHighlight({
  code,
  language = "plaintext",
  theme = "light-plus",
  maxLines,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const codeToRender = maxLines 
    ? code.split("\n").slice(0, maxLines).join("\n")
    : code;
  
  const resolvedTheme = theme === "auto" ? "light-plus" : theme;
  const highlightedCode = await highlightCode(codeToRender, language, resolvedTheme);

  return (
    <div className={codeBlockVariants({ className })}>
      <div className="overflow-x-auto p-2">
        <code 
          className="font-mono text-sm break-all whitespace-pre-wrap" 
          dangerouslySetInnerHTML={{ __html: highlightedCode }} 
        />
      </div>
    </div>
  );
}

// Helper to mimic cn utility
function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}
