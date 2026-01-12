import type { Database } from "@/shared/lib/database.types";

// Extract table types from generated Database type
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type WorkoutType = Database["public"]["Tables"]["workout_types"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];

export type WorkoutLog = Database["public"]["Tables"]["workout_logs"]["Row"];
export type WorkoutLogInsert = Database["public"]["Tables"]["workout_logs"]["Insert"];

export type SetLog = Database["public"]["Tables"]["set_logs"]["Row"];
export type SetLogInsert = Database["public"]["Tables"]["set_logs"]["Insert"];

export type PersonalRecord = Database["public"]["Tables"]["personal_records"]["Row"];
export type ScheduleState = Database["public"]["Tables"]["schedule_state"]["Row"];
export type WeightComparison = Database["public"]["Tables"]["weight_comparisons"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];

// Custom types for UI
export type WorkoutDay = "Push" | "Pull" | "Legs" | "Rest";

export type CyclePosition = 0 | 1 | 2 | 3; // Push=0, Pull=1, Legs=2, Rest=3

export interface WorkoutWithExercises extends WorkoutType {
  exercises: Exercise[];
}

export interface SetRowData {
  setNumber: number;
  previousWeight: number | null;
  previousReps: number | null;
  currentWeight: number | null;
  currentReps: number | null;
  isCompleted: boolean;
  isActive: boolean;
}

export interface WorkoutSummary {
  totalVolume: number;
  durationMinutes: number;
  totalSets: number;
  totalExercises: number;
  newPRs: Array<{
    exerciseName: string;
    weight: number;
    reps: number;
  }>;
  comparison: WeightComparison | null;
}

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

// Summary data
export interface SummaryData {
  workoutLogId: string;
  workoutTypeName: string;
  totalVolume: number;
  durationMinutes: number;
  totalSets: number;
  totalExercises: number;
  newPRs: PRRecord[];
  comparison: WeightComparison | null;
}

export interface PRRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  exerciseId: string;
}

// Progress data
export interface ProgressData {
  streakWeeks: number;
  personalRecords: {
    bench: PRWithDelta | null;
    squat: PRWithDelta | null;
    deadlift: PRWithDelta | null;
  };
  volumeHistory: VolumeDataPoint[];
  goals: GoalWithProgress[];
}

export interface PRWithDelta {
  exerciseName: string;
  currentWeight: number;
  previousWeight: number | null;
  delta: number | null;
}

export interface VolumeDataPoint {
  date: string;
  volume: number;
  label: string;
}

export interface GoalWithProgress {
  id: string;
  exerciseName: string;
  targetWeight: number;
  currentWeight: number;
  targetDate: string | null;
  progress: number;
  isCompleted: boolean;
}

// User settings
export interface UserSettings {
  weightUnit: "kg" | "lbs";
  defaultRestSeconds: number;
  timerSoundEnabled: boolean;
  vibrationEnabled: boolean;
  workoutRemindersEnabled: boolean;
  restDayAlertsEnabled: boolean;
}
