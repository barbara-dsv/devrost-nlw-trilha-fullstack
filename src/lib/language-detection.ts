// Utilitário para detecção de linguagem baseada em heurística
// Analisa keywords e padrões comuns para identificar a linguagem do código

export type Language =
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

const languagePatterns: Record<Language, RegExp[]> = {
  javascript: [
    /\b(function|const|let|var|=>|console\.log|import|export|require)\b/,
    /\bdocument\./,
    /\bwindow\./,
  ],
  typescript: [
    /\binterface\s+\w+|type\s+\w+|: \w+\s*\|/,
    /\bconst\s+\w+:\s*\w+/,
    /\bimport\s+.*\s+from\s+/,
  ],
  python: [
    /\bdef\s+\w+\(|\bclass\s+\w+|:\s*$/,
    /\bimport\s+\w+|\bfrom\s+\w+\s+import/,
    /\bprint\(|\blen\(|\brange\(/,
  ],
  java: [
    /\bpublic\s+class\s+\w+|private\s+class\s+\w+/,
    /\bSystem\.out\.println/,
    /\bimport\s+java\./,
  ],
  c: [
    /#\s*include\s+<.*\.h>/,
    /\bprintf\(|\bscanf\(/,
    /\bint\s+main\(/,
  ],
  cpp: [
    /#\s*include\s+<.*>/,
    /\bstd::cout|\bstd::cin/,
    /\bclass\s+\w+\s*{/,
  ],
  csharp: [
    /\busing\s+System/,
    /\bnamespace\s+\w+/,
    /\bConsole\.WriteLine/,
  ],
  php: [
    /<\?php|<\?=|<\?/,
    /\bfunction\s+\w+\(/,
    /\becho\s+/,
  ],
  html: [
    /<!DOCTYPE|<html|<head|<body|<div|<span|<p|<a\s|<img/,
    /<\/\w+>/,
  ],
  css: [
    /\.\w+\s*\{/,
    /#\w+\s*\{/,
    /:\s*\{/,
  ],
  sql: [
    /\bSELECT\s+\*?\s+FROM\b/i,
    /\bINSERT\s+INTO\b/i,
    /\bUPDATE\s+\w+\s+SET\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bCREATE\s+TABLE\b/i,
  ],
  json: [
    /^\s*\{[\s\S]*\}\s*$/,
    /^\s*\[[\s\S]*\]\s*$/,
    /"\w+"\s*:\s*/,
  ],
  yaml: [
    /^\s*\w+:\s*/,
    /^\s*-\s+\w+:/,
  ],
  markdown: [
    /^#{1,6}\s+/,
    /^\*\s+/,
    /^\d+\.\s+/,
    /^\>\s+/,
  ],
  plaintext: [],
};

export function detectLanguage(code: string): Language {
  if (!code || code.trim().length === 0) {
    return "plaintext";
  }

  // Verificar assinaturas específicas primeiro
  const firstLines = code.split("\n").slice(0, 20).join("\n");

  // 1. Verificar HTML
  if (/<html|<!DOCTYPE|<div|<span|<p\s|<a\s|<img/i.test(firstLines)) {
    return "html";
  }

  // 2. Verificar JSON
  if (/^\s*[\[{]/.test(code.trim())) {
    try {
      JSON.parse(code);
      return "json";
    } catch {
      // Não é JSON válido, continua
    }
  }

  // 3. Verificar YAML
  if (/^\s*\w+:\s*/.test(firstLines) || /^\s*-\s+\w+:/.test(firstLines)) {
    return "yaml";
  }

  // 4. Verificar Markdown
  if (/^#{1,6}\s+/.test(firstLines) || /^\*\s+/.test(firstLines)) {
    return "markdown";
  }

  // 5. Verificar PHP
  if (/<\?php|<\?=|<\?/.test(firstLines)) {
    return "php";
  }

  // 6. Verificar SQL
  if (
    /\bSELECT\s+\*?\s+FROM\b/i.test(firstLines) ||
    /\bINSERT\s+INTO\b/i.test(firstLines) ||
    /\bUPDATE\s+\w+\s+SET\b/i.test(firstLines)
  ) {
    return "sql";
  }

  // 7. Analisar keywords para outras linguagens
  const scores: Record<string, number> = {};

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    if (lang === "plaintext") continue;
    let score = 0;
    for (const pattern of patterns) {
      const matches = firstLines.match(pattern);
      if (matches) {
        score += matches.length;
      }
    }
    scores[lang] = score;
  }

  // Encontrar linguagem com maior score
  let maxScore = 0;
  let detectedLang: Language = "plaintext";

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang as Language;
    }
  }

  return detectedLang;
}

// Mapeamento de extensões para linguagens
export const fileExtensionToLanguage: Record<string, Language> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "cpp",
  cs: "csharp",
  php: "php",
  html: "html",
  htm: "html",
  css: "css",
  sql: "sql",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
  markdown: "markdown",
};

export function detectLanguageFromFilename(filename: string): Language {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext && fileExtensionToLanguage[ext]) {
    return fileExtensionToLanguage[ext];
  }
  return "plaintext";
}
