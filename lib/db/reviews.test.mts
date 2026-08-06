import "dotenv/config";
import { db } from "./index";
import { users } from "./schema";
import { getNewWords, getDueReviews, recordAnswer } from "./reviews";

async function main() {
  const [user] = await db
    .insert(users)
    .values({ email: "test@example.com" })
    .onConflictDoNothing()
    .returning();

  const testUser = user ?? (await db.select().from(users))[0];
  console.log(`Using test user id=${testUser.id}`);

  const newWords = await getNewWords(testUser.id, 3);
  console.log(
    "\nNew words (never reviewed before):",
    newWords.map((w) => `${w.bg} (${w.en})`)
  );

  console.log("\nRecording answers: first word correct, second word wrong...");
  await recordAnswer(testUser.id, newWords[0].id, true);
  await recordAnswer(testUser.id, newWords[1].id, false);

  const stillNew = await getNewWords(testUser.id, 10);
  console.log(
    `\nWords still marked "new": ${stillNew.length} (should be 2 fewer than before)`
  );

  const due = await getDueReviews(testUser.id);
  console.log(
    `Words due right now: ${due.length} (should be 0 -- both were just scheduled for the future)`
  );
}

main().then(() => process.exit(0));
