"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { detectLanguage } from "@/lib/language-detection";
import { tv } from "tailwind-variants";

type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "php"
  | "html"
  | "css"
  | "sql"
  | "json"
  | "yaml"
  | "markdown"
  | "plaintext";

type Theme = "dark-plus" | "light-plus";

interface CodeEditorProps {
  defaultValue?: string;
  onChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  onLimitChange?: (isOverLimit: boolean) => void;
  maxLength?: number;
  language?: string;
  theme?: Theme;
  className?: string;
}

const editorVariants = tv({
  base: "rounded-lg border border-border bg-muted overflow-hidden relative",
});

const codeVariants = tv({
  base: "font-mono text-sm whitespace-pre-wrap break-words",
});

const supportedLanguages: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" },
];

// Preload Shiki
let shikiModule: typeof import("shiki") | null = null;
let shikiLoading = false;

async function loadShiki() {
  if (shikiModule) return shikiModule;
  if (shikiLoading) {
    while (!shikiModule) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return shikiModule;
  }
  shikiLoading = true;
  shikiModule = await import("shiki");
  return shikiModule;
}

export function CodeEditor({
  defaultValue = "",
  onChange,
  onLanguageChange,
  onLimitChange,
  maxLength = 2000,
  language: propLanguage,
  theme = "dark-plus",
  className,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultValue);
  const [detectedLanguage, setDetectedLanguage] = useState<Language>("plaintext");
  const [userSelectedLanguage, setUserSelectedLanguage] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [shikiReady, setShikiReady] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Preload Shiki on mount
  useEffect(() => {
    loadShiki().then(() => setShikiReady(true));
  }, []);

  // Set initial language from prop
  useEffect(() => {
    if (propLanguage && !userSelectedLanguage) {
      setDetectedLanguage(propLanguage as Language);
    }
  }, [propLanguage, userSelectedLanguage]);

  // Detect language on code change
  useEffect(() => {
    if (code.length > 10 && !userSelectedLanguage) {
      const lang = detectLanguage(code);
      setDetectedLanguage(lang);
      if (onLanguageChange) {
        onLanguageChange(lang);
      }
    }
  }, [code, userSelectedLanguage, onLanguageChange]);

  // Highlight code with debounce
  const highlightCode = useCallback(async () => {
    if (!code || !shikiReady) {
      setHighlightedCode("");
      return;
    }

    setIsHighlighting(true);
    try {
      const { codeToHtml } = await loadShiki();
      const html = await codeToHtml(code, {
        lang: detectedLanguage,
        theme: theme,
      });
      setHighlightedCode(html);
    } catch (error) {
      console.error("Error highlighting code:", error);
      setHighlightedCode(`<pre class="shiki ${theme}"><code>${escapeHtml(code)}</code></pre>`);
    } finally {
      setIsHighlighting(false);
    }
  }, [code, detectedLanguage, theme, shikiReady]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      highlightCode();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [highlightCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length > maxLength) {
      onLimitChange?.(true);
      return;
    }
    onLimitChange?.(false);
    setCode(newValue);
    onChange?.(newValue);
  };

  const isOverLimit = code.length > maxLength;

  const handleLanguageSelect = (lang: Language) => {
    setDetectedLanguage(lang);
    setUserSelectedLanguage(true);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    setShowLanguageDropdown(false);
  };

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const currentLanguageLabel =
    supportedLanguages.find((l) => l.value === detectedLanguage)?.label ||
    detectedLanguage;

  // Show plain text while loading Shiki or during highlight
  const showPlainText = !shikiReady || (isHighlighting && !highlightedCode);

  return (
    <div className={editorVariants({ className })}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {currentLanguageLabel}
          </button>
          {showLanguageDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded shadow-lg z-20 min-w-[120px]">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageSelect(lang.value)}
                  className="block w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative min-h-64 max-h-96 overflow-auto">
        <pre
          ref={preRef}
          className={codeVariants({
            className:
              "absolute inset-0 p-4 m-0 pointer-events-none overflow-auto bg-transparent",
          })}
          dangerouslySetInnerHTML={{
            __html: highlightedCode || escapeHtml(code),
          }}
        />

        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onScroll={handleScroll}
          spellCheck={false}
          className={codeVariants({
            className:
              "absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-foreground resize-none focus:outline-none z-10",
          })}
          style={{
            color: "transparent",
            caretColor: "currentColor",
          }}
        />
        
        <div className={`absolute bottom-2 right-2 text-xs font-mono px-2 py-1 rounded ${
          isOverLimit ? "bg-red-500/20 text-red-400" : "bg-muted/80 text-muted-foreground"
        }`}>
          {code.length} / {maxLength}
        </div>
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  if (typeof document === "undefined") {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
