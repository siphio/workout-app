import { cn } from "@/shared/lib/utils";

interface Props {
  streakWeeks: number;
  className?: string;
}

export function StreakCard({ streakWeeks, className }: Props) {
  return (
    <div className={cn("bg-zinc-900 rounded-2xl p-5", className)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-lg font-semibold text-white">
            {streakWeeks} Week Streak!
          </p>
          <p className="text-zinc-400 text-sm">
            {streakWeeks > 0 ? "Keep it going" : "Start your streak!"}
          </p>
        </div>
      </div>
    </div>
  );
}
