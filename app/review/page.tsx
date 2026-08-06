import { getDueReviews, getNewWords } from "@/lib/db/reviews";
import { FlashcardDeck } from "@/app/components/flashcards/FlashcardDeck";

// Placeholder until real auth exists (Phase 4) -- this is the same test
// user created by lib/db/reviews.test.mts.
const TEST_USER_ID = 1;

export default async function ReviewPage() {
  const due = await getDueReviews(TEST_USER_ID);
  const newWords = await getNewWords(TEST_USER_ID, 10);

  const queue = [
    ...due.map((w) => ({ id: w.wordId, bg: w.bg, en: w.en })),
    ...newWords.map((w) => ({ id: w.id, bg: w.bg, en: w.en })),
  ].slice(0, 20);

  return <FlashcardDeck words={queue} userId={TEST_USER_ID} />;
}
