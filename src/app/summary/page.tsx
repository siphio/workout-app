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
    <main className="min-h-screen bg-zinc-950 px-6 pt-14 pb-12">
      {/* Centered container - all content constrained to same width */}
      <div className="max-w-[340px] mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-7 h-7 text-zinc-950" strokeWidth={3} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center tracking-wide mb-6">
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
          className="mb-5"
        />

        <PRList prs={summaryData.newPRs} className="mb-6" />

        {/* Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-white text-zinc-950 font-semibold py-3 rounded-2xl border-2 border-zinc-300">
            SHARE
          </button>
          <Link
            href="/"
            className="block w-full bg-zinc-950 border-2 border-zinc-600 text-white font-semibold py-3 rounded-2xl text-center"
          >
            DONE
          </Link>
        </div>
      </div>
    </main>
  );
}
