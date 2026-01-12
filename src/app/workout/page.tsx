import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { WorkoutClient } from "@/features/workout/workout-client";
import { startWorkout } from "@/features/workout/actions/workout-actions";
import type {
  ActiveWorkoutState,
  ExerciseWithSets,
  SetState,
  PreviousSet,
  User,
  ScheduleState,
  WorkoutType,
  Exercise,
  WorkoutLog,
  SetLog
} from "@/shared/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export default async function WorkoutPage() {
  const supabase = await createClient();

  // Get user settings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userData } = await (supabase as any)
    .from("users")
    .select("weight_unit, default_rest_seconds, timer_sound_enabled, vibration_enabled")
    .eq("id", DEFAULT_USER_ID)
    .single();

  const user = userData as Pick<User, "weight_unit" | "default_rest_seconds" | "timer_sound_enabled" | "vibration_enabled"> | null;

  // Get current schedule position
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: scheduleData } = await (supabase as any)
    .from("schedule_state")
    .select("cycle_position")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  const schedule = scheduleData as Pick<ScheduleState, "cycle_position"> | null;

  const cyclePosition = schedule?.cycle_position ?? 0;
  if (cyclePosition === 3) redirect("/"); // Rest day

  // Get workout type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workoutTypeData } = await (supabase as any)
    .from("workout_types")
    .select("id, name")
    .eq("display_order", cyclePosition)
    .single();

  const workoutType = workoutTypeData as Pick<WorkoutType, "id" | "name"> | null;

  if (!workoutType) redirect("/");

  // Get exercises
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: exercisesData } = await (supabase as any)
    .from("exercises")
    .select("*")
    .eq("workout_type_id", workoutType.id)
    .order("display_order");

  const exercises = (exercisesData ?? []) as Exercise[];

  if (!exercises.length) redirect("/");

  // Get previous workout sets
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: previousWorkoutData } = await (supabase as any)
    .from("workout_logs")
    .select("id")
    .eq("user_id", DEFAULT_USER_ID)
    .eq("workout_type_id", workoutType.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  const previousWorkout = previousWorkoutData as Pick<WorkoutLog, "id"> | null;

  let previousSetsByExercise: Record<string, PreviousSet[]> = {};
  if (previousWorkout) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: previousSetsData } = await (supabase as any)
      .from("set_logs")
      .select("exercise_id, set_number, weight, reps")
      .eq("workout_log_id", previousWorkout.id)
      .order("set_number");

    const previousSets = (previousSetsData ?? []) as Pick<SetLog, "exercise_id" | "set_number" | "weight" | "reps">[];

    if (previousSets.length > 0) {
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
