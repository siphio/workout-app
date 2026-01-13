"use client";

import { useState, useRef } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SetInput } from "./set-input";
import type { SetState, PreviousSet } from "@/shared/types";

interface Props {
  set: SetState;
  previousSet?: PreviousSet;
  isActive: boolean;
  onWeightChange: (value: number | null) => void;
  onRepsChange: (value: number | null) => void;
  onComplete: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function SetRow({ set, previousSet, isActive, onWeightChange, onRepsChange, onComplete, onDelete, canDelete = true }: Props) {
  const isCompleted = set.isCompleted;
  const isUpcoming = !isCompleted && !isActive;
  const previousDisplay = previousSet ? `${previousSet.weight} × ${previousSet.reps}` : "—";
  const canComplete = set.weight !== null && set.reps !== null && !isCompleted;

  // Swipe state
  const [translateX, setTranslateX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const DELETE_THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canDelete) return;
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    // Only allow swiping left (positive diff), cap at DELETE_THRESHOLD
    const newTranslate = Math.max(0, Math.min(diff, DELETE_THRESHOLD));
    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    if (translateX >= DELETE_THRESHOLD * 0.8) {
      // Keep open to show delete button
      setTranslateX(DELETE_THRESHOLD);
      setIsDeleting(true);
    } else {
      // Snap back
      setTranslateX(0);
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setTranslateX(0);
    setIsDeleting(false);
  };

  const handleCloseSwipe = () => {
    setTranslateX(0);
    setIsDeleting(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
      {/* Delete button background */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 flex items-center justify-center bg-red-500 transition-opacity",
          translateX > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{ width: DELETE_THRESHOLD }}
      >
        <button
          onClick={handleDelete}
          className="w-full h-full flex items-center justify-center"
          aria-label="Delete set"
        >
          <Trash2 className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main row content */}
      <div
        className={cn(
          "grid grid-cols-[40px_1fr_1fr_1fr_48px] gap-2 items-center py-3 px-1 rounded-lg bg-zinc-950 transition-transform",
          isActive && "border-l-4 border-emerald-500 bg-zinc-800/60 -ml-1 pl-3"
        )}
        style={{ transform: `translateX(-${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={isDeleting ? handleCloseSwipe : undefined}
      >
        {/* Set number */}
        <span className={cn(
          "text-base font-medium",
          isCompleted && "text-white",
          isActive && "text-white",
          isUpcoming && "text-zinc-500"
        )}>
          {set.setNumber}
        </span>

        {/* Previous */}
        <span className={cn(
          "text-sm text-center",
          isCompleted ? "text-zinc-300" : "text-zinc-400"
        )}>
          {previousDisplay}
        </span>

        {/* Weight */}
        {isActive ? (
          <SetInput value={set.weight} onChange={onWeightChange} autoFocus className="h-11" />
        ) : (
          <div className={cn(
            "text-center text-base",
            isCompleted && "text-white font-medium",
            isUpcoming && "text-zinc-500"
          )}>
            {set.weight ?? "—"}
          </div>
        )}

        {/* Reps */}
        {isActive ? (
          <SetInput value={set.reps} onChange={onRepsChange} className="h-11" />
        ) : (
          <div className={cn(
            "text-center text-base",
            isCompleted && "text-white font-medium",
            isUpcoming && "text-zinc-500"
          )}>
            {set.reps ?? "—"}
          </div>
        )}

        {/* Complete button */}
        <div className="flex justify-center">
          {isCompleted ? (
            <div className="w-11 h-11 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
          ) : isActive && canComplete ? (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(); }}
              className="w-11 h-11 flex items-center justify-center"
            >
              <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
              </div>
            </button>
          ) : (
            <div className="w-11 h-11 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-zinc-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
