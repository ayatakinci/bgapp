import "dotenv/config";
import { readFileSync } from "node:fs";
import { db } from "./index";
import { words, sentences } from "./schema";

const SENTENCES_FILE =
  "C:/Users/BCA/AppData/Local/Temp/claude/c--Users-BCA-OneDrive-Desktop-projects-langauagelearningapp/7bfb159f-5812-4d9e-81ee-ce27a4e2b427/scratchpad/bul.txt";
// Raised from 4 -- common words feed both the word-detail page (needs 5)
// and lesson-level sentence practice (needs up to ~100 per lesson, pooled
// across a lesson's words). Rare words still won't reach this cap; it's a
// ceiling, not a guarantee.
const MAX_SENTENCES_PER_WORD = 25;
// How much longer an inflected form can be than the stored word and still
// count as a match, e.g. "куче" -> "кучето" (+2, definite article) or
// "маса" -> "масите" (+2, definite plural). This mainly helps nouns, since
// their citation form is usually a genuine prefix of the inflected form --
// it does much less for verb conjugation, where endings often replace part
// of the stem rather than simply extending it.
//
// Kept at 2, not 3: at 3, "вино" (wine) matched "виновен" (guilty) --
// two entirely unrelated words that happen to share a 4-letter prefix.
// Real risk with this heuristic, not fully eliminated at 2 either, just
// reduced -- short base words are still the most exposed case.
const MAX_SUFFIX_LENGTH = 2;
const MIN_WORD_LENGTH_FOR_PREFIX_MATCH = 3;

// Splits on anything that isn't a Cyrillic letter, so punctuation and
// spaces all become token boundaries.
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{Script=Cyrillic}]+/gu)
    .filter(Boolean);
}

async function main() {
  console.log("Clearing existing sentences...");
  await db.delete(sentences);

  const raw = readFileSync(SENTENCES_FILE, "utf8");
  const lines = raw.split("\n").filter((l) => l.trim());
  console.log(`Loaded ${lines.length} Tatoeba sentence pairs.`);

  const allWords = await db.select({ id: words.id, bg: words.bg }).from(words);
  const exactMap = new Map(allWords.map((w) => [w.bg, w]));

  // Index words by their first 3 characters, so a token only needs to be
  // compared against words that could plausibly match, not the whole list.
  const prefixIndex = new Map<string, typeof allWords>();
  for (const w of allWords) {
    if (w.bg.length < MIN_WORD_LENGTH_FOR_PREFIX_MATCH) continue;
    const key = w.bg.slice(0, 3);
    const list = prefixIndex.get(key) ?? [];
    list.push(w);
    prefixIndex.set(key, list);
  }

  function findMatch(token: string) {
    const exact = exactMap.get(token);
    if (exact) return exact;

    const candidates = prefixIndex.get(token.slice(0, 3)) ?? [];
    for (const w of candidates) {
      if (token.startsWith(w.bg) && token.length - w.bg.length <= MAX_SUFFIX_LENGTH) {
        return w;
      }
    }
    return undefined;
  }

  // Collect every candidate sentence per word first, so we can sort by
  // length and keep the shortest (likely simplest) ones, rather than
  // whichever sentences happened to appear first in the file.
  const candidatesByWord = new Map<number, { bg: string; en: string; matchedWord: string }[]>();
  const seenPairs = new Set<string>();

  for (const line of lines) {
    const [en, bg] = line.split("\t");
    if (!en || !bg) continue;

    const tokens = new Set(tokenize(bg));

    for (const token of tokens) {
      const match = findMatch(token);
      if (!match) continue;

      const key = `${match.id}::${bg}`;
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);

      const list = candidatesByWord.get(match.id) ?? [];
      list.push({ bg, en, matchedWord: token });
      candidatesByWord.set(match.id, list);
    }
  }

  const toInsert: { bg: string; en: string; matchedWord: string; wordId: number }[] = [];
  for (const [wordId, candidates] of candidatesByWord) {
    candidates.sort((a, b) => a.bg.length - b.bg.length);
    for (const c of candidates.slice(0, MAX_SENTENCES_PER_WORD)) {
      toInsert.push({ ...c, wordId });
    }
  }

  console.log(`Matched sentences for ${candidatesByWord.size} of ${allWords.length} words.`);
  console.log(`Inserting ${toInsert.length} sentences...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    await db.insert(sentences).values(toInsert.slice(i, i + BATCH_SIZE));
  }

  console.log("Done.");
}

main().then(() => process.exit(0));
