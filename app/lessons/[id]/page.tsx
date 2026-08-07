import { db } from "@/lib/db";
import { lessons, lessonWords, words } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lessonId = Number(id);

  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId));

  if (!lesson) {
    return <p>Lesson not found.</p>;
  }

  const lessonWordsList = await db
    .select({ id: words.id, bg: words.bg, en: words.en })
    .from(lessonWords)
    .innerJoin(words, eq(lessonWords.wordId, words.id))
    .where(eq(lessonWords.lessonId, lessonId));

  return (
    <div>
      <h1>{lesson.title}</h1>
      <ul>
        {lessonWordsList.map((word) => (
          <li key={word.id}>
            {word.bg} — {word.en}
          </li>
        ))}
      </ul>
    </div>
  );
}
