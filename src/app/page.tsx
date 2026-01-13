import { SwipeableHome } from "@/features/home/components";
import { getProgressData } from "@/features/progress/lib/progress-queries";

export default async function HomePage() {
  // Temporarily hardcoded for testing
  const cyclePosition = 0;
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  // Pre-fetch progress data for seamless swiping
  const progressData = await getProgressData("3M");

  return (
    <SwipeableHome
      cyclePosition={cyclePosition}
      currentDay={currentDay}
      progressData={progressData}
    />
  );
}
