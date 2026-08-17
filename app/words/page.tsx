import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { words, sentences } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getWords() {
  // Alphabetical, not the DB's arbitrary scan order -- and with each
  // word's sentence count visible up front, so coverage is obvious
  // before clicking in, not a surprise after.
  const result = await db
    .select({
      id: words.id,
      bg: words.bg,
      en: words.en,
      sentenceCount: sql<number>`count(${sentences.id})`,
    })
    .from(words)
    .leftJoin(sentences, eq(sentences.wordId, words.id))
    .groupBy(words.id)
    .orderBy(words.bg);

  return result;
}

export default async function WordsPage() {
  const allWords = await getWords();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">All words</h1>
      <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
        {allWords.map((word) => (
          <li key={word.id}>
            <Link
              href={`/words/${word.id}`}
              className="flex items-baseline justify-between px-4 py-3 hover:bg-stone-50"
            >
              <span className="font-medium">{word.bg}</span>
              <span className="flex items-baseline gap-3">
                <span className="text-sm text-stone-500">{word.en}</span>
                <span
                  className={`text-xs ${
                    word.sentenceCount > 0 ? "text-stone-400" : "text-stone-300"
                  }`}
                >
                  {word.sentenceCount > 0 ? `${word.sentenceCount} examples` : "no examples"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
