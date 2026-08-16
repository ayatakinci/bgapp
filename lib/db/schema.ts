import { pgTable, serial, text, timestamp, integer, primaryKey, index, real, boolean } from "drizzle-orm/pg-core";


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
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
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

// Append-only history of every answer ever submitted -- unlike `reviews`
// (current state, overwritten each time), this is what stats/streaks/
// accuracy actually need to compute from.
export const reviewLog = pgTable(
  "review_log",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    correct: boolean("correct").notNull(),
    answeredAt: timestamp("answered_at").notNull().defaultNow(),
  },
  (table) => [index("review_log_user_id_idx").on(table.userId)]
);