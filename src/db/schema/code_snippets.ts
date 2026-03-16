import { pgTable, uuid, text, varchar, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { languageEnum, scoreCategoryEnum } from "./enums";

export const codeSnippets = pgTable("code_snippets", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  score: decimal("score", { precision: 3, scale: 1 }).notNull(),
  scoreCategory: scoreCategoryEnum("score_category").notNull(),
  roastMode: boolean("roast_mode").notNull().default(false),
  roastText: text("roast_text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
