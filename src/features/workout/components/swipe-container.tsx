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

export function SwipeContainer({ children, onNext, onPrev, className }: Props) {
  const { handlers } = useSwipeNavigation({ onSwipeLeft: onNext, onSwipeRight: onPrev });

  return (
    <div {...handlers} tabIndex={0} className={cn("outline-none", className)}>
      {children}
    </div>
  );
}
