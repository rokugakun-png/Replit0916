import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Character, CharacterSettings } from '@shared/schema';

interface CharactersContextType {
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
  updateCharacterName: (characterId: string, name: string) => Promise<void>;
  getCharacterName: (characterId: string) => string;
  getCharacterById: (characterId: string) => Character | undefined;
}

const CharactersContext = createContext<CharactersContextType | undefined>(undefined);

export function CharactersProvider({ children }: { children: ReactNode }) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 全キャラクター取得
  const { 
    data: characters = [], 
    isLoading, 
    error: queryError 
  } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
    retry: 3,
    retryDelay: 1000,
  });

  // 最初のキャラクターを選択状態にする
  useEffect(() => {
    if (characters.length > 0 && !selectedCharacterId) {
      setSelectedCharacterId(characters[0].id);
    }
  }, [characters, selectedCharacterId]);

  // キャラクター名前更新
  const updateCharacterNameMutation = useMutation({
    mutationFn: async ({ characterId, name }: { characterId: string, name: string }) => {
      return apiRequest('PATCH', `/api/characters/${characterId}/name`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
    },
  });

  const updateCharacterName = async (characterId: string, name: string) => {
    await updateCharacterNameMutation.mutateAsync({ characterId, name });
  };

  const getCharacterName = (characterId: string): string => {
    const character = characters.find(c => c.id === characterId);
    return character?.name || '';
  };

  const getCharacterById = (characterId: string): Character | undefined => {
    return characters.find(c => c.id === characterId);
  };

  const error = queryError instanceof Error ? queryError.message : null;

  return (
    <CharactersContext.Provider value={{
      characters,
      isLoading,
      error,
      selectedCharacterId,
      setSelectedCharacterId,
      updateCharacterName,
      getCharacterName,
      getCharacterById,
    }}>
      {children}
    </CharactersContext.Provider>
  );
}

export function useCharacters() {
  const context = useContext(CharactersContext);
  if (context === undefined) {
    throw new Error('useCharacters must be used within a CharactersProvider');
  }
  return context;
}

// 選択されているキャラクターを取得するためのヘルパーフック
export function useSelectedCharacter() {
  const { selectedCharacterId, getCharacterById } = useCharacters();
  return selectedCharacterId ? getCharacterById(selectedCharacterId) : undefined;
}