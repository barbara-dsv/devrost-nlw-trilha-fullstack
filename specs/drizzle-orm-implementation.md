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
  scoreCategory: scoreCategoryEnum("score_category").notNull(), // Categoria visual do score
  roastMode: boolean("roast_mode").notNull().default(false),
  roastText: text("roast_text").notNull(), // Análise gerada pela IA
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

### 3.2. Lógica de Limpeza (Retention)
Como o objetivo é armazenar apenas **códigos recentes**, é necessário implementar uma rotina de limpeza:
- **Estratégia**: Remover códigos com mais de 30 dias ou manter apenas os top 1000 (limite de storage).
- **Implementação**: Job agendado (cron) ou trigger no banco para deletar registros antigos.

### 3.3. Enums

Para garantir consistência nos tipos de linguagem e severidade das análises:

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

export const severityEnum = pgEnum("severity", [
  "critical",  // Vermelho - Problemas graves
  "warning",   // Amarelo/Ambar - Avisos
  "good",      // Verde - Pontos positivos
]);

export const scoreCategoryEnum = pgEnum("score_category", [
  "terrible",  // Vermelho (0.0 - 3.0) - Score muito baixo
  "poor",      // Vermelho/Ambar (3.1 - 5.0) - Score baixo
  "fair",      // Ambar (5.1 - 7.0) - Score médio
  "good",      // Ambar/Verde (7.1 - 8.5) - Score bom
  "excellent", // Verde (8.6 - 10.0) - Score excelente
]);

// No schema, usar: 
// language: languageEnum("language").notNull(),
// severity: severityEnum("severity").notNull(),
// scoreCategory: scoreCategoryEnum("score_category").notNull(),
```

#### `analysis_items`
Armazena os itens de análise detalhada (cartões de "Roast Results").
```typescript
// src/db/schema/analysis_items.ts
export const analysisItems = pgTable("analysis_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  snippetId: uuid("snippet_id").notNull().references(() => codeSnippets.id),
  severity: severityEnum("severity").notNull(),
  title: varchar("title", { length: 255 }).notNull(), // Ex: "using var instead of const/let"
  description: text("description").notNull(), // Ex: "var is function-scoped..."
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**Relacionamento:**
- **code_snippets** 1:N **analysis_items**: Cada código pode ter múltiplos itens de análise (cards).

## 4. Arquitetura de Pastas Proposta

```
src/
├── db/
│   ├── schema/
│   │   ├── index.ts        # Exporta todas as tabelas
│   │   ├── enums.ts        # Definições de enums (language, severity)
│   │   ├── code_snippets.ts
│   │   └── analysis_items.ts
│   ├── index.ts            # Conexão com o banco
│   └── migrations/         # Arquivos de migration gerados
├── server/
│   ├── actions/
│   │   ├── code.ts         # Submissão de código e geração de análise
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

**Observação sobre IA**: Usaremos `AI SDK` (Vercel) para gerar o roast. A IA deve retornar um JSON estruturado com o score e os itens de análise (severity, title, description).

```typescript
// src/server/actions/code.ts
'use server'

import { db } from '@/server/db'
import { codeSnippets } from '@/db/schema/code_snippets'
import { analysisItems } from '@/db/schema/analysis_items'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai' // Vercel AI SDK
import { openai } from '@ai-sdk/openai' // ou outro provider
import { lt } from 'drizzle-orm'

// Interface para a resposta da IA
interface AnalysisItem {
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
}

interface IAResponse {
  score: number;
  review: string;
  items: AnalysisItem[];
}

export async function submitCode(formData: FormData) {
  const code = formData.get('code') as string
  const language = formData.get('language') as string
  const roastMode = formData.get('roastMode') === 'true'

  // 1. Gerar roast via IA com formato JSON
  const prompt = roastMode 
    ? `You are a brutally honest code reviewer. Review this ${language} code and be sarcastic and direct.
Return your response in JSON format with the following structure:
{
  "score": number (0-10),
  "review": string (overall review),
  "items": [
    { "severity": "critical"|"warning"|"good", "title": string, "description": string }
  ]
}

Code to review:
${code}`
    : `You are a helpful code reviewer. Review this ${language} code and provide constructive feedback.
Return your response in JSON format with the following structure:
{
  "score": number (0-10),
  "review": string (overall review),
  "items": [
    { "severity": "critical"|"warning"|"good", "title": string, "description": string }
  ]
}

Code to review:
${code}`;

  const { text: responseText } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: prompt,
  });

  // 2. Parsear a resposta JSON
  let iaResponse: IAResponse;
  try {
    // Encontrar o JSON no texto (remove markdown code blocks se presentes)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    iaResponse = JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    // Fallback básico se o JSON falhar
    iaResponse = {
      score: Math.random() * 5 + 3,
      review: "Análise gerada (fallback)",
      items: []
    };
  }

  const { score, review, items } = iaResponse;

  // 3. Determinar a categoria do score baseado no valor
  const getScoreCategory = (score: number): "terrible" | "poor" | "fair" | "good" | "excellent" => {
    if (score <= 3.0) return "terrible";
    if (score <= 5.0) return "poor";
    if (score <= 7.0) return "fair";
    if (score <= 8.5) return "good";
    return "excellent";
  };

  const scoreCategory = getScoreCategory(score);

  // 4. Inserir no banco
  // Limpar códigos antigos antes de inserir
  await cleanupOldSnippets();

  // Inserir o snippet principal
  const [snippet] = await db.insert(codeSnippets).values({
    code,
    language,
    score,
    scoreCategory,
    roastMode,
    roastText: review,
  }).returning();

  // Inserir os itens de análise (se houver)
  if (items && items.length > 0) {
    await db.insert(analysisItems).values(
      items.map(item => ({
        snippetId: snippet.id,
        severity: item.severity,
        title: item.title,
        description: item.description,
      }))
    );
  }

  revalidatePath('/')
  revalidatePath('/leaderboard')
  
  return { success: true, score, review, items, snippetId: snippet.id };
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
- [ ] Definir enums (language, severity, scoreCategory) em `src/db/schema/enums.ts`
- [ ] Definir schemas das tabelas (code_snippets, analysis_items)
- [ ] Criar instância do Drizzle em `src/server/db.ts`
- [ ] Gerar e aplicar migrations iniciais

### Fase 3: Server Actions (AI & DB)
- [ ] Implementar `submitCode` com integração AI SDK (retornando JSON com items de análise)
- [ ] Implementar `cleanupOldSnippets` para retenção apenas de recentes
- [ ] Implementar `getLeaderboard` (consulta do ranking)
- [ ] Implementar `getStats` (estatísticas da homepage)
- [ ] Implementar `getAnalysisItems` (para exibir os cards na tela de resultados)

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
