import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, TrendingUp } from "lucide-react";
import WeeklyReportChart from "@/components/WeeklyReportChart";

export default function ReportsPage() {
  const [selectedWeek, setSelectedWeek] = useState<string>("current");

  // todo: remove mock functionality
  const mockWeeklyReports = [
    {
      id: "current",
      label: "今週 (12/9 - 12/15)",
      weekStart: "12/9",
      weekEnd: "12/15",
      moodData: [
        { day: "月", mood: 6, date: "12/9" },
        { day: "火", mood: 7, date: "12/10" },
        { day: "水", mood: 5, date: "12/11" },
        { day: "木", mood: 8, date: "12/12" },
        { day: "金", mood: 7, date: "12/13" },
        { day: "土", mood: 8, date: "12/14" },
        { day: "日", mood: 6, date: "12/15" }
      ],
      progressData: [
        { day: "月", progress: 20, taskCompleted: 2 },
        { day: "火", progress: 35, taskCompleted: 3 },
        { day: "水", progress: 35, taskCompleted: 0 },
        { day: "木", progress: 60, taskCompleted: 4 },
        { day: "金", progress: 75, taskCompleted: 2 },
        { day: "土", progress: 85, taskCompleted: 1 },
        { day: "日", progress: 85, taskCompleted: 0 }
      ],
      summary: {
        averageMood: 6.7,
        totalTasksCompleted: 12,
        mostActiveDay: "木曜日",
        improvementTrend: "up" as const
      }
    },
    {
      id: "last",
      label: "先週 (12/2 - 12/8)",
      weekStart: "12/2",
      weekEnd: "12/8",
      moodData: [
        { day: "月", mood: 5, date: "12/2" },
        { day: "火", mood: 6, date: "12/3" },
        { day: "水", mood: 6, date: "12/4" },
        { day: "木", mood: 7, date: "12/5" },
        { day: "金", mood: 6, date: "12/6" },
        { day: "土", mood: 7, date: "12/7" },
        { day: "日", mood: 5, date: "12/8" }
      ],
      progressData: [
        { day: "月", progress: 10, taskCompleted: 1 },
        { day: "火", progress: 20, taskCompleted: 2 },
        { day: "水", progress: 30, taskCompleted: 2 },
        { day: "木", progress: 45, taskCompleted: 3 },
        { day: "金", progress: 55, taskCompleted: 1 },
        { day: "土", progress: 65, taskCompleted: 2 },
        { day: "日", progress: 65, taskCompleted: 0 }
      ],
      summary: {
        averageMood: 6.0,
        totalTasksCompleted: 11,
        mostActiveDay: "木曜日",
        improvementTrend: "stable" as const
      }
    },
    {
      id: "two_weeks_ago",
      label: "2週間前 (11/25 - 12/1)",
      weekStart: "11/25",
      weekEnd: "12/1",
      moodData: [
        { day: "月", mood: 4, date: "11/25" },
        { day: "火", mood: 5, date: "11/26" },
        { day: "水", mood: 4, date: "11/27" },
        { day: "木", mood: 6, date: "11/28" },
        { day: "金", mood: 5, date: "11/29" },
        { day: "土", mood: 6, date: "11/30" },
        { day: "日", mood: 4, date: "12/1" }
      ],
      progressData: [
        { day: "月", progress: 5, taskCompleted: 1 },
        { day: "火", progress: 10, taskCompleted: 1 },
        { day: "水", progress: 10, taskCompleted: 0 },
        { day: "木", progress: 25, taskCompleted: 3 },
        { day: "金", progress: 35, taskCompleted: 2 },
        { day: "土", progress: 40, taskCompleted: 1 },
        { day: "日", progress: 40, taskCompleted: 0 }
      ],
      summary: {
        averageMood: 4.9,
        totalTasksCompleted: 8,
        mostActiveDay: "木曜日",
        improvementTrend: "down" as const
      }
    }
  ];

  const selectedReport = mockWeeklyReports.find(r => r.id === selectedWeek);

  const handleBackToHome = () => {
    console.log('Back to home');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToHome}
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">週次レポート</h1>
            </div>
            <TrendingUp className="w-5 h-5 text-chart-2" />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 期間選択 */}
        <Card className="mb-6" data-testid="card-period-selector">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              期間を選択
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockWeeklyReports.map((report) => (
                <Button
                  key={report.id}
                  variant={selectedWeek === report.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedWeek(report.id)}
                  data-testid={`button-select-week-${report.id}`}
                >
                  {report.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 比較インサイト */}
        {selectedWeek !== "current" && (
          <Card className="mb-6" data-testid="card-comparison">
            <CardHeader>
              <CardTitle className="text-base">今週との比較</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const currentReport = mockWeeklyReports[0];
                const moodChange = currentReport.summary.averageMood - (selectedReport?.summary.averageMood || 0);
                const taskChange = currentReport.summary.totalTasksCompleted - (selectedReport?.summary.totalTasksCompleted || 0);
                
                return (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">気分の変化:</span>
                      <span className={`font-medium ${moodChange > 0 ? 'text-chart-2' : moodChange < 0 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                        {moodChange > 0 ? '+' : ''}{moodChange.toFixed(1)}ポイント
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">タスク完了数の変化:</span>
                      <span className={`font-medium ${taskChange > 0 ? 'text-chart-2' : taskChange < 0 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                        {taskChange > 0 ? '+' : ''}{taskChange}個
                      </span>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* レポートチャート */}
        {selectedReport && (
          <WeeklyReportChart weekData={selectedReport} />
        )}

        {/* 改善提案 */}
        <Card className="mt-6" data-testid="card-suggestions">
          <CardHeader>
            <CardTitle className="text-base">改善提案</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {selectedReport?.summary.improvementTrend === 'up' ? (
                <>
                  <p className="text-chart-2 font-medium">✓ 良い調子です！この調子で続けましょう</p>
                  <ul className="space-y-1 text-muted-foreground pl-4">
                    <li>• 現在の取り組みを継続することをお勧めします</li>
                    <li>• 新しい目標を設定してさらなる成長を目指しましょう</li>
                  </ul>
                </>
              ) : selectedReport?.summary.improvementTrend === 'down' ? (
                <>
                  <p className="text-chart-3 font-medium">⚠ 少し調子が落ちているようです</p>
                  <ul className="space-y-1 text-muted-foreground pl-4">
                    <li>• 休息を取ることも大切です</li>
                    <li>• AIカウンセラーに相談してみることをお勧めします</li>
                    <li>• 小さな目標から始めてみましょう</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground font-medium">安定した状態を保てています</p>
                  <ul className="space-y-1 text-muted-foreground pl-4">
                    <li>• 今の取り組みを継続しましょう</li>
                    <li>• 新しいチャレンジを始める良いタイミングかもしれません</li>
                  </ul>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}