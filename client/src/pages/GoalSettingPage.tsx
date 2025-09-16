import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Target, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoalSettingPageProps {
  worryId: string;
}

export default function GoalSettingPage({ worryId }: GoalSettingPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: ""
  });

  // モックデータ
  const worries: Record<string, { title: string }> = {
    "1": { title: "仕事でのコミュニケーション改善" },
    "2": { title: "健康的な生活習慣の確立" },
    "3": { title: "キャリアプランの明確化" }
  };

  const worry = worries[worryId] || worries["1"];

  const handleBack = () => {
    setLocation("/");
  };

  const handleSaveGoal = () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "目標のタイトルを入力してください",
        variant: "destructive"
      });
      return;
    }

    // TODO: 実際のAPI呼び出し
    console.log("新しい目標を保存:", { worryId, ...newGoal });
    
    toast({
      title: "目標を設定しました",
      description: "新しい目標が追加されました。"
    });

    // フォームをクリア
    setNewGoal({
      title: "",
      description: "",
      targetDate: ""
    });
  };

  const handleGoToTaskManagement = () => {
    setLocation(`/tasks/${worryId}`);
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
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-medium text-foreground">目標設定</h1>
              <p className="text-sm text-muted-foreground truncate">
                {worry.title}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToTaskManagement}
              data-testid="button-goto-tasks"
            >
              タスク管理
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* 説明セクション */}
        <Card data-testid="card-goal-explanation">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-chart-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-2">目標を設定しましょう</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  この悩みについて、どのような状態になりたいか目標を設定してみましょう。
                  具体的で達成可能な目標を設定することで、一歩ずつ前進していけます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 目標設定フォーム */}
        <Card data-testid="card-goal-form">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新しい目標
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                目標のタイトル *
              </label>
              <Input
                placeholder="例：同僚と気軽に話せるようになる"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                data-testid="input-goal-title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                詳細説明（任意）
              </label>
              <Textarea
                placeholder="どのような状態になりたいか、もう少し詳しく教えてください"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                data-testid="input-goal-description"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                目標達成予定日（任意）
              </label>
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                data-testid="input-goal-date"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSaveGoal}
                className="w-full"
                data-testid="button-save-goal"
              >
                目標を設定する
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* タスク管理画面への遷移 */}
        <Card data-testid="card-task-management">
          <CardHeader>
            <CardTitle className="text-base">タスク管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              設定した目標に向けて具体的なタスクを管理し、AI提案を受けることができます。
            </p>
            <Button 
              onClick={handleGoToTaskManagement}
              className="w-full"
              data-testid="button-go-to-tasks"
            >
              <Target className="w-4 h-4 mr-2" />
              タスク管理へ進む
            </Button>
          </CardContent>
        </Card>

        {/* 既存の目標（今後のタスクで実装） */}
        <Card data-testid="card-existing-goals">
          <CardHeader>
            <CardTitle className="text-base">既存の目標</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-4">
              まだ目標が設定されていません
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}