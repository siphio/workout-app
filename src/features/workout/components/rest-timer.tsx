"use client";

import { Clock } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";

interface Props {
  isActive: boolean;
  formattedTime: string;
  progress: number;
  onSkip: () => void;
  className?: string;
}

export function RestTimer({ isActive, formattedTime, progress, onSkip, className }: Props) {
  if (!isActive) return null;

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 pb-8", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-zinc-400" />
          <span className="text-zinc-400 text-sm uppercase tracking-wide">Rest</span>
          <span className="text-white font-mono text-xl font-semibold">{formattedTime}</span>
        </div>
        <button onClick={onSkip} className="text-zinc-400 hover:text-white text-sm px-4 py-2 min-h-[44px] min-w-[44px]">Skip</button>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-2 bg-zinc-800" />
        <span className="absolute right-0 -top-6 text-emerald-500 text-xs">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
