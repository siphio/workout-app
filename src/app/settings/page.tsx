import { getUserSettings } from "@/features/settings/actions/settings-actions";
import {
  ProfileSection,
  PreferencesSection,
  NotificationsSection,
  DataSection,
} from "@/features/settings/components";
import { PageHeader } from "@/shared/components/page-header";
import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <main className="h-[100dvh] bg-zinc-950 overflow-y-auto">
      <PageHeader title="Settings" />

      <div className="px-6 pb-24 space-y-6">
        <ProfileSection />
        <PreferencesSection settings={settings} />
        <NotificationsSection settings={settings} />
        <DataSection />

        <button className="w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl touch-manipulation active:bg-zinc-800">
          Sign Out
        </button>

        <p className="text-center text-zinc-500 text-sm pb-4">App Version 1.0.0</p>
      </div>

      <BottomTabBar />
    </main>
  );
}
