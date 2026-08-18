import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { syllabusProgress } from "./schema";

export async function getSyllabusProgress(userId: number): Promise<Set<string>> {
  const rows = await db
    .select({ itemId: syllabusProgress.itemId })
    .from(syllabusProgress)
    .where(eq(syllabusProgress.userId, userId));
  return new Set(rows.map((r) => r.itemId));
}

export async function setSyllabusItemChecked(userId: number, itemId: string, checked: boolean) {
  if (checked) {
    await db.insert(syllabusProgress).values({ userId, itemId }).onConflictDoNothing();
  } else {
    await db.delete(syllabusProgress).where(and(eq(syllabusProgress.userId, userId), eq(syllabusProgress.itemId, itemId)));
  }
}
