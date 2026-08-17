CREATE TABLE "word_bank" (
	"user_id" integer NOT NULL,
	"word_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "word_bank_user_id_word_id_pk" PRIMARY KEY("user_id","word_id")
);
--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "word_bank" ADD CONSTRAINT "word_bank_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_bank" ADD CONSTRAINT "word_bank_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;