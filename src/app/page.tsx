"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Temporarily hardcoded for testing
  const cyclePosition = 0;
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  const SWIPE_THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    // Swipe left (positive diff) → go to Progress
    if (diff > SWIPE_THRESHOLD) {
      router.push("/progress");
    }
  };

  return (
    <main
      className="min-h-screen bg-zinc-950 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero Background - Full screen with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/30">
        {/* Geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[15%] w-40 h-40 bg-zinc-800/60 rotate-45 rounded-sm" />
          <div className="absolute top-[25%] right-[20%] w-32 h-32 bg-emerald-900/40 rotate-12 rounded-sm" />
          <div className="absolute top-[45%] left-[35%] w-24 h-24 bg-zinc-800/40 -rotate-12 rounded-sm" />
        </div>
      </div>

      {/* Swipe hint - right edge */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-600 pr-2">
        <ChevronLeft className="w-5 h-5 animate-pulse" />
        <span className="text-xs uppercase tracking-wider rotate-90 origin-left translate-x-4">Progress</span>
      </div>

      {/* Floating Bottom Card */}
      <div className="absolute bottom-8 left-4 right-4">
        <div className="bg-zinc-900/95 backdrop-blur-xl rounded-[32px] px-7 pt-4 pb-8 shadow-2xl border border-zinc-800/50">
          {/* Pill Handle */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
          </div>

          <p className="text-zinc-400 text-lg mb-2">Hello, it&apos;s</p>

          <h1 className="text-[44px] font-bold text-white tracking-tight mb-1">
            {currentDay} DAY
          </h1>

          <p className="text-2xl font-semibold text-emerald-500 mb-8">
            Marley
          </p>

          <a
            href="/workout"
            className="flex items-center justify-center w-full bg-white text-zinc-950 text-lg font-semibold py-5 px-6 rounded-2xl hover:bg-zinc-100 active:scale-[0.98] transition-all min-h-[64px]"
          >
            START WORKOUT &nbsp;→
          </a>

          {/* Cycle Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {[0, 1, 2, 3].map((position) => (
              <div
                key={position}
                className={`w-3 h-3 rounded-full transition-colors ${
                  position === cyclePosition
                    ? "bg-emerald-500"
                    : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
