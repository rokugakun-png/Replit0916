import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Heart, Brain, Lightbulb } from "lucide-react";

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  avatar?: string;
}

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacterId?: string;
  onSelectCharacter: (characterId: string) => void;
}

export default function CharacterSelector({ characters, selectedCharacterId, onSelectCharacter }: CharacterSelectorProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "doctor":
        return <Heart className="w-4 h-4" />;
      case "therapist":
        return <Brain className="w-4 h-4" />;
      case "consultant":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleText = (role: string) => {
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

  const getRoleColor = (role: string) => {
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

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-foreground mb-4">相談相手を選択</h3>
      <div className="grid gap-3">
        {characters.map((character) => (
          <Card 
            key={character.id}
            className={`hover-elevate cursor-pointer transition-all ${
              selectedCharacterId === character.id 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                : ''
            }`}
            onClick={() => onSelectCharacter(character.id)}
            data-testid={`card-character-${character.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {character.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-card-foreground" data-testid={`text-character-name-${character.id}`}>
                      {character.name}
                    </h4>
                    <Badge className={getRoleColor(character.role)} data-testid={`badge-role-${character.id}`}>
                      {getRoleIcon(character.role)}
                      <span className="ml-1">{getRoleText(character.role)}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-personality-${character.id}`}>
                    {character.personality}
                  </p>
                </div>

                {selectedCharacterId === character.id && (
                  <div className="text-primary">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedCharacterId && (
        <Button 
          className="w-full mt-4" 
          size="lg"
          data-testid="button-start-conversation"
        >
          会話を始める
        </Button>
      )}
    </div>
  );
}