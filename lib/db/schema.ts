import { pgTable, serial, text, timestamp, integer, primaryKey, index, real } from "drizzle-orm/pg-core";


export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  bg: text("bg").notNull(),
  en: text("en").notNull(),
  partOfSpeech: text("part_of_speech"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessonWords = pgTable(
  "lesson_words",
  {
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.lessonId, table.wordId] })]
);

export const sentences = pgTable(
  "sentences",
  {
    id: serial("id").primaryKey(),
    bg: text("bg").notNull(),
    en: text("en").notNull(),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("sentences_word_id_idx").on(table.wordId)]
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    nextReviewAt: timestamp("next_review_at").notNull().defaultNow(),
    interval: integer("interval").notNull().default(0),
    easeFactor: real("ease_factor").notNull().default(2.5),
    repetitions: integer("repetitions").notNull().default(0),
    lastReviewedAt: timestamp("last_reviewed_at"),
  },
  (table) => [primaryKey({ columns: [table.userId, table.wordId] })]
);