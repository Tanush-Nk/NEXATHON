import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Zap, Trophy, Star, Lock } from "lucide-react";
import type { Badge } from "@shared/schema";

interface BadgeItem {
  name: Badge | string;
  icon: typeof Award;
  earned: boolean;
  description: string;
}

interface BadgeGridProps {
  badges: Badge[];
}

const allBadges: BadgeItem[] = [
  { name: "Fast Learner", icon: Zap, earned: false, description: "Answer 10 questions in under 5 minutes" },
  { name: "Streak Master", icon: Award, earned: false, description: "Maintain a 7-day learning streak" },
  { name: "Quiz Champion", icon: Trophy, earned: false, description: "Complete 50 quizzes" },
  { name: "Knowledge Seeker", icon: Target, earned: false, description: "Explore 5 different topics" },
  { name: "Perfectionist", icon: Star, earned: false, description: "Achieve 100% accuracy on 10 quizzes" },
];

export function BadgeGrid({ badges }: BadgeGridProps) {
  const badgesWithStatus = allBadges.map(badge => ({
    ...badge,
    earned: badges.includes(badge.name as Badge)
  }));

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-4" data-testid="grid-badges">
      {badgesWithStatus.map((badge) => {
        const Icon = badge.icon;
        return (
          <Card 
            key={badge.name} 
            className={`aspect-square hover-elevate cursor-pointer ${!badge.earned ? 'opacity-50' : ''}`}
            data-testid={`card-badge-${badge.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-4 gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                badge.earned 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {badge.earned ? <Icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <p className="text-xs font-medium text-center text-foreground">{badge.name}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
