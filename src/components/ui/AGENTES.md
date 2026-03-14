# Padrões de Criação de Componentes UI

Este arquivo documenta os padrões e convenções para criar componentes UI no projeto.

## 📋 Padrões Gerais

### 1. Estrutura de Pastas
```
src/components/ui/
├── component.tsx      # Componente principal
├── index.ts          # Barrel export
└── AGENTES.md        # Documentação (este arquivo)
```

### 2. Naming Conventions
- **Componentes**: PascalCase (ex: `Button`, `Input`, `Card`)
- **Arquivos**: lowercase com hífen (ex: `button.tsx`, `input.tsx`)
- **Named Exports**: Sempre use named exports, NUNCA default exports

### 3. Tecnologias
- **Tailwind Variants**: Para gerenciar variantes e estilos
- **Tailwind CSS**: Para estilização
- **TypeScript**: Para tipagem forte

## 🎨 Componente Button - Padrões Específicos

### 1. Importações
```typescript
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
```

### 2. Uso do Tailwind Variants
- Use `tv()` em vez de `cva()` (do class-variance-authority)
- Estrutura:
  ```typescript
  const componentVariants = tv({
    base: "classes-base-aqui",
    variants: {
      variant: {
        // variantes aqui
      },
      size: {
        // tamanhos aqui
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  });
  ```

### 3. Props e Interface
```typescript
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // props adicionais aqui
}
```

### 4. Componente
```typescript
export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";
```

### 5. Barrel Export (index.ts)
```typescript
export { Component, type ComponentProps } from "./component";
```

## ⚠️ Importante: Regras de Estilização

### 1. Não use twMerge/twMerge com variants
❌ **ERRADO**:
```typescript
className={cn(componentVariants({ variant, size, className }))}
```

✅ **CORRETO**:
```typescript
className={componentVariants({ variant, size, className })}
```

**Motivo**: O `tailwind-variants` já faz o merge automático de classes quando você passa `className` como propriedade. O uso de `cn` (twMerge) é desnecessário e pode causar conflitos.

### 2. Como adicionar classes extras
Se precisar adicionar classes específicas a um componente, passe via `className`:

```typescript
<Button className="my-custom-class" variant="default">
  Texto
</Button>
```

Essa classe será automaticamente mesclada com as classes da variante.

## 📝 Template de Componente

Copie e use este template para novos componentes:

```typescript
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const componentVariants = tv({
  base: "classes-base",
  variants: {
    variant: {
      default: "classes-variante-default",
      // adicione mais variantes
    },
    size: {
      default: "classes-tamanho-default",
      // adicione mais tamanhos
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // props adicionais
}

export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Component.displayName = "Component";
```

## 📚 Exemplos de Uso

### Button
```typescript
import { Button } from "@/components/ui";

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚡</Button>

// Com className adicional
<Button className="my-class" variant="default">
  Custom
</Button>
```

## 🔧 Configuração do Projeto

### Tailwind CSS
- As cores do tema estão definidas em `src/app/globals.css`
- Variáveis disponíveis: `primary`, `secondary`, `destructive`, `accent`, etc.

### Aliases
- `@/*` aponta para `src/*` (configurado em `tsconfig.json`)

## ✅ Checklist antes de commitar

- [ ] Componente usa `tv()` do tailwind-variants
- [ ] Não usa `cn()` ou `twMerge` com variants
- [ ] Usa named exports (sem default exports)
- [ ] Inclui `displayName` no componente
- [ ] Adiciona barrel export em `index.ts`
- [ ] Passa `className` para o `tv()` em vez de usar `cn()`
- [ ] Formatação e lint passam (`npm run format` e `npm run lint`)
