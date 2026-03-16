import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { severityEnum } from "./enums";
import { codeSnippets } from "./code_snippets";

export const analysisItems = pgTable("analysis_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  snippetId: uuid("snippet_id").notNull().references(() => codeSnippets.id),
  severity: severityEnum("severity").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
