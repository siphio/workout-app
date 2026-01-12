"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { ActiveWorkoutState } from "@/shared/types";
import { WorkoutHeader, ExerciseCard, VideoPlaceholder, SetTable, RestTimer, SwipeContainer } from "./components";
import { useWorkoutState, useRestTimer, useElapsedTime } from "./hooks";
import { completeWorkout } from "./actions/workout-actions";
import { clearWorkoutState } from "./lib/workout-storage";

interface Props {
  initialState: ActiveWorkoutState;
  userSettings: {
    defaultRestSeconds: number;
    timerSoundEnabled: boolean;
    vibrationEnabled: boolean;
    weightUnit: string;
  };
}

export function WorkoutClient({ initialState, userSettings }: Props) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const { state, currentExercise, nextExercise, prevExercise, updateSetValue, completeSet, addSet, calculateTotalVolume, isWorkoutComplete } = useWorkoutState({ initialState });
  const { formattedTime: elapsedTime, isPaused, togglePause } = useElapsedTime(state?.startedAt ?? null);
  const restTimer = useRestTimer({
    defaultRestSeconds: currentExercise?.rest_seconds ?? userSettings.defaultRestSeconds,
    soundEnabled: userSettings.timerSoundEnabled,
    vibrationEnabled: userSettings.vibrationEnabled,
  });

  const handleCompleteSet = useCallback(async (setIndex: number) => {
    if (!state) return;
    await completeSet(state.currentExerciseIndex, setIndex);
    restTimer.start(state.exercises[state.currentExerciseIndex].rest_seconds);
  }, [state, completeSet, restTimer]);

  const handleFinishWorkout = useCallback(async () => {
    if (!state || isCompleting) return;
    setIsCompleting(true);
    try {
      const totalVolume = calculateTotalVolume();
      const durationSeconds = Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 1000);
      await completeWorkout(state.workoutLogId, totalVolume, durationSeconds);
      clearWorkoutState();
      router.push(`/summary?workoutId=${state.workoutLogId}`);
    } catch (error) {
      console.error("Failed to complete workout:", error);
      setIsCompleting(false);
    }
  }, [state, isCompleting, calculateTotalVolume, router]);

  if (!state || !currentExercise) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><p className="text-zinc-400">Loading...</p></div>;
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-32">
      <WorkoutHeader workoutTypeName={state.workoutTypeName} formattedTime={elapsedTime} isPaused={isPaused} onTogglePause={togglePause} />

      <SwipeContainer currentIndex={state.currentExerciseIndex} totalCount={state.exercises.length} onNext={nextExercise} onPrev={prevExercise} className="px-6 py-6">
        <ExerciseCard name={currentExercise.name} currentIndex={state.currentExerciseIndex} totalExercises={state.exercises.length} className="mb-4" />
        <VideoPlaceholder className="mb-6" />
        <SetTable
          exercise={currentExercise}
          onWeightChange={(idx, val) => updateSetValue(state.currentExerciseIndex, idx, "weight", val)}
          onRepsChange={(idx, val) => updateSetValue(state.currentExerciseIndex, idx, "reps", val)}
          onCompleteSet={handleCompleteSet}
          onAddSet={() => addSet(state.currentExerciseIndex)}
          weightUnit={userSettings.weightUnit.toUpperCase()}
        />
        <div className="flex items-center gap-2 mt-6 text-zinc-400">
          <span className="text-lg">≡</span>
          <span className="text-sm">Add note...</span>
        </div>
      </SwipeContainer>

      <RestTimer isActive={restTimer.isActive} formattedTime={restTimer.formattedTime} progress={restTimer.progress} onSkip={restTimer.skip} />

      {isWorkoutComplete() && !restTimer.isActive && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 pb-8">
          <button onClick={handleFinishWorkout} disabled={isCompleting} className="w-full bg-emerald-500 text-white font-semibold py-4 rounded-xl hover:bg-emerald-600 disabled:opacity-50">
            {isCompleting ? "Completing..." : "FINISH WORKOUT"}
          </button>
        </div>
      )}
    </main>
  );
}
