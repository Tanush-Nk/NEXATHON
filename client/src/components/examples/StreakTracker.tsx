import { StreakTracker } from "../StreakTracker";

export default function StreakTrackerExample() {
  const today = new Date();
  const activityDays = [
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
  ];

  return (
    <div className="p-8 max-w-md">
      <StreakTracker 
        currentStreak={4} 
        bestStreak={12}
        activityDays={activityDays}
      />
    </div>
  );
}
