import { storage } from "../storage";
import type { Badge, Difficulty } from "@shared/schema";

export class GamificationService {
  // XP rewards based on difficulty
  private static readonly XP_REWARDS = {
    easy: 10,
    medium: 15,
    hard: 20
  };

  // Badge requirements
  private static readonly BADGE_REQUIREMENTS = {
    "Fast Learner": { type: "quiz_count", threshold: 10 },
    "Streak Master": { type: "streak", threshold: 7 },
    "Quiz Champion": { type: "quiz_count", threshold: 50 },
    "Knowledge Seeker": { type: "topics", threshold: 5 },
    "Perfectionist": { type: "perfect_quizzes", threshold: 10 }
  };

  static calculateXPGain(difficulty: Difficulty, isCorrect: boolean): number {
    if (!isCorrect) return 0;
    return this.XP_REWARDS[difficulty];
  }

  static async updateUserProgress(userId: string, difficulty: Difficulty, isCorrect: boolean) {
    const xpGain = this.calculateXPGain(difficulty, isCorrect);
    
    // Update XP and level
    const updatedUser = await storage.updateUserXP(userId, xpGain);
    
    // Update streak
    await storage.updateUserStreak(userId);
    
    // Check and award badges
    await this.checkAndAwardBadges(userId);
    
    return updatedUser;
  }

  static async checkAndAwardBadges(userId: string) {
    const user = await storage.getUser(userId);
    if (!user) return;

    const quizzes = await storage.getQuizzesByUser(userId);
    const completedQuizzes = quizzes.filter(q => q.isCorrect !== null);
    const correctQuizzes = quizzes.filter(q => q.isCorrect === true);

    // Fast Learner: Complete 10 quizzes
    if (completedQuizzes.length >= 10 && !user.badges.includes("Fast Learner")) {
      await storage.awardBadge(userId, "Fast Learner");
    }

    // Streak Master: 7 day streak
    if (user.streak >= 7 && !user.badges.includes("Streak Master")) {
      await storage.awardBadge(userId, "Streak Master");
    }

    // Quiz Champion: Complete 50 quizzes
    if (completedQuizzes.length >= 50 && !user.badges.includes("Quiz Champion")) {
      await storage.awardBadge(userId, "Quiz Champion");
    }

    // Knowledge Seeker: Explore 5 different topics
    const uniqueTopics = new Set(quizzes.map(q => q.topic));
    if (uniqueTopics.size >= 5 && !user.badges.includes("Knowledge Seeker")) {
      await storage.awardBadge(userId, "Knowledge Seeker");
    }

    // Perfectionist: 100% accuracy on 10 quizzes
    // For this, we'd need to track individual quiz sessions, simplified here
    const recentPerfectCount = correctQuizzes.length;
    if (recentPerfectCount >= 10 && !user.badges.includes("Perfectionist")) {
      await storage.awardBadge(userId, "Perfectionist");
    }
  }
}
