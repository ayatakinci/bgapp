import Link from "next/link";
import { eq, asc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { words, sentences } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wordId = Number(id);

  const [word] = await db.select().from(words).where(eq(words.id, wordId));

  if (!word) {
    return <p className="text-stone-500">Word not found.</p>;
  }

  // Shortest sentences first -- same "prefer simple" preference used when
  // the sentences were originally selected during import.
  const examples = await db
    .select()
    .from(sentences)
    .where(eq(sentences.wordId, wordId))
    .orderBy(asc(sql`length(${sentences.bg})`))
    .limit(5);

  return (
    <div>
      <Link href="/words" className="mb-4 inline-block text-sm text-stone-500 hover:text-stone-800">
        ← All words
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight">{word.bg}</h1>
      <p className="mt-1 text-lg text-stone-600">{word.en}</p>
      {word.partOfSpeech && (
        <p className="mt-1 text-sm text-stone-400">{word.partOfSpeech}</p>
      )}

      <h2 className="mt-8 mb-3 text-sm font-medium uppercase tracking-wide text-stone-500">
        Example sentences
      </h2>
      {examples.length === 0 ? (
        <p className="text-sm text-stone-400">No example sentences yet for this word.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {examples.map((ex) => (
            <li key={ex.id} className="rounded-md border border-stone-200 bg-white px-4 py-3">
              <p className="font-medium">{ex.bg}</p>
              <p className="mt-1 text-sm text-stone-500">{ex.en}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
