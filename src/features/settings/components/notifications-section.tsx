"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/shared/components/ui/switch";
import { updateUserSettings } from "../actions/settings-actions";
import type { UserSettings } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from "@/shared/lib/pwa/notifications";

interface Props {
  settings: UserSettings;
  className?: string;
}

export function NotificationsSection({ settings, className }: Props) {
  const [workoutReminders, setWorkoutReminders] = useState(settings.workoutRemindersEnabled);
  const [restDayAlerts, setRestDayAlerts] = useState(settings.restDayAlertsEnabled);
  const [notificationPermission, setNotificationPermission] = useState<string>("default");
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setNotificationPermission(getNotificationPermission());
  }, []);

  const handleWorkoutRemindersChange = async (enabled: boolean) => {
    // Request permission if enabling and not yet granted
    if (enabled && notificationPermission !== "granted") {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission !== "granted") {
        // User denied - don't enable the setting
        return;
      }
    }

    setWorkoutReminders(enabled);
    await updateUserSettings({ workoutRemindersEnabled: enabled });
  };

  const handleRestDayAlertsChange = async (enabled: boolean) => {
    // Request permission if enabling and not yet granted
    if (enabled && notificationPermission !== "granted") {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission !== "granted") {
        return;
      }
    }

    setRestDayAlerts(enabled);
    await updateUserSettings({ restDayAlertsEnabled: enabled });
  };

  if (!isSupported) {
    return (
      <div className={cn("", className)}>
        <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
          NOTIFICATIONS
        </h2>
        <div className="bg-zinc-900 rounded-2xl p-5">
          <p className="text-zinc-500 text-sm">
            Notifications are not supported in this browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
        NOTIFICATIONS
      </h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <span className="text-white">Workout Reminders</span>
            {notificationPermission === "denied" && (
              <p className="text-xs text-red-500 mt-1">
                Notifications blocked in browser settings
              </p>
            )}
          </div>
          <Switch
            checked={workoutReminders}
            onCheckedChange={handleWorkoutRemindersChange}
            disabled={notificationPermission === "denied"}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <span className="text-white">Rest Day Alerts</span>
          </div>
          <Switch
            checked={restDayAlerts}
            onCheckedChange={handleRestDayAlertsChange}
            disabled={notificationPermission === "denied"}
          />
        </div>
      </div>
    </div>
  );
}
