CREATE TABLE "grammar_drills" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL,
	"prompt_bg" text NOT NULL,
	"prompt_en" text NOT NULL,
	"correct_answer" text NOT NULL,
	"options" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer NOT NULL,
	CONSTRAINT "grammar_topics_position_unique" UNIQUE("position")
);
--> statement-breakpoint
ALTER TABLE "grammar_drills" ADD CONSTRAINT "grammar_drills_topic_id_grammar_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "grammar_drills_topic_id_idx" ON "grammar_drills" USING btree ("topic_id");