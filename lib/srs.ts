export type ReviewState = {
  interval: number;
  easeFactor: number;
  repetitions: number;
};

export type ReviewResult = ReviewState & {
  nextReviewAt: Date;
};

// Simplified SM-2 (the algorithm behind Anki). "correct" collapses the
// original 0-5 quality scale down to two cases: 5 (easily correct) and 2
// (incorrect), which is enough for a binary right/wrong flashcard flow.
export function nextReviewState(state: ReviewState, correct: boolean): ReviewResult {
  let { interval, easeFactor, repetitions } = state;

  if (!correct) {
    // A miss resets the schedule entirely: start over tomorrow, regardless
    // of how well-known the word seemed before.
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      // Every subsequent correct answer multiplies the interval by the
      // word's ease factor, so well-known words get reviewed less and
      // less often over time.
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // The SM-2 ease adjustment formula. A correct answer nudges ease up
  // slightly; a miss nudges it down more sharply. 1.3 is SM-2's standard
  // floor, preventing a struggling word's interval from shrinking forever.
  const quality = correct ? 5 : 2;
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReviewAt };
}
