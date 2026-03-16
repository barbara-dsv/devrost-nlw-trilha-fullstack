"use server";

import { db } from "@/db";
import { codeSnippets } from "@/db/schema/code_snippets";
import { analysisItems } from "@/db/schema/analysis_items";
import { desc, avg, count, eq } from "drizzle-orm";

export async function getLeaderboard(limit = 10) {
  // Query manual com join para buscar snippets e seus itens de análise
  // Usando Drizzle Query API (não relational query) conforme especificação
  const result = await db
    .select({
      id: codeSnippets.id,
      code: codeSnippets.code,
      language: codeSnippets.language,
      score: codeSnippets.score,
      scoreCategory: codeSnippets.scoreCategory,
      roastText: codeSnippets.roastText,
      createdAt: codeSnippets.createdAt,
      analysisItems: count(analysisItems.id),
    })
    .from(codeSnippets)
    .leftJoin(analysisItems, eq(codeSnippets.id, analysisItems.snippetId))
    .groupBy(codeSnippets.id)
    .orderBy(desc(codeSnippets.score))
    .limit(limit);

  return result;
}

export async function getStats() {
   const totalCodesResult = await db
     .select({ count: count() })
     .from(codeSnippets);
   const avgScoreResult = await db
     .select({ avg: avg(codeSnippets.score) })
     .from(codeSnippets);

   return {
     totalCodes: Number(totalCodesResult[0]?.count) || 0,
     avgScore: Number(avgScoreResult[0]?.avg) || 0,
   };
 }

export async function getSnippetById(id: string) {
  // Query manual com join para buscar um snippet específico com seus itens de análise
  const snippetResult = await db
    .select()
    .from(codeSnippets)
    .where(eq(codeSnippets.id, id))
    .limit(1);

  if (snippetResult.length === 0) {
    return null;
  }

  const snippet = snippetResult[0];

  const itemsResult = await db
    .select()
    .from(analysisItems)
    .where(eq(analysisItems.snippetId, id));

  return {
    ...snippet,
    analysisItems: itemsResult,
  };
}
