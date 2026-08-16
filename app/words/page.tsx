import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

async function getWords() {
  const result = await db.select().from(words);
  return result;



}
export default async function WordsPage() {
  const allWords = await getWords();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">All words</h1>
      <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
        {allWords.map((word) => (
          <li key={word.id} className="flex items-baseline justify-between px-4 py-3">
            <span className="font-medium">{word.bg}</span>
            <span className="text-sm text-stone-500">{word.en}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
