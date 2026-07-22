ALTER TABLE "templates" ADD COLUMN "analysis_config" jsonb;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "analysis_sections" jsonb;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "ai_model" text;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "ai_generated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "category_scores" ADD COLUMN "rationale" text;