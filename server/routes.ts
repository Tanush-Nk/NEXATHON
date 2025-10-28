import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AIService } from "./services/aiService";
import { GamificationService } from "./services/gamification";
import type { Difficulty } from "@shared/schema";

const DEMO_USER_ID = "demo-user-1";

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoints
  app.get("/api/users/current", async (_req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users/leaderboard", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedUser = await storage.updateUser(id, updates);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/messages", async (_req, res) => {
    try {
      const messages = await storage.getChatMessagesByUser(DEMO_USER_ID);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/send", async (req, res) => {
    try {
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        userId: DEMO_USER_ID,
        role: "user",
        content
      });

      // Get conversation history
      const history = await storage.getChatMessagesByUser(DEMO_USER_ID);
      const conversationHistory = history
        .slice(-10)
        .map(msg => ({ role: msg.role as "user" | "assistant", content: msg.content }));

      // Generate AI response
      const aiResponse = await AIService.generateChatResponse(content, conversationHistory);

      // Save AI message
      const aiMessage = await storage.createChatMessage({
        userId: DEMO_USER_ID,
        role: "assistant",
        content: aiResponse
      });

      res.json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Quiz endpoints
  app.get("/api/quizzes", async (_req, res) => {
    try {
      const quizzes = await storage.getQuizzesByUser(DEMO_USER_ID);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  app.post("/api/quiz/generate", async (req, res) => {
    try {
      const { topic, difficulty } = req.body;

      if (!topic || !difficulty) {
        return res.status(400).json({ error: "Topic and difficulty are required" });
      }

      // Get user's quiz history to determine accuracy
      const userQuizzes = await storage.getQuizzesByUser(DEMO_USER_ID);
      const recentQuizzes = userQuizzes.slice(0, 10);
      const correctCount = recentQuizzes.filter(q => q.isCorrect).length;
      const accuracy = recentQuizzes.length > 0 ? (correctCount / recentQuizzes.length) * 100 : 70;

      // Adjust difficulty based on performance
      const adjustedDifficulty = AIService.adjustDifficulty(difficulty as Difficulty, accuracy);

      // Generate quiz using AI
      const generatedQuiz = await AIService.generateAdaptiveQuiz(
        topic,
        adjustedDifficulty,
        accuracy
      );

      res.json(generatedQuiz);
    } catch (error) {
      console.error("Quiz generation error:", error);
      res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { question, options, correctAnswer, userAnswer, topic, difficulty } = req.body;

      if (!question || !correctAnswer || !userAnswer || !topic || !difficulty) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const isCorrect = userAnswer === correctAnswer;

      // Save quiz result
      const quiz = await storage.createQuiz({
        userId: DEMO_USER_ID,
        topic,
        difficulty,
        question,
        options: options || [],
        correctAnswer,
        userAnswer,
        isCorrect
      });

      // Update user progress (XP, level, badges, streak)
      const updatedUser = await GamificationService.updateUserProgress(
        DEMO_USER_ID,
        difficulty as Difficulty,
        isCorrect
      );

      res.json({
        quiz,
        user: updatedUser,
        isCorrect,
        xpGained: GamificationService.calculateXPGain(difficulty as Difficulty, isCorrect)
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // Progress endpoints
  app.get("/api/progress/stats", async (_req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      const quizzes = await storage.getQuizzesByUser(DEMO_USER_ID);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const completedQuizzes = quizzes.filter(q => q.isCorrect !== null);
      const correctAnswers = quizzes.filter(q => q.isCorrect).length;
      const accuracy = completedQuizzes.length > 0 
        ? Math.round((correctAnswers / completedQuizzes.length) * 100)
        : 0;

      // Calculate weekly data
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayQuizzes = quizzes.filter(q => {
          const qDate = new Date(q.timestamp);
          return qDate.toDateString() === date.toDateString();
        });
        
        const dayCorrect = dayQuizzes.filter(q => q.isCorrect).length;
        const dayAccuracy = dayQuizzes.length > 0 ? Math.round((dayCorrect / dayQuizzes.length) * 100) : 0;
        const dayXP = dayQuizzes.reduce((sum, q) => 
          sum + GamificationService.calculateXPGain(q.difficulty as Difficulty, q.isCorrect || false), 0
        );
        
        return {
          name: dayName,
          value: dayXP,
          accuracy: dayAccuracy
        };
      });

      // Calculate topic data
      const topicMap = new Map<string, number>();
      quizzes.forEach(q => {
        const xp = GamificationService.calculateXPGain(q.difficulty as Difficulty, q.isCorrect || false);
        topicMap.set(q.topic, (topicMap.get(q.topic) || 0) + xp);
      });
      
      const topicData = Array.from(topicMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      res.json({
        user,
        stats: {
          totalXP: user.xp,
          level: user.level,
          streak: user.streak,
          accuracy,
          quizzesCompleted: completedQuizzes.length
        },
        weeklyData,
        topicData
      });
    } catch (error) {
      console.error("Progress stats error:", error);
      res.status(500).json({ error: "Failed to fetch progress stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
