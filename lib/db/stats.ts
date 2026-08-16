import { eq } from "drizzle-orm";
import { db } from "./index";
import { reviews, reviewLog } from "./schema";

// A word counts as "mastered" once its interval has grown past three
// weeks -- a chosen heuristic, not a precise measurement, but a
// reasonable stand-in for "you clearly know this one now."
const MASTERED_INTERVAL_DAYS = 21;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Consecutive-day streak, counting backward from today. A streak only
// stays "alive" if the most recent activity was today or yesterday --
// otherwise it's broken, even if the count would technically still be
// positive counting from further back.
function computeStreak(answeredDates: Date[]): number {
  if (answeredDates.length === 0) return 0;

  const uniqueDays = Array.from(new Set(answeredDates.map(toDateKey))).sort().reverse();

  const today = toDateKey(new Date());
  const yesterday = toDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const newer = new Date(uniqueDays[i - 1]);
    const older = new Date(uniqueDays[i]);
    const diffDays = Math.round((newer.getTime() - older.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function getUserStats(userId: number) {
  const userReviews = await db.select().from(reviews).where(eq(reviews.userId, userId));
  const wordsStarted = userReviews.length;
  const wordsMastered = userReviews.filter((r) => r.interval >= MASTERED_INTERVAL_DAYS).length;

  const logs = await db
    .select({ correct: reviewLog.correct, answeredAt: reviewLog.answeredAt })
    .from(reviewLog)
    .where(eq(reviewLog.userId, userId));

  const totalAnswers = logs.length;
  const correctAnswers = logs.filter((l) => l.correct).length;
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const streak = computeStreak(logs.map((l) => l.answeredAt));

  return { wordsStarted, wordsMastered, accuracy, totalAnswers, streak };
}
