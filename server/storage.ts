import { type User, type InsertUser, type Quiz, type InsertQuiz, type ChatMessage, type InsertChatMessage, type Badge } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizzesByUser(userId: string): Promise<Quiz[]>;
  getQuizById(id: string): Promise<Quiz | undefined>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByUser(userId: string): Promise<ChatMessage[]>;
  
  // Gamification operations
  updateUserXP(userId: string, xpGain: number): Promise<User>;
  updateUserStreak(userId: string): Promise<User>;
  awardBadge(userId: string, badge: Badge): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizzes: Map<string, Quiz>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.chatMessages = new Map();
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create a demo user for testing
    const demoUserId = "demo-user-1";
    const demoUser: User = {
      id: demoUserId,
      username: "demo",
      password: "demo",
      xp: 1250,
      level: 13,
      streak: 7,
      lastActiveDate: new Date(),
      badges: ["Fast Learner", "Streak Master"]
    };
    this.users.set(demoUserId, demoUser);

    // Add some other users for leaderboard
    const otherUsers = [
      { username: "alex", xp: 2100, level: 21, streak: 12, badges: ["Fast Learner", "Streak Master", "Quiz Champion"] },
      { username: "sarah", xp: 1850, level: 19, streak: 5, badges: ["Fast Learner", "Knowledge Seeker"] },
      { username: "mike", xp: 1450, level: 15, streak: 3, badges: ["Fast Learner"] },
      { username: "emma", xp: 980, level: 10, streak: 8, badges: ["Streak Master"] },
    ];

    otherUsers.forEach((userData) => {
      const id = randomUUID();
      this.users.set(id, {
        id,
        password: "demo",
        lastActiveDate: new Date(),
        ...userData
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null,
      badges: []
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = {
      ...insertQuiz,
      id,
      userAnswer: insertQuiz.userAnswer ?? null,
      isCorrect: insertQuiz.isCorrect ?? null,
      timestamp: new Date()
    };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getQuizzesByUser(userId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter(quiz => quiz.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatMessagesByUser(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async updateUserXP(userId: string, xpGain: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const newXP = user.xp + xpGain;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    const updatedUser = {
      ...user,
      xp: newXP,
      level: newLevel
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStreak(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    let newStreak = user.streak;
    
    if (!lastActive || lastActive.getTime() < today.getTime() - 86400000) {
      // Last active more than 1 day ago, reset streak
      newStreak = 1;
    } else if (lastActive.getTime() === today.getTime() - 86400000) {
      // Last active yesterday, increment streak
      newStreak = user.streak + 1;
    }
    // If last active today, keep same streak

    const updatedUser = {
      ...user,
      streak: newStreak,
      lastActiveDate: new Date()
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async awardBadge(userId: string, badge: Badge): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.badges.includes(badge)) {
      return user; // Already has this badge
    }

    const updatedUser = {
      ...user,
      badges: [...user.badges, badge]
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
