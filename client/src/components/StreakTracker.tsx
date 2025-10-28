import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakTrackerProps {
  currentStreak: number;
  bestStreak: number;
  activityDays?: Date[];
}

export function StreakTracker({ currentStreak, bestStreak, activityDays = [] }: StreakTrackerProps) {
  const today = new Date();
  const daysToShow = 14;
  const days = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (daysToShow - 1 - i));
    return date;
  });

  const isActiveDay = (date: Date) => {
    return activityDays.some(activeDate => 
      activeDate.toDateString() === date.toDateString()
    );
  };

  return (
    <Card data-testid="card-streak">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Flame className="w-6 h-6 text-orange-500" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-3xl font-display font-bold text-foreground" data-testid="text-current-streak">
              {currentStreak}
            </p>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-3xl font-display font-bold text-foreground" data-testid="text-best-streak">
              {bestStreak}
            </p>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Last 14 Days</p>
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const isActive = isActiveDay(date);
              const isToday = date.toDateString() === today.toDateString();
              
              return (
                <div
                  key={index}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isToday
                      ? 'border-2 border-primary bg-background'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  data-testid={`day-${index}`}
                >
                  <span className="text-[10px]">{date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
