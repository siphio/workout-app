"use client";

import { useState, useCallback, useEffect } from "react";
import type { ActiveWorkoutState } from "@/shared/types";
import { saveWorkoutState, clearWorkoutState } from "../lib/workout-storage";
import { logSet, deleteSetLog } from "../actions/workout-actions";

export function useWorkoutState({ initialState }: { initialState: ActiveWorkoutState | null }) {
  const [state, setState] = useState<ActiveWorkoutState | null>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state) {
      saveWorkoutState({
        workoutLogId: state.workoutLogId,
        workoutTypeId: state.workoutTypeId,
        workoutTypeName: state.workoutTypeName,
        exercises: state.exercises,
        currentExerciseIndex: state.currentExerciseIndex,
        startedAt: state.startedAt,
        savedAt: new Date().toISOString(),
      });
    }
  }, [state]);

  const currentExercise = state?.exercises[state.currentExerciseIndex] ?? null;

  const goToExercise = useCallback((index: number) => {
    if (!state || index < 0 || index >= state.exercises.length) return;
    setState((prev) => prev ? { ...prev, currentExerciseIndex: index } : null);
  }, [state]);

  const updateSetValue = useCallback((
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: number | null
  ) => {
    setState((prev) => {
      if (!prev) return null;
      const newExercises = [...prev.exercises];
      const newSets = [...newExercises[exerciseIndex].sets];
      newSets[setIndex] = { ...newSets[setIndex], [field]: value };
      newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
      return { ...prev, exercises: newExercises };
    });
  }, []);

  const completeSet = useCallback(async (exerciseIndex: number, setIndex: number) => {
    if (!state) return { isPR: false };
    const exercise = state.exercises[exerciseIndex];
    const set = exercise.sets[setIndex];
    if (set.weight === null || set.reps === null) return { isPR: false };

    setIsLoading(true);
    try {
      // Optimistic update
      setState((prev) => {
        if (!prev) return null;
        const newExercises = [...prev.exercises];
        const newSets = [...newExercises[exerciseIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], isCompleted: true, completedAt: new Date().toISOString() };
        newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
        return { ...prev, exercises: newExercises };
      });

      const result = await logSet(state.workoutLogId, exercise.id, set.setNumber, set.weight, set.reps);

      setState((prev) => {
        if (!prev) return null;
        const newExercises = [...prev.exercises];
        const newSets = [...newExercises[exerciseIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], id: result.id };
        newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
        return { ...prev, exercises: newExercises };
      });

      return { isPR: result.isPR };
    } catch {
      // Rollback
      setState((prev) => {
        if (!prev) return null;
        const newExercises = [...prev.exercises];
        const newSets = [...newExercises[exerciseIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], isCompleted: false };
        newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], sets: newSets };
        return { ...prev, exercises: newExercises };
      });
      return { isPR: false };
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const addSet = useCallback((exerciseIndex: number) => {
    setState((prev) => {
      if (!prev) return null;
      const newExercises = [...prev.exercises];
      const exercise = newExercises[exerciseIndex];
      newExercises[exerciseIndex] = {
        ...exercise,
        sets: [...exercise.sets, { setNumber: exercise.sets.length + 1, weight: null, reps: null, isCompleted: false }],
      };
      return { ...prev, exercises: newExercises };
    });
  }, []);

  const deleteSet = useCallback(async (exerciseIndex: number, setIndex: number) => {
    if (!state) return;
    const exercise = state.exercises[exerciseIndex];
    if (exercise.sets.length <= 1) return; // Don't delete last set

    const setToDelete = exercise.sets[setIndex];

    // Optimistic update
    setState((prev) => {
      if (!prev) return null;
      const newExercises = [...prev.exercises];
      const newSets = prev.exercises[exerciseIndex].sets
        .filter((_, idx) => idx !== setIndex)
        .map((set, idx) => ({ ...set, setNumber: idx + 1 })); // Renumber sets
      newExercises[exerciseIndex] = { ...prev.exercises[exerciseIndex], sets: newSets };
      return { ...prev, exercises: newExercises };
    });

    // If set was already logged to database, delete it there too
    if (setToDelete.id) {
      try {
        await deleteSetLog(setToDelete.id);
      } catch (error) {
        console.error("Failed to delete set from database:", error);
        // Could rollback here, but for MVP we'll just log the error
      }
    }
  }, [state]);

  const calculateTotalVolume = useCallback(() => {
    if (!state) return 0;
    return state.exercises.reduce((total, ex) =>
      total + ex.sets.reduce((t, s) => s.isCompleted && s.weight && s.reps ? t + s.weight * s.reps : t, 0), 0);
  }, [state]);

  const isWorkoutComplete = useCallback(() => {
    if (!state) return false;
    return state.exercises.every((ex) => ex.sets.every((s) => s.isCompleted));
  }, [state]);

  return {
    state,
    currentExercise,
    isLoading,
    goToExercise,
    nextExercise: useCallback(() => state && goToExercise(state.currentExerciseIndex + 1), [state, goToExercise]),
    prevExercise: useCallback(() => state && goToExercise(state.currentExerciseIndex - 1), [state, goToExercise]),
    updateSetValue,
    completeSet,
    addSet,
    deleteSet,
    calculateTotalVolume,
    isWorkoutComplete,
    clearWorkout: useCallback(() => { clearWorkoutState(); setState(null); }, []),
  };
}
