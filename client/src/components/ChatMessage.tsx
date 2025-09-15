import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Brain, Lightbulb } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isFromUser: boolean;
    timestamp: string;
    characterName?: string;
    characterRole?: string;
    characterAvatar?: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "doctor":
        return <Heart className="w-3 h-3" />;
      case "therapist":
        return <Brain className="w-3 h-3" />;
      case "consultant":
        return <Lightbulb className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getRoleText = (role?: string) => {
    switch (role) {
      case "doctor":
        return "主治医";
      case "therapist":
        return "セラピスト";
      case "consultant":
        return "コンサルタント";
      default:
        return "アドバイザー";
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "doctor":
        return "bg-chart-2 text-white";
      case "therapist":
        return "bg-chart-1 text-white";
      case "consultant":
        return "bg-chart-3 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (message.isFromUser) {
    return (
      <div className="flex justify-end mb-4" data-testid={`message-user-${message.id}`}>
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="flex-1">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid={`text-user-content-${message.id}`}>
                  {message.content}
                </p>
              </CardContent>
            </Card>
            <div className="text-xs text-muted-foreground mt-1 text-right" data-testid={`text-user-timestamp-${message.id}`}>
              {message.timestamp}
            </div>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              あ
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4" data-testid={`message-character-${message.id}`}>
      <div className="flex items-start gap-3 max-w-[80%]">
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.characterAvatar} alt={message.characterName} />
          <AvatarFallback className="bg-card text-card-foreground text-xs">
            {message.characterName?.charAt(0) || "A"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground" data-testid={`text-character-name-${message.id}`}>
              {message.characterName}
            </span>
            {message.characterRole && (
              <Badge size="sm" className={getRoleColor(message.characterRole)} data-testid={`badge-character-role-${message.id}`}>
                {getRoleIcon(message.characterRole)}
                <span className="ml-1">{getRoleText(message.characterRole)}</span>
              </Badge>
            )}
          </div>
          
          <Card className="bg-card">
            <CardContent className="p-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-card-foreground" data-testid={`text-character-content-${message.id}`}>
                {message.content}
              </p>
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground mt-1" data-testid={`text-character-timestamp-${message.id}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}