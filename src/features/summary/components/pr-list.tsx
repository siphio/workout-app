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
    <div className={cn("border-t border-zinc-800 pt-5", className)}>
      <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-3">
        NEW RECORDS 🏆
      </h2>
      <ul className="space-y-2">
        {prs.map((pr, i) => (
          <li key={`${pr.exerciseId}-${i}`} className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-white text-sm">
              {pr.exerciseName}: {pr.weight}{weightUnit} × {pr.reps}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
