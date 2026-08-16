import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Здравей 👋</h1>
      <p className="max-w-prose text-stone-600">
        A small Bulgarian vocabulary trainer, built lesson by lesson.
      </p>
      <div className="flex gap-4">
        <Link
          href="/review"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Start reviewing
        </Link>
        <Link
          href="/lessons"
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
        >
          Browse lessons
        </Link>
      </div>
    </div>
  );
}
