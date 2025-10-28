import { StatCard } from "../StatCard";
import { Award, Target, Flame, BookOpen } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard 
        title="Total XP" 
        value="1,250" 
        icon={Award}
        trend={{ value: 12, label: "this week" }}
      />
      <StatCard 
        title="Accuracy" 
        value="87%" 
        icon={Target}
        trend={{ value: 5, label: "improvement" }}
      />
      <StatCard 
        title="Streak" 
        value="7 days" 
        icon={Flame}
      />
      <StatCard 
        title="Quizzes Completed" 
        value="42" 
        icon={BookOpen}
        trend={{ value: 23, label: "this month" }}
      />
    </div>
  );
}
