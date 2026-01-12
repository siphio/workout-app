import { createClient } from "@/shared/lib/supabase/server";
import type { SummaryData, PRRecord, WeightComparison, WorkoutLog, SetLog, Exercise } from "@/shared/types";

export async function getSummaryData(workoutLogId: string): Promise<SummaryData | null> {
  const supabase = await createClient();

  // Fetch workout log with workout type name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workoutLog } = await (supabase as any)
    .from("workout_logs")
    .select(`id, total_volume, duration_seconds, started_at, completed_at, workout_types!inner(name)`)
    .eq("id", workoutLogId)
    .single();

  if (!workoutLog) return null;

  const log = workoutLog as WorkoutLog & { workout_types: { name: string } };

  // Fetch set logs with exercise names
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: setLogs } = await (supabase as any)
    .from("set_logs")
    .select(`id, exercise_id, weight, reps, is_pr, exercises!inner(name)`)
    .eq("workout_log_id", workoutLogId);

  const sets = (setLogs ?? []) as (SetLog & { exercises: Pick<Exercise, "name"> })[];

  // Extract PRs from completed sets
  const newPRs: PRRecord[] = sets
    .filter((s) => s.is_pr)
    .map((s) => ({
      exerciseName: s.exercises.name,
      weight: Number(s.weight),
      reps: s.reps,
      exerciseId: s.exercise_id!,
    }));

  const totalVolume = Number(log.total_volume ?? 0);

  // Fetch weight comparison based on total volume
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: comparison } = await (supabase as any)
    .from("weight_comparisons")
    .select("*")
    .lte("min_weight", totalVolume)
    .gte("max_weight", totalVolume)
    .single();

  return {
    workoutLogId,
    workoutTypeName: log.workout_types.name,
    totalVolume,
    durationMinutes: Math.round((log.duration_seconds ?? 0) / 60),
    totalSets: sets.length,
    totalExercises: new Set(sets.map((s) => s.exercise_id)).size,
    newPRs,
    comparison: comparison as WeightComparison | null,
  };
}
