import { getProgressData } from "@/features/progress/lib/progress-queries";
import { StreakCard, PRCard, VolumeChart, GoalCard, ProgressSwipeWrapper } from "@/features/progress/components";
import { PageHeader } from "@/shared/components/page-header";
import { BottomNav } from "@/shared/components/bottom-nav";

type TimeRange = "1M" | "3M" | "1Y";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function ProgressPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const timeRange = (["1M", "3M", "1Y"].includes(params.range ?? "")
    ? params.range
    : "3M") as TimeRange;

  const progressData = await getProgressData(timeRange);

  return (
    <ProgressSwipeWrapper>
      <main className="min-h-screen bg-zinc-950 pb-24">
        <PageHeader title="PROGRESS" showSettings leftAligned />

        <div className="px-6 space-y-5">
          <StreakCard streakWeeks={progressData.streakWeeks} />

          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              PERSONAL RECORDS
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <PRCard pr={progressData.personalRecords.bench} label="Bench" />
              <PRCard pr={progressData.personalRecords.squat} label="Squat" />
              <PRCard pr={progressData.personalRecords.deadlift} label="Deadlift" />
            </div>
          </div>

          <VolumeChart data={progressData.volumeHistory} activeRange={timeRange} />

          {progressData.goals.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                GOALS
              </h2>
              <div className="space-y-3">
                {progressData.goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </main>
    </ProgressSwipeWrapper>
  );
}
