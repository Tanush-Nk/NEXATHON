import { useQuery } from "@tanstack/react-query";
import { Award, Target, Flame, BookOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { XPDisplay } from "@/components/XPDisplay";
import { BadgeGrid } from "@/components/BadgeGrid";
import { StreakTracker } from "@/components/StreakTracker";
import { ProgressChart } from "@/components/ProgressChart";
import type { Badge, User, Quiz } from "@shared/schema";

interface ProgressStats {
  user: User;
  stats: {
    totalXP: number;
    level: number;
    streak: number;
    accuracy: number;
    quizzesCompleted: number;
  };
  weeklyData: Array<{ name: string; value: number; accuracy: number }>;
  topicData: Array<{ name: string; value: number }>;
}

export default function DashboardPage() {
  const { data: progressData, isLoading } = useQuery<ProgressStats>({
    queryKey: ["/api/progress/stats"],
  });

  const { data: quizzes } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const { user, stats, weeklyData, topicData } = progressData;

  const activityDays = quizzes
    ?.map(q => new Date(q.timestamp))
    .filter((date, index, self) => 
      self.findIndex(d => d.toDateString() === date.toDateString()) === index
    ) || [];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Track your learning journey</p>
          </div>
          <XPDisplay xp={user.xp} level={user.level} size="md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total XP" 
            value={stats.totalXP.toLocaleString()} 
            icon={Award}
            trend={{ value: 12, label: "this week" }}
          />
          <StatCard 
            title="Accuracy" 
            value={`${stats.accuracy}%`} 
            icon={Target}
            trend={{ value: 5, label: "improvement" }}
          />
          <StatCard 
            title="Current Streak" 
            value={`${stats.streak} days`} 
            icon={Flame}
          />
          <StatCard 
            title="Quizzes Completed" 
            value={stats.quizzesCompleted} 
            icon={BookOpen}
            trend={{ value: 23, label: "this month" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProgressChart 
              title="Weekly Progress" 
              data={weeklyData} 
              type="line"
              showAccuracy={true}
            />
            <ProgressChart 
              title="XP by Topic" 
              data={topicData} 
              type="bar"
            />
          </div>
          
          <div className="space-y-6">
            <StreakTracker 
              currentStreak={stats.streak} 
              bestStreak={stats.streak}
              activityDays={activityDays}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Your Achievements</h2>
          <BadgeGrid badges={user.badges as Badge[]} />
        </div>
      </div>
    </div>
  );
}
