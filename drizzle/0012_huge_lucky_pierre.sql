CREATE TABLE "syllabus_progress" (
	"user_id" integer NOT NULL,
	"item_id" text NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "syllabus_progress_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "example" text;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "example_translation" text;--> statement-breakpoint
ALTER TABLE "grammar_topics" ADD COLUMN "pitfall" text;--> statement-breakpoint
ALTER TABLE "syllabus_progress" ADD CONSTRAINT "syllabus_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;