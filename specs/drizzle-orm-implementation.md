# Especificação: Implementação do Drizzle ORM com Docker Compose

## 1. Introdução
Esta especificação descreve a implementação do Drizzle ORM no projeto **DevRoast** para persistência de dados. O projeto atualmente utiliza dados estáticos para o leaderboard e submissão de código. A migração para um banco de dados real permitirá:
- Armazenamento persistente de códigos submetidos
- Cálculo em tempo real de estatísticas e ranking
- Histórico de avaliações (roasts)
- Suporte a usuários autenticados

## 2. Stack Tecnológica Proposta

### 2.1. Banco de Dados
- **PostgreSQL**: Banco de dados relacional robusto para produção
- **Docker Compose**: Para orquestração do banco de dados localmente
- **Drizzle ORM**: TypeScript-first ORM com suporte a migrations

### 2.2. Ferramentas de Desenvolvimento
- **Drizzle Kit**: CLI para migrations e introspecção
- **Neon** (opcional): Banco PostgreSQL serverless para produção

## 3. Modelo de Dados

### 3.1. Tabelas Principais

#### `code_snippets`
Armazena os códigos submetidos anonimamente.
```typescript
// src/db/schema/code_snippets.ts
export const codeSnippets = pgTable("code_snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).notNull(), // "javascript", "typescript", etc.
  score: decimal("score", { precision: 3, scale: 1 }).notNull(), // 0.0 a 10.0
  roastMode: boolean("roast_mode").notNull().default(false),
  roastText: text("roast_text").notNull(), // Análise gerada pela IA
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3.2. Lógica de Limpeza (Retention)
Como o objetivo é armazenar apenas **códigos recentes**, é necessário implementar uma rotina de limpeza:
- **Estratégia**: Remover códigos com mais de 30 dias ou manter apenas os top 1000 (limite de storage).
- **Implementação**: Job agendado (cron) ou trigger no banco para deletar registros antigos.

### 3.3. Enums (opcional)

Para garantir consistência nos tipos de linguagem:
```typescript
// src/db/schema/enums.ts
export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "html",
  "css",
  "sql",
  "plaintext",
]);

// No schema, usar: language: languageEnum("language").notNull(),
```

## 4. Arquitetura de Pastas Proposta

```
src/
├── db/
│   ├── schema/
│   │   ├── index.ts        # Exporta todas as tabelas
│   │   ├── users.ts
│   │   ├── code_snippets.ts
│   │   └── roasts.ts
│   ├── index.ts            # Conexão com o banco
│   └── migrations/         # Arquivos de migration gerados
├── server/
│   ├── actions/
│   │   ├── code.ts         # Submissão de código
│   │   └── leaderboard.ts  # Consultas do leaderboard
│   └── db.ts               # Instância do Drizzle
└── app/
    ├── api/                # Rotas API (se necessário)
    └── (rotas existentes)
```

## 5. Configuração do Docker Compose

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast123
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### `.env.local`
```env
DATABASE_URL=postgres://devroast:devroast123@localhost:5432/devroast
```

## 6. Integração com Next.js App Router

### 6.1. Server Actions
Usar Server Actions para operações de banco de dados.

**Observação sobre Anonimato**: Não vinculamos a `userId`.

**Observação sobre IA**: Usaremos `AI SDK` (Vercel) para gerar o roast. Isso requer a chave de API da OpenAI (ou similar).

```typescript
// src/server/actions/code.ts
'use server'

import { db } from '@/server/db'
import { codeSnippets } from '@/db/schema/code_snippets'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai' // Vercel AI SDK
import { openai } from '@ai-sdk/openai' // ou outro provider

export async function submitCode(formData: FormData) {
  const code = formData.get('code') as string
  const language = formData.get('language') as string
  const roastMode = formData.get('roastMode') === 'true'

  // 1. Gerar roast via IA
  const prompt = roastMode 
    ? `You are a brutally honest code reviewer. Review this ${language} code and be sarcastic and direct:\n\n${code}`
    : `You are a helpful code reviewer. Review this ${language} code and provide constructive feedback:\n\n${code}`;

  const { text: roastText } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: prompt,
  });

  // 2. Extrair score (ex: pedir à IA para retornar em formato JSON ou usar regex)
  // Por simplicidade, vamos assumir que a IA retorna "Score: X/10" no texto ou calculamos hash.
  // Para esta spec, vamos simular um score baseado no comprimento ou usar uma lógica simples.
  // Idealmente, pedir à IA para retornar JSON: { "score": 5.5, "review": "..." }
  
  // Exemplo simples de parsing de score (assumindo formato "Score: 7.5")
  const scoreMatch = roastText.match(/Score:\s*([\d.]+)/);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : (Math.random() * 5 + 3); // Fallback

  // 3. Inserir no banco (apenas se for um código novo/recente)
  // Limpar códigos antigos antes de inserir (ou manter apenas top N)
  await cleanupOldSnippets(); // Função de limpeza

  await db.insert(codeSnippets).values({
    code,
    language,
    score,
    roastMode,
    roastText,
  })

  revalidatePath('/')
  revalidatePath('/leaderboard')
  
  return { success: true, score, roastText };
}

// Função para limpar códigos antigos (retenção apenas recentes)
async function cleanupOldSnippets() {
  // Manter apenas os 1000 códigos mais recentes ou remover os com mais de 30 dias
  // Exemplo: Deletar códigos com mais de 30 dias
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await db.delete(codeSnippets).where(lt(codeSnippets.createdAt, thirtyDaysAgo));
}
```

### 6.2. Consultas para Leaderboard

```typescript
// src/server/actions/leaderboard.ts
'use server'

import { db } from '@/server/db'
import { codeSnippets } from '@/db/schema/code_snippets'
import { desc, avg, count } from 'drizzle-orm'

export async function getLeaderboard(limit = 10) {
  return await db
    .select()
    .from(codeSnippets)
    .orderBy(desc(codeSnippets.score))
    .limit(limit)
}

export async function getStats() {
  const totalCodesResult = await db.select({ count: count() }).from(codeSnippets)
  const avgScoreResult = await db
    .select({ avg: avg(codeSnippets.score) })
    .from(codeSnippets)

  return {
    totalCodes: totalCodesResult[0]?.count || 0,
    avgScore: avgScoreResult[0]?.avg || 0,
  }
}
```

## 7. Migrações

### 7.1. Configuração do Drizzle Kit
`drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### 7.2. Comandos
```bash
# Gerar migrations
npm run drizzle:generate

# Aplicar migrations
npm run drizzle:migrate

# Push direto (desenvolvimento)
npm run drizzle:push
```

## 8. To-Dos para Implantação

### Fase 1: Setup Inicial
- [ ] Instalar dependências: `drizzle-orm`, `drizzle-kit`, `pg`, `ai`, `@ai-sdk/openai`
- [ ] Criar arquivo `docker-compose.yml`
- [ ] Configurar `.env.local` com URL do banco e chave de API da OpenAI
- [ ] Inicializar banco com `docker-compose up -d`

### Fase 2: Schema do Banco
- [ ] Criar estrutura de pastas `src/db/`
- [ ] Definir schemas das tabelas (code_snippets apenas, usuarios anonimos)
- [ ] Criar instância do Drizzle em `src/server/db.ts`
- [ ] Gerar e aplicar migrations iniciais

### Fase 3: Server Actions (AI & DB)
- [ ] Implementar `submitCode` com integração AI SDK
- [ ] Implementar `cleanupOldSnippets` para retenção apenas de recentes
- [ ] Implementar `getLeaderboard` (consulta do ranking)
- [ ] Implementar `getStats` (estatísticas da homepage)

### Fase 4: Integração com Frontend
- [ ] Atualizar Homepage (`/`) para usar dados reais via Server Actions
- [ ] Atualizar Leaderboard (`/leaderboard`) para usar dados reais
- [ ] Remover dados estáticos dos componentes
- [ ] Adicionar input de código e botão de submit na Homepage

### Fase 5: Testes e Validação
- [ ] Testar submissão de código (verificarAI response e inserção no DB)
- [ ] Verificar leaderboard em tempo real
- [ ] Validar limpeza automática de códigos antigos
- [ ] Validar performance com dados de produção

## 9. Respostas do Usuário (Atualizadas)

1. **Autenticação**: Anônima (qualquer pessoa pode submeter sem login).
2. **Análise de Código**: Gerado por IA usando AI SDK (Vercel).
3. **Armazenamento**: Apenas códigos recentes (limpeza automática implementada).
4. **Produção**: Local (Docker Compose) no momento.

## 10. Próximos Passos

Após definição das respostas acima, posso:
1. Gerar o arquivo `docker-compose.yml` completo
2. Criar os schemas do Drizzle
3. Implementar as server actions iniciais
4. Atualizar os componentes frontend para usar dados reais
