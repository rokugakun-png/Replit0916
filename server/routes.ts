import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { suggestTasksFromConversation, analyzeMoodFromConversation } from "./ai-task-suggestion";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI task suggestion endpoint
  app.post("/api/suggest-tasks", async (req, res) => {
    try {
      const { messages, worryTitle, characterName } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "会話メッセージが必要です" });
      }

      if (!worryTitle) {
        return res.status(400).json({ error: "悩みのタイトルが必要です" });
      }

      const suggestions = await suggestTasksFromConversation(
        messages, 
        worryTitle, 
        characterName || "カウンセラー"
      );

      res.json({ suggestions });
    } catch (error) {
      console.error("Task suggestion error:", error);
      const errorMessage = error instanceof Error ? error.message : "タスク提案でエラーが発生しました";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Mood analysis endpoint
  app.post("/api/analyze-mood", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "会話メッセージが必要です" });
      }

      const moodAnalysis = await analyzeMoodFromConversation(messages);
      res.json(moodAnalysis);
    } catch (error) {
      console.error("Mood analysis error:", error);
      res.status(500).json({ 
        mood: "お疲れ様", 
        confidence: 0.5, 
        supportiveMessage: "今日もお疲れ様でした。" 
      });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
