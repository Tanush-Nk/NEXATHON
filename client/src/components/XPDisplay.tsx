import { Award } from "lucide-react";

interface XPDisplayProps {
  xp: number;
  level: number;
  size?: "sm" | "md" | "lg";
}

export function XPDisplay({ xp, level, size = "md" }: XPDisplayProps) {
  const nextLevelXP = level * 100;
  const currentLevelXP = (level - 1) * 100;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-40 h-40"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-4xl"
  };

  return (
    <div className="relative flex items-center justify-center" data-testid="display-xp">
      <svg className={sizeClasses[size]} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Award className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-primary mb-1`} />
        <p className={`${textSizeClasses[size]} font-display font-bold text-foreground`} data-testid="text-level">
          {level}
        </p>
        <p className="text-xs text-muted-foreground" data-testid="text-xp">
          {xp} XP
        </p>
      </div>
    </div>
  );
}
