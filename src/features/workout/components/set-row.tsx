"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SetInput } from "./set-input";
import type { SetState, PreviousSet } from "@/shared/types";

interface Props {
  set: SetState;
  previousSet?: PreviousSet;
  isActive: boolean;
  onWeightChange: (value: number | null) => void;
  onRepsChange: (value: number | null) => void;
  onComplete: () => void;
}

export function SetRow({ set, previousSet, isActive, onWeightChange, onRepsChange, onComplete }: Props) {
  const isCompleted = set.isCompleted;
  const isUpcoming = !isCompleted && !isActive;
  const previousDisplay = previousSet ? `${previousSet.weight} × ${previousSet.reps}` : "—";
  const canComplete = set.weight !== null && set.reps !== null && !isCompleted;

  return (
    <div className={cn(
      "grid grid-cols-5 gap-2 items-center py-3 px-2",
      isActive && "border-l-4 border-emerald-500 bg-zinc-900/50 -ml-1 pl-3"
    )}>
      <span className={cn("text-base", isCompleted && "text-white", isActive && "text-white font-medium", isUpcoming && "text-zinc-500")}>
        {set.setNumber}
      </span>
      <span className="text-zinc-400 text-sm">{previousDisplay}</span>

      {isActive ? (
        <SetInput value={set.weight} onChange={onWeightChange} autoFocus />
      ) : (
        <div className={cn("text-center py-2", isCompleted && "text-white", isUpcoming && "text-zinc-500")}>
          {set.weight ?? "—"}
        </div>
      )}

      {isActive ? (
        <SetInput value={set.reps} onChange={onRepsChange} />
      ) : (
        <div className={cn("text-center py-2", isCompleted && "text-white", isUpcoming && "text-zinc-500")}>
          {set.reps ?? "—"}
        </div>
      )}

      <div className="flex justify-center">
        {isCompleted ? (
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </div>
        ) : isActive && canComplete ? (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-500/20">
              <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
            </div>
          </button>
        ) : (
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
          </div>
        )}
      </div>
    </div>
  );
}
