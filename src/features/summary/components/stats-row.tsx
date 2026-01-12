import { Clock, Dumbbell, CheckCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  durationMinutes: number;
  totalSets: number;
  totalExercises: number;
  className?: string;
}

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
