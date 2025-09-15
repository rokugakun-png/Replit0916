import { useState } from 'react';
import CharacterSelector from '../CharacterSelector';

export default function CharacterSelectorExample() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>();

  const mockCharacters = [
    {
      id: "1",
      name: "田中先生",
      role: "doctor",
      personality: "優しく穏やかな性格で、患者の話をじっくりと聞いてくれる経験豊富な医師。心理的なサポートにも長けています。",
      avatar: ""
    },
    {
      id: "2",
      name: "佐藤カウンセラー",
      role: "therapist",
      personality: "共感力が高く、相談者の気持ちに寄り添いながら適切なアドバイスを提供するプロのセラピスト。",
      avatar: ""
    },
    {
      id: "3",
      name: "山田コンサル",
      role: "consultant",
      personality: "論理的で実践的なアプローチを得意とし、具体的な解決策や行動計画を一緒に考えてくれる頼れる相談相手。",
      avatar: ""
    }
  ];

  return (
    <CharacterSelector
      characters={mockCharacters}
      selectedCharacterId={selectedCharacterId}
      onSelectCharacter={(id) => {
        setSelectedCharacterId(id);
        console.log('Selected character:', id);
      }}
    />
  );
}