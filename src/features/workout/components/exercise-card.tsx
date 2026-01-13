import { cn } from "@/shared/lib/utils";

interface Props {
  name: string;
  currentIndex: number;
  totalExercises: number;
  className?: string;
}

export function ExerciseCard({ name, currentIndex, totalExercises, className }: Props) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-5", className)}>
      <h2 className="text-2xl font-bold text-white text-center uppercase tracking-wide">{name}</h2>
      <p className="text-zinc-400 text-center text-sm mt-2">Exercise {currentIndex + 1} of {totalExercises}</p>
    </div>
  );
}
