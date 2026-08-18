import Link from "next/link";
import { db } from "@/lib/db";
import { grammarTopics, lessons } from "@/lib/db/schema";
import { SYLLABUS, DISTINCTIVE_FEATURES } from "@/lib/syllabus";
import { getSession } from "@/lib/auth/dal";
import { getSyllabusProgress } from "@/lib/db/syllabus-progress";
import { SyllabusChecklist } from "@/app/components/SyllabusChecklist";

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const session = await getSession();

  const [allGrammar, allLessons, checkedItems] = await Promise.all([
    db.select({ id: grammarTopics.id, title: grammarTopics.title }).from(grammarTopics),
    db.select({ id: lessons.id, title: lessons.title, level: lessons.level, position: lessons.position }).from(lessons).orderBy(lessons.position),
    session ? getSyllabusProgress(session.userId) : Promise.resolve(new Set<string>()),
  ]);
  const grammarIdByTitle = new Map(allGrammar.map((g) => [g.title, g.id]));

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Bulgarian Syllabus: A1 → B2</h1>
      <p className="mb-8 text-sm text-stone-500">
        The complete map from zero to confident, independent Bulgarian. Work through it level by level --
        every grammar point links to a practice topic where one exists on this site; vocabulary categories
        link to lessons. Check items off as you study them to track your progress.
      </p>

      <div className="flex flex-col gap-14">
        {SYLLABUS.map((lvl) => {
          const lessonsForLevel = allLessons.filter((l) => l.level === lvl.level);
          const items = lvl.grammar.map((item) => ({
            id: item.id,
            text: item.text,
            links: (item.topics ?? [])
              .map((t) => ({ title: t, id: grammarIdByTitle.get(t) }))
              .filter((t): t is { title: string; id: number } => t.id !== undefined),
          }));
          const initialChecked = items.map((i) => i.id).filter((id) => checkedItems.has(id));

          return (
            <section key={lvl.level}>
              <div className="mb-1 flex items-baseline gap-3">
                <span className="text-2xl">{lvl.emoji}</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-sm font-semibold text-white">
                  {lvl.level}
                </span>
                <h2 className="text-lg font-semibold tracking-tight">{lvl.name}</h2>
              </div>

              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                    Grammar
                  </h3>
                  <SyllabusChecklist items={items} initialChecked={initialChecked} loggedIn={Boolean(session)} />
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                      Can-do
                    </h3>
                    <ul className="flex flex-col gap-1 text-sm text-stone-700">
                      {lvl.canDo.map((c) => (
                        <li key={c} className="flex gap-2">
                          <span className="text-stone-300">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                      Vocabulary ({lvl.vocabularyCount})
                    </h3>
                    <p className="text-sm text-stone-500">{lvl.vocabulary}</p>
                    {lessonsForLevel.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {lessonsForLevel.map((l) => (
                          <Link
                            key={l.id}
                            href={`/lessons/${l.id}`}
                            className="rounded-full border border-stone-300 px-2 py-0.5 text-xs font-medium text-stone-600 hover:border-stone-500 hover:text-stone-900"
                          >
                            {l.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-6 rounded-md border border-stone-200 bg-white px-4 py-3 text-sm">
                🎯 <span className="font-medium">Milestone:</span> {lvl.milestone}
              </p>
            </section>
          );
        })}
      </div>

      <section className="mt-14 rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          ⭐ The distinctively Bulgarian features
        </h2>
        <p className="mb-4 text-sm text-stone-500">
          Bulgarian is Slavic but unusual. A few things that will stand out.
        </p>
        <dl className="grid gap-4 sm:grid-cols-2">
          {DISTINCTIVE_FEATURES.map((f) => (
            <div key={f.title}>
              <dt className="text-sm font-medium text-stone-800">{f.title}</dt>
              <dd className="mt-0.5 text-sm text-stone-500">{f.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
