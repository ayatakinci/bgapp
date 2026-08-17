import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons, words } from "@/lib/db/schema";
import { getLessonSentences } from "@/lib/db/lesson-sentences";
import { SentencePracticeDeck } from "@/app/components/exercises/SentencePracticeDeck";

export const dynamic = "force-dynamic";

export default async function LessonPracticePage({
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

  const sentenceRows = await getLessonSentences(lessonId, 100);

  const wordDistractorRows = await db
    .select({ bg: words.bg })
    .from(words)
    .orderBy(sql`random()`)
    .limit(50);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
      <p className="mb-8 text-sm text-stone-500">
        Practice with {sentenceRows.length} real sentences using this lesson's words.
      </p>
      <SentencePracticeDeck
        sentences={sentenceRows}
        wordDistractorPool={wordDistractorRows.map((w) => w.bg)}
      />
    </div>
  );
}
