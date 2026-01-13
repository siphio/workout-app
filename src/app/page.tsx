import { HomeView } from "@/features/home/components";
import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

export default async function HomePage() {
  // Temporarily hardcoded for testing
  const cyclePosition = 0;
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  return (
    <>
      <HomeView cyclePosition={cyclePosition} currentDay={currentDay} />
      <BottomTabBar />
    </>
  );
}
