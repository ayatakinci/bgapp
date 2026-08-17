import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { grammarTopics, grammarDrills } from "@/lib/db/schema";
import { GrammarDrillDeck } from "@/app/components/exercises/GrammarDrillDeck";

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
      {topic.notes && (
        <div className="mb-8 rounded-md border border-stone-200 bg-white px-5 py-4">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
            Lesson notes
          </h2>
          <p className="text-sm leading-relaxed text-stone-600">{topic.notes}</p>
        </div>
      )}
      <GrammarDrillDeck drills={drills} />
    </div>
  );
}
