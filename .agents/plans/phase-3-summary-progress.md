# Feature: Phase 3 - Summary & Progress

Validate documentation and codebase patterns before implementing. Pay attention to naming of existing utils, types, and models.

## Feature Description

Complete post-workout experience and progress tracking: dynamic summary with real workout stats, weight comparison gamification, PR detection, progress dashboard with streak tracking, volume chart using Recharts, goals display, settings with working toggles, and bottom navigation.

## User Story

As a **gym user (Marley)** I want to **see my workout results with fun comparisons and track my progress over time** so that **I feel rewarded after workouts and can visualize my strength gains**

## Problem & Solution

**Problem:** Current summary, progress, and settings pages are static placeholders. No database integration, no PR detection, no working toggles, no navigation.

**Solution:** Server components fetch real workout data from Supabase. Summary shows actual stats with weight comparisons. Progress displays streak, PRs with deltas, Recharts volume chart, goals. Settings has working toggles persisting to DB. Bottom nav enables seamless navigation.

**Metadata:** Type: New Capability | Complexity: High | Dependencies: Recharts, shadcn/ui (chart, switch, select)

---

## CONTEXT REFERENCES

### Must-Read Files
| File | Why |
|------|-----|
| `src/app/summary/page.tsx` | Current placeholder to make dynamic |
| `src/app/progress/page.tsx` | Current placeholder to refactor |
| `src/app/settings/page.tsx` | Current placeholder to make functional |
| `src/features/workout/actions/workout-actions.ts` | Server action pattern with `(supabase as any)` |
| `src/shared/types/index.ts` | Types to extend |
| `supabase/migrations/20240101000000_initial_schema.sql` | DB schema |
| `design-assets/ui-screens/*.png` | UI mockups |

### Files to Create
```
src/features/summary/{components/{comparison-card,stats-row,pr-list,index}.tsx,lib/summary-queries.ts,index.ts}
src/features/progress/{components/{streak-card,pr-card,volume-chart,goal-card,index}.tsx,lib/progress-queries.ts,index.ts}
src/features/settings/{components/{profile-section,preferences-section,notifications-section,data-section,index}.tsx,actions/settings-actions.ts,index.ts}
src/shared/components/{bottom-nav,page-header}.tsx
```

### Key Pattern (Supabase RLS Workaround)
```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { data } = await (supabase as any).from("table").select("*").single();
```

---

## IMPLEMENTATION PLAN

| Phase | Description |
|-------|-------------|
| 1 | Foundation: `pnpm dlx shadcn@latest add switch select chart`, shared nav/header, extend types |
| 2 | Summary: components, queries, dynamic page |
| 3 | Progress: components, Recharts chart, aggregation queries |
| 4 | Settings: toggles, server actions, persistence |
| 5 | Integration: bottom nav on all pages, validation |

---

## STEP-BY-STEP TASKS

### Task 1: Install & Extend Types

```bash
pnpm dlx shadcn@latest add switch select chart
```

**ADD to `src/shared/types/index.ts`:**
```typescript
// Summary data
export interface SummaryData {
  workoutLogId: string; workoutTypeName: string; totalVolume: number;
  durationMinutes: number; totalSets: number; totalExercises: number;
  newPRs: PRRecord[]; comparison: WeightComparison | null;
}
export interface PRRecord { exerciseName: string; weight: number; reps: number; exerciseId: string; }

// Progress data
export interface ProgressData {
  streakWeeks: number;
  personalRecords: { bench: PRWithDelta | null; squat: PRWithDelta | null; deadlift: PRWithDelta | null; };
  volumeHistory: VolumeDataPoint[]; goals: GoalWithProgress[];
}
export interface PRWithDelta { exerciseName: string; currentWeight: number; previousWeight: number | null; delta: number | null; }
export interface VolumeDataPoint { date: string; volume: number; label: string; }
export interface GoalWithProgress {
  id: string; exerciseName: string; targetWeight: number; currentWeight: number;
  targetDate: string | null; progress: number; isCompleted: boolean;
}

// User settings
export interface UserSettings {
  weightUnit: "kg" | "lbs"; defaultRestSeconds: number;
  timerSoundEnabled: boolean; vibrationEnabled: boolean;
  workoutRemindersEnabled: boolean; restDayAlertsEnabled: boolean;
}
```

### Task 2: Create Shared Components

**`src/shared/components/bottom-nav.tsx`:**
```typescript
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, TrendingUp, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Dumbbell, label: "Workout", href: "/workout" },
  { icon: TrendingUp, label: "Progress", href: "/progress" },
  { icon: User, label: "Profile", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-2 pb-8">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}
            className={cn("flex flex-col items-center gap-1 py-2 px-4 min-w-[64px]",
              pathname === item.href ? "text-emerald-500" : "text-zinc-500")}>
            <item.icon className="w-6 h-6" /><span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

**`src/shared/components/page-header.tsx`:**
```typescript
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props { title: string; backHref?: string; showSettings?: boolean; className?: string; }

export function PageHeader({ title, backHref, showSettings, className }: Props) {
  return (
    <header className={cn("flex items-center justify-between px-6 py-4", className)}>
      {backHref ? (
        <Link href={backHref} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
      ) : <div className="w-10" />}
      <h1 className="text-lg font-semibold text-white uppercase">{title}</h1>
      {showSettings ? (
        <Link href="/settings" className="w-10 h-10 flex items-center justify-center -mr-2">
          <Settings className="w-6 h-6 text-zinc-400" />
        </Link>
      ) : <div className="w-10" />}
    </header>
  );
}
```

### Task 3: Create Summary Feature

**`mkdir -p src/features/summary/{components,lib}`**

**`src/features/summary/lib/summary-queries.ts`:**
```typescript
import { createClient } from "@/shared/lib/supabase/server";
import type { SummaryData, PRRecord, WeightComparison, WorkoutLog, SetLog, Exercise } from "@/shared/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function getSummaryData(workoutLogId: string): Promise<SummaryData | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workoutLog } = await (supabase as any)
    .from("workout_logs").select(`id, total_volume, duration_seconds, started_at, completed_at, workout_types!inner(name)`)
    .eq("id", workoutLogId).single();
  if (!workoutLog) return null;
  const log = workoutLog as WorkoutLog & { workout_types: { name: string } };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: setLogs } = await (supabase as any)
    .from("set_logs").select(`id, exercise_id, weight, reps, is_pr, exercises!inner(name)`)
    .eq("workout_log_id", workoutLogId);
  const sets = (setLogs ?? []) as (SetLog & { exercises: Pick<Exercise, "name"> })[];

  const newPRs: PRRecord[] = sets.filter((s) => s.is_pr).map((s) => ({
    exerciseName: s.exercises.name, weight: Number(s.weight), reps: s.reps, exerciseId: s.exercise_id!,
  }));
  const totalVolume = Number(log.total_volume ?? 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: comparison } = await (supabase as any)
    .from("weight_comparisons").select("*").lte("min_weight", totalVolume).gte("max_weight", totalVolume).single();

  return {
    workoutLogId, workoutTypeName: log.workout_types.name, totalVolume,
    durationMinutes: Math.round((log.duration_seconds ?? 0) / 60),
    totalSets: sets.length, totalExercises: new Set(sets.map((s) => s.exercise_id)).size,
    newPRs, comparison: comparison as WeightComparison | null,
  };
}
```

**`src/features/summary/components/comparison-card.tsx`:**
```typescript
import Image from "next/image";
import type { WeightComparison } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props { totalVolume: number; comparison: WeightComparison | null; weightUnit?: string; className?: string; }

export function ComparisonCard({ totalVolume, comparison, weightUnit = "kg", className }: Props) {
  const imageSrc = comparison?.image_filename ? `/images/comparisons/${comparison.image_filename}` : "/images/comparisons/trex.png";
  return (
    <div className={cn("bg-zinc-900 rounded-2xl p-6", className)}>
      <div className="flex justify-center mb-4">
        <div className="w-48 h-48 relative">
          <Image src={imageSrc} alt={comparison?.comparison_name ?? "Weight comparison"} fill className="object-contain" />
        </div>
      </div>
      <p className="text-zinc-400 text-center mb-2">You lifted</p>
      <p className="text-stat font-bold text-white text-center mb-2">{totalVolume.toLocaleString()} {weightUnit}</p>
      {comparison && <p className="text-emerald-500 text-center">That&apos;s equivalent to a {comparison.comparison_name}!</p>}
    </div>
  );
}
```

**`src/features/summary/components/stats-row.tsx`:**
```typescript
import { Clock, Dumbbell, CheckCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props { durationMinutes: number; totalSets: number; totalExercises: number; className?: string; }

export function StatsRow({ durationMinutes, totalSets, totalExercises, className }: Props) {
  const stats = [
    { icon: Clock, value: `${durationMinutes} min` },
    { icon: Dumbbell, value: `${totalSets} sets` },
    { icon: CheckCircle, value: `${totalExercises} exercises` },
  ];
  return (
    <div className={cn("flex justify-around py-4 border-y border-zinc-800", className)}>
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <stat.icon className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-white font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
```

**`src/features/summary/components/pr-list.tsx`:**
```typescript
import type { PRRecord } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props { prs: PRRecord[]; weightUnit?: string; className?: string; }

export function PRList({ prs, weightUnit = "kg", className }: Props) {
  if (prs.length === 0) return null;
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">NEW RECORDS 🏆</h2>
      <ul className="space-y-2">
        {prs.map((pr, i) => (
          <li key={`${pr.exerciseId}-${i}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white">{pr.exerciseName}: {pr.weight}{weightUnit} × {pr.reps}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**`src/features/summary/components/index.ts`:** `export { ComparisonCard } from "./comparison-card"; export { StatsRow } from "./stats-row"; export { PRList } from "./pr-list";`

**`src/features/summary/index.ts`:** `export * from "./components"; export * from "./lib/summary-queries";`

### Task 4: Update Summary Page

**Replace `src/app/summary/page.tsx`:**
```typescript
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { getSummaryData } from "@/features/summary/lib/summary-queries";
import { ComparisonCard, StatsRow, PRList } from "@/features/summary/components";

interface Props { searchParams: Promise<{ workoutId?: string }>; }

export default async function SummaryPage({ searchParams }: Props) {
  const params = await searchParams;
  if (!params.workoutId) redirect("/");
  const summaryData = await getSummaryData(params.workoutId);
  if (!summaryData) redirect("/");

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white text-center mb-8">WORKOUT COMPLETE</h1>
      <ComparisonCard totalVolume={summaryData.totalVolume} comparison={summaryData.comparison} className="mb-6" />
      <StatsRow durationMinutes={summaryData.durationMinutes} totalSets={summaryData.totalSets} totalExercises={summaryData.totalExercises} className="mb-6" />
      <PRList prs={summaryData.newPRs} className="mb-8" />
      <div className="space-y-3">
        <button className="w-full bg-white text-zinc-950 font-semibold py-4 px-6 rounded-xl">SHARE</button>
        <Link href="/" className="block w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl text-center">DONE</Link>
      </div>
    </main>
  );
}
```

### Task 5: Create Progress Feature

**`mkdir -p src/features/progress/{components,lib}`**

**`src/features/progress/lib/progress-queries.ts`:**
```typescript
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
  const { data: workouts } = await supabase.from("workout_logs")
    .select("completed_at").eq("user_id", DEFAULT_USER_ID).not("completed_at", "is", null).order("completed_at", { ascending: false });
  if (!workouts?.length) return 0;

  const weeks = new Set<string>();
  for (const w of workouts) weeks.add(getWeekStart(new Date(w.completed_at)).toISOString().split("T")[0]);

  let streak = 0, checkDate = getWeekStart(new Date());
  while (weeks.has(checkDate.toISOString().split("T")[0])) { streak++; checkDate.setDate(checkDate.getDate() - 7); }
  return streak;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date), day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1)); d.setHours(0, 0, 0, 0);
  return d;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getMainLiftPRs(supabase: any): Promise<ProgressData["personalRecords"]> {
  const result: ProgressData["personalRecords"] = { bench: null, squat: null, deadlift: null };
  for (const liftName of MAIN_LIFTS) {
    const { data: exercise } = await supabase.from("exercises").select("id").eq("name", liftName).single();
    if (!exercise) continue;
    const { data: currentPR } = await supabase.from("personal_records")
      .select("value, achieved_at").eq("user_id", DEFAULT_USER_ID).eq("exercise_id", exercise.id).eq("pr_type", "max_weight").single();
    if (!currentPR) continue;
    const { data: previousPRs } = await supabase.from("set_logs")
      .select("weight").eq("exercise_id", exercise.id).lt("completed_at", currentPR.achieved_at).order("weight", { ascending: false }).limit(1);

    const previousWeight = previousPRs?.[0]?.weight ? Number(previousPRs[0].weight) : null;
    const currentWeight = Number(currentPR.value);
    const prData: PRWithDelta = {
      exerciseName: liftName.replace("Barbell ", ""), currentWeight, previousWeight,
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

  const { data: workouts } = await supabase.from("workout_logs")
    .select("completed_at, total_volume").eq("user_id", DEFAULT_USER_ID)
    .not("completed_at", "is", null).gte("completed_at", startDate.toISOString()).order("completed_at", { ascending: true });
  if (!workouts) return [];

  const weeklyVolume = new Map<string, number>();
  for (const w of workouts) {
    const key = getWeekStart(new Date(w.completed_at)).toISOString().split("T")[0];
    weeklyVolume.set(key, (weeklyVolume.get(key) ?? 0) + Number(w.total_volume ?? 0));
  }
  return Array.from(weeklyVolume.entries()).map(([date, volume]) => ({
    date, volume: Math.round(volume),
    label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGoalsWithProgress(supabase: any): Promise<GoalWithProgress[]> {
  const { data: goals } = await supabase.from("goals")
    .select(`id, target_weight, target_date, current_weight, is_completed, exercises!inner(name)`)
    .eq("user_id", DEFAULT_USER_ID).eq("is_completed", false).order("target_date", { ascending: true });
  if (!goals) return [];
  return goals.map((goal: any) => {
    const current = Number(goal.current_weight ?? 0), target = Number(goal.target_weight);
    return {
      id: goal.id, exerciseName: goal.exercises.name, targetWeight: target, currentWeight: current,
      targetDate: goal.target_date, progress: Math.min(100, Math.round((current / target) * 100)), isCompleted: goal.is_completed,
    };
  });
}
```

**`src/features/progress/components/streak-card.tsx`:**
```typescript
import { cn } from "@/shared/lib/utils";
interface Props { streakWeeks: number; className?: string; }
export function StreakCard({ streakWeeks, className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-2xl p-5", className)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-lg font-semibold text-white">{streakWeeks} Week Streak!</p>
          <p className="text-zinc-400 text-sm">{streakWeeks > 0 ? "Keep it going" : "Start your streak!"}</p>
        </div>
      </div>
    </div>
  );
}
```

**`src/features/progress/components/pr-card.tsx`:**
```typescript
import type { PRWithDelta } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
interface Props { pr: PRWithDelta | null; label: string; weightUnit?: string; className?: string; }
export function PRCard({ pr, label, weightUnit = "kg", className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-xl p-4 text-center", className)}>
      <p className="text-zinc-400 text-sm mb-1">{label}</p>
      {pr ? (<>
        <p className="text-xl font-bold text-white">{pr.currentWeight} {weightUnit}</p>
        {pr.delta && pr.delta > 0 ? <p className="text-emerald-500 text-sm">+{pr.delta} {weightUnit} ↑</p> : <p className="text-zinc-600 text-sm">—</p>}
      </>) : (<>
        <p className="text-xl font-bold text-zinc-600">— {weightUnit}</p>
        <p className="text-zinc-600 text-sm">No PR yet</p>
      </>)}
    </div>
  );
}
```

**`src/features/progress/components/volume-chart.tsx`:**
```typescript
"use client";
import { useState } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/components/ui/chart";
import type { VolumeDataPoint } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props { data: VolumeDataPoint[]; className?: string; }
const chartConfig = { volume: { label: "Volume", color: "#10b981" } } satisfies ChartConfig;
const timeRanges = ["1M", "3M", "1Y"] as const;

export function VolumeChart({ data, className }: Props) {
  const [activeRange, setActiveRange] = useState<typeof timeRanges[number]>("3M");
  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide">TOTAL VOLUME</h2>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button key={range} onClick={() => setActiveRange(range)}
              className={cn("px-3 py-1 rounded-full text-sm transition-colors",
                activeRange === range ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-300")}>{range}</button>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 rounded-2xl p-4">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={40} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${Number(v).toLocaleString()} kg`} />} />
              <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} fill="url(#volumeGradient)" />
            </AreaChart>
          </ChartContainer>
        ) : <div className="h-48 flex items-center justify-center text-zinc-500">No workout data yet</div>}
      </div>
    </div>
  );
}
```

**`src/features/progress/components/goal-card.tsx`:**
```typescript
import type { GoalWithProgress } from "@/shared/types";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
interface Props { goal: GoalWithProgress; weightUnit?: string; className?: string; }
export function GoalCard({ goal, weightUnit = "kg", className }: Props) {
  const targetDate = goal.targetDate ? new Date(goal.targetDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null;
  const goalText = targetDate ? `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit} by ${targetDate}` : `${goal.exerciseName.replace("Barbell ", "")} ${goal.targetWeight}${weightUnit}`;
  return (
    <div className={cn("bg-zinc-900 rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-white">🎯 {goalText}</p>
        <span className="text-emerald-500 text-sm">{goal.progress}%</span>
      </div>
      <Progress value={goal.progress} className="h-2 bg-zinc-800" />
    </div>
  );
}
```

**`src/features/progress/components/index.ts`:** `export { StreakCard } from "./streak-card"; export { PRCard } from "./pr-card"; export { VolumeChart } from "./volume-chart"; export { GoalCard } from "./goal-card";`

**`src/features/progress/index.ts`:** `export * from "./components"; export * from "./lib/progress-queries";`

### Task 6: Update Progress Page

**Replace `src/app/progress/page.tsx`:**
```typescript
import { getProgressData } from "@/features/progress/lib/progress-queries";
import { StreakCard, PRCard, VolumeChart, GoalCard } from "@/features/progress/components";
import { PageHeader } from "@/shared/components/page-header";
import { BottomNav } from "@/shared/components/bottom-nav";

export default async function ProgressPage() {
  const progressData = await getProgressData();
  return (
    <main className="min-h-screen bg-zinc-950 pb-24">
      <PageHeader title="PROGRESS" showSettings />
      <div className="px-6 space-y-6">
        <StreakCard streakWeeks={progressData.streakWeeks} />
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">PERSONAL RECORDS</h2>
          <div className="grid grid-cols-3 gap-3">
            <PRCard pr={progressData.personalRecords.bench} label="Bench" />
            <PRCard pr={progressData.personalRecords.squat} label="Squat" />
            <PRCard pr={progressData.personalRecords.deadlift} label="Deadlift" />
          </div>
        </div>
        <VolumeChart data={progressData.volumeHistory} />
        {progressData.goals.length > 0 && (
          <div>
            <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">GOALS</h2>
            <div className="space-y-3">{progressData.goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
```

### Task 7: Create Settings Feature

**`mkdir -p src/features/settings/{components,actions}`**

**`src/features/settings/actions/settings-actions.ts`:**
```typescript
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
  const { data } = await (supabase as any).from("users")
    .select("weight_unit, default_rest_seconds, timer_sound_enabled, vibration_enabled, workout_reminders_enabled, rest_day_alerts_enabled")
    .eq("id", DEFAULT_USER_ID).single();
  return {
    weightUnit: data?.weight_unit ?? "kg", defaultRestSeconds: data?.default_rest_seconds ?? 90,
    timerSoundEnabled: data?.timer_sound_enabled ?? true, vibrationEnabled: data?.vibration_enabled ?? true,
    workoutRemindersEnabled: data?.workout_reminders_enabled ?? true, restDayAlertsEnabled: data?.rest_day_alerts_enabled ?? false,
  };
}

export async function clearAllData(): Promise<void> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = supabase as any;
  await s.from("set_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await s.from("personal_records").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("workout_logs").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("goals").delete().eq("user_id", DEFAULT_USER_ID);
  await s.from("schedule_state").update({ cycle_position: 0, last_completed_at: null }).eq("user_id", DEFAULT_USER_ID);
  revalidatePath("/"); revalidatePath("/progress"); revalidatePath("/settings");
}
```

**`src/features/settings/components/profile-section.tsx`:**
```typescript
import { Camera } from "lucide-react";
import { cn } from "@/shared/lib/utils";
interface Props { name?: string; email?: string; className?: string; }
export function ProfileSection({ name = "Marley", email = "marley@email.com", className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-2xl p-5", className)}>
      <div className="flex justify-end mb-2"><button className="text-emerald-500 text-sm">Edit</button></div>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-3"><Camera className="w-8 h-8 text-zinc-500" /></div>
        <p className="text-xl font-semibold text-white">{name}</p>
        <p className="text-zinc-400 text-sm">{email}</p>
      </div>
    </div>
  );
}
```

**`src/features/settings/components/preferences-section.tsx`:**
```typescript
"use client";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { updateUserSettings } from "../actions/settings-actions";
import type { UserSettings } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props { settings: UserSettings; className?: string; }
export function PreferencesSection({ settings, className }: Props) {
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">WORKOUT PREFERENCES</h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Weight Unit</span>
          <Select defaultValue={settings.weightUnit} onValueChange={(v) => updateUserSettings({ weightUnit: v as "kg" | "lbs" })}>
            <SelectTrigger className="w-20 bg-transparent border-none text-zinc-400"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="lbs">lbs</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Default Rest Timer</span>
          <Select defaultValue={String(settings.defaultRestSeconds)} onValueChange={(v) => updateUserSettings({ defaultRestSeconds: parseInt(v) })}>
            <SelectTrigger className="w-20 bg-transparent border-none text-zinc-400"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="60">60s</SelectItem><SelectItem value="90">90s</SelectItem><SelectItem value="120">120s</SelectItem><SelectItem value="180">180s</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Timer Sound</span>
          <Switch defaultChecked={settings.timerSoundEnabled} onCheckedChange={(c) => updateUserSettings({ timerSoundEnabled: c })} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Vibration</span>
          <Switch defaultChecked={settings.vibrationEnabled} onCheckedChange={(c) => updateUserSettings({ vibrationEnabled: c })} />
        </div>
      </div>
    </div>
  );
}
```

**`src/features/settings/components/notifications-section.tsx`:**
```typescript
"use client";
import { Switch } from "@/shared/components/ui/switch";
import { updateUserSettings } from "../actions/settings-actions";
import type { UserSettings } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props { settings: UserSettings; className?: string; }
export function NotificationsSection({ settings, className }: Props) {
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">NOTIFICATIONS</h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Workout Reminders</span>
          <Switch defaultChecked={settings.workoutRemindersEnabled} onCheckedChange={(c) => updateUserSettings({ workoutRemindersEnabled: c })} />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Rest Day Alerts</span>
          <Switch defaultChecked={settings.restDayAlertsEnabled} onCheckedChange={(c) => updateUserSettings({ restDayAlertsEnabled: c })} />
        </div>
      </div>
    </div>
  );
}
```

**`src/features/settings/components/data-section.tsx`:**
```typescript
"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { clearAllData } from "../actions/settings-actions";
import { cn } from "@/shared/lib/utils";

interface Props { className?: string; }
export function DataSection({ className }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const handleClearData = async () => {
    if (!showConfirm) { setShowConfirm(true); return; }
    setIsClearing(true);
    try { await clearAllData(); setShowConfirm(false); } finally { setIsClearing(false); }
  };
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">DATA</h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <button className="flex items-center justify-between px-5 py-4 w-full">
          <span className="text-white">Export Workout Data</span><ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
        <button onClick={handleClearData} disabled={isClearing} className="flex items-center justify-between px-5 py-4 w-full">
          <span className={showConfirm ? "text-red-500 font-semibold" : "text-red-500"}>{showConfirm ? "Tap again to confirm" : "Clear All Data"}</span>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
```

**`src/features/settings/components/index.ts`:** `export { ProfileSection } from "./profile-section"; export { PreferencesSection } from "./preferences-section"; export { NotificationsSection } from "./notifications-section"; export { DataSection } from "./data-section";`

**`src/features/settings/index.ts`:** `export * from "./components"; export * from "./actions/settings-actions";`

### Task 8: Update Settings Page

**Replace `src/app/settings/page.tsx`:**
```typescript
import { getUserSettings } from "@/features/settings/actions/settings-actions";
import { ProfileSection, PreferencesSection, NotificationsSection, DataSection } from "@/features/settings/components";
import { PageHeader } from "@/shared/components/page-header";

export default async function SettingsPage() {
  const settings = await getUserSettings();
  return (
    <main className="min-h-screen bg-zinc-950 pb-12">
      <PageHeader title="SETTINGS" backHref="/" />
      <div className="px-6 space-y-6">
        <ProfileSection />
        <PreferencesSection settings={settings} />
        <NotificationsSection settings={settings} />
        <DataSection />
        <button className="w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl">SIGN OUT</button>
        <p className="text-center text-zinc-500 text-sm">App Version 1.0.0</p>
      </div>
    </main>
  );
}
```

### Task 9: Integration

**Update `src/app/page.tsx`:**
1. Add: `import { BottomNav } from "@/shared/components/bottom-nav";`
2. Add `pb-24` to bottom card div
3. Add `<BottomNav />` before `</main>`

**Create image placeholder:**
```bash
mkdir -p public/images/comparisons
cp design-assets/ui-screens/trex.png public/images/comparisons/trex.png 2>/dev/null || echo "Copy T-Rex image manually"
```

---

## VALIDATION

```bash
pnpm typecheck && pnpm lint && pnpm build
```

## MANUAL TESTING
1. Complete workout → verify redirect to `/summary?workoutId=xxx` with real stats
2. Verify weight comparison displays correctly
3. `/progress` → verify streak, PRs, chart render
4. Test time range filters (1M/3M/1Y)
5. `/settings` → toggle Timer Sound, verify persistence after refresh
6. Test Clear All Data (confirm dialog)
7. Test bottom navigation between screens

## ACCEPTANCE CRITERIA
- [ ] Summary shows actual workout data (volume, duration, sets, exercises)
- [ ] Weight comparison matches total volume
- [ ] PRs achieved during workout display in summary
- [ ] Progress shows calculated streak (consecutive weeks)
- [ ] PR cards show 3 main lifts with deltas
- [ ] Volume chart renders with Recharts, time filters work
- [ ] Goals display with progress bars
- [ ] Settings toggles persist to database
- [ ] Clear All Data removes workout history
- [ ] Bottom navigation works across screens
- [ ] `pnpm typecheck && pnpm lint && pnpm build` pass

## NOTES
- **Supabase RLS:** Use `(supabase as any)` cast with eslint-disable
- **Streak:** Counts consecutive weeks (Mon-Sun) with completed workouts
- **Out of Scope:** Export data, Sign out, Edit profile, Share (all placeholders)
