# Feature: Phase 2 - Core Workout Flow

## Feature Description

Complete workout logging experience: dynamic exercise data, interactive set tracking with previous performance comparison, persistent rest timer, swipe navigation, localStorage resume, and schedule advancement.

## User Story

As a **gym user (Marley)**
I want to **log sets with weight/reps and see my previous performance**
So that **I can track progress and beat my last workout**

## Problem Statement

Current workout page is static placeholder without database integration, state management, or interactive features.

## Solution Statement

Server component fetches exercises + previous performance, passes to client component for interactive set logging with optimistic updates, rest timer, and swipe navigation.

## Feature Metadata

- **Type**: New Capability
- **Complexity**: High
- **Systems**: `/app/workout`, `/features/workout`, Supabase (workout_logs, set_logs, schedule_state)
- **Dependencies**: Supabase client, localStorage API, touch events

---

## CONTEXT REFERENCES

### Must-Read Files

| File | Why |
|------|-----|
| `src/app/workout/page.tsx:1-98` | Current placeholder to replace |
| `src/app/page.tsx:1-65` | Server data fetching pattern |
| `src/shared/lib/supabase/server.ts:1-32` | Server Supabase client |
| `src/shared/lib/supabase/client.ts:1-9` | Client Supabase for mutations |
| `src/shared/types/index.ts:1-52` | Types to extend |
| `src/shared/components/ui/button.tsx:1-56` | shadcn component pattern |
| `src/app/globals.css:1-147` | Design tokens |
| `supabase/seed.sql:1-84` | Exercise data structure |
| `design-assets/ui-screens/active-workout-ui.png` | Target mockup |

### Files to Create

```
src/features/workout/
├── components/
│   ├── workout-header.tsx
│   ├── exercise-card.tsx
│   ├── video-placeholder.tsx
│   ├── set-table.tsx
│   ├── set-row.tsx
│   ├── set-input.tsx
│   ├── rest-timer.tsx
│   ├── swipe-container.tsx
│   └── index.ts
├── hooks/
│   ├── use-workout-state.ts
│   ├── use-rest-timer.ts
│   ├── use-swipe-navigation.ts
│   ├── use-elapsed-time.ts
│   └── index.ts
├── actions/
│   └── workout-actions.ts
├── lib/
│   └── workout-storage.ts
├── workout-client.tsx
└── index.ts
```

### Mockup Reference

From `active-workout-ui.png`:
- Header: Back arrow | "PUSH DAY" | "12:34" emerald timer + pause
- Exercise card: Border, "BENCH PRESS" bold, "Exercise 1 of 6" muted
- Video: 16:9 dark gray, play button, "Form Guide"
- Set table: SET | PREVIOUS | KG | REPS | checkmark columns
- Row states: Completed (emerald check), Active (emerald left border + inputs), Upcoming (muted)
- Rest timer: Fixed bottom, clock icon, countdown, progress bar, Skip button

### Patterns to Follow

**Server Component Data Fetching:**
```tsx
const supabase = await createClient();
const { data } = await supabase.from("table").select("*").single();
```

**Client Component with Server Action:**
```tsx
"use client";
import { serverAction } from "./actions";
const result = await serverAction(data);
```

**Component Pattern:**
```tsx
import { cn } from "@/lib/utils";
interface Props { className?: string; }
export function Component({ className }: Props) {
  return <div className={cn("base-styles", className)} />;
}
```

---

## IMPLEMENTATION TASKS

### Task 1: Create Directory Structure

```bash
mkdir -p src/features/workout/{components,hooks,actions,lib}
```

**Validate:** `ls src/features/workout/` shows 4 directories

---

### Task 2: Extend Types in `src/shared/types/index.ts`

Add after line 52:

```typescript
// Active workout state
export interface ActiveWorkoutState {
  workoutLogId: string;
  workoutTypeId: string;
  workoutTypeName: string;
  exercises: ExerciseWithSets[];
  currentExerciseIndex: number;
  startedAt: string;
  isRestTimerActive: boolean;
  restTimeRemaining: number;
}

export interface ExerciseWithSets extends Exercise {
  sets: SetState[];
  previousSets: PreviousSet[];
}

export interface SetState {
  id?: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  isCompleted: boolean;
  completedAt?: string;
}

export interface PreviousSet {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface WorkoutResumeData {
  workoutLogId: string;
  workoutTypeId: string;
  workoutTypeName: string;
  exercises: ExerciseWithSets[];
  currentExerciseIndex: number;
  startedAt: string;
  savedAt: string;
}
```

**Validate:** `pnpm typecheck`

---

### Task 3: Create `src/features/workout/lib/workout-storage.ts`

```typescript
import type { WorkoutResumeData } from "@/types";

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
```

**Validate:** File exists

---

### Task 4: Create `src/features/workout/actions/workout-actions.ts`

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function startWorkout(workoutTypeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_logs")
    .insert({
      user_id: DEFAULT_USER_ID,
      workout_type_id: workoutTypeId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function logSet(
  workoutLogId: string,
  exerciseId: string,
  setNumber: number,
  weight: number,
  reps: number
) {
  const supabase = await createClient();

  // Check for PR
  const { data: currentPR } = await supabase
    .from("personal_records")
    .select("value")
    .eq("user_id", DEFAULT_USER_ID)
    .eq("exercise_id", exerciseId)
    .eq("pr_type", "max_weight")
    .single();

  const isPR = !currentPR || weight > currentPR.value;

  const { data, error } = await supabase
    .from("set_logs")
    .insert({
      workout_log_id: workoutLogId,
      exercise_id: exerciseId,
      set_number: setNumber,
      weight,
      reps,
      is_pr: isPR,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (isPR) {
    await supabase.from("personal_records").upsert({
      user_id: DEFAULT_USER_ID,
      exercise_id: exerciseId,
      pr_type: "max_weight",
      value: weight,
      reps,
      workout_log_id: workoutLogId,
      achieved_at: new Date().toISOString(),
    }, { onConflict: "user_id,exercise_id,pr_type" });
  }

  return { ...data, isPR };
}

export async function updateSet(setLogId: string, weight: number, reps: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("set_logs")
    .update({ weight, reps })
    .eq("id", setLogId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function completeWorkout(
  workoutLogId: string,
  totalVolume: number,
  durationSeconds: number
) {
  const supabase = await createClient();

  await supabase
    .from("workout_logs")
    .update({
      completed_at: new Date().toISOString(),
      total_volume: totalVolume,
      duration_seconds: durationSeconds,
    })
    .eq("id", workoutLogId);

  // Advance schedule
  const { data: schedule } = await supabase
    .from("schedule_state")
    .select("cycle_position")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  const nextPosition = ((schedule?.cycle_position ?? 0) + 1) % 4;

  await supabase
    .from("schedule_state")
    .update({
      cycle_position: nextPosition,
      last_completed_at: new Date().toISOString(),
    })
    .eq("user_id", DEFAULT_USER_ID);

  revalidatePath("/");
  return { success: true };
}
```

**Validate:** `pnpm typecheck`

---

### Task 5: Create `src/features/workout/hooks/use-elapsed-time.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

export function useElapsedTime(startedAt: string | null) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!startedAt || isPaused) return;
    const startTime = new Date(startedAt).getTime();

    const update = () => setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt, isPaused]);

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    isPaused,
    togglePause: useCallback(() => setIsPaused((p) => !p), []),
  };
}
```

**Validate:** File exists

---

### Task 6: Create `src/features/workout/hooks/use-rest-timer.ts`

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Options {
  defaultRestSeconds: number;
  onComplete?: () => void;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export function useRestTimer({ defaultRestSeconds, onComplete, soundEnabled = true, vibrationEnabled = true }: Options) {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(defaultRestSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/timer-complete.mp3");
    }
  }, []);

  useEffect(() => {
    if (!isActive || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (soundEnabled) audioRef.current?.play().catch(() => {});
          if (vibrationEnabled && navigator.vibrate) navigator.vibrate([200, 100, 200]);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, soundEnabled, vibrationEnabled, onComplete]);

  const start = useCallback((customSeconds?: number) => {
    const s = customSeconds ?? defaultRestSeconds;
    setTotalSeconds(s);
    setRemainingSeconds(s);
    setIsActive(true);
  }, [defaultRestSeconds]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return {
    isActive,
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    progress: totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0,
    start,
    skip: useCallback(() => { setIsActive(false); setRemainingSeconds(0); }, []),
  };
}
```

**Validate:** `pnpm typecheck`

---

### Task 7: Create `src/features/workout/hooks/use-swipe-navigation.ts`

```typescript
"use client";

import { useRef, useCallback } from "react";

interface Options {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export function useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold = 50 }: Options) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > threshold) {
      diff > 0 ? onSwipeLeft() : onSwipeRight();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") onSwipeLeft();
    else if (e.key === "ArrowLeft") onSwipeRight();
  }, [onSwipeLeft, onSwipeRight]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onKeyDown: handleKeyDown,
    },
  };
}
```

**Validate:** File exists

---

### Task 8: Create `src/features/workout/hooks/use-workout-state.ts`

```typescript
"use client";

import { useState, useCallback, useEffect } from "react";
import type { ActiveWorkoutState, ExerciseWithSets } from "@/types";
import { saveWorkoutState, clearWorkoutState } from "../lib/workout-storage";
import { logSet, updateSet } from "../actions/workout-actions";

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
    calculateTotalVolume,
    isWorkoutComplete,
    clearWorkout: useCallback(() => { clearWorkoutState(); setState(null); }, []),
  };
}
```

**Validate:** `pnpm typecheck`

---

### Task 9: Create `src/features/workout/hooks/index.ts`

```typescript
export { useWorkoutState } from "./use-workout-state";
export { useRestTimer } from "./use-rest-timer";
export { useSwipeNavigation } from "./use-swipe-navigation";
export { useElapsedTime } from "./use-elapsed-time";
```

---

### Task 10: Create `src/features/workout/components/workout-header.tsx`

```typescript
"use client";

import Link from "next/link";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  workoutTypeName: string;
  formattedTime: string;
  isPaused: boolean;
  onTogglePause: () => void;
  className?: string;
}

export function WorkoutHeader({ workoutTypeName, formattedTime, isPaused, onTogglePause, className }: Props) {
  return (
    <header className={cn("flex items-center justify-between px-6 py-4 border-b border-zinc-800", className)}>
      <Link href="/" className="w-10 h-10 flex items-center justify-center -ml-2">
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      <h1 className="text-lg font-semibold text-white uppercase">{workoutTypeName} DAY</h1>
      <div className="flex items-center gap-2">
        <span className="text-emerald-500 font-mono text-lg">{formattedTime}</span>
        <button onClick={onTogglePause} className="w-10 h-10 flex items-center justify-center -mr-2">
          {isPaused ? <Play className="w-5 h-5 text-emerald-500" /> : <Pause className="w-5 h-5 text-emerald-500" />}
        </button>
      </div>
    </header>
  );
}
```

---

### Task 11: Create `src/features/workout/components/exercise-card.tsx`

```typescript
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  currentIndex: number;
  totalExercises: number;
  className?: string;
}

export function ExerciseCard({ name, currentIndex, totalExercises, className }: Props) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-700 rounded-2xl p-5", className)}>
      <h2 className="text-xl font-bold text-white text-center uppercase">{name}</h2>
      <p className="text-zinc-400 text-center text-sm mt-1">Exercise {currentIndex + 1} of {totalExercises}</p>
    </div>
  );
}
```

---

### Task 12: Create `src/features/workout/components/video-placeholder.tsx`

```typescript
import { cn } from "@/lib/utils";

export function VideoPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("bg-zinc-800 rounded-2xl aspect-video flex items-center justify-center", className)}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-zinc-600 flex items-center justify-center mb-2 mx-auto">
          <div className="w-0 h-0 border-l-[12px] border-l-zinc-400 border-y-[8px] border-y-transparent ml-1" />
        </div>
        <p className="text-zinc-400 text-sm">Form Guide</p>
      </div>
    </div>
  );
}
```

---

### Task 13: Create `src/features/workout/components/set-input.tsx`

```typescript
"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  autoFocus?: boolean;
  className?: string;
}

export function SetInput({ value, onChange, autoFocus = false, className }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <input
      ref={ref}
      type="number"
      inputMode="decimal"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
      placeholder="—"
      className={cn(
        "bg-zinc-800 rounded-lg px-3 py-2 text-white text-center w-full",
        "border border-transparent focus:border-emerald-500 focus:outline-none",
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className
      )}
    />
  );
}
```

---

### Task 14: Create `src/features/workout/components/set-row.tsx`

```typescript
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetInput } from "./set-input";
import type { SetState, PreviousSet } from "@/types";

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
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        ) : isActive && canComplete ? (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-500/20"
          >
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
        )}
      </div>
    </div>
  );
}
```

---

### Task 15: Create `src/features/workout/components/set-table.tsx`

```typescript
"use client";

import { SetRow } from "./set-row";
import type { ExerciseWithSets } from "@/types";

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
```

---

### Task 16: Create `src/features/workout/components/rest-timer.tsx`

```typescript
"use client";

import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  isActive: boolean;
  formattedTime: string;
  progress: number;
  onSkip: () => void;
  className?: string;
}

export function RestTimer({ isActive, formattedTime, progress, onSkip, className }: Props) {
  if (!isActive) return null;

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 pb-8", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-zinc-400" />
          <span className="text-zinc-400 text-sm uppercase tracking-wide">Rest</span>
          <span className="text-white font-mono text-xl font-semibold">{formattedTime}</span>
        </div>
        <button onClick={onSkip} className="text-zinc-400 hover:text-white text-sm px-3 py-1">Skip</button>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-2 bg-zinc-800" />
        <span className="absolute right-0 -top-6 text-emerald-500 text-xs">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
```

---

### Task 17: Create `src/features/workout/components/swipe-container.tsx`

```typescript
"use client";

import { cn } from "@/lib/utils";
import { useSwipeNavigation } from "../hooks/use-swipe-navigation";

interface Props {
  children: React.ReactNode;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export function SwipeContainer({ children, currentIndex, totalCount, onNext, onPrev, className }: Props) {
  const { handlers } = useSwipeNavigation({ onSwipeLeft: onNext, onSwipeRight: onPrev });

  return (
    <div {...handlers} tabIndex={0} className={cn("outline-none", className)}>
      {children}
      <div className="flex justify-center gap-2 mt-6 mb-4">
        {Array.from({ length: totalCount }).map((_, i) => (
          <div key={i} className={cn("w-2 h-2 rounded-full", i === currentIndex ? "bg-emerald-500" : "bg-zinc-700")} />
        ))}
      </div>
    </div>
  );
}
```

---

### Task 18: Create `src/features/workout/components/index.ts`

```typescript
export { WorkoutHeader } from "./workout-header";
export { ExerciseCard } from "./exercise-card";
export { VideoPlaceholder } from "./video-placeholder";
export { SetTable } from "./set-table";
export { SetRow } from "./set-row";
export { SetInput } from "./set-input";
export { RestTimer } from "./rest-timer";
export { SwipeContainer } from "./swipe-container";
```

---

### Task 19: Create `src/features/workout/workout-client.tsx`

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { ActiveWorkoutState } from "@/types";
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
```

**Validate:** `pnpm typecheck`

---

### Task 20: Update `src/app/workout/page.tsx`

Replace entire file with server component:

```typescript
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkoutClient } from "@/features/workout/workout-client";
import { startWorkout } from "@/features/workout/actions/workout-actions";
import type { ActiveWorkoutState, ExerciseWithSets, SetState, PreviousSet } from "@/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export default async function WorkoutPage() {
  const supabase = await createClient();

  // Get user settings
  const { data: user } = await supabase
    .from("users")
    .select("weight_unit, default_rest_seconds, timer_sound_enabled, vibration_enabled")
    .eq("id", DEFAULT_USER_ID)
    .single();

  // Get current schedule position
  const { data: schedule } = await supabase
    .from("schedule_state")
    .select("cycle_position")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  const cyclePosition = schedule?.cycle_position ?? 0;
  if (cyclePosition === 3) redirect("/"); // Rest day

  // Get workout type
  const { data: workoutType } = await supabase
    .from("workout_types")
    .select("id, name")
    .eq("display_order", cyclePosition)
    .single();

  if (!workoutType) redirect("/");

  // Get exercises
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("workout_type_id", workoutType.id)
    .order("display_order");

  if (!exercises?.length) redirect("/");

  // Get previous workout sets
  const { data: previousWorkout } = await supabase
    .from("workout_logs")
    .select("id")
    .eq("user_id", DEFAULT_USER_ID)
    .eq("workout_type_id", workoutType.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  let previousSetsByExercise: Record<string, PreviousSet[]> = {};
  if (previousWorkout) {
    const { data: previousSets } = await supabase
      .from("set_logs")
      .select("exercise_id, set_number, weight, reps")
      .eq("workout_log_id", previousWorkout.id)
      .order("set_number");

    if (previousSets) {
      previousSetsByExercise = previousSets.reduce((acc, s) => {
        const key = s.exercise_id!;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ setNumber: s.set_number, weight: Number(s.weight), reps: s.reps });
        return acc;
      }, {} as Record<string, PreviousSet[]>);
    }
  }

  // Create workout log
  const workoutLog = await startWorkout(workoutType.id);

  // Build initial state
  const exercisesWithSets: ExerciseWithSets[] = exercises.map((ex) => ({
    ...ex,
    sets: Array.from({ length: ex.default_sets }, (_, i): SetState => ({
      setNumber: i + 1, weight: null, reps: null, isCompleted: false,
    })),
    previousSets: previousSetsByExercise[ex.id] ?? [],
  }));

  const initialState: ActiveWorkoutState = {
    workoutLogId: workoutLog.id,
    workoutTypeId: workoutType.id,
    workoutTypeName: workoutType.name,
    exercises: exercisesWithSets,
    currentExerciseIndex: 0,
    startedAt: workoutLog.started_at,
    isRestTimerActive: false,
    restTimeRemaining: 0,
  };

  return (
    <WorkoutClient
      initialState={initialState}
      userSettings={{
        defaultRestSeconds: user?.default_rest_seconds ?? 90,
        timerSoundEnabled: user?.timer_sound_enabled ?? true,
        vibrationEnabled: user?.vibration_enabled ?? true,
        weightUnit: user?.weight_unit ?? "kg",
      }}
    />
  );
}
```

**Validate:** `pnpm build`

---

### Task 21: Create Sound File Placeholder

```bash
mkdir -p public/sounds
# Download or create a short beep sound (~0.5s) as timer-complete.mp3
```

**Validate:** Directory exists

---

### Task 22: Create Feature Index `src/features/workout/index.ts`

```typescript
export { WorkoutClient } from "./workout-client";
export * from "./components";
export * from "./hooks";
export * from "./actions/workout-actions";
export * from "./lib/workout-storage";
```

---

## VALIDATION COMMANDS

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build
pnpm build

# Dev server
pnpm dev
```

### Manual Testing Checklist

1. Navigate to `localhost:3000` → Click "START WORKOUT"
2. Verify "BENCH PRESS" loads as Exercise 1 of 6
3. Enter 80 (weight) and 10 (reps) → tap checkmark
4. Verify set completes, rest timer starts
5. Skip timer → verify it disappears
6. Swipe left → verify Exercise 2 loads
7. Complete all sets across all exercises
8. Verify "FINISH WORKOUT" button appears
9. Tap finish → verify redirect to /summary
10. Return home → verify schedule shows "PULL DAY"

---

## ACCEPTANCE CRITERIA

- [ ] Workout loads correct exercises for current cycle day
- [ ] Set table shows 3 visual states (completed/active/upcoming)
- [ ] Previous performance displays from last workout
- [ ] Weight/reps inputs work with numeric keyboard
- [ ] Completing set saves to DB and starts rest timer
- [ ] Rest timer counts down with progress bar and skip
- [ ] Swipe navigation between exercises works
- [ ] Position dots indicate current exercise
- [ ] "+ Add Set" adds new row
- [ ] Workout completes when all sets done
- [ ] Total volume calculates correctly
- [ ] Schedule advances on completion
- [ ] UI matches mockup design tokens
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` succeeds

---

## NOTES

**Architecture:** Server component fetches data, client component handles interactivity. Optimistic updates with rollback on error.

**Limitations:**
- No offline support (Phase 4)
- Timer resets on page refresh
- No confirmation before leaving
- Notes feature is placeholder
- Single hardcoded user ID

**Dependencies on Phase 3:** Summary page reads workout by ID, displays PRs, progress dashboard aggregates data.
