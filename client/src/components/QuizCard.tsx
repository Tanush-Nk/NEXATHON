import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Difficulty } from "@shared/schema";

interface QuizCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onSkip?: () => void;
}

export function QuizCard({ question, options, correctAnswer, difficulty, onAnswer, onSkip }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === correctAnswer;
    setHasAnswered(true);
    onAnswer(selectedAnswer, isCorrect);
  };

  const difficultyColors = {
    easy: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    hard: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="card-quiz">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={difficultyColors[difficulty]} data-testid={`badge-${difficulty}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground leading-tight">
          {question}
        </h2>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === correctAnswer;
          const showResult = hasAnswered;
          
          let buttonVariant: "outline" | "default" = "outline";
          let buttonClass = "min-h-[56px] justify-start text-left whitespace-normal h-auto";
          
          if (showResult) {
            if (isCorrectOption) {
              buttonClass += " border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
            } else if (isSelected && !isCorrectOption) {
              buttonClass += " border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
            }
          } else if (isSelected) {
            buttonVariant = "default";
          }

          return (
            <Button
              key={index}
              variant={buttonVariant}
              className={buttonClass}
              onClick={() => !hasAnswered && setSelectedAnswer(option)}
              disabled={hasAnswered}
              data-testid={`button-option-${index}`}
            >
              <div className="flex items-center justify-between w-full gap-4">
                <span className="flex-1">{option}</span>
                {showResult && isCorrectOption && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {showResult && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 flex-shrink-0" />}
              </div>
            </Button>
          );
        })}
      </CardContent>
      
      <CardFooter className="flex gap-4 justify-between">
        {onSkip && !hasAnswered && (
          <Button variant="outline" onClick={onSkip} data-testid="button-skip">
            Skip
          </Button>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedAnswer || hasAnswered}
          className="ml-auto"
          data-testid="button-submit"
        >
          {hasAnswered ? "Answered" : "Submit Answer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
