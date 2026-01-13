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
    <div className={cn("flex justify-between items-center py-4", className)}>
      <div className="text-center flex-1">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-2">
          <ClockHands className="w-4.5 h-4.5 text-zinc-950" />
        </div>
        <p className="text-white text-sm">{durationMinutes} min</p>
      </div>
      <div className="h-10 w-px bg-zinc-700" />
      <div className="text-center flex-1">
        <Dumbbell className="w-8 h-8 text-emerald-500 mx-auto mb-2" strokeWidth={2.5} />
        <p className="text-white text-sm">{totalSets} sets</p>
      </div>
      <div className="h-10 w-px bg-zinc-700" />
      <div className="text-center flex-1">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-2">
          <Check className="w-4.5 h-4.5 text-zinc-950" strokeWidth={3} />
        </div>
        <p className="text-white text-sm">{totalExercises} exercises</p>
      </div>
    </div>
  );
}
