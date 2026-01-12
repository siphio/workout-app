"use client";

import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { updateUserSettings } from "../actions/settings-actions";
import type { UserSettings } from "@/shared/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  settings: UserSettings;
  className?: string;
}

export function PreferencesSection({ settings, className }: Props) {
  return (
    <div className={cn("", className)}>
      <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
        WORKOUT PREFERENCES
      </h2>
      <div className="bg-zinc-900 rounded-2xl divide-y divide-zinc-800">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Weight Unit</span>
          <Select
            defaultValue={settings.weightUnit}
            onValueChange={(v) => updateUserSettings({ weightUnit: v as "kg" | "lbs" })}
          >
            <SelectTrigger className="w-20 bg-transparent border-none text-zinc-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Default Rest Timer</span>
          <Select
            defaultValue={String(settings.defaultRestSeconds)}
            onValueChange={(v) => updateUserSettings({ defaultRestSeconds: parseInt(v) })}
          >
            <SelectTrigger className="w-20 bg-transparent border-none text-zinc-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">60s</SelectItem>
              <SelectItem value="90">90s</SelectItem>
              <SelectItem value="120">120s</SelectItem>
              <SelectItem value="180">180s</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Timer Sound</span>
          <Switch
            defaultChecked={settings.timerSoundEnabled}
            onCheckedChange={(c) => updateUserSettings({ timerSoundEnabled: c })}
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white">Vibration</span>
          <Switch
            defaultChecked={settings.vibrationEnabled}
            onCheckedChange={(c) => updateUserSettings({ vibrationEnabled: c })}
          />
        </div>
      </div>
    </div>
  );
}
