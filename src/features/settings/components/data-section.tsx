"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { clearAllData } from "../actions/settings-actions";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}

export function DataSection({ className }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsClearing(true);
    try {
      await clearAllData();
      setShowConfirm(false);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
        DATA
      </h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <button className="flex items-center justify-between px-5 py-4 w-full">
          <span className="text-white">Export Workout Data</span>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
        <button
          onClick={handleClearData}
          disabled={isClearing}
          className="flex items-center justify-between px-5 py-4 w-full"
        >
          <span className={showConfirm ? "text-red-500 font-semibold" : "text-red-500"}>
            {showConfirm ? "Tap again to confirm" : "Clear All Data"}
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
