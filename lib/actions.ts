"use server";

import { revalidatePath } from "next/cache";
import { recordAnswer } from "./db/reviews";
import { addToWordBank, removeFromWordBank } from "./db/word-bank";
import { setSyllabusItemChecked } from "./db/syllabus-progress";
import { getSession } from "./auth/dal";

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

// Session-derived userId, not a client-supplied one -- this is called
// straight from a Client Component's onClick (not a <form> action), so
// unlike the actions above there's no natural place upstream that already
// checked who's asking.
export async function toggleSyllabusItem(itemId: string, checked: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Not logged in");
  await setSyllabusItemChecked(session.userId, itemId, checked);
}
