CREATE TABLE "sentences" (
	"id" serial PRIMARY KEY NOT NULL,
	"bg" text NOT NULL,
	"en" text NOT NULL,
	"word_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sentences" ADD CONSTRAINT "sentences_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sentences_word_id_idx" ON "sentences" USING btree ("word_id");