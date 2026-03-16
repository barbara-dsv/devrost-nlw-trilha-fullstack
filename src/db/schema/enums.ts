import { pgEnum } from "drizzle-orm/pg-core";

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
  "critical",
  "warning",
  "good",
]);

export const scoreCategoryEnum = pgEnum("score_category", [
  "terrible",
  "poor",
  "fair",
  "good",
  "excellent",
]);
