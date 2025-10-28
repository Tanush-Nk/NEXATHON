import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastActiveDate: timestamp("last_active_date"),
  badges: text("badges").array().notNull().default(sql`ARRAY[]::text[]`),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  topic: text("topic").notNull(),
  difficulty: text("difficulty").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  timestamp: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Difficulty = "easy" | "medium" | "hard";
export type Badge = "Fast Learner" | "Streak Master" | "Quiz Champion" | "Knowledge Seeker" | "Perfectionist";
