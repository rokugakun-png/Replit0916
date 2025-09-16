import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Target, Plus, CheckCircle, Calendar, Star, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useCharacter } from "@/contexts/CharacterContext";

interface Task {
  id: string;
  goalId?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
}

interface Achievement {
  id: string;
  content: string;
  date: string;
  category: "task" | "goal" | "personal";
}

interface AITaskSuggestion {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  reasoning: string;
  category: "communication" | "self-care" | "goal-setting" | "behavioral" | "emotional";
}

interface ChatMessage {
  sender: "user" | "character";
  content: string;
  timestamp: string;
}

interface TaskManagementPageProps {
  worryId: string;
}

export default function TaskManagementPage({ worryId }: TaskManagementPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { character: characterSettings } = useCharacter();
  const [activeTab, setActiveTab] = useState("tasks");
  
  // 新しいタスク追加フォーム
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  // 今日の達成記録フォーム
  const [newAchievement, setNewAchievement] = useState("");

  // AI提案関連
  const [aiSuggestions, setAiSuggestions] = useState<AITaskSuggestion[]>([]);
  const [isAnalyzingChat, setIsAnalyzingChat] = useState(false);

  // モックデータ
  const worries: Record<string, { title: string }> = {
    "1": { title: "仕事でのコミュニケーション改善" },
    "2": { title: "健康的な生活習慣の確立" },
    "3": { title: "キャリアプランの明確化" }
  };

  const worry = worries[worryId] || worries["1"];

  // AI提案のためのmutation
  const aiSuggestionMutation = useMutation({
    mutationFn: async (params: { messages: ChatMessage[], worryTitle: string, characterName: string }) => {
      const response = await apiRequest("POST", "/api/suggest-tasks", params);
      return await response.json();
    },
    onSuccess: (data: { suggestions: AITaskSuggestion[] }) => {
      setAiSuggestions(data.suggestions || []);
      setIsAnalyzingChat(false);
      toast({
        title: "AI提案が完了しました",
        description: `${data.suggestions?.length || 0}件のタスクが提案されました。`
      });
    },
    onError: (error) => {
      setIsAnalyzingChat(false);
      console.error("AI suggestion error:", error);
      toast({
        title: "AI提案でエラーが発生しました",
        description: "しばらく後にもう一度お試しください。",
        variant: "destructive"
      });
    }
  });

  // モック目標データ
  const [goals] = useState<Goal[]>([
    {
      id: "goal-1",
      title: "同僚と気軽に話せるようになる",
      description: "朝の挨拶から始めて、段階的にコミュニケーションを増やす",
      targetDate: "2024-03-31",
      completed: false
    },
    {
      id: "goal-2", 
      title: "会議で積極的に発言する",
      description: "週に最低1回は会議で質問や意見を述べる",
      completed: false
    }
  ]);

  // モックタスクデータ
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      goalId: "goal-1",
      title: "毎朝同僚に挨拶する",
      description: "最低3人には「おはようございます」と言う",
      completed: false,
      priority: "high",
      dueDate: "2024-12-20",
      createdAt: "2024-12-15"
    },
    {
      id: "task-2",
      goalId: "goal-1",
      title: "昼休みに同僚と軽い雑談をする",
      completed: true,
      priority: "medium",
      createdAt: "2024-12-14"
    },
    {
      id: "task-3",
      title: "チーム会議の資料を事前準備",
      description: "会議前日までに質問を3つ考えておく",
      completed: false,
      priority: "medium",
      dueDate: "2024-12-18",
      createdAt: "2024-12-13"
    }
  ]);

  // 今日の達成記録
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "ach-1",
      content: "朝の挨拶を4人にできました",
      date: "2024-12-16",
      category: "task"
    },
    {
      id: "ach-2",
      content: "同僚との雑談で笑顔を心がけることができました",
      date: "2024-12-16",
      category: "personal"
    }
  ]);

  const handleBack = () => {
    setLocation("/");
  };

  const handleGoToGoalSetting = () => {
    setLocation(`/goals/${worryId}`);
  };

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "タスクを完了しました！",
        description: "素晴らしい取り組みですね。"
      });
    }
  };

  const handleAnalyzeChats = () => {
    // モックチャット履歴データ（実際の実装では、チャット履歴を取得）
    const mockChatMessages: ChatMessage[] = [
      {
        sender: "character",
        content: "こんにちは！今日も一日お疲れ様でした。お仕事でのコミュニケーションについて、何か気になることはありましたか？",
        timestamp: "14:30"
      },
      {
        sender: "user",
        content: "同僚との会話がうまくいかなくて悩んでいます。自分の意見を伝えるのが苦手で...",
        timestamp: "14:32"
      },
      {
        sender: "character",
        content: "そうでしたか。ご自分の気持ちを相手に伝えるのは、とても勇気のいることですよね。どんな場面で特に難しさを感じられますか？",
        timestamp: "14:35"
      },
      {
        sender: "user",
        content: "朝の挨拶はできるんですが、それ以上の会話に発展させることが難しいです。会議でも意見を言いたいのですが、なかなか発言できません。",
        timestamp: "14:37"
      }
    ];

    setIsAnalyzingChat(true);
    aiSuggestionMutation.mutate({
      messages: mockChatMessages,
      worryTitle: worry.title,
      characterName: characterSettings.name
    });
  };

  const handleAdoptSuggestion = (suggestion: AITaskSuggestion) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: suggestion.title,
      description: suggestion.description,
      completed: false,
      priority: suggestion.priority,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);
    
    // 採用したタスクを提案から削除
    setAiSuggestions(prev => prev.filter(s => s.title !== suggestion.title));

    toast({
      title: "AIタスクを採用しました",
      description: "タスク一覧に追加されました。"
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "タスクのタイトルを入力してください",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || undefined,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: ""
    });

    toast({
      title: "新しいタスクを追加しました",
      description: "一歩ずつ進んでいきましょう。"
    });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) {
      toast({
        title: "達成内容を入力してください",
        variant: "destructive"
      });
      return;
    }

    const achievement: Achievement = {
      id: `ach-${Date.now()}`,
      content: newAchievement,
      date: new Date().toISOString().split('T')[0],
      category: "personal"
    };

    setAchievements(prev => [achievement, ...prev]);
    setNewAchievement("");

    toast({
      title: "今日の達成を記録しました！",
      description: "自分の成長を大切にしてください。"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-chart-3 text-white";
      case "medium": return "bg-chart-2 text-white";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "高";
      case "medium": return "中";
      case "low": return "低";
      default: return "不明";
    }
  };

  const todaysTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  });

  const todaysAchievements = achievements.filter(ach => {
    const today = new Date().toISOString().split('T')[0];
    return ach.date === today;
  });

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
              <h1 className="text-lg font-medium text-foreground">タスク管理</h1>
              <p className="text-sm text-muted-foreground truncate">
                {worry.title}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToGoalSetting}
              data-testid="button-goto-goals"
            >
              目標設定
            </Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* 今日のサマリー */}
        <Card className="mb-6" data-testid="card-today-summary">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              今日の状況
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">今日のタスク</span>
              <span className="font-medium" data-testid="text-todays-task-count">
                {todaysTasks.length}件
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">達成した取り組み</span>
              <span className="font-medium text-chart-1" data-testid="text-todays-achievement-count">
                {todaysAchievements.length}件
              </span>
            </div>
          </CardContent>
        </Card>

        {/* タブナビゲーション */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tasks" data-testid="tab-tasks">タスク</TabsTrigger>
            <TabsTrigger value="goals" data-testid="tab-goals">目標</TabsTrigger>
            <TabsTrigger value="achievements" data-testid="tab-achievements">達成</TabsTrigger>
            <TabsTrigger value="ai-suggestions" data-testid="tab-ai-suggestions">AI提案</TabsTrigger>
            <TabsTrigger value="add" data-testid="tab-add">追加</TabsTrigger>
          </TabsList>

          {/* タスク一覧タブ */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <Card className="text-center py-8" data-testid="card-no-tasks">
                  <CardContent>
                    <p className="text-muted-foreground">
                      まだタスクがありません
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task) => (
                  <Card key={task.id} className={`${task.completed ? 'opacity-60' : ''}`} data-testid={`card-task-${task.id}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleTaskComplete(task.id)}
                          data-testid={`checkbox-task-${task.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </h4>
                            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                              {getPriorityText(task.priority)}
                            </Badge>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {task.dueDate && (
                              <span>期限: {task.dueDate}</span>
                            )}
                            {task.goalId && (
                              <Badge variant="outline" className="text-xs">
                                目標関連
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 目標一覧タブ */}
          <TabsContent value="goals" className="space-y-4">
            <div className="space-y-3">
              {goals.length === 0 ? (
                <Card className="text-center py-8" data-testid="card-no-goals">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      まだ目標が設定されていません
                    </p>
                    <Button onClick={handleGoToGoalSetting} size="sm">
                      <Target className="w-4 h-4 mr-2" />
                      目標を設定する
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                goals.map((goal) => (
                  <Card key={goal.id} data-testid={`card-goal-${goal.id}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground mb-1">
                            {goal.title}
                          </h4>
                          {goal.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {goal.description}
                            </p>
                          )}
                          {goal.targetDate && (
                            <p className="text-xs text-muted-foreground">
                              目標日: {goal.targetDate}
                            </p>
                          )}
                          
                          {/* この目標に関連するタスク数 */}
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              関連タスク: {tasks.filter(t => t.goalId === goal.id).length}件
                            </Badge>
                          </div>
                        </div>
                        <Badge className={goal.completed ? "bg-chart-1" : "bg-muted"}>
                          {goal.completed ? "達成済み" : "進行中"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* AI提案タブ */}
          <TabsContent value="ai-suggestions" className="space-y-4">
            <Card data-testid="card-ai-analysis">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AIタスク提案
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-3">
                    これまでのカウンセラーとの会話を分析し、あなたに適したタスクを提案します。
                    うつ病や不安を抱える方に配慮した、小さく達成しやすいタスクを提案いたします。
                  </p>
                </div>
                <Button
                  onClick={handleAnalyzeChats}
                  disabled={isAnalyzingChat || aiSuggestionMutation.isPending}
                  className="w-full"
                  data-testid="button-analyze-chats"
                >
                  {isAnalyzingChat || aiSuggestionMutation.isPending ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      チャット履歴を分析
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {aiSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-foreground">AIからの提案</h3>
                {aiSuggestions.map((suggestion, index) => (
                  <Card key={index} data-testid={`card-ai-suggestion-${index}`}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground mb-1">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getPriorityColor(suggestion.priority)} text-xs`}>
                                {getPriorityText(suggestion.priority)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">
                            <strong>提案理由:</strong> {suggestion.reasoning}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAdoptSuggestion(suggestion)}
                            data-testid={`button-adopt-suggestion-${index}`}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            採用する
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAiSuggestions(prev => prev.filter((_, i) => i !== index))}
                            data-testid={`button-dismiss-suggestion-${index}`}
                          >
                            却下
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 達成記録タブ */}
          <TabsContent value="achievements" className="space-y-4">
            <Card data-testid="card-add-achievement">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  今日できたこと
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="今日達成できたことや頑張ったことを記録してください"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    rows={2}
                    data-testid="input-achievement"
                  />
                </div>
                <Button
                  onClick={handleAddAchievement}
                  className="w-full"
                  data-testid="button-add-achievement"
                >
                  記録する
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-foreground">最近の達成記録</h3>
              {achievements.length === 0 ? (
                <Card className="text-center py-8" data-testid="card-no-achievements">
                  <CardContent>
                    <p className="text-muted-foreground">
                      まだ達成記録がありません
                    </p>
                  </CardContent>
                </Card>
              ) : (
                achievements.map((achievement) => (
                  <Card key={achievement.id} data-testid={`card-achievement-${achievement.id}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-chart-1 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground mb-1">
                            {achievement.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* タスク追加タブ */}
          <TabsContent value="add" className="space-y-4">
            <Card data-testid="card-add-task">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  新しいタスク
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    タスクのタイトル *
                  </label>
                  <Input
                    placeholder="例：明日の会議で質問を1つする"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    data-testid="input-task-title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    詳細説明（任意）
                  </label>
                  <Textarea
                    placeholder="具体的にどのように取り組むか"
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    data-testid="input-task-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      優先度
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      data-testid="select-task-priority"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      期限（任意）
                    </label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      data-testid="input-task-date"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddTask}
                  className="w-full"
                  data-testid="button-add-task"
                >
                  タスクを追加
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}