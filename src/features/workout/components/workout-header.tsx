"use client";

import Link from "next/link";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  workoutTypeName: string;
  formattedTime: string;
  isPaused: boolean;
  onTogglePause: () => void;
  className?: string;
}

export function WorkoutHeader({ workoutTypeName, formattedTime, isPaused, onTogglePause, className }: Props) {
  return (
    <header className={cn("relative flex items-center justify-center px-4 py-3", className)}>
      <Link href="/" className="absolute left-4 w-11 h-11 flex items-center justify-center">
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      <h1 className="text-base font-semibold text-white uppercase tracking-wide">{workoutTypeName} DAY</h1>
      <div className="absolute right-4 flex items-center gap-1">
        <span className="text-emerald-500 font-mono text-lg font-semibold">{formattedTime}</span>
        <button onClick={onTogglePause} className="w-11 h-11 flex items-center justify-center">
          {isPaused ? <Play className="w-5 h-5 text-emerald-500 fill-emerald-500" /> : <Pause className="w-5 h-5 text-emerald-500 fill-emerald-500" />}
        </button>
      </div>
    </header>
  );
}
