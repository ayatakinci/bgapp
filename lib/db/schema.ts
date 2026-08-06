import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  bg: text("bg").notNull(),
  en: text("en").notNull(),
  partOfSpeech: text("part_of_speech"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});