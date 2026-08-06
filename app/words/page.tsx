import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";
 async function getWords() {
  const result = await db.select().from(words);
  return result;



}
export default async function WordsPage() {
  const allWords = await getWords();

  return (
    <ul>
      {allWords.map((word) => (
        <li key={word.id}>{word.bg} — {word.en}</li>
      ))}
    </ul>
  );
}
