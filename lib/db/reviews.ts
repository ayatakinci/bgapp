import { eq, and, lte, notExists } from "drizzle-orm";
import { db } from "./index";
import { reviews, words, reviewLog } from "./schema";
import { nextReviewState } from "../srs";

// Words this user has never reviewed before -- the pool "new word" lessons
// pull from, as opposed to the spaced-repetition queue below.
export async function getNewWords(userId: number, limit: number) {
  return db
    .select()
    .from(words)
    .where(
      notExists(
        db
          .select()
          .from(reviews)
          .where(and(eq(reviews.userId, userId), eq(reviews.wordId, words.id)))
      )
    )
    .limit(limit);
}

// Words this user has already started, whose scheduled review date has
// arrived (or passed). This is the Piece 5 join query, made real.
export async function getDueReviews(userId: number) {
  return db
    .select({
      wordId: words.id,
      bg: words.bg,
      en: words.en,
      nextReviewAt: reviews.nextReviewAt,
    })
    .from(reviews)
    .innerJoin(words, eq(reviews.wordId, words.id))
    .where(and(eq(reviews.userId, userId), lte(reviews.nextReviewAt, new Date())))
    .orderBy(reviews.nextReviewAt);
}

// Records the outcome of reviewing one word, running the SM-2 algorithm on
// its current state (or default starting state, if this is the word's
// first-ever review) and upserting the result.
export async function recordAnswer(userId: number, wordId: number, correct: boolean) {
  const [existing] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.wordId, wordId)));

  const currentState = existing
    ? {
        interval: existing.interval,
        easeFactor: existing.easeFactor,
        repetitions: existing.repetitions,
      }
    : { interval: 0, easeFactor: 2.5, repetitions: 0 };

  const result = nextReviewState(currentState, correct);

  await db
    .insert(reviews)
    .values({
      userId,
      wordId,
      interval: result.interval,
      easeFactor: result.easeFactor,
      repetitions: result.repetitions,
      nextReviewAt: result.nextReviewAt,
      lastReviewedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.wordId],
      set: {
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        nextReviewAt: result.nextReviewAt,
        lastReviewedAt: new Date(),
      },
    });

  // reviews holds current state (overwritten above); this is the
  // permanent record of the event itself, for stats/streaks later.
  await db.insert(reviewLog).values({ userId, wordId, correct });

  return result;
}
