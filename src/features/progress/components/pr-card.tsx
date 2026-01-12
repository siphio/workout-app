import type { PRWithDelta } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  pr: PRWithDelta | null;
  label: string;
  weightUnit?: string;
  className?: string;
}

export function PRCard({ pr, label, weightUnit = "kg", className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-xl p-4 text-center", className)}>
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      {pr ? (
        <>
          <p className="text-xl font-bold text-white">
            {pr.currentWeight} {weightUnit}
          </p>
          {pr.delta && pr.delta > 0 ? (
            <p className="text-emerald-500 text-sm">+{pr.delta} {weightUnit} ↑</p>
          ) : (
            <p className="text-zinc-600 text-sm">—</p>
          )}
        </>
      ) : (
        <>
          <p className="text-xl font-bold text-zinc-600">— {weightUnit}</p>
          <p className="text-zinc-600 text-sm">No PR yet</p>
        </>
      )}
    </div>
  );
}
