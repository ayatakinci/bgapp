CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"bg" text NOT NULL,
	"en" text NOT NULL,
	"part_of_speech" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
