"use client";

import { ProfileSection } from "./profile-section";
import { PreferencesSection } from "./preferences-section";
import { NotificationsSection } from "./notifications-section";
import { DataSection } from "./data-section";
import { PageHeader } from "@/shared/components/page-header";
import type { UserSettings } from "@/shared/types";

interface Props {
  settings: UserSettings;
}

export function SettingsView({ settings }: Props) {
  return (
    <div className="min-h-full bg-zinc-950 pb-12">
      <PageHeader title="SETTINGS" />

      <div className="px-6 space-y-6">
        <ProfileSection />
        <PreferencesSection settings={settings} />
        <NotificationsSection settings={settings} />
        <DataSection />

        <button className="w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl touch-manipulation">
          SIGN OUT
        </button>

        <p className="text-center text-zinc-500 text-sm">App Version 1.0.0</p>
      </div>
    </div>
  );
}
