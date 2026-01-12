import { getProgressData } from "@/features/progress/lib/progress-queries";
import { StreakCard, PRCard, VolumeChart, GoalCard } from "@/features/progress/components";
import { PageHeader } from "@/shared/components/page-header";
import { BottomNav } from "@/shared/components/bottom-nav";

export default async function ProgressPage() {
  const progressData = await getProgressData();

  return (
    <main className="min-h-screen bg-zinc-950 pb-24">
      <PageHeader title="PROGRESS" showSettings />

      <div className="px-6 space-y-6">
        <StreakCard streakWeeks={progressData.streakWeeks} />

        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            PERSONAL RECORDS
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <PRCard pr={progressData.personalRecords.bench} label="Bench" />
            <PRCard pr={progressData.personalRecords.squat} label="Squat" />
            <PRCard pr={progressData.personalRecords.deadlift} label="Deadlift" />
          </div>
        </div>

        <VolumeChart data={progressData.volumeHistory} />

        {progressData.goals.length > 0 && (
          <div>
            <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
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
  );
}
