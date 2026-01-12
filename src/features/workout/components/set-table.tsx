"use client";

import { SetRow } from "./set-row";
import type { ExerciseWithSets } from "@/shared/types";

interface Props {
  exercise: ExerciseWithSets;
  onWeightChange: (setIndex: number, value: number | null) => void;
  onRepsChange: (setIndex: number, value: number | null) => void;
  onCompleteSet: (setIndex: number) => void;
  onAddSet: () => void;
  weightUnit?: string;
}

export function SetTable({ exercise, onWeightChange, onRepsChange, onCompleteSet, onAddSet, weightUnit = "KG" }: Props) {
  const activeSetIndex = exercise.sets.findIndex((s) => !s.isCompleted);

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 text-xs text-zinc-400 uppercase tracking-wide px-2 mb-3">
        <span>Set</span>
        <span>Previous</span>
        <span>{weightUnit}</span>
        <span>Reps</span>
        <span className="text-center">✓</span>
      </div>

      {exercise.sets.map((set, idx) => (
        <SetRow
          key={set.setNumber}
          set={set}
          previousSet={exercise.previousSets[idx]}
          isActive={idx === activeSetIndex}
          onWeightChange={(val) => onWeightChange(idx, val)}
          onRepsChange={(val) => onRepsChange(idx, val)}
          onComplete={() => onCompleteSet(idx)}
        />
      ))}

      <button onClick={onAddSet} className="text-zinc-400 text-sm mt-4 w-full text-center hover:text-zinc-300 py-2">
        + Add Set
      </button>
    </div>
  );
}
