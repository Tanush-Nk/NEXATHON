import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-display font-bold text-foreground" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs ${trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
