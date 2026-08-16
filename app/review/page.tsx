import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";
import { getDueReviews, getNewWords } from "@/lib/db/reviews";
import { getSession } from "@/lib/auth/dal";
import { FlashcardDeck } from "@/app/components/flashcards/FlashcardDeck";

// This page's data changes constantly (due dates, new words) -- never let
// Next.js freeze it into a static build-time snapshot.
export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const userId = session.userId;

  const due = await getDueReviews(userId);
  const newWords = await getNewWords(userId, 10);

  const queue = [
    ...due.map((w) => ({ id: w.wordId, bg: w.bg, en: w.en })),
    ...newWords.map((w) => ({ id: w.id, bg: w.bg, en: w.en })),
  ].slice(0, 20);

  // A random sample of translations from the whole word pool, used as
  // wrong-answer options for the multiple-choice exercise.
  const distractorRows = await db
    .select({ en: words.en })
    .from(words)
    .orderBy(sql`random()`)
    .limit(50);
  const distractorPool = distractorRows.map((w) => w.en);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Review</h1>
      <FlashcardDeck words={queue} userId={userId} distractorPool={distractorPool} />
    </div>
  );
}
