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
    <div className={cn("bg-zinc-900 rounded-xl px-3 py-4 text-center", className)}>
      <p className="text-zinc-500 text-sm mb-2">{label}</p>
      {pr ? (
        <>
          <p className="text-2xl font-bold text-white mb-1">
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
          <p className="text-2xl font-bold text-zinc-600 mb-1">— {weightUnit}</p>
          <p className="text-zinc-600 text-sm">No PR yet</p>
        </>
      )}
    </div>
  );
}
