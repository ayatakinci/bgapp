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

// Bulgarian Wiktionary marks stress with a combining acute accent (U+0301)
// on the stressed vowel, e.g. "у́каз". The frequency list has plain surface
// forms with no stress marks, so we strip combining diacritics to compare
// them on equal footing.
function stripStress(word: string): string {
  return word.normalize("NFC").replace(/[\u0300-\u036f]/g, "");
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
  senses?: { glosses?: string[] }[];
};

async function main() {
  console.log("Loading frequency list...");
  const candidates = await loadCandidateWords();
  const remaining = new Set(candidates);

  console.log(`Looking for ${TARGET_COUNT} matches among ${remaining.size} candidate words...`);

  const found = new Map<string, { bg: string; en: string; partOfSpeech: string }>();

  const res = await fetch(WIKTIONARY_URL);
  if (!res.body) throw new Error("No response body from Wiktionary source");

  const nodeStream = Readable.fromWeb(res.body as any);
  const rl = readline.createInterface({ input: nodeStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (found.size >= TARGET_COUNT) break;
    if (!line.trim()) continue;

    let entry: WiktionaryEntry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (entry.lang !== "Bulgarian" || !entry.word) continue;

    const plain = stripStress(entry.word);
    if (found.has(plain) || !remaining.has(plain)) continue;

    const gloss = entry.senses?.[0]?.glosses?.[0];
    if (!gloss) continue;

    found.set(plain, {
      bg: plain,
      en: gloss,
      partOfSpeech: entry.pos ?? "unknown",
    });
  }

  rl.close();
  nodeStream.destroy();

  console.log(`Matched ${found.size} words. Inserting into the database...`);

  const rows = Array.from(found.values());
  if (rows.length > 0) {
    await db.insert(words).values(rows);
  }

  console.log(`Done. Inserted ${rows.length} words.`);
}

main().then(() => process.exit(0));
