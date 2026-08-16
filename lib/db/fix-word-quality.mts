import "dotenv/config";
import { inArray, eq, or } from "drizzle-orm";
import { db } from "./index";
import { words, lessons, lessonWords } from "./schema";
import { findWords } from "./ingest.mts";

// Confirmed by manually inspecting their raw Wiktionary entries -- neither
// has a "vulgar"/"slang" tag on any sense currently captured by the
// ingest logic, so they can't be caught automatically. Character-entry
// (alphabet letter) removal below IS automatic, via part_of_speech.
const KNOWN_BAD_WORDS = ["курва", "кур"];

async function main() {
  const badRows = await db
    .select()
    .from(words)
    .where(or(eq(words.partOfSpeech, "character"), inArray(words.bg, KNOWN_BAD_WORDS)));

  console.log(`Removing ${badRows.length} low-quality entries...`);
  console.log(badRows.map((w) => `  ${w.bg} (${w.partOfSpeech}) - ${w.en}`).join("\n"));

  if (badRows.length === 0) {
    console.log("Nothing to clean up.");
    return;
  }

  await db.delete(words).where(
    inArray(words.id, badRows.map((w) => w.id))
  );

  const remaining = await db.select({ bg: words.bg }).from(words);
  // Must include KNOWN_BAD_WORDS explicitly, not just currently-remaining
  // words -- they were just deleted, so without this they'd look
  // available again and get immediately re-matched with the same bad
  // sense (their tags don't mark them as vulgar, so content-based
  // filtering alone can't catch them).
  const excludeWords = new Set([...remaining.map((w) => w.bg), ...KNOWN_BAD_WORDS]);

  console.log(`Finding ${badRows.length} replacement words...`);
  const replacements = await findWords(badRows.length, excludeWords);
  console.log(`Found ${replacements.length} replacements.`);

  if (replacements.length > 0) {
    await db.insert(words).values(replacements);
  }

  // Lesson groupings are just a mechanical split of the word list, not
  // meaningful content of their own -- regenerate them cleanly against
  // the corrected word set rather than trying to patch around the gaps
  // left by deleted words.
  console.log("Regenerating lessons against the corrected word list...");
  await db.delete(lessons); // cascades to lesson_words

  const allWords = await db.select().from(words).orderBy(words.id);
  const WORDS_PER_LESSON = 25;
  for (let i = 0; i < allWords.length; i += WORDS_PER_LESSON) {
    const chunk = allWords.slice(i, i + WORDS_PER_LESSON);
    const position = i / WORDS_PER_LESSON + 1;
    const [lesson] = await db
      .insert(lessons)
      .values({ title: `Lesson ${position}`, position })
      .returning();
    await db.insert(lessonWords).values(chunk.map((w) => ({ lessonId: lesson.id, wordId: w.id })));
  }

  console.log(`Done. ${allWords.length} words, ${Math.ceil(allWords.length / WORDS_PER_LESSON)} lessons.`);
}

main().then(() => process.exit(0));
