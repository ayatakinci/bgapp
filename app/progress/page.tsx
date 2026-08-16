import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/dal";
import { getUserStats } from "@/lib/db/stats";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  );
}

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const stats = await getUserStats(session.userId);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Progress</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Day streak" value={stats.streak} />
        <StatCard label="Words started" value={stats.wordsStarted} />
        <StatCard label="Words mastered" value={stats.wordsMastered} />
        <StatCard
          label="Accuracy"
          value={stats.totalAnswers > 0 ? `${stats.accuracy}%` : "—"}
        />
      </div>
      {stats.totalAnswers === 0 && (
        <p className="mt-6 text-sm text-stone-500">
          No reviews yet — head to the review page to get started.
        </p>
      )}
    </div>
  );
}
