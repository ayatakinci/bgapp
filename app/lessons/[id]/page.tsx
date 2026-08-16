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
    return <p className="text-stone-500">Lesson not found.</p>;
  }

  const lessonWordsList = await db
    .select({ id: words.id, bg: words.bg, en: words.en })
    .from(lessonWords)
    .innerJoin(words, eq(lessonWords.wordId, words.id))
    .where(eq(lessonWords.lessonId, lessonId));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
      <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
        {lessonWordsList.map((word) => (
          <li key={word.id} className="flex items-baseline justify-between px-4 py-3">
            <span className="font-medium">{word.bg}</span>
            <span className="text-sm text-stone-500">{word.en}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
