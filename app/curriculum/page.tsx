import Link from "next/link";
import { db } from "@/lib/db";
import { grammarTopics, lessons } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;

const LEVEL_INFO: Record<(typeof LEVELS)[number], { name: string; blurb: string }> = {
  A1: {
    name: "Beginner",
    blurb: "The core grammar (to be, present tense, negation, questions) plus the everyday vocabulary you need from day one.",
  },
  A2: {
    name: "Elementary",
    blurb: "Past tenses, comparison, reflexive verbs -- and vocabulary for the physical world around you: nature, home, nationalities.",
  },
  B1: {
    name: "Intermediate",
    blurb: "Verbal aspect and the renarrated mood -- the features that make Bulgarian genuinely different from other languages -- plus more abstract vocabulary.",
  },
  B2: {
    name: "Upper-intermediate",
    blurb: "Passive voice, reported speech, complex connectors -- reading and expressing more nuanced ideas.",
  },
};

export default async function CurriculumPage() {
  const [allGrammar, allLessons] = await Promise.all([
    db.select().from(grammarTopics).orderBy(grammarTopics.position),
    db.select().from(lessons).orderBy(lessons.position),
  ]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Curriculum</h1>
      <p className="mb-8 text-sm text-stone-500">
        One suggested path through everything on this site, grammar and vocabulary together, ordered from
        beginner to upper-intermediate (CEFR A1 → B2). Work through a level's grammar topics alongside its
        lessons before moving to the next level.
      </p>

      <div className="flex flex-col gap-10">
        {LEVELS.map((level) => {
          const grammarForLevel = allGrammar.filter((g) => g.level === level);
          const lessonsForLevel = allLessons.filter((l) => l.level === level);
          const info = LEVEL_INFO[level];

          return (
            <section key={level}>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="rounded-full bg-stone-900 px-3 py-1 text-sm font-semibold text-white">
                  {level}
                </span>
                <h2 className="text-lg font-semibold tracking-tight">{info.name}</h2>
              </div>
              <p className="mb-4 text-sm text-stone-500">{info.blurb}</p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                    Grammar ({grammarForLevel.length})
                  </h3>
                  <ol className="flex flex-col gap-1.5">
                    {grammarForLevel.map((topic, i) => (
                      <li key={topic.id}>
                        <Link
                          href={`/grammar/${topic.id}`}
                          className="flex gap-2 rounded-md px-2 py-1 text-sm text-stone-700 hover:bg-white hover:underline"
                        >
                          <span className="text-stone-400">{i + 1}.</span>
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                    Vocabulary ({lessonsForLevel.length})
                  </h3>
                  <ol className="flex flex-col gap-1.5">
                    {lessonsForLevel.map((lesson, i) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/lessons/${lesson.id}`}
                          className="flex gap-2 rounded-md px-2 py-1 text-sm text-stone-700 hover:bg-white hover:underline"
                        >
                          <span className="text-stone-400">{i + 1}.</span>
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
