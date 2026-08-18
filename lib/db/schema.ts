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
  // Where this lesson sits in the overall CEFR progression -- same scale
  // as grammarTopics.level, so /curriculum can interleave the two.
  level: text("level").notNull().default("A1"), // "A1" | "A2" | "B1" | "B2"
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
    // The literal token from `bg` that matched `words.bg` -- not always
    // identical to it, since matching tolerates inflected forms (e.g.
    // stored word "далеч" can match sentence token "далече"). Stored
    // explicitly so a fill-in-the-blank exercise can blank the exact
    // right substring instead of re-deriving it at render time.
    matchedWord: text("matched_word").notNull(),
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

// A separate content model from lessons/words on purpose -- grammar
// topics (Part A of the roadmap) are a different kind of thing than
// vocabulary words, and drills here are practiced on demand rather than
// scheduled through the SRS system (that would need reviews/review_log
// to become polymorphic across words and drills, a bigger change than
// this pass -- deliberately left for later).
export const grammarTopics = pgTable("grammar_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  // Longer-form prose: etymology, formality notes, cultural context --
  // the "why", not just the one-line "what" in description.
  notes: text("notes"),
  level: text("level").notNull().default("A1"), // "A1" | "A2" | "B1" | "B2"
  position: integer("position").notNull().unique(),
});

export const grammarDrills = pgTable(
  "grammar_drills",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => grammarTopics.id, { onDelete: "cascade" }),
    // promptBg contains a literal "___" marking where the blank goes,
    // e.g. "___ книга е голяма." with correctAnswer "Тази".
    promptBg: text("prompt_bg").notNull(),
    promptEn: text("prompt_en").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    options: text("options").array().notNull(),
  },
  (table) => [index("grammar_drills_topic_id_idx").on(table.topicId)]
);

// A user's own hand-picked words, separate from the SRS review queue --
// e.g. words they want to drill before a trip, independent of whatever
// the spaced-repetition schedule would otherwise serve up.
export const wordBank = pgTable(
  "word_bank",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.wordId] })]
);