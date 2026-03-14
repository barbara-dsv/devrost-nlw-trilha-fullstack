# Especificação: Editor com Syntax Highlight

## 1. Introdução
O objetivo desta feature é permitir que os usuários cole trechos de código no aplicativo e visualizem a syntax highlighting automaticamente, com a opção de selecionar a linguagem manualmente. A referência de design é o editor do **ray-so** (Raycast).

## 2. Análise do Ambiente Atual
- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Bibliotecas Existentes:**
  - `shiki` (v4.0.2): Já instalado. É uma biblioteca de syntax highlighting que usa TextMate grammars (as mesmas do VS Code). É altamente precisa e performática.
  - `tailwind-variants`: Para estilização condicional.

## 3. Opções de Implementação

### Opção A: `shiki` (Recomendada)
Como `shiki` já está no projeto, esta é a opção mais limpa e integrada.
- **Prós:** Alta qualidade de highlighting, suporte a muitas linguagens, uso de grammars do VS Code, tema personalizável.
- **Contras:** Pode ser mais pesado que Prism se não for otimizado (lazy loading), mas o v4 é muito eficiente.
- **Uso no Ray-so:** O ray-so original usa Prism, mas Shiki é uma evolução moderna.

### Opção B: `prism-react-renderer`
- **Prós:** Leve, popular, fácil de usar.
- **Contras:** Menos preciso que Shiki, menos linguagens suportadas nativamente.
- **Status:** Não instalado no projeto.

### Opção C: `react-simple-code-editor`
- **Prós:** Editor simples, focado em edição.
- **Contras:** O highlighting é visual apenas (não é um editor real em termos de modelo de documento), depende de Prism.
- **Status:** Não instalado.

### Opção D: Monaco Editor (VS Code)
- **Prós:** Funcionalidades completas (intellisense, etc.).
- **Contras:** Muito pesado (~20MB+), complexo de integrar, provavelmente overkill para a necessidade atual.
- **Status:** Não instalado.

## 4. Proposta Técnica

### 4.1. Biblioteca de Highlighting: Shiki
Usaremos `shiki` para a renderização da syntax highlighting.
- **Lazy Loading:** Carregar os gramáticas e temas sob demanda para manter o bundle size baixo.
- **Temas:** Utilizar o tema "Dark Plus" (padrão do VS Code) ou permitir customização.

### 4.2. Editor de Código
Para o componente de edição:
- **Abordagem 1 (Editável):** Usar um `textarea` ou `contenteditable` sobreposto a um bloco de código renderizado por Shiki (estilo `react-simple-code-editor`).
- **Abordagem 2 (Pronto):** Usar um wrapper leve como `@uiw/react-textarea-code-editor` ou `prism-code-editor` que já integra editing e highlighting.

Dada a preferência pelo visual do **ray-so** (que é um visualizador com possibilidade de edição?), e a necessidade de "colar código", a abordagem de um **visualizador editável** é ideal.

**Componente Escolhido:** Será criado um componente `CodeEditor` que:
1. Aceita uma string de código.
2. Aceita uma linguagem (ou detecta automaticamente).
3. Renderiza o código com highlighting via Shiki.
4. Permite edição (via `textarea` transparente ou `contenteditable`).

*Nota:* A detecção automática de linguagem é complexa. Shiki não detecta automaticamente; ele precisa da linguagem especificada. Para detecção automática, precisaremos de uma biblioteca como `lang-detector` ou lógica personalizada baseada em heurísticas/extension.

### 4.3. Fluxo de Detecção de Linguagem
1. **Paste:** Usuário cola código.
2. **Tentativa 1 (Heurística):** Verificar `navigator.clipboard.read()` (se suportado) para metadados ou analisar a estrutura básica (ex: `<?php`, `<html>`).
3. **Tentativa 2 (Biblioteca):** Usar `@vscode/vscode-languagedetector` (se possível no browser) ou uma heurística simples baseada em keywords.
4. **Fallback:** Se não detectar, usar "plaintext" ou permitir seleção manual.

Como a detecção automática completa é difícil no frontend puro, a especificação focará na **seleção manual** como recurso primário, com detecção baseada em extensão/arquivo (se disponível) como secundário.

## 5. Especificação de Implementação

### 5.1. Novo Componente: `CodeEditor`
Local: `src/components/ui/code-editor.tsx`

**Props:**
```typescript
interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  theme?: string; // Opcional, default 'dark-plus'
}
```

**Estrutura Interna:**
- **Camada de Visualização (Highlight):** `pre` ou `div` renderizado com HTML gerado por `shiki.codeToHtml`.
- **Camada de Edição (Input):** `textarea` transparente sobreposta para capturar input do usuário.
- **UI de Seleção de Linguagem:** Dropdown para selecionar linguagem manualmente (visível quando `language` não está definido ou via toggle).

### 5.2. Integração com `shiki`
- Usar `shiki` diretamente ou criar um wrapper `useShiki` hook.
- **Lazy Loading:** Carregar apenas os gramáticas necessários.
  ```typescript
  import { codeToHtml } from 'shiki';
  // ... usage
  ```

### 5.3. Detecção de Linguagem (Simplificada)
Criar um utilitário `detectLanguage(code: string): string` que:
1. Analisa as primeiras linhas.
2. Verifica keywords específicas (ex: `function`, `import`, `console.log`).
3. Retorna uma linguagem padrão (ex: `javascript`) ou `plaintext`.

### 5.4. Estilização (Tailwind)
- Estilos do editor (fonte, padding, cores) seguindo o design do ray-so.
- Suporte a tema claro/escuro (se necessário).

## 6. To-Dos

- [ ] **Pesquisa & POC:** Validar integração do `shiki` com um `textarea` overlay.
- [ ] **Componente `CodeEditor`:** Criar arquivo `src/components/ui/code-editor.tsx`.
- [ ] **Hook `useShiki`:** (Opcional) Abstrair a lógica de highlight.
- [ ] **Utilitário de Detecção:** Implementar `detectLanguage`.
- [ ] **UI de Seleção:** Criar dropdown de linguagens.
- [ ] **Integração na Homepage:** Substituir o input atual pelo novo `CodeEditor`.
- [ ] **Testes:** Verificar performance com grandes blocos de código.

## 7. Respostas do Usuário

1.  **Editor Editável:** Sim, o usuário pode editar o código mesmo depois de colado (modo visualização + edição).
2.  **Detecção de Linguagem:** Por análise de conteúdo (heurística/baseada em keywords).
3.  **Temas:** Suporte para temas claros e escuros.
4.  **Linguagens:** Não existe uma específica, pode detectar qualquer linguagem suportada pelo Shiki.
