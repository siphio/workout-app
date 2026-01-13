import type { GoalWithProgress } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  goal: GoalWithProgress;
  weightUnit?: string;
  className?: string;
}

export function GoalCard({ goal, weightUnit = "kg", className }: Props) {
  const targetDate = goal.targetDate
    ? new Date(goal.targetDate).toLocaleDateString("en-US", {
        month: "long",
      })
    : null;

  const goalText = targetDate
    ? `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit} by ${targetDate}`
    : `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit}`;

  const isHighProgress = goal.progress >= 50;

  return (
    <div className={cn("bg-zinc-900 rounded-xl px-4 py-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-medium">🎯 {goalText}</p>
        <span className={cn(
          "text-sm font-medium",
          isHighProgress ? "text-emerald-500" : "text-zinc-500"
        )}>
          {goal.progress}%
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isHighProgress ? "bg-emerald-500" : "bg-zinc-600"
          )}
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </div>
  );
}
