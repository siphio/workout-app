"use client";

import Link from "next/link";

interface Props {
  cyclePosition: number;
  currentDay: string;
}

export function HomeView({ cyclePosition, currentDay }: Props) {
  return (
    <div className="h-full bg-zinc-950 relative overflow-hidden">
      {/* Hero Background - Full screen with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/30">
        {/* Geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[15%] w-40 h-40 bg-zinc-800/60 rotate-45 rounded-sm" />
          <div className="absolute top-[25%] right-[20%] w-32 h-32 bg-emerald-900/40 rotate-12 rounded-sm" />
          <div className="absolute top-[45%] left-[35%] w-24 h-24 bg-zinc-800/40 -rotate-12 rounded-sm" />
        </div>
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

          <Link
            href="/workout"
            className="flex items-center justify-center w-full bg-white text-zinc-950 text-lg font-semibold py-5 px-6 rounded-2xl hover:bg-zinc-100 active:scale-[0.98] transition-all min-h-[64px] touch-manipulation"
          >
            START WORKOUT &nbsp;→
          </Link>

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
    </div>
  );
}
