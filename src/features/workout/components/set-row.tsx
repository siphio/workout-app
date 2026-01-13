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
      "grid grid-cols-[40px_1fr_1fr_1fr_48px] gap-2 items-center py-3 px-1 rounded-lg",
      isActive && "border-l-4 border-emerald-500 bg-zinc-800/60 -ml-1 pl-3"
    )}>
      {/* Set number */}
      <span className={cn(
        "text-base font-medium",
        isCompleted && "text-white",
        isActive && "text-white",
        isUpcoming && "text-zinc-500"
      )}>
        {set.setNumber}
      </span>

      {/* Previous */}
      <span className={cn(
        "text-sm text-center",
        isCompleted ? "text-zinc-300" : "text-zinc-400"
      )}>
        {previousDisplay}
      </span>

      {/* Weight */}
      {isActive ? (
        <SetInput value={set.weight} onChange={onWeightChange} autoFocus className="h-11" />
      ) : (
        <div className={cn(
          "text-center text-base",
          isCompleted && "text-white font-medium",
          isUpcoming && "text-zinc-500"
        )}>
          {set.weight ?? "—"}
        </div>
      )}

      {/* Reps */}
      {isActive ? (
        <SetInput value={set.reps} onChange={onRepsChange} className="h-11" />
      ) : (
        <div className={cn(
          "text-center text-base",
          isCompleted && "text-white font-medium",
          isUpcoming && "text-zinc-500"
        )}>
          {set.reps ?? "—"}
        </div>
      )}

      {/* Complete button */}
      <div className="flex justify-center">
        {isCompleted ? (
          <div className="w-11 h-11 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          </div>
        ) : isActive && canComplete ? (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="w-11 h-11 flex items-center justify-center"
          >
            <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
              <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
            </div>
          </button>
        ) : (
          <div className="w-11 h-11 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
          </div>
        )}
      </div>
    </div>
  );
}
