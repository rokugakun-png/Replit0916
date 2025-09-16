import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CharacterSettings {
  name: string;
  title: string;
}

interface CharacterContextType {
  character: CharacterSettings;
  updateCharacterName: (name: string) => void;
  updateCharacterTitle: (title: string) => void;
  updateCharacter: (character: CharacterSettings) => void;
  resetToDefault: () => void;
}

const defaultCharacter: CharacterSettings = {
  name: "さくら先生",
  title: "心理カウンセラー"
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<CharacterSettings>(defaultCharacter);

  // ローカルストレージからキャラクター設定を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('character-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setCharacter(parsedSettings);
      } catch (error) {
        console.error('Failed to parse character settings:', error);
      }
    }
  }, []);

  // キャラクター設定をローカルストレージに保存
  const saveToStorage = (newCharacter: CharacterSettings) => {
    localStorage.setItem('character-settings', JSON.stringify(newCharacter));
  };

  const updateCharacterName = (name: string) => {
    const newCharacter = { ...character, name };
    setCharacter(newCharacter);
    saveToStorage(newCharacter);
  };

  const updateCharacterTitle = (title: string) => {
    const newCharacter = { ...character, title };
    setCharacter(newCharacter);
    saveToStorage(newCharacter);
  };

  const updateCharacter = (newCharacter: CharacterSettings) => {
    setCharacter(newCharacter);
    saveToStorage(newCharacter);
  };

  const resetToDefault = () => {
    setCharacter(defaultCharacter);
    localStorage.removeItem('character-settings');
  };

  return (
    <CharacterContext.Provider value={{
      character,
      updateCharacterName,
      updateCharacterTitle,
      updateCharacter,
      resetToDefault
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}