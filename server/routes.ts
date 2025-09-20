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

  // キャラクター管理API
  
  // 全キャラクター取得
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getAllCharacters();
      res.json(characters);
    } catch (error) {
      console.error("Get characters error:", error);
      res.status(500).json({ error: "キャラクター取得でエラーが発生しました" });
    }
  });

  // 特定キャラクター取得
  app.get("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ error: "キャラクターが見つかりません" });
      }
      res.json(character);
    } catch (error) {
      console.error("Get character error:", error);
      res.status(500).json({ error: "キャラクター取得でエラーが発生しました" });
    }
  });

  // キャラクター名前更新
  app.patch("/api/characters/:id/name", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: "有効な名前が必要です" });
      }

      const updatedCharacter = await storage.updateCharacter(req.params.id, { name: name.trim() });
      if (!updatedCharacter) {
        return res.status(404).json({ error: "キャラクターが見つかりません" });
      }

      res.json(updatedCharacter);
    } catch (error) {
      console.error("Update character name error:", error);
      res.status(500).json({ error: "キャラクター名前更新でエラーが発生しました" });
    }
  });

  // キャラクター設定取得
  app.get("/api/character-settings", async (req, res) => {
    try {
      const settings = await storage.getCharacterSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get character settings error:", error);
      res.status(500).json({ error: "キャラクター設定取得でエラーが発生しました" });
    }
  });

  // キャラクター設定更新
  app.patch("/api/character-settings", async (req, res) => {
    try {
      const settings = req.body;
      await storage.updateCharacterSettings(settings);
      res.json({ success: true });
    } catch (error) {
      console.error("Update character settings error:", error);
      res.status(500).json({ error: "キャラクター設定更新でエラーが発生しました" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
