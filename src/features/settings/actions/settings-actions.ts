"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { UserSettings } from "@/shared/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (settings.weightUnit !== undefined) updateData.weight_unit = settings.weightUnit;
  if (settings.defaultRestSeconds !== undefined) updateData.default_rest_seconds = settings.defaultRestSeconds;
  if (settings.timerSoundEnabled !== undefined) updateData.timer_sound_enabled = settings.timerSoundEnabled;
  if (settings.vibrationEnabled !== undefined) updateData.vibration_enabled = settings.vibrationEnabled;
  if (settings.workoutRemindersEnabled !== undefined) updateData.workout_reminders_enabled = settings.workoutRemindersEnabled;
  if (settings.restDayAlertsEnabled !== undefined) updateData.rest_day_alerts_enabled = settings.restDayAlertsEnabled;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("users").update(updateData).eq("id", DEFAULT_USER_ID);

  revalidatePath("/settings");
}

export async function getUserSettings(): Promise<UserSettings> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("users")
    .select("weight_unit, default_rest_seconds, timer_sound_enabled, vibration_enabled, workout_reminders_enabled, rest_day_alerts_enabled")
    .eq("id", DEFAULT_USER_ID)
    .single();

  return {
    weightUnit: data?.weight_unit ?? "kg",
    defaultRestSeconds: data?.default_rest_seconds ?? 90,
    timerSoundEnabled: data?.timer_sound_enabled ?? true,
    vibrationEnabled: data?.vibration_enabled ?? true,
    workoutRemindersEnabled: data?.workout_reminders_enabled ?? true,
    restDayAlertsEnabled: data?.rest_day_alerts_enabled ?? false,
  };
}

export async function clearAllData(): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = supabase as any;

  // Delete in order respecting foreign key constraints
  await s.from("set_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await s.from("personal_records").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("workout_logs").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("goals").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("schedule_state").update({ cycle_position: 0, last_completed_at: null }).eq("user_id", DEFAULT_USER_ID);

  revalidatePath("/");
  revalidatePath("/progress");
  revalidatePath("/settings");
}
