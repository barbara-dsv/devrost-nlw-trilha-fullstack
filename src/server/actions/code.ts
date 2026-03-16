"use server";

import { db } from "@/db";
import { codeSnippets } from "@/db/schema/code_snippets";
import { analysisItems } from "@/db/schema/analysis_items";
import { languageEnum, severityEnum } from "@/db/schema/enums";
import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { lt } from "drizzle-orm";

console.log("OPENAI_API_KEY loaded:", process.env.OPENAI_API_KEY ? "YES (length: " + process.env.OPENAI_API_KEY.length + ")" : "NO");

function getMockResponse(roastMode: boolean): IAResponse {
  const baseScore = roastMode ? 2.5 : 6.5;
  const scoreVariation = (Math.random() - 0.5) * 2;
  const score = Math.max(0, Math.min(10, baseScore + scoreVariation));
  
  const getScoreCategory = (score: number): "terrible" | "poor" | "fair" | "good" | "excellent" => {
    if (score <= 3.0) return "terrible";
    if (score <= 5.0) return "poor";
    if (score <= 7.0) return "fair";
    if (score <= 8.5) return "good";
    return "excellent";
  };
  
  const scoreCategory = getScoreCategory(score);
  
  const mockItems: AnalysisItem[] = [
    {
      severity: score <= 3 ? "critical" : score <= 5 ? "warning" : "good",
      title: roastMode 
        ? "Código necessita de sérias melhorias" 
        : "Boa estrutura com espaço para aprimoramentos",
      description: roastMode
        ? "Este código apresenta múltiplos problemas que afetam legibilidade e manutenção. Considere revisar práticas básicas de programação."
        : "O código mostra boa intenção. Alguns ajustes poderiam melhorar consistência e seguir melhores práticas estabelecidas."
    }
  ];
  
  return {
    score: Number(score.toFixed(1)),
    review: roastMode
      ? "Honestamente, este código precisa de trabalho séria. Há vários problemas que podem estar causando bugs ou dificultando a manutenção."
      : "O código está no caminho certo! Com algumas melhorias menores, poderia ser ainda melhor. Continue praticando!",
    items: mockItems
  };
}

export async function submitCode(formData: FormData) {
  const code = formData.get("code") as string;
  const language = formData.get("language") as string;
  const roastMode = formData.get("roastMode") === "true";

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

  let iaResponse: IAResponse;
  
  try {
    const { text: responseText } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: prompt,
    });
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      iaResponse = JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      iaResponse = {
        score: Math.random() * 5 + 3,
        review: "Análise gerada (fallback)",
        items: [],
      };
    }
  } catch (apiError) {
    console.warn("OpenAI API failed, using mock response:", apiError instanceof Error ? apiError.message : String(apiError));
    iaResponse = getMockResponse(roastMode);
  }

  const { score, review, items } = iaResponse;

  const getScoreCategory = (
    score: number
  ): "terrible" | "poor" | "fair" | "good" | "excellent" => {
    if (score <= 3.0) return "terrible";
    if (score <= 5.0) return "poor";
    if (score <= 7.0) return "fair";
    if (score <= 8.5) return "good";
    return "excellent";
  };

  const scoreCategory = getScoreCategory(score);

  await cleanupOldSnippets();

  const [snippet] = await db.insert(codeSnippets).values({
    code,
    language: language as typeof languageEnum.enumValues[number],
    score: String(score),
    scoreCategory,
    roastMode,
    roastText: review,
  }).returning();

  if (items && items.length > 0) {
    await db.insert(analysisItems).values(
      items.map((item) => ({
        snippetId: snippet.id,
        severity: item.severity as any,
        title: item.title,
        description: item.description,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/leaderboard");

  return { success: true, score, review, items, snippetId: snippet.id };
}

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

async function cleanupOldSnippets() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await db.delete(codeSnippets).where(lt(codeSnippets.createdAt, thirtyDaysAgo));
}
