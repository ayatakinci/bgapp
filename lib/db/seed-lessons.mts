import "dotenv/config";
import { db } from "./index";
import { words, lessons, lessonWords } from "./schema";
import { DOMAIN_SINGLE_WORDS, DOMAIN_PHRASES, DOMAIN_ORDER } from "./curriculum-data.mts";

const WORDS_PER_LESSON = 25;

async function main() {
  console.log("Clearing existing lessons...");
  await db.delete(lessons); // cascades to lesson_words

  const allWords = await db.select().from(words).orderBy(words.id);
  const wordByBg = new Map(allWords.map((w) => [w.bg, w]));
  const usedIds = new Set<number>();

  // One lesson per roadmap domain (Part C), in the order the roadmap lists them.
  let position = 1;
  for (const domain of DOMAIN_ORDER) {
    const domainWords = [
      ...(DOMAIN_SINGLE_WORDS[domain] ?? []),
      ...(DOMAIN_PHRASES[domain] ?? []).map((p) => p.bg),
    ]
      .map((bg) => wordByBg.get(bg))
      .filter((w): w is NonNullable<typeof w> => w !== undefined);

    const [lesson] = await db
      .insert(lessons)
      .values({ title: domain, position: position++ })
      .returning();

    await db.insert(lessonWords).values(domainWords.map((w) => ({ lessonId: lesson.id, wordId: w.id })));
    domainWords.forEach((w) => usedIds.add(w.id));
    console.log(`${domain}: ${domainWords.length} words`);
  }

  // Everything else (the original frequency-based import, minus whatever
  // got reused in a curriculum domain above) still gets a home, as
  // supplementary vocabulary after the curriculum-aligned lessons.
  const leftover = allWords.filter((w) => !usedIds.has(w.id));
  console.log(`\n${leftover.length} words left over -> supplementary lessons.`);

  for (let i = 0; i < leftover.length; i += WORDS_PER_LESSON) {
    const chunk = leftover.slice(i, i + WORDS_PER_LESSON);
    const [lesson] = await db
      .insert(lessons)
      .values({ title: `Extra vocabulary ${i / WORDS_PER_LESSON + 1}`, position: position++ })
      .returning();
    await db.insert(lessonWords).values(chunk.map((w) => ({ lessonId: lesson.id, wordId: w.id })));
  }

  console.log(`Done. ${position - 1} lessons total.`);
}

main().then(() => process.exit(0));
