import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, Clock, Heart, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface ChatRoom {
  id: string;
  worryId: string;
  worryTitle: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  status: "active" | "resolved" | "paused";
}

interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  todayMessage: string;
  mood: string;
  specialties: string[];
}

interface CharacterRoomsPageProps {
  characterId?: string;
}

export default function CharacterRoomsPage({ characterId = "sakura" }: CharacterRoomsPageProps) {
  const [, setLocation] = useLocation();
  
  // モックデータ
  const character: Character = {
    id: "sakura",
    name: "さくら先生",
    title: "心理カウンセラー",
    avatar: "",
    description: "臨床心理士として10年の経験。あなたの気持ちにそっと寄り添います。",
    todayMessage: "今日は暖かい一日ですね。心も軽やかに過ごしていただけたらと思います。何か気になることがあれば、いつでもお話しくださいね。",
    mood: "穏やか",
    specialties: ["人間関係", "職場の悩み", "自己肯定感"]
  };

  const chatRooms: ChatRoom[] = [
    {
      id: "room-1",
      worryId: "1",
      worryTitle: "仕事でのコミュニケーション改善",
      lastMessage: "新しいアプローチ、うまくいきそうですね。明日もお聞かせください。",
      lastMessageTime: "2時間前",
      unreadCount: 0,
      status: "active"
    },
    {
      id: "room-2", 
      worryId: "2",
      worryTitle: "健康的な生活習慣の確立",
      lastMessage: "少しずつでも変化していけば大丈夫です。焦らずに進んでいきましょう。",
      lastMessageTime: "昨日",
      unreadCount: 1,
      status: "active"
    },
    {
      id: "room-3",
      worryId: "3", 
      worryTitle: "キャリアプランの明確化",
      lastMessage: "ご自分のペースで考えていけば良いと思います。一緒に整理していきましょう。",
      lastMessageTime: "3日前",
      unreadCount: 0,
      status: "paused"
    }
  ];

  const handleBack = () => {
    setLocation('/characters');
  };

  const handleOpenChatRoom = (chatRoom: ChatRoom) => {
    setLocation(`/chat/${characterId}/${chatRoom.worryId}`);
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
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">{character.name}のお部屋</h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* キャラクタープロフィール */}
        <Card className="mb-6" data-testid="card-character-profile">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback className="bg-chart-2 text-white text-lg">
                  {character.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {character.name}
                </h3>
                <p className="text-sm text-chart-2 font-medium mb-2">
                  {character.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {character.description}
                </p>
              </div>
            </div>

            {/* 今日の気分と専門分野 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-chart-2/10 border-chart-2/20">
                <Heart className="w-3 h-3 mr-1" />
                今日の気分: {character.mood}
              </Badge>
              {character.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* 今日の一言 */}
            <div className="bg-chart-2/10 rounded-lg p-4 border border-chart-2/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-chart-2" />
                <span className="text-sm font-medium text-chart-2">今日の一言</span>
              </div>
              <p className="text-sm text-card-foreground leading-relaxed">
                {character.todayMessage}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* チャットルーム一覧 */}
        <Card data-testid="card-chat-rooms">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              あなたとのお話の場所
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chatRooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  まだお話しした悩みがありません
                </p>
                <p className="text-xs text-muted-foreground">
                  ホーム画面から「お話しする」を押してみてくださいね
                </p>
              </div>
            ) : (
              chatRooms.map((room) => (
                <Card 
                  key={room.id} 
                  className="hover-elevate cursor-pointer transition-all duration-200"
                  onClick={() => handleOpenChatRoom(room)}
                  data-testid={`card-chat-room-${room.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {room.worryTitle}
                          </h4>
                          <Badge className={`${getStatusColor(room.status)} text-xs`}>
                            {getStatusText(room.status)}
                          </Badge>
                        </div>
                        
                        {room.lastMessage && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {room.lastMessage}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{room.lastMessageTime || "まだお話ししていません"}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {room.unreadCount > 0 && (
                          <Badge className="bg-chart-3 text-white text-xs px-2 py-1">
                            {room.unreadCount}
                          </Badge>
                        )}
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* フッターメッセージ */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            どの悩みについても、いつでもお話しできます。<br />
            あなたのペースで、一緒に向き合っていきましょう。
          </p>
        </div>
      </div>
    </div>
  );
}