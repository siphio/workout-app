import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getSummaryData } from "@/features/summary/lib/summary-queries";
import { ComparisonCard, StatsRow, PRList } from "@/features/summary/components";

interface Props {
  searchParams: Promise<{ workoutId?: string }>;
}

export default async function SummaryPage({ searchParams }: Props) {
  const params = await searchParams;

  if (!params.workoutId) {
    redirect("/");
  }

  const summaryData = await getSummaryData(params.workoutId);

  if (!summaryData) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12">
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white text-center mb-8">
        WORKOUT COMPLETE
      </h1>

      <ComparisonCard
        totalVolume={summaryData.totalVolume}
        comparison={summaryData.comparison}
        className="mb-6"
      />

      <StatsRow
        durationMinutes={summaryData.durationMinutes}
        totalSets={summaryData.totalSets}
        totalExercises={summaryData.totalExercises}
        className="mb-6"
      />

      <PRList prs={summaryData.newPRs} className="mb-8" />

      {/* Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-white text-zinc-950 font-semibold py-4 px-6 rounded-xl">
          SHARE
        </button>
        <Link
          href="/"
          className="block w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl text-center"
        >
          DONE
        </Link>
      </div>
    </main>
  );
}
