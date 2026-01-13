"use client";

import { useState } from "react";
import { SwipeablePages } from "@/shared/components/swipeable-pages";
import { HomeView } from "./home-view";
import { ProgressView } from "@/features/progress/components";
import { SettingsView } from "@/features/settings/components";
import type { ProgressData, UserSettings } from "@/shared/types";

interface Props {
  cyclePosition: number;
  currentDay: string;
  progressData: ProgressData;
  userSettings: UserSettings;
}

const PAGE_LABELS = ["Home", "Progress", "Settings"];

export function SwipeableHome({ cyclePosition, currentDay, progressData, userSettings }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="h-[100dvh] w-screen overflow-hidden">
      {/* Page indicator */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        {/* Page label */}
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {PAGE_LABELS[currentPage]}
        </span>
        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === index
                  ? "bg-emerald-500 w-6"
                  : "bg-zinc-600 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      <SwipeablePages
        initialPage={0}
        onPageChange={setCurrentPage}
        className="h-full"
      >
        <HomeView cyclePosition={cyclePosition} currentDay={currentDay} />
        <ProgressView data={progressData} timeRange="3M" />
        <SettingsView settings={userSettings} />
      </SwipeablePages>
    </div>
  );
}
