import "dotenv/config";
import { db } from "./index";
import { words, lessons, lessonWords } from "./schema";

const WORDS_PER_LESSON = 25;

async function main() {
  const allWords = await db.select().from(words).orderBy(words.id);

  const lessonCount = Math.ceil(allWords.length / WORDS_PER_LESSON);

  for (let i = 0; i < allWords.length; i += WORDS_PER_LESSON) {
    const chunk = allWords.slice(i, i + WORDS_PER_LESSON);
    const position = i / WORDS_PER_LESSON + 1;

    const [lesson] = await db
      .insert(lessons)
      .values({ title: `Lesson ${position}`, position })
      .returning();

    await db.insert(lessonWords).values(
      chunk.map((w) => ({ lessonId: lesson.id, wordId: w.id }))
    );
  }

  console.log(`Created ${lessonCount} lessons from ${allWords.length} words.`);
}

main().then(() => process.exit(0));
