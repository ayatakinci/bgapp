"use server";

import { recordAnswer } from "./db/reviews";

export async function submitAnswer(userId: number, wordId: number, correct: boolean) {
  await recordAnswer(userId, wordId, correct);
}
