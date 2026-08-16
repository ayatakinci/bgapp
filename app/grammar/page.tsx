import Link from "next/link";
import { db } from "@/lib/db";
import { grammarTopics } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function GrammarPage() {
  const topics = await db.select().from(grammarTopics).orderBy(grammarTopics.position);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Grammar</h1>
      <ul className="flex flex-col gap-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link
              href={`/grammar/${topic.id}`}
              className="block rounded-md border border-stone-200 bg-white px-4 py-3 hover:border-stone-400 hover:bg-stone-50"
            >
              <span className="font-medium text-stone-800">{topic.title}</span>
              {topic.description && (
                <span className="ml-2 text-sm text-stone-500">{topic.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
