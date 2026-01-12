"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  WorkoutLog,
  SetLog,
  PersonalRecord,
  ScheduleState
} from "@/shared/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function startWorkout(workoutTypeId: string): Promise<WorkoutLog> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("workout_logs")
    .insert({
      user_id: DEFAULT_USER_ID,
      workout_type_id: workoutTypeId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as WorkoutLog;
}

export async function logSet(
  workoutLogId: string,
  exerciseId: string,
  setNumber: number,
  weight: number,
  reps: number
): Promise<SetLog & { isPR: boolean }> {
  const supabase = await createClient();

  // Check for PR
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentPR } = await (supabase as any)
    .from("personal_records")
    .select("value")
    .eq("user_id", DEFAULT_USER_ID)
    .eq("exercise_id", exerciseId)
    .eq("pr_type", "max_weight")
    .single();

  const prData = currentPR as PersonalRecord | null;
  const isPR = !prData || weight > Number(prData.value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("personal_records").upsert({
      user_id: DEFAULT_USER_ID,
      exercise_id: exerciseId,
      pr_type: "max_weight",
      value: weight,
      reps,
      workout_log_id: workoutLogId,
      achieved_at: new Date().toISOString(),
    }, { onConflict: "user_id,exercise_id,pr_type" });
  }

  return { ...(data as SetLog), isPR };
}

export async function updateSet(setLogId: string, weight: number, reps: number): Promise<SetLog> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("set_logs")
    .update({ weight, reps })
    .eq("id", setLogId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as SetLog;
}

export async function completeWorkout(
  workoutLogId: string,
  totalVolume: number,
  durationSeconds: number
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("workout_logs")
    .update({
      completed_at: new Date().toISOString(),
      total_volume: totalVolume,
      duration_seconds: durationSeconds,
    })
    .eq("id", workoutLogId);

  // Advance schedule
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: schedule } = await (supabase as any)
    .from("schedule_state")
    .select("cycle_position")
    .eq("user_id", DEFAULT_USER_ID)
    .single();

  const scheduleData = schedule as ScheduleState | null;
  const nextPosition = ((scheduleData?.cycle_position ?? 0) + 1) % 4;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("schedule_state")
    .update({
      cycle_position: nextPosition,
      last_completed_at: new Date().toISOString(),
    })
    .eq("user_id", DEFAULT_USER_ID);

  revalidatePath("/");
  return { success: true };
}
