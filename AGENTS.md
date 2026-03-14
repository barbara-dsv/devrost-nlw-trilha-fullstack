# Projeto DevRoast

## Visão Geral
Projeto de avaliação de código desenvolvido durante o **NLW da Rocketseat**. Permite aos usuários colar código e receber avaliações (roasts) sobre a qualidade do código.

## Tecnologias
- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** Padrão de composição (sub-componentes)

## Padrões Globais

### Padrão de Componentes
Todos os componentes de UI seguem o **pattern de composição**:
```tsx
<Componente.Root>
  <Componente.SubComponente />
</Componente.Root>
```

**Exemplos:**
- `Button.Default`, `Button.Destructive`, `Button.Lg`
- `Badge.Success`, `Badge.Warning`
- `Toggle.Root`, `Toggle.Switch`, `Toggle.Text`
- `Card.Root`, `Card.Header`, `Card.Title`, `Card.Content`

### Estrutura de Pastas
```
src/
  app/              # Rotas Next.js
    page.tsx        # Homepage
    componentes/    # Página de demonstração
    leaderboard/    # Página do ranking
  components/
    ui/             # Componentes de interface
      button.tsx
      badge.tsx
      toggle.tsx
      card.tsx
      navbar.tsx
      code-block.tsx
      score-ring.tsx
      index.ts      # Exportação centralizada
```

### Configurações
- **Porta:** 3000 (desenvolvimento)
- **Build:** `npm run build`
- **Dev:** `npm run dev`

### Estilização
- **Cores:**
  - Verde accent: `#10b981` (definido em global.css)
  - Cores do sistema: Variáveis Tailwind CSS
- **Fontes:** Sistema padrão

### Componentes Chave
1. **Toggle** - Switch para alternar estados (roast mode)
2. **Button** - Botões com variantes e tamanhos
3. **Badge** - Tags de status/categoria
4. **Card** - Container de conteúdo
5. **Navbar** - Barra de navegação
6. **CodeBlock** - Exibição de código com syntax highlighting
7. **ScoreRing** - Anel de pontuação circular

### URLs Importantes
- **Homepage:** `/`
- **Componentes:** `/componentes`
- **Leaderboard:** `/leaderboard`
