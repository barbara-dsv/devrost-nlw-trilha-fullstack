CREATE TYPE "public"."language" AS ENUM('javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'html', 'css', 'sql', 'plaintext');--> statement-breakpoint
CREATE TYPE "public"."score_category" AS ENUM('terrible', 'poor', 'fair', 'good', 'excellent');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('critical', 'warning', 'good');--> statement-breakpoint
CREATE TABLE "code_snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"language" "language" NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"score_category" "score_category" NOT NULL,
	"roast_mode" boolean DEFAULT false NOT NULL,
	"roast_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analysis_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"snippet_id" uuid NOT NULL,
	"severity" "severity" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analysis_items" ADD CONSTRAINT "analysis_items_snippet_id_code_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."code_snippets"("id") ON DELETE no action ON UPDATE no action;