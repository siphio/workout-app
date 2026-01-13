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
    <div className="h-full bg-zinc-950 overflow-y-auto">
      <PageHeader title="Progress" />

      <div className="px-6 pb-32 space-y-5">
        <StreakCard streakWeeks={data.streakWeeks} />

        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Personal Records
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
              Goals
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
