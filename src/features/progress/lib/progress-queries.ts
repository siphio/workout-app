import { createClient } from "@/shared/lib/supabase/server";
import type { ProgressData, PRWithDelta, VolumeDataPoint, GoalWithProgress } from "@/shared/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";
const MAIN_LIFTS = ["Barbell Bench Press", "Barbell Back Squat", "Barbell Deadlift"];

export async function getProgressData(timeRange: "1M" | "3M" | "1Y" = "3M"): Promise<ProgressData> {
  const supabase = await createClient();

  return {
    streakWeeks: await calculateStreak(supabase),
    personalRecords: await getMainLiftPRs(supabase),
    volumeHistory: await getVolumeHistory(supabase, timeRange),
    goals: await getGoalsWithProgress(supabase),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function calculateStreak(supabase: any): Promise<number> {
  const { data: workouts } = await supabase
    .from("workout_logs")
    .select("completed_at")
    .eq("user_id", DEFAULT_USER_ID)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (!workouts?.length) return 0;

  const weeks = new Set<string>();
  for (const w of workouts) {
    weeks.add(getWeekStart(new Date(w.completed_at)).toISOString().split("T")[0]);
  }

  let streak = 0;
  const checkDate = getWeekStart(new Date());

  while (weeks.has(checkDate.toISOString().split("T")[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 7);
  }

  return streak;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getMainLiftPRs(supabase: any): Promise<ProgressData["personalRecords"]> {
  const result: ProgressData["personalRecords"] = { bench: null, squat: null, deadlift: null };

  for (const liftName of MAIN_LIFTS) {
    const { data: exercise } = await supabase
      .from("exercises")
      .select("id")
      .eq("name", liftName)
      .single();

    if (!exercise) continue;

    const { data: currentPR } = await supabase
      .from("personal_records")
      .select("value, achieved_at")
      .eq("user_id", DEFAULT_USER_ID)
      .eq("exercise_id", exercise.id)
      .eq("pr_type", "max_weight")
      .single();

    if (!currentPR) continue;

    const { data: previousPRs } = await supabase
      .from("set_logs")
      .select("weight")
      .eq("exercise_id", exercise.id)
      .lt("completed_at", currentPR.achieved_at)
      .order("weight", { ascending: false })
      .limit(1);

    const previousWeight = previousPRs?.[0]?.weight ? Number(previousPRs[0].weight) : null;
    const currentWeight = Number(currentPR.value);

    const prData: PRWithDelta = {
      exerciseName: liftName.replace("Barbell ", ""),
      currentWeight,
      previousWeight,
      delta: previousWeight ? currentWeight - previousWeight : null,
    };

    if (liftName.includes("Bench")) result.bench = prData;
    else if (liftName.includes("Squat")) result.squat = prData;
    else if (liftName.includes("Deadlift")) result.deadlift = prData;
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getVolumeHistory(supabase: any, timeRange: "1M" | "3M" | "1Y"): Promise<VolumeDataPoint[]> {
  const startDate = new Date();
  if (timeRange === "1M") startDate.setMonth(startDate.getMonth() - 1);
  else if (timeRange === "3M") startDate.setMonth(startDate.getMonth() - 3);
  else startDate.setFullYear(startDate.getFullYear() - 1);

  const { data: workouts } = await supabase
    .from("workout_logs")
    .select("completed_at, total_volume")
    .eq("user_id", DEFAULT_USER_ID)
    .not("completed_at", "is", null)
    .gte("completed_at", startDate.toISOString())
    .order("completed_at", { ascending: true });

  if (!workouts) return [];

  const weeklyVolume = new Map<string, number>();
  for (const w of workouts) {
    const key = getWeekStart(new Date(w.completed_at)).toISOString().split("T")[0];
    weeklyVolume.set(key, (weeklyVolume.get(key) ?? 0) + Number(w.total_volume ?? 0));
  }

  return Array.from(weeklyVolume.entries()).map(([date, volume]) => ({
    date,
    volume: Math.round(volume),
    label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGoalsWithProgress(supabase: any): Promise<GoalWithProgress[]> {
  const { data: goals } = await supabase
    .from("goals")
    .select(`id, target_weight, target_date, current_weight, is_completed, exercises!inner(name)`)
    .eq("user_id", DEFAULT_USER_ID)
    .eq("is_completed", false)
    .order("target_date", { ascending: true });

  if (!goals) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return goals.map((goal: any) => {
    const current = Number(goal.current_weight ?? 0);
    const target = Number(goal.target_weight);
    return {
      id: goal.id,
      exerciseName: goal.exercises.name,
      targetWeight: target,
      currentWeight: current,
      targetDate: goal.target_date,
      progress: Math.min(100, Math.round((current / target) * 100)),
      isCompleted: goal.is_completed,
    };
  });
}
