"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function ProgressSwipeWrapper({ children }: Props) {
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SWIPE_THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchEndX.current - touchStartX.current;
    // Swipe right (positive diff) → go back to Home
    if (diff > SWIPE_THRESHOLD) {
      router.push("/");
    }
  };

  return (
    <div
      className="min-h-screen relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe hint - left edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-600 pl-2 z-10">
        <ChevronRight className="w-5 h-5 animate-pulse" />
        <span className="text-xs uppercase tracking-wider -rotate-90 origin-right -translate-x-4">Home</span>
      </div>

      {children}
    </div>
  );
}
