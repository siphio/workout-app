import { Dumbbell, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// Custom clock hands icon (no outline circle)
function ClockHands({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v8l5 3" />
    </svg>
  );
}

interface Props {
  durationMinutes: number;
  totalSets: number;
  totalExercises: number;
  className?: string;
}

export function StatsRow({ durationMinutes, totalSets, totalExercises, className }: Props) {
  return (
    <div className={cn("flex justify-between items-center py-3", className)}>
      <div className="text-center flex-1">
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-1.5">
          <ClockHands className="w-4 h-4 text-zinc-950" />
        </div>
        <p className="text-white text-sm">{durationMinutes} min</p>
      </div>
      <div className="h-8 w-px bg-zinc-700" />
      <div className="text-center flex-1">
        <Dumbbell className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" strokeWidth={2.5} />
        <p className="text-white text-sm">{totalSets} sets</p>
      </div>
      <div className="h-8 w-px bg-zinc-700" />
      <div className="text-center flex-1">
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-1.5">
          <Check className="w-4 h-4 text-zinc-950" strokeWidth={3} />
        </div>
        <p className="text-white text-sm">{totalExercises} exercises</p>
      </div>
    </div>
  );
}
