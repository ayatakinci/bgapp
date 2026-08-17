import { eq, inArray, asc, sql } from "drizzle-orm";
import { db } from "./index";
import { lessonWords, sentences } from "./schema";

// Pools sentences across every word in a lesson, dedupes by sentence text
// (the same sentence can legitimately be linked to more than one word in
// the same lesson), and prefers shorter/simpler sentences when there are
// more available than the cap.
export async function getLessonSentences(lessonId: number, limit = 100) {
  const lessonWordRows = await db
    .select({ wordId: lessonWords.wordId })
    .from(lessonWords)
    .where(eq(lessonWords.lessonId, lessonId));
  const wordIds = lessonWordRows.map((w) => w.wordId);

  if (wordIds.length === 0) return [];

  const rows = await db
    .select()
    .from(sentences)
    .where(inArray(sentences.wordId, wordIds))
    .orderBy(asc(sql`length(${sentences.bg})`))
    .limit(limit * 3); // overfetch, since dedup can drop some

  const seen = new Set<string>();
  const deduped: typeof rows = [];
  for (const row of rows) {
    if (seen.has(row.bg)) continue;
    seen.add(row.bg);
    deduped.push(row);
    if (deduped.length >= limit) break;
  }

  return deduped;
}
