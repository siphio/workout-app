"use client";

import { useState, useEffect, useCallback } from "react";

export function useElapsedTime(startedAt: string | null) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!startedAt || isPaused) return;
    const startTime = new Date(startedAt).getTime();

    const update = () => setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startedAt, isPaused]);

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return {
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    isPaused,
    togglePause: useCallback(() => setIsPaused((p) => !p), []),
  };
}
