# Especificação: Implementação do tRPC com Next.js App Router

## 1. Objetivo
Criar uma camada de API type-safe usando tRPC integrado com TanStack React Query e Next.js App Router, suportando Server Components e Client Components.

## 2. Stack
- @trpc/server
- @trpc/client
- @trpc/tanstack-react-query
- @tanstack/react-query
- zod
- server-only

## 3. Arquitetura
```
src/
├── trpc/
│   ├── init.ts              # initTRPC, context, base router
│   ├── query-client.ts      # QueryClient factory
│   ├── client.tsx           # TRPCProvider (Client Components)
│   ├── server.tsx          # tRPC proxy + caller (Server Components)
│   └── routers/
│       ├── _app.ts          # AppRouter principal
│       └── hello.ts         # Exemplo de router
└── app/
    └── api/trpc/[trpc]/
        └── route.ts         # API route handler
```

## 4. Implementação

### 4.1 Instalação
```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod server-only
```

### 4.2 init.ts - Base tRPC
```typescript
// src/trpc/init.ts
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return { userId: 'user_123' };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 4.3 Router exemplo
```typescript
// src/trpc/routers/hello.ts
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const helloRouter = createTRPCRouter({
  greeting: baseProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => {
      return { greeting: `hello ${opts.input.text}` };
    }),
});

// src/trpc/routers/_app.ts
import { createTRPCRouter } from '../init';
import { helloRouter } from './hello';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
```

### 4.4 API Route
```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '../../../../trpc/init';
import { appRouter } from '../../../../trpc/routers/_app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 4.5 Query Client
```typescript
// src/trpc/query-client.ts
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}
```

### 4.6 Client Components Provider
```typescript
// src/trpc/client.tsx
'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

function getUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: `${getUrl()}/api/trpc` })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
```

### 4.7 Server Components
```typescript
// src/trpc/server.tsx
import 'server-only';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
export const caller = appRouter.createCaller(createTRPCContext());
```

### 4.8 Uso em Server Component
```typescript
// app/page.tsx
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { ClientGreeting } from './client-greeting';

export default async function Home() {
  prefetch(trpc.hello.greeting.queryOptions({ text: 'world' }));
  
  return (
    <HydrateClient>
      <ClientGreeting />
    </HydrateClient>
  );
}
```

### 4.9 Uso em Client Component
```typescript
// app/client-greeting.tsx
'use client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function ClientGreeting() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.hello.greeting.queryOptions({ text: 'world' }));
  return <div>{data.greeting}</div>;
}
```

### 4.10 Provider no Layout
```typescript
// src/app/layout.tsx
import { TRPCReactProvider } from '@/trpc/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
```

## 5. To-Dos
- [ ] Instalar dependências
- [ ] Criar estrutura de pastas `src/trpc/`
- [ ] Implementar `trpc/init.ts` com contexto
- [ ] Criar router exemplo em `trpc/routers/_app.ts`
- [ ] Criar API route em `app/api/trpc/[trpc]/route.ts`
- [ ] Configurar `trpc/query-client.ts`
- [ ] Configurar `trpc/client.tsx` (Provider)
- [ ] Configurar `trpc/server.tsx` (Server proxy)
- [ ] Adicionar TRPCReactProvider no `layout.tsx`
- [ ] Migrar server actions existentes para routers tRPC
- [ ] Testar integração com Client e Server Components
