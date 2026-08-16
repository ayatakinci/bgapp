import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const allLessons = await db.select().from(lessons).orderBy(lessons.position);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Lessons</h1>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {allLessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/lessons/${lesson.id}`}
              className="block rounded-md border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:border-stone-400 hover:bg-stone-50"
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
