import type { WorkoutResumeData } from "@/shared/types";

const STORAGE_KEY = "clean-gains-active-workout";
const RESUME_WINDOW_MINUTES = 20;

export function saveWorkoutState(data: WorkoutResumeData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...data,
    savedAt: new Date().toISOString(),
  }));
}

export function getWorkoutState(): WorkoutResumeData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data: WorkoutResumeData = JSON.parse(stored);
    const totalSets = data.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const resumeWindowMs = (totalSets * 135 + RESUME_WINDOW_MINUTES * 60) * 1000;
    const savedAt = new Date(data.savedAt).getTime();

    if (Date.now() - savedAt > resumeWindowMs) {
      clearWorkoutState();
      return null;
    }
    return data;
  } catch {
    clearWorkoutState();
    return null;
  }
}

export function clearWorkoutState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
