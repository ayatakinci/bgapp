import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { words } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/dal";
import { getWordBank } from "@/lib/db/word-bank";
import { FlashcardDeck } from "@/app/components/flashcards/FlashcardDeck";

export const dynamic = "force-dynamic";

export default async function WordBankPracticePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const bank = await getWordBank(session.userId);

  const distractorRows = await db
    .select({ en: words.en })
    .from(words)
    .orderBy(sql`random()`)
    .limit(50);
  const distractorPool = distractorRows.map((w) => w.en);

  return (
    <div>
      <Link href="/word-bank" className="mb-4 inline-block text-sm text-stone-500 hover:text-stone-800">
        ← Word bank
      </Link>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Word bank practice</h1>
      {bank.length === 0 ? (
        <p className="text-stone-500">Your word bank is empty.</p>
      ) : (
        <FlashcardDeck
          words={bank.map((w) => ({ id: w.id, bg: w.bg, en: w.en }))}
          userId={session.userId}
          distractorPool={distractorPool}
        />
      )}
    </div>
  );
}
