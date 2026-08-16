import "dotenv/config";
import { Readable } from "node:stream";
import readline from "node:readline";
import { db } from "./index";
import { words } from "./schema";

const TARGET_COUNT = 500;
const FREQUENCY_LIST_URL =
  "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/bg/bg_50k.txt";
const WIKTIONARY_URL =
  "https://kaikki.org/dictionary/Bulgarian/kaikki.org-dictionary-Bulgarian.jsonl";

// Wiktionary usage labels that mark a sense as a poor fit for a beginner
// word list -- either inappropriate (vulgar/slang/offensive/derogatory) or
// unlikely to be genuinely useful (obsolete/archaic/rare).
const SKIP_SENSE_TAGS = new Set([
  "vulgar",
  "slang",
  "offensive",
  "derogatory",
  "obsolete",
  "archaic",
  "rare",
]);

// Bulgarian Wiktionary marks stress with a combining acute accent (U+0301)
// on the stressed vowel, e.g. "у́каз". The frequency list has plain surface
// forms with no stress marks, so we strip combining diacritics to compare
// them on equal footing.
function stripStress(word: string): string {
  return word.normalize("NFC").replace(/[̀-ͯ]/g, "");
}

async function loadCandidateWords(): Promise<string[]> {
  const res = await fetch(FREQUENCY_LIST_URL);
  const text = await res.text();
  return text
    .split("\n")
    .map((line) => line.split(" ")[0]?.trim())
    .filter((word): word is string => Boolean(word));
}

type WiktionaryEntry = {
  word: string;
  pos?: string;
  lang?: string;
  senses?: { glosses?: string[]; tags?: string[] }[];
};

// Walks a word's senses in order and returns the first gloss that isn't
// tagged as inappropriate/obsolete/etc, instead of blindly trusting
// whichever sense happens to be listed first.
function pickBestGloss(entry: WiktionaryEntry): string | undefined {
  for (const sense of entry.senses ?? []) {
    const tags = sense.tags ?? [];
    const isSkippable = tags.some((tag) => SKIP_SENSE_TAGS.has(tag));
    if (isSkippable) continue;

    const gloss = sense.glosses?.[0];
    if (gloss) return gloss;
  }
  return undefined;
}

export type ImportedWord = { bg: string; en: string; partOfSpeech: string };

// Streams the Wiktionary extract looking for matches against a candidate
// word list, stopping once `targetCount` matches are found. `excludeWords`
// lets a caller top up an existing set without re-matching words it
// already has.
export async function findWords(
  targetCount: number,
  excludeWords: Set<string> = new Set()
): Promise<ImportedWord[]> {
  const candidates = await loadCandidateWords();
  const remaining = new Set(candidates.filter((w) => !excludeWords.has(w)));

  const found = new Map<string, ImportedWord>();

  const res = await fetch(WIKTIONARY_URL);
  if (!res.body) throw new Error("No response body from Wiktionary source");

  const nodeStream = Readable.fromWeb(res.body as any);
  const rl = readline.createInterface({ input: nodeStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (found.size >= targetCount) break;
    if (!line.trim()) continue;

    let entry: WiktionaryEntry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (entry.lang !== "Bulgarian" || !entry.word) continue;
    if (entry.pos === "character") continue; // alphabet-letter entries, not vocabulary

    const plain = stripStress(entry.word);
    if (found.has(plain) || excludeWords.has(plain) || !remaining.has(plain)) continue;

    const gloss = pickBestGloss(entry);
    if (!gloss) continue;

    found.set(plain, {
      bg: plain,
      en: gloss,
      partOfSpeech: entry.pos ?? "unknown",
    });
  }

  rl.close();
  nodeStream.destroy();

  return Array.from(found.values());
}

// Like findWords, but driven by an explicit target list instead of the
// frequency list -- for pulling specific named words (e.g. the roadmap's
// domain vocabulary) rather than "whatever's most common." Scans the
// whole file rather than stopping early, since the targets are scattered
// throughout it, not concentrated near the start.
export async function findSpecificWords(targetWords: Set<string>): Promise<ImportedWord[]> {
  const found = new Map<string, ImportedWord>();

  const res = await fetch(WIKTIONARY_URL);
  if (!res.body) throw new Error("No response body from Wiktionary source");

  const nodeStream = Readable.fromWeb(res.body as any);
  const rl = readline.createInterface({ input: nodeStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (found.size >= targetWords.size) break;
    if (!line.trim()) continue;

    let entry: WiktionaryEntry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (entry.lang !== "Bulgarian" || !entry.word) continue;
    if (entry.pos === "character") continue;

    const plain = stripStress(entry.word);
    if (found.has(plain) || !targetWords.has(plain)) continue;

    const gloss = pickBestGloss(entry);
    if (!gloss) continue;

    found.set(plain, { bg: plain, en: gloss, partOfSpeech: entry.pos ?? "unknown" });
  }

  rl.close();
  nodeStream.destroy();

  return Array.from(found.values());
}

async function main() {
  console.log(`Looking for ${TARGET_COUNT} words...`);
  const rows = await findWords(TARGET_COUNT);

  console.log(`Matched ${rows.length} words. Inserting into the database...`);
  if (rows.length > 0) {
    await db.insert(words).values(rows);
  }
  console.log(`Done. Inserted ${rows.length} words.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0));
}
