import { getUserSettings } from "@/features/settings/actions/settings-actions";
import {
  ProfileSection,
  PreferencesSection,
  NotificationsSection,
  DataSection,
} from "@/features/settings/components";
import { PageHeader } from "@/shared/components/page-header";

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <main className="min-h-screen bg-zinc-950 pb-12">
      <PageHeader title="SETTINGS" backHref="/" />

      <div className="px-6 space-y-6">
        <ProfileSection />
        <PreferencesSection settings={settings} />
        <NotificationsSection settings={settings} />
        <DataSection />

        <button className="w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl">
          SIGN OUT
        </button>

        <p className="text-center text-zinc-500 text-sm">App Version 1.0.0</p>
      </div>
    </main>
  );
}
