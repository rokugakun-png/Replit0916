import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, RotateCcw } from "lucide-react";
import { useCharacter } from "@/contexts/CharacterContext";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { character, updateCharacterName, updateCharacterTitle, updateCharacter, resetToDefault } = useCharacter();
  const { toast } = useToast();
  
  const [editForm, setEditForm] = useState({
    name: character.name,
    title: character.title
  });

  // キャラクター設定が変更されたらフォームも更新
  useEffect(() => {
    setEditForm({
      name: character.name,
      title: character.title
    });
  }, [character.name, character.title]);

  const handleBack = () => {
    setLocation("/");
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "名前を入力してください",
        variant: "destructive"
      });
      return;
    }

    if (!editForm.title.trim()) {
      toast({
        title: "役職を入力してください",
        variant: "destructive"
      });
      return;
    }

    updateCharacter({
      name: editForm.name.trim(),
      title: editForm.title.trim()
    });
    
    toast({
      title: "設定を保存しました",
      description: "キャラクター設定が更新されました。"
    });
  };

  const handleReset = () => {
    resetToDefault();
    setEditForm({
      name: "さくら先生",
      title: "心理カウンセラー"
    });
    
    toast({
      title: "デフォルト設定に戻しました",
      description: "キャラクター設定がリセットされました。"
    });
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
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">設定</h1>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* キャラクター設定 */}
        <Card data-testid="card-character-settings">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              相談相手のキャラクター設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                キャラクター名 *
              </label>
              <Input
                placeholder="例：さくら先生"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                data-testid="input-character-name"
              />
              <p className="text-xs text-muted-foreground mt-1">
                相談相手として表示される名前です
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                役職・肩書き *
              </label>
              <Input
                placeholder="例：心理カウンセラー"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                data-testid="input-character-title"
              />
              <p className="text-xs text-muted-foreground mt-1">
                キャラクターの専門分野や役職です
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                onClick={handleSave}
                className="w-full"
                data-testid="button-save-character"
              >
                設定を保存
              </Button>
              
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
                data-testid="button-reset-character"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                デフォルトに戻す
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 現在の設定表示 */}
        <Card data-testid="card-current-settings">
          <CardHeader>
            <CardTitle className="text-base">現在の設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">キャラクター名</span>
                <span className="text-sm font-medium" data-testid="text-current-name">
                  {character.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">役職・肩書き</span>
                <span className="text-sm font-medium" data-testid="text-current-title">
                  {character.title}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}