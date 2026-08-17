import Link from "next/link";
import { db } from "@/lib/db";
import { lessons, lessonWords, words, sentences } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

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

  const wordIds = lessonWordsList.map((w) => w.id);
  const sentenceRows =
    wordIds.length > 0
      ? await db
          .select({ wordId: sentences.wordId, bg: sentences.bg, en: sentences.en })
          .from(sentences)
          .where(inArray(sentences.wordId, wordIds))
      : [];

  const sentencesByWord = new Map<number, { bg: string; en: string }>();
  for (const s of sentenceRows) {
    if (!sentencesByWord.has(s.wordId)) sentencesByWord.set(s.wordId, s); // one example is enough here
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        <Link
          href={`/lessons/${lessonId}/practice`}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Practice sentences
        </Link>
      </div>
      <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
        {lessonWordsList.map((word) => {
          const example = sentencesByWord.get(word.id);
          return (
            <li key={word.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{word.bg}</span>
                <span className="text-sm text-stone-500">{word.en}</span>
              </div>
              {example && (
                <p className="mt-1 text-sm text-stone-400">
                  {example.bg} <span className="italic">— {example.en}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
