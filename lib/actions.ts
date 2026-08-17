"use server";

import { revalidatePath } from "next/cache";
import { recordAnswer } from "./db/reviews";
import { addToWordBank, removeFromWordBank } from "./db/word-bank";

export async function submitAnswer(userId: number, wordId: number, correct: boolean) {
  await recordAnswer(userId, wordId, correct);
}

export async function toggleWordBank(userId: number, wordId: number, inBank: boolean, path: string) {
  if (inBank) {
    await removeFromWordBank(userId, wordId);
  } else {
    await addToWordBank(userId, wordId);
  }
  revalidatePath(path);
}
