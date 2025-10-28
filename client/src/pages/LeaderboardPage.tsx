import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import type { User } from "@shared/schema";

export default function LeaderboardPage() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const sortedUsers = [...(users || [])].sort((a, b) => b.xp - a.xp);
  const topThree = sortedUsers.slice(0, 3);
  const restOfUsers = sortedUsers.slice(3);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-500/10 border-yellow-500/20";
    if (index === 1) return "bg-gray-400/10 border-gray-400/20";
    if (index === 2) return "bg-amber-600/10 border-amber-600/20";
    return "";
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2">Top learners on EduMentor AI</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          {topThree[1] && (
            <Card className={`${getRankColor(1)} border`} data-testid="card-rank-2">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">{getRankIcon(1)}</div>
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarFallback className="text-lg font-semibold bg-secondary text-secondary-foreground">
                    {topThree[1].username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{topThree[1].username}</p>
                  <p className="text-sm text-muted-foreground">Level {topThree[1].level}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xl font-display font-bold text-primary">
                    {topThree[1].xp.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <Card className={`${getRankColor(0)} border transform scale-105`} data-testid="card-rank-1">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">{getRankIcon(0)}</div>
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {topThree[0].username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg text-foreground">{topThree[0].username}</p>
                  <p className="text-sm text-muted-foreground">Level {topThree[0].level}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-display font-bold text-primary">
                    {topThree[0].xp.toLocaleString()}
                  </span>
                </div>
                {topThree[0].badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {topThree[0].badges.slice(0, 3).map((badge, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <Card className={`${getRankColor(2)} border`} data-testid="card-rank-3">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="flex justify-center">{getRankIcon(2)}</div>
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarFallback className="text-lg font-semibold bg-secondary text-secondary-foreground">
                    {topThree[2].username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{topThree[2].username}</p>
                  <p className="text-sm text-muted-foreground">Level {topThree[2].level}</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xl font-display font-bold text-primary">
                    {topThree[2].xp.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rest of Rankings */}
        {restOfUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {restOfUsers.map((user, index) => {
                const actualRank = index + 4;
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover-elevate border border-border"
                    data-testid={`row-rank-${actualRank}`}
                  >
                    <div className="w-12 text-center">
                      <span className="text-lg font-display font-bold text-muted-foreground">
                        #{actualRank}
                      </span>
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="font-semibold bg-accent text-accent-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">Level {user.level}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-display font-bold text-foreground">
                        {user.xp.toLocaleString()}
                      </span>
                    </div>
                    {user.streak > 0 && (
                      <Badge variant="outline" className="gap-1">
                        🔥 {user.streak}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
