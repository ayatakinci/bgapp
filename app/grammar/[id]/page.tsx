import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { grammarTopics, grammarDrills } from "@/lib/db/schema";
import { GrammarDrillDeck } from "@/app/components/exercises/GrammarDrillDeck";
import { SpeakButton } from "@/app/components/SpeakButton";
import { CYRILLIC_ALPHABET } from "@/lib/cyrillic-alphabet";

export const dynamic = "force-dynamic";

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topicId = Number(id);

  const [topic] = await db.select().from(grammarTopics).where(eq(grammarTopics.id, topicId));

  if (!topic) {
    return <p className="text-stone-500">Topic not found.</p>;
  }

  const drills = await db
    .select()
    .from(grammarDrills)
    .where(eq(grammarDrills.topicId, topicId));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">{topic.title}</h1>
      {topic.description && <p className="mb-4 text-sm text-stone-500">{topic.description}</p>}

      {(topic.notes || topic.example || topic.pitfall) && (
        <div className="mb-8 flex flex-col gap-4">
          {topic.notes && (
            <div className="rounded-md border border-stone-200 bg-white px-5 py-4">
              <h2 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-400">
                Pattern
              </h2>
              <p className="text-sm leading-relaxed text-stone-700">{topic.notes}</p>
            </div>
          )}

          {topic.example && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-5 py-4">
              <h2 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700">
                Example
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-stone-800">{topic.example}</p>
                <SpeakButton text={topic.example} />
              </div>
              {topic.exampleTranslation && (
                <p className="mt-1 text-sm text-stone-500">{topic.exampleTranslation}</p>
              )}
            </div>
          )}

          {topic.pitfall && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-5 py-4">
              <h2 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-amber-700">
                Watch out for
              </h2>
              <p className="text-sm leading-relaxed text-stone-700">{topic.pitfall}</p>
            </div>
          )}
        </div>
      )}

      {topic.title === "Cyrillic alphabet" && (
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-stone-400">
            The alphabet
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {CYRILLIC_ALPHABET.map((letter) => (
              <div
                key={letter.upper}
                className="flex flex-col items-center gap-1 rounded-md border border-stone-200 bg-white py-3"
              >
                <span className="text-2xl font-semibold tracking-tight">
                  {letter.upper}
                  <span className="text-stone-400">{letter.lower}</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-stone-400">{letter.name}</span>
                  <SpeakButton text={letter.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <GrammarDrillDeck drills={drills} />
    </div>
  );
}
