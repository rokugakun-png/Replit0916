import { useState } from 'react';
import CharacterSelector from '../CharacterSelector';

export default function CharacterSelectorExample() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>();

  const mockCharacters = [
    {
      id: "1",
      name: "さくら先生",
      role: "doctor",
      personality: "どんなときでもあなたの味方。ゆっくりお話を聞かせてください。一緒に考えていきましょう。",
      avatar: ""
    },
    {
      id: "2",
      name: "ひろかさん",
      role: "therapist",
      personality: "あなたの気持ちをそのまま受け止めます。無理をしなくても大丈夫。安心してお話しください。",
      avatar: ""
    },
    {
      id: "3",
      name: "けんじさん",
      role: "consultant",
      personality: "一緒に小さな一歩を見つけましょう。答えはもうあなたの中にあります。それを一緒に見つけていきませんか？",
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