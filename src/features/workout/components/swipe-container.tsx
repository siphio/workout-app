"use client";

import { cn } from "@/shared/lib/utils";
import { useSwipeNavigation } from "../hooks/use-swipe-navigation";

interface Props {
  children: React.ReactNode;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  className?: string;
}

export function SwipeContainer({ children, currentIndex, totalCount, onNext, onPrev, className }: Props) {
  const { handlers } = useSwipeNavigation({ onSwipeLeft: onNext, onSwipeRight: onPrev });

  return (
    <div {...handlers} tabIndex={0} className={cn("outline-none", className)}>
      {children}
      <div className="flex justify-center gap-2 mt-6 mb-4">
        {Array.from({ length: totalCount }).map((_, i) => (
          <div key={i} className={cn("w-2 h-2 rounded-full", i === currentIndex ? "bg-emerald-500" : "bg-zinc-700")} />
        ))}
      </div>
    </div>
  );
}
