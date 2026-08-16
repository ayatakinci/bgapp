import "dotenv/config";
import { readFileSync } from "node:fs";
import { db } from "./index";
import { words, sentences } from "./schema";

const SENTENCES_FILE =
  "C:/Users/BCA/AppData/Local/Temp/claude/c--Users-BCA-OneDrive-Desktop-projects-langauagelearningapp/7bfb159f-5812-4d9e-81ee-ce27a4e2b427/scratchpad/bul.txt";
const MAX_SENTENCES_PER_WORD = 2;

// Splits on anything that isn't a Cyrillic letter, so punctuation and
// spaces all become token boundaries.
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{Script=Cyrillic}]+/gu)
    .filter(Boolean);
}

async function main() {
  const raw = readFileSync(SENTENCES_FILE, "utf8");
  const lines = raw.split("\n").filter((l) => l.trim());
  console.log(`Loaded ${lines.length} Tatoeba sentence pairs.`);

  const allWords = await db.select({ id: words.id, bg: words.bg }).from(words);
  const wordIdByBg = new Map(allWords.map((w) => [w.bg, w.id]));

  const countPerWord = new Map<string, number>();
  const toInsert: { bg: string; en: string; wordId: number }[] = [];

  for (const line of lines) {
    const [en, bg] = line.split("\t");
    if (!en || !bg) continue;

    const tokens = new Set(tokenize(bg));

    for (const token of tokens) {
      const wordId = wordIdByBg.get(token);
      if (!wordId) continue;

      const count = countPerWord.get(token) ?? 0;
      if (count >= MAX_SENTENCES_PER_WORD) continue;

      countPerWord.set(token, count + 1);
      toInsert.push({ bg, en, wordId });
    }
  }

  console.log(`Matched sentences for ${countPerWord.size} of ${allWords.length} words.`);
  console.log(`Inserting ${toInsert.length} sentences...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    await db.insert(sentences).values(toInsert.slice(i, i + BATCH_SIZE));
  }

  console.log("Done.");
}

main().then(() => process.exit(0));
