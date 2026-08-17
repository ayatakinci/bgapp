import Link from "next/link";
import { db } from "@/lib/db";
import { lessons, lessonWords, words, sentences } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getLessonSentences } from "@/lib/db/lesson-sentences";

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

  // The full reading pool -- up to 100 real sentences across this lesson's
  // words, separate from the one-per-word example above the vocab list.
  const readingSentences = await getLessonSentences(lessonId, 100);

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

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-500">
        Words ({lessonWordsList.length})
      </h2>
      <ul className="mb-10 divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
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

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-stone-500">
        Example sentences ({readingSentences.length})
      </h2>
      {readingSentences.length === 0 ? (
        <p className="text-sm text-stone-400">No example sentences for this lesson yet.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
          {readingSentences.map((s) => (
            <li key={s.id} className="px-4 py-3">
              <p className="font-medium">{s.bg}</p>
              <p className="mt-1 text-sm text-stone-500">{s.en}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
