"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  showRestCompleteNotification,
  getNotificationPermission,
} from "@/shared/lib/pwa/notifications";

interface Options {
  defaultRestSeconds: number;
  onComplete?: () => void;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  notificationsEnabled?: boolean;
}

export function useRestTimer({
  defaultRestSeconds,
  onComplete,
  soundEnabled = true,
  vibrationEnabled = true,
  notificationsEnabled = false,
}: Options) {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(defaultRestSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/timer-complete.mp3");
    }
  }, []);

  useEffect(() => {
    if (!isActive || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false);

          // Play sound
          if (soundEnabled) {
            audioRef.current?.play().catch(() => {});
          }

          // Vibrate
          if (vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }

          // Show notification (if enabled and permitted)
          if (notificationsEnabled && getNotificationPermission() === "granted") {
            showRestCompleteNotification();
          }

          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, soundEnabled, vibrationEnabled, notificationsEnabled, onComplete]);

  const start = useCallback(
    (customSeconds?: number) => {
      const s = customSeconds ?? defaultRestSeconds;
      setTotalSeconds(s);
      setRemainingSeconds(s);
      setIsActive(true);
    },
    [defaultRestSeconds]
  );

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return {
    isActive,
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    progress:
      totalSeconds > 0
        ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
        : 0,
    start,
    skip: useCallback(() => {
      setIsActive(false);
      setRemainingSeconds(0);
    }, []),
  };
}
