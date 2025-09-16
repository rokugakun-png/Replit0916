import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import WorryCard from "@/components/WorryCard";
import { useLocation } from "wouter";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  
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
    // 振り返るボタンで目標設定画面に遷移
    setLocation(`/goals/${id}`);
  };

  const handleStartChat = (id: string) => {
    // デフォルトでさくら先生との個別チャットルームに直接遷移
    setLocation(`/chat/sakura/${id}`);
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
        {/* 今週のあなた */}
        <Card className="mb-6" data-testid="card-overview">
          <CardHeader>
            <CardTitle className="text-base">今週のあなた</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-medium text-foreground mb-2">
                  今週もお疲れ様でした
                </div>
                <p className="text-sm text-muted-foreground">
                  {mockWorries.filter(w => w.status === 'active').length > 0 
                    ? `${mockWorries.filter(w => w.status === 'active').length}つの悩みと向き合っていますね`
                    : '今は落ち着いて過ごされているようですね'
                  }
                </p>
              </div>
              
              {mockWorries.reduce((acc, w) => acc + w.completedTasks, 0) > 0 && (
                <div className="flex items-center justify-center gap-2 p-3 bg-chart-1/10 rounded-lg">
                  <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
                  <span className="text-sm text-chart-1 font-medium">
                    {mockWorries.reduce((acc, w) => acc + w.completedTasks, 0)}つのことを達成できました
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  どんな小さな一歩でも、あなたの成長です
                </p>
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