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
    <header className={cn("flex items-center justify-between px-6 py-4 border-b border-zinc-800", className)}>
      <Link href="/" className="w-10 h-10 flex items-center justify-center -ml-2">
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      <h1 className="text-lg font-semibold text-white uppercase">{workoutTypeName} DAY</h1>
      <div className="flex items-center gap-2">
        <span className="text-emerald-500 font-mono text-lg">{formattedTime}</span>
        <button onClick={onTogglePause} className="w-10 h-10 flex items-center justify-center -mr-2">
          {isPaused ? <Play className="w-5 h-5 text-emerald-500" /> : <Pause className="w-5 h-5 text-emerald-500" />}
        </button>
      </div>
    </header>
  );
}
