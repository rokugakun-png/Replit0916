import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MoreVertical, Heart } from "lucide-react";
import { useLocation } from "wouter";

interface ChatMessage {
  id: string;
  sender: "user" | "character";
  content: string;
  timestamp: string;
  type: "text" | "suggestion";
}

interface Worry {
  id: string;
  title: string;
  status: "active" | "resolved" | "paused";
}

interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

interface IndividualChatPageProps {
  characterId?: string;
  worryId?: string;
}

export default function IndividualChatPage({ 
  characterId = "sakura", 
  worryId = "1" 
}: IndividualChatPageProps) {
  const [newMessage, setNewMessage] = useState("");
  const [, setLocation] = useLocation();

  // モックデータ
  const characters: Record<string, Character> = {
    sakura: {
      id: "sakura",
      name: "さくら先生",
      title: "心理カウンセラー",
      avatar: ""
    },
    doctor: {
      id: "doctor", 
      name: "田中医師",
      title: "精神科医",
      avatar: ""
    },
    consultant: {
      id: "consultant",
      name: "佐藤コンサルタント",
      title: "キャリアコンサルタント", 
      avatar: ""
    }
  };

  const worries: Record<string, Worry> = {
    "1": {
      id: "1",
      title: "仕事でのコミュニケーション改善",
      status: "active"
    },
    "2": {
      id: "2",
      title: "健康的な生活習慣の確立",
      status: "active"
    },
    "3": {
      id: "3",
      title: "キャリアプランの明確化",
      status: "paused"
    }
  };

  const character = characters[characterId] || characters.sakura;
  const worry = worries[worryId] || worries["1"];

  // 悩みとキャラクターごとの初期メッセージ
  const getInitialMessages = (worryId: string, characterId: string): ChatMessage[] => {
    const chatKey = `${characterId}:${worryId}`;
    
    const messageTemplates: Record<string, ChatMessage[]> = {
      "sakura:1": [
        {
          id: "1",
          sender: "character",
          content: "こんにちは！今日も一日お疲れ様でした。お仕事でのコミュニケーションについて、何か気になることはありましたか？",
          timestamp: "14:30",
          type: "text"
        },
        {
          id: "2",
          sender: "user", 
          content: "同僚との会話がうまくいかなくて悩んでいます。自分の意見を伝えるのが苦手で...",
          timestamp: "14:32",
          type: "text"
        },
        {
          id: "3",
          sender: "character",
          content: "そうでしたか。ご自分の気持ちを相手に伝えるのは、とても勇気のいることですよね。どんな場面で特に難しさを感じられますか？",
          timestamp: "14:35",
          type: "text"
        }
      ],
      "sakura:2": [
        {
          id: "1",
          sender: "character",
          content: "健康的な生活習慣について、今日はいかがでしたか？小さな変化でも、ぜひお聞かせください。",
          timestamp: "15:20",
          type: "text"
        },
        {
          id: "2",
          sender: "user",
          content: "昨日は早めに寝るつもりだったのですが、結局遅くなってしまいました...",
          timestamp: "15:22",
          type: "text"
        }
      ],
      "sakura:3": [
        {
          id: "1",
          sender: "character",
          content: "キャリアプランについて、最近何か新しく考えたことはありますか？",
          timestamp: "16:10",
          type: "text"
        }
      ]
    };

    return messageTemplates[chatKey] || [
      {
        id: "1",
        sender: "character",
        content: `${worry.title}について、今日はいかがでしたか？何かお話ししたいことがあれば、ぜひお聞かせください。`,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      }
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages(worryId, characterId));

  const handleBack = () => {
    setLocation(`/chat/${characterId}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      type: "text"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // シミュレート：キャラクターからの返信
    setTimeout(() => {
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "character",
        content: "ありがとうございます。そのお気持ち、とてもよく分かります。一歩ずつ進んでいきましょうね。",
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setMessages(prev => [...prev, characterResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2 text-white";
      case "resolved": 
        return "bg-chart-1 text-white";
      case "paused":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "お話し中";
      case "resolved":
        return "解決済み";
      case "paused":
        return "休止中";
      default:
        return "不明";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback className="bg-chart-2 text-white text-sm">
                  {character.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-foreground text-sm truncate">
                  {character.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {character.title}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
          
          {/* 悩みのタイトルとステータス */}
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-foreground flex-1 truncate">
              {worry.title}
            </h3>
            <Badge className={`${getStatusColor(worry.status)} text-xs`}>
              {getStatusText(worry.status)}
            </Badge>
          </div>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.id}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'character' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={character.avatar} alt={character.name} />
                      <AvatarFallback className="bg-chart-2 text-white text-xs">
                        {character.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{character.name}</span>
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-chart-2 text-white'
                      : message.type === 'suggestion'
                      ? 'bg-chart-1/10 border border-chart-1/20'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'suggestion' && (
                    <div className="flex items-center gap-1 mb-2 text-chart-1">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs font-medium">提案</span>
                    </div>
                  )}
                  
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${
                    message.sender === 'user' 
                      ? 'text-white' 
                      : 'text-foreground'
                  }`}>
                    {message.content}
                  </p>
                </div>
                
                <div className={`text-xs text-muted-foreground mt-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 入力エリア */}
      <div className="sticky bottom-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              className="flex-1"
              data-testid="input-message"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              あなたのペースで、ゆっくりお話ししましょう
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}