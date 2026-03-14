"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { detectLanguage } from "@/lib/language-detection";
import { tv } from "tailwind-variants";

// Tipos
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
  language?: string;
  theme?: Theme;
  className?: string;
}

// Estilos
const editorVariants = tv({
  base: "rounded-lg border border-border bg-muted overflow-hidden relative",
});

const codeVariants = tv({
  base: "font-mono text-sm whitespace-pre-wrap break-words",
});

// Lista de linguagens suportadas para o seletor
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

export function CodeEditor({
  defaultValue = "",
  onChange,
  onLanguageChange,
  language: propLanguage,
  theme = "dark-plus",
  className,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultValue);
  const [detectedLanguage, setDetectedLanguage] = useState<Language>("plaintext");
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Detect language on code change
  useEffect(() => {
    if (!propLanguage) {
      const lang = detectLanguage(code);
      setDetectedLanguage(lang);
      if (onLanguageChange) {
        onLanguageChange(lang);
      }
    } else {
      setDetectedLanguage(propLanguage as Language);
    }
  }, [code, propLanguage, onLanguageChange]);

  // Highlight code using Shiki
  useEffect(() => {
    const highlightCode = async () => {
      try {
        const { codeToHtml } = await import("shiki");
        const html = await codeToHtml(code, {
          lang: detectedLanguage,
          theme: theme,
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error("Error highlighting code:", error);
        setHighlightedCode(
          `<pre class="shiki ${theme}"><code>${escapeHtml(code)}</code></pre>`
        );
      }
    };

    highlightCode();
  }, [code, detectedLanguage, theme]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange?.(newValue);
  };

  const handleLanguageSelect = (lang: Language) => {
    setDetectedLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    setShowLanguageDropdown(false);
  };

  // Sync scroll between textarea and highlighted code
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const currentLanguageLabel =
    supportedLanguages.find((l) => l.value === detectedLanguage)?.label ||
    detectedLanguage;

  return (
    <div className={editorVariants({ className })}>
      {/* Header */}
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

      {/* Editor Area */}
      <div className="relative h-64">
        {/* Highlighted Code Layer */}
        <pre
          ref={preRef}
          className={codeVariants({
            className:
              "absolute inset-0 p-4 m-0 pointer-events-none overflow-auto bg-transparent",
          })}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* Textarea Layer */}
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
            // Manter o caret visível e o texto invisível para não sobrepor o highlight
            color: "transparent",
            caretColor: "currentColor",
          }}
        />
      </div>
    </div>
  );
}

// Helper para escapar HTML
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
