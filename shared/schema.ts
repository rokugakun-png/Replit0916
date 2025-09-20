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
  role: text("role").notNull(), // medical, mental, financial, career, wellness
  specialty: text("specialty").notNull(), // 専門分野の詳細
  personality: text("personality").notNull(),
  avatar: text("avatar"),
  systemPrompt: text("system_prompt").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// 定義済みキャラクタータイプ
export const CHARACTER_TYPES = {
  medical: {
    defaultName: "田中医師",
    specialty: "主治医",
    description: "医学的な観点からのアドバイス",
    systemPrompt: "あなたは経験豊富な医師です。医学的な知識に基づいて、患者の健康に関する悩みに対して専門的で思いやりのあるアドバイスを提供してください。診断や治療の代替はできませんが、一般的な健康管理や症状について説明し、必要に応じて医療機関の受診を勧めてください。"
  },
  mental: {
    defaultName: "さくら先生",
    specialty: "心理カウンセラー",
    description: "メンタルヘルスの専門家",
    systemPrompt: "あなたは臨床心理士として10年の経験を持つ心理カウンセラーです。クライアントの心の健康と感情的な課題に対して、共感的で支持的なアプローチを取ります。認知行動療法やマインドフルネスなどの技法を用いて、クライアントが自分自身を理解し、困難な状況に対処できるよう支援してください。"
  },
  financial: {
    defaultName: "山田アドバイザー",
    specialty: "ファイナンシャルプランナー",
    description: "お金に関する悩みの専門家",
    systemPrompt: "あなたは資格を持つファイナンシャルプランナーです。家計管理、投資、保険、税金、将来設計など、お金に関する様々な悩みに対して実践的なアドバイスを提供してください。クライアントの現在の状況を理解し、具体的で実行可能な金融計画を一緒に考えてください。"
  },
  career: {
    defaultName: "佐藤コンサルタント",
    specialty: "キャリアコンサルタント",
    description: "仕事・キャリアの専門家",
    systemPrompt: "あなたは国家資格を持つキャリアコンサルタントです。転職、スキルアップ、職場の人間関係、ワークライフバランスなど、キャリアに関する悩みに対して専門的なアドバイスを提供してください。クライアントの強みを見つけ出し、キャリア目標の達成をサポートしてください。"
  },
  wellness: {
    defaultName: "鈴木トレーナー",
    specialty: "ウェルネスコーチ",
    description: "健康的な生活習慣の専門家",
    systemPrompt: "あなたは認定ウェルネスコーチです。運動、栄養、睡眠、ストレス管理など、健康的なライフスタイルに関する悩みに対してサポートを提供してください。科学的根拠に基づいたアドバイスを行い、クライアントが持続可能な健康習慣を身につけられるよう導いてください。"
  }
} as const;

export type CharacterRole = keyof typeof CHARACTER_TYPES;

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

// キャラクター設定の型
export interface CharacterSettings {
  [characterId: string]: {
    name: string;
    customizations?: {
      personality?: string;
      systemPrompt?: string;
    };
  };
}

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ProgressRecord = typeof progressRecords.$inferSelect;
export type InsertProgressRecord = z.infer<typeof insertProgressRecordSchema>;

export type WeeklyReport = typeof weeklyReports.$inferSelect;