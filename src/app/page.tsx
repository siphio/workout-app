import { SwipeableHome } from "@/features/home/components";
import { getProgressData } from "@/features/progress/lib/progress-queries";
import { getUserSettings } from "@/features/settings/actions/settings-actions";

export default async function HomePage() {
  // Temporarily hardcoded for testing
  const cyclePosition = 0;
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  // Pre-fetch all data for seamless swiping
  const [progressData, userSettings] = await Promise.all([
    getProgressData("3M"),
    getUserSettings(),
  ]);

  return (
    <SwipeableHome
      cyclePosition={cyclePosition}
      currentDay={currentDay}
      progressData={progressData}
      userSettings={userSettings}
    />
  );
}
