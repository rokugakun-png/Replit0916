import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 悩み（Worry）テーブル
export const worries = pgTable("worries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, resolved, paused
  progress: integer("progress").notNull().default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 目標（Goal）テーブル
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  worryId: varchar("worry_id").notNull().references(() => worries.id),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// タスク（Task）テーブル
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  worryId: varchar("worry_id").notNull().references(() => worries.id),
  goalId: varchar("goal_id").references(() => goals.id),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AIキャラクター（Character）テーブル
export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // doctor, consultant, therapist
  personality: text("personality").notNull(),
  avatar: text("avatar"),
  systemPrompt: text("system_prompt").notNull(),
});

// チャットメッセージ（ChatMessage）テーブル
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  worryId: varchar("worry_id").notNull().references(() => worries.id),
  characterId: varchar("character_id").notNull().references(() => characters.id),
  content: text("content").notNull(),
  isFromUser: boolean("is_from_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// 進捗記録（ProgressRecord）テーブル
export const progressRecords = pgTable("progress_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  worryId: varchar("worry_id").notNull().references(() => worries.id),
  mood: integer("mood"), // 1-10
  progress: integer("progress"), // 0-100
  notes: text("notes"),
  date: timestamp("date").defaultNow(),
});

// 週次レポート（WeeklyReport）テーブル
export const weeklyReports = pgTable("weekly_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekStart: timestamp("week_start").notNull(),
  weekEnd: timestamp("week_end").notNull(),
  data: jsonb("data").notNull(), // グラフ用データを保存
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertWorrySchema = createInsertSchema(worries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertProgressRecordSchema = createInsertSchema(progressRecords).omit({
  id: true,
  date: true,
});

// Types
export type Worry = typeof worries.$inferSelect;
export type InsertWorry = z.infer<typeof insertWorrySchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ProgressRecord = typeof progressRecords.$inferSelect;
export type InsertProgressRecord = z.infer<typeof insertProgressRecordSchema>;

export type WeeklyReport = typeof weeklyReports.$inferSelect;