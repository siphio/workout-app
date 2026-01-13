"use client";

import { SetRow } from "./set-row";
import type { ExerciseWithSets } from "@/shared/types";

interface Props {
  exercise: ExerciseWithSets;
  onWeightChange: (setIndex: number, value: number | null) => void;
  onRepsChange: (setIndex: number, value: number | null) => void;
  onCompleteSet: (setIndex: number) => void;
  onDeleteSet: (setIndex: number) => void;
  onAddSet: () => void;
  weightUnit?: string;
}

export function SetTable({ exercise, onWeightChange, onRepsChange, onCompleteSet, onDeleteSet, onAddSet, weightUnit = "KG" }: Props) {
  const activeSetIndex = exercise.sets.findIndex((s) => !s.isCompleted);
  const canDeleteSets = exercise.sets.length > 1;

  return (
    <div>
      {/* Header row */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr_48px] gap-2 text-xs text-zinc-500 uppercase tracking-wider mb-3 px-1">
        <span>Set</span>
        <span className="text-center">Previous</span>
        <span className="text-center">{weightUnit}</span>
        <span className="text-center">Reps</span>
        <span className="text-center">✓</span>
      </div>

      {/* Set rows */}
      <div className="space-y-1">
        {exercise.sets.map((set, idx) => (
          <SetRow
            key={set.setNumber}
            set={set}
            previousSet={exercise.previousSets[idx]}
            isActive={idx === activeSetIndex}
            onWeightChange={(val) => onWeightChange(idx, val)}
            onRepsChange={(val) => onRepsChange(idx, val)}
            onComplete={() => onCompleteSet(idx)}
            onDelete={() => onDeleteSet(idx)}
            canDelete={canDeleteSets}
          />
        ))}
      </div>

      <button
        onClick={onAddSet}
        className="text-zinc-400 text-sm mt-5 w-full text-center hover:text-zinc-300 py-3 min-h-[44px]"
      >
        + Add Set
      </button>
    </div>
  );
}
