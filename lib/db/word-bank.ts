import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { wordBank, words } from "./schema";

export async function getWordBank(userId: number) {
  return db
    .select({ id: words.id, bg: words.bg, en: words.en, addedAt: wordBank.addedAt })
    .from(wordBank)
    .innerJoin(words, eq(wordBank.wordId, words.id))
    .where(eq(wordBank.userId, userId))
    .orderBy(wordBank.addedAt);
}

export async function isInWordBank(userId: number, wordId: number) {
  const [row] = await db
    .select()
    .from(wordBank)
    .where(and(eq(wordBank.userId, userId), eq(wordBank.wordId, wordId)));
  return Boolean(row);
}

export async function addToWordBank(userId: number, wordId: number) {
  await db.insert(wordBank).values({ userId, wordId }).onConflictDoNothing();
}

export async function removeFromWordBank(userId: number, wordId: number) {
  await db.delete(wordBank).where(and(eq(wordBank.userId, userId), eq(wordBank.wordId, wordId)));
}
