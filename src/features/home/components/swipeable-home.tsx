"use client";

import { useState } from "react";
import { SwipeablePages } from "@/shared/components/swipeable-pages";
import { HomeView } from "./home-view";
import { ProgressView } from "@/features/progress/components";
import type { ProgressData } from "@/shared/types";

interface Props {
  cyclePosition: number;
  currentDay: string;
  progressData: ProgressData;
}

export function SwipeableHome({ cyclePosition, currentDay, progressData }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Page indicator dots */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentPage === index
                ? "bg-emerald-500 w-6"
                : "bg-zinc-600"
            }`}
          />
        ))}
      </div>

      <SwipeablePages
        initialPage={0}
        onPageChange={setCurrentPage}
        className="h-full"
      >
        <HomeView cyclePosition={cyclePosition} currentDay={currentDay} />
        <ProgressView data={progressData} timeRange="3M" />
      </SwipeablePages>
    </div>
  );
}
