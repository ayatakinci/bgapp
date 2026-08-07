import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import Link from "next/link";

export default async function LessonsPage() {
  const allLessons = await db.select().from(lessons).orderBy(lessons.position);

  return (
    <ul>
      {allLessons.map((lesson) => (
        <li key={lesson.id}>
          <Link href={`/lessons/${lesson.id}`}>{lesson.title}</Link>
        </li>
      ))}
    </ul>
  );
}
