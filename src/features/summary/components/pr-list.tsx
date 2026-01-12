import type { PRRecord } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  prs: PRRecord[];
  weightUnit?: string;
  className?: string;
}

export function PRList({ prs, weightUnit = "kg", className }: Props) {
  if (prs.length === 0) return null;

  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
        NEW RECORDS
      </h2>
      <ul className="space-y-2">
        {prs.map((pr, i) => (
          <li key={`${pr.exerciseId}-${i}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white">
              {pr.exerciseName}: {pr.weight}{weightUnit} x {pr.reps}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
