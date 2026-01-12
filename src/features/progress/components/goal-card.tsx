import type { GoalWithProgress } from "@/shared/types";
import { Progress } from "@/shared/components/ui/progress";
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
        year: "numeric",
      })
    : null;

  const goalText = targetDate
    ? `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit} by ${targetDate}`
    : `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit}`;

  return (
    <div className={cn("bg-zinc-900 rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-white">🎯 {goalText}</p>
        <span className="text-emerald-500 text-sm">{goal.progress}%</span>
      </div>
      <Progress value={goal.progress} className="h-2 bg-zinc-800" />
    </div>
  );
}
