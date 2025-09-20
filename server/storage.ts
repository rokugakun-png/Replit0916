import { 
  type Character, 
  type InsertCharacter, 
  type CharacterSettings, 
  CHARACTER_TYPES,
  type CharacterRole 
} from "@shared/schema";
import { randomUUID } from "crypto";

// ストレージインターフェース
export interface IStorage {
  // キャラクター管理
  getCharacter(id: string): Promise<Character | undefined>;
  getAllCharacters(): Promise<Character[]>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, updates: Partial<Character>): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<boolean>;
  
  // キャラクター設定管理
  getCharacterSettings(): Promise<CharacterSettings>;
  updateCharacterSettings(settings: CharacterSettings): Promise<void>;
}

export class MemStorage implements IStorage {
  private characters: Map<string, Character>;
  private characterSettings: CharacterSettings;

  constructor() {
    this.characters = new Map();
    this.characterSettings = {};
    this.initializeDefaultCharacters();
  }

  // デフォルトキャラクターを初期化
  private initializeDefaultCharacters() {
    Object.entries(CHARACTER_TYPES).forEach(([role, config], index) => {
      const id = randomUUID();
      const character: Character = {
        id,
        name: config.defaultName,
        role: role as CharacterRole,
        specialty: config.specialty,
        personality: config.description,
        avatar: null,
        systemPrompt: config.systemPrompt,
        isDefault: true,
        sortOrder: index
      };
      this.characters.set(id, character);
      
      // キャラクター設定も初期化
      this.characterSettings[id] = {
        name: config.defaultName
      };
    });
  }

  // キャラクター管理メソッド
  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const character: Character = {
      id,
      name: insertCharacter.name,
      role: insertCharacter.role,
      specialty: insertCharacter.specialty,
      personality: insertCharacter.personality,
      avatar: insertCharacter.avatar ?? null,
      systemPrompt: insertCharacter.systemPrompt,
      isDefault: insertCharacter.isDefault ?? false,
      sortOrder: insertCharacter.sortOrder ?? 999
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;
    
    const updatedCharacter = { ...character, ...updates };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    return this.characters.delete(id);
  }

  // キャラクター設定管理メソッド
  async getCharacterSettings(): Promise<CharacterSettings> {
    return this.characterSettings;
  }

  async updateCharacterSettings(settings: CharacterSettings): Promise<void> {
    this.characterSettings = { ...this.characterSettings, ...settings };
  }
}

export const storage = new MemStorage();
