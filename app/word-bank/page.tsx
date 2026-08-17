import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/dal";
import { getWordBank } from "@/lib/db/word-bank";
import { toggleWordBank } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function WordBankPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const bank = await getWordBank(session.userId);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Word bank</h1>
        {bank.length > 0 && (
          <Link
            href="/word-bank/practice"
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Practice this deck
          </Link>
        )}
      </div>

      {bank.length === 0 ? (
        <p className="text-sm text-stone-400">
          No words saved yet. Open any word from{" "}
          <Link href="/words" className="underline hover:text-stone-600">
            All words
          </Link>{" "}
          and add it here to build your own practice deck.
        </p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
          {bank.map((word) => (
            <li key={word.id} className="flex items-center justify-between px-4 py-3">
              <Link href={`/words/${word.id}`} className="flex items-baseline gap-3 hover:underline">
                <span className="font-medium">{word.bg}</span>
                <span className="text-sm text-stone-500">{word.en}</span>
              </Link>
              <form action={toggleWordBank.bind(null, session.userId, word.id, true, "/word-bank")}>
                <button type="submit" className="text-sm text-stone-400 hover:text-rose-600">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
