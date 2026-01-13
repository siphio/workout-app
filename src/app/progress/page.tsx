import { getProgressData } from "@/features/progress/lib/progress-queries";
import { StreakCard, PRCard, VolumeChart, GoalCard } from "@/features/progress/components";
import { PageHeader } from "@/shared/components/page-header";
import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

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
    <main className="h-[100dvh] bg-zinc-950 overflow-y-auto">
      <PageHeader title="Progress" />

      <div className="px-6 pb-24 space-y-5">
        <StreakCard streakWeeks={progressData.streakWeeks} />

        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Personal Records
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
              Goals
            </h2>
            <div className="space-y-3">
              {progressData.goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomTabBar />
    </main>
  );
}
