"use client";

import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  isActive: boolean;
  formattedTime: string;
  progress: number;
  defaultRestSeconds?: number;
  onSkip: () => void;
  className?: string;
}

export function RestTimer({ isActive, formattedTime, progress, defaultRestSeconds = 90, onSkip, className }: Props) {
  // Format default time for display when not active
  const defaultTimeDisplay = `${Math.floor(defaultRestSeconds / 60)}:${(defaultRestSeconds % 60).toString().padStart(2, "0")}`;
  const displayTime = isActive ? formattedTime : defaultTimeDisplay;
  const displayProgress = isActive ? progress : 0;

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-5 pt-4 pb-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-zinc-400" />
          <span className="text-zinc-400 text-sm uppercase tracking-wider font-medium">Rest</span>
          <span className={cn("font-mono text-2xl font-bold", isActive ? "text-white" : "text-zinc-500")}>
            {displayTime}
          </span>
        </div>
        <button
          onClick={onSkip}
          className={cn(
            "text-base px-4 py-2 min-h-[44px] min-w-[44px]",
            isActive ? "text-zinc-400 hover:text-white" : "text-zinc-600"
          )}
          disabled={!isActive}
        >
          Skip
        </button>
      </div>

      {/* Progress bar with percentage inside */}
      <div className="relative h-8 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
        <span className={cn(
          "absolute inset-0 flex items-center justify-center text-sm font-semibold",
          displayProgress > 50 ? "text-white" : "text-zinc-400"
        )}>
          {Math.round(displayProgress)}%
        </span>
      </div>
    </div>
  );
}
