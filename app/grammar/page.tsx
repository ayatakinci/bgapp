import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { grammarTopics } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default async function GrammarPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level: rawLevel } = await searchParams;
  const level = LEVELS.includes(rawLevel as (typeof LEVELS)[number]) ? rawLevel! : "A1";

  const topics = await db
    .select()
    .from(grammarTopics)
    .where(eq(grammarTopics.level, level))
    .orderBy(grammarTopics.position);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Grammar</h1>

      <div className="mb-6 flex gap-2">
        {LEVELS.map((l) => (
          <Link
            key={l}
            href={`/grammar?level=${l}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              l === level
                ? "bg-stone-900 text-white"
                : "border border-stone-300 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {l}
          </Link>
        ))}
      </div>

      {topics.length === 0 ? (
        <p className="text-sm text-stone-500">No topics for this level yet.</p>
      ) : (
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
      )}
    </div>
  );
}
