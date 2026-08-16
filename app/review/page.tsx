import { redirect } from "next/navigation";
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

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Review</h1>
      <FlashcardDeck words={queue} userId={userId} />
    </div>
  );
}
