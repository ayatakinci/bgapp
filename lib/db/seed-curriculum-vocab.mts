import "dotenv/config";
import { db } from "./index";
import { words } from "./schema";
import { findSpecificWords } from "./ingest.mts";
import { DOMAIN_SINGLE_WORDS, DOMAIN_PHRASES } from "./curriculum-data.mts";

async function main() {
  const existing = await db.select({ bg: words.bg }).from(words);
  const existingSet = new Set(existing.map((w) => w.bg));

  const allSingleWords = new Set(Object.values(DOMAIN_SINGLE_WORDS).flat());
  const toLookup = new Set([...allSingleWords].filter((w) => !existingSet.has(w)));

  console.log(`${allSingleWords.size} single words needed, ${toLookup.size} not already in the database.`);
  console.log("Looking them up in Wiktionary...");

  const found = toLookup.size > 0 ? await findSpecificWords(toLookup) : [];
  const foundWords = new Set(found.map((w) => w.bg));
  const missing = [...toLookup].filter((w) => !foundWords.has(w));

  console.log(`Found ${found.length} of ${toLookup.size}.`);
  if (missing.length > 0) {
    console.log("Not found in Wiktionary:", missing.join(", "));
  }

  const phraseRows = Object.values(DOMAIN_PHRASES)
    .flat()
    .filter((p) => !existingSet.has(p.bg))
    .map((p) => ({ bg: p.bg, en: p.en, partOfSpeech: "phrase" }));

  const rows = [...found, ...phraseRows];
  if (rows.length > 0) {
    await db.insert(words).values(rows);
  }

  console.log(`Inserted ${found.length} looked-up words + ${phraseRows.length} phrases/numbers.`);
}

main().then(() => process.exit(0));
