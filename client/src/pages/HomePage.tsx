import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import WorryCard from "@/components/WorryCard";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // todo: remove mock functionality
  const mockWorries = [
    {
      id: "1",
      title: "仕事でのコミュニケーション改善",
      description: "チームメンバーとの関係性を向上させ、より効果的なコミュニケーションを取れるようになりたい",
      status: "active",
      progress: 65,
      goalCount: 3,
      taskCount: 8,
      completedTasks: 5,
      lastActivity: "2日前"
    },
    {
      id: "2", 
      title: "健康的な生活習慣の確立",
      description: "規則正しい睡眠と運動習慣を身につけて、心身の健康を改善したい",
      status: "active",
      progress: 40,
      goalCount: 2,
      taskCount: 6,
      completedTasks: 2,
      lastActivity: "1日前"
    },
    {
      id: "3",
      title: "キャリアプランの明確化",
      description: "将来の方向性を決めて、スキルアップの計画を立てたい",
      status: "paused",
      progress: 25,
      goalCount: 4,
      taskCount: 10,
      completedTasks: 3,
      lastActivity: "1週間前"
    }
  ];

  const filteredWorries = mockWorries.filter(worry =>
    worry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worry.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    console.log('View details for worry:', id);
  };

  const handleStartChat = (id: string) => {
    console.log('Start chat for worry:', id);
  };

  const handleAddWorry = () => {
    console.log('Add new worry');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">悩み相談</h1>
            <Button 
              size="icon" 
              onClick={handleAddWorry}
              data-testid="button-add-worry"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="悩みを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-worries"
            />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 概要カード */}
        <Card className="mb-6" data-testid="card-overview">
          <CardHeader>
            <CardTitle className="text-base">今週の概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-chart-2" data-testid="text-active-worries">
                  {mockWorries.filter(w => w.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">進行中</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-chart-1" data-testid="text-completed-tasks">
                  {mockWorries.reduce((acc, w) => acc + w.completedTasks, 0)}
                </div>
                <div className="text-sm text-muted-foreground">完了タスク</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary" data-testid="text-average-progress">
                  {Math.round(mockWorries.reduce((acc, w) => acc + w.progress, 0) / mockWorries.length)}%
                </div>
                <div className="text-sm text-muted-foreground">平均進捗</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 悩み一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">あなたの悩み</h2>
            <span className="text-sm text-muted-foreground" data-testid="text-worry-count">
              {filteredWorries.length}件
            </span>
          </div>

          {filteredWorries.length === 0 ? (
            <Card className="text-center py-8" data-testid="card-no-worries">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "検索条件に一致する悩みがありません" : "まだ悩みが登録されていません"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleAddWorry} data-testid="button-add-first-worry">
                    <Plus className="w-4 h-4 mr-2" />
                    最初の悩みを追加
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredWorries.map((worry) => (
              <WorryCard
                key={worry.id}
                worry={worry}
                onViewDetails={handleViewDetails}
                onStartChat={handleStartChat}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}