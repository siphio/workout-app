import { cn } from "@/shared/lib/utils";

interface Props {
  streakWeeks: number;
  className?: string;
}

export function StreakCard({ streakWeeks, className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-2xl px-5 py-4", className)}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">🔥</span>
        <p className="text-xl font-semibold text-white">
          {streakWeeks} Week Streak!
        </p>
      </div>
      <p className="text-zinc-500 text-sm">
        {streakWeeks > 0 ? "Keep it going" : "Start your streak!"}
      </p>
    </div>
  );
}
