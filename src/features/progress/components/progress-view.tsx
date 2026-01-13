"use client";

import { StreakCard } from "./streak-card";
import { PRCard } from "./pr-card";
import { VolumeChart } from "./volume-chart";
import { GoalCard } from "./goal-card";
import { PageHeader } from "@/shared/components/page-header";
import type { ProgressData } from "@/shared/types";

interface Props {
  data: ProgressData;
  timeRange: "1M" | "3M" | "1Y";
}

export function ProgressView({ data, timeRange }: Props) {
  return (
    <div className="min-h-full bg-zinc-950 pb-24">
      <PageHeader title="PROGRESS" showSettings leftAligned />

      <div className="px-6 space-y-5">
        <StreakCard streakWeeks={data.streakWeeks} />

        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            PERSONAL RECORDS
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <PRCard pr={data.personalRecords.bench} label="Bench" />
            <PRCard pr={data.personalRecords.squat} label="Squat" />
            <PRCard pr={data.personalRecords.deadlift} label="Deadlift" />
          </div>
        </div>

        <VolumeChart data={data.volumeHistory} activeRange={timeRange} />

        {data.goals.length > 0 && (
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              GOALS
            </h2>
            <div className="space-y-3">
              {data.goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
