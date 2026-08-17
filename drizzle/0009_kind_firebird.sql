ALTER TABLE "grammar_topics" ADD COLUMN "level" text DEFAULT 'A1' NOT NULL;--> statement-breakpoint
ALTER TABLE "sentences" ADD COLUMN "matched_word" text NOT NULL;