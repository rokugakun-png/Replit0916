import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import CharacterSelector from "@/components/CharacterSelector";

export default function ChatPage() {
  const [selectedWorryId, setSelectedWorryId] = useState<string>("1");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>();
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    isFromUser: boolean;
    timestamp: string;
    characterName?: string;
    characterRole?: string;
    characterAvatar?: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // todo: remove mock functionality
  const mockWorries = [
    { id: "1", title: "仕事でのコミュニケーション改善" },
    { id: "2", title: "健康的な生活習慣の確立" },
    { id: "3", title: "キャリアプランの明確化" }
  ];

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

  // todo: remove mock functionality
  const mockInitialMessages = [
    {
      id: "1",
      content: "こんにちは！仕事でのコミュニケーションについてご相談されたいとのことですね。まずは、どのような状況で困ることが多いか教えていただけますか？",
      isFromUser: false,
      timestamp: "14:30",
      characterName: "田中先生",
      characterRole: "doctor",
      characterAvatar: ""
    }
  ];

  const selectedWorry = mockWorries.find(w => w.id === selectedWorryId);
  const selectedCharacter = mockCharacters.find(c => c.id === selectedCharacterId);

  useEffect(() => {
    if (selectedCharacterId && messages.length === 0) {
      setMessages(mockInitialMessages);
    }
  }, [selectedCharacterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      isFromUser: true,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);

    // todo: remove mock functionality - simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: `${content}についてのご相談ありがとうございます。\n\nそのような状況でお困りなのですね。よく理解できます。具体的にどのような場面で特に難しさを感じられるでしょうか？\n\n詳しくお聞かせいただければ、より適切なアドバイスをさせていただけると思います。`,
        isFromUser: false,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        characterName: selectedCharacter?.name,
        characterRole: selectedCharacter?.role,
        characterAvatar: selectedCharacter?.avatar
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleBackToHome = () => {
    console.log('Back to home');
  };

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setShowCharacterSelector(false);
  };

  if (showCharacterSelector || !selectedCharacterId) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToHome}
                data-testid="button-back-to-home"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-medium text-foreground">
                  {selectedWorry?.title || "悩み相談"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          <CharacterSelector
            characters={mockCharacters}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={handleSelectCharacter}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHome}
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-sm font-medium text-foreground truncate">
                {selectedWorry?.title || "悩み相談"}
              </h1>
              {selectedCharacter && (
                <p className="text-xs text-muted-foreground">
                  {selectedCharacter.name}と相談中
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCharacterSelector(true)}
              data-testid="button-change-character"
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* チャットエリア */}
      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="px-4 py-4 space-y-4 min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <Card className="text-center py-8" data-testid="card-no-messages">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {selectedCharacter?.name}との会話を始めましょう
                </p>
                <p className="text-sm text-muted-foreground">
                  下のメッセージ入力欄から相談内容を送信してください
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* チャット入力 */}
      <div className="max-w-md mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="相談内容を入力してください..."
        />
      </div>
    </div>
  );
}