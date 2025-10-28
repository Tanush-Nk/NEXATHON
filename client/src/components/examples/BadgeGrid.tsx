import { BadgeGrid } from "../BadgeGrid";

export default function BadgeGridExample() {
  return (
    <div className="p-8 space-y-4">
      <div>
        <h3 className="text-xl font-display font-semibold mb-4">Your Achievements</h3>
        <BadgeGrid badges={["Fast Learner", "Streak Master"]} />
      </div>
    </div>
  );
}
