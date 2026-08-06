CREATE TABLE "lesson_words" (
	"lesson_id" integer NOT NULL,
	"word_id" integer NOT NULL,
	CONSTRAINT "lesson_words_lesson_id_word_id_pk" PRIMARY KEY("lesson_id","word_id")
);
--> statement-breakpoint
ALTER TABLE "lesson_words" ADD CONSTRAINT "lesson_words_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_words" ADD CONSTRAINT "lesson_words_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;