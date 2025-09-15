import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WeeklyReportChartProps {
  weekData: {
    weekStart: string;
    weekEnd: string;
    moodData: Array<{ day: string; mood: string; date: string; moodValue?: number }>;
    progressData: Array<{ day: string; progress: number; taskCompleted: number }>;
    summary: {
      moodDescription: string;
      totalTasksCompleted: number;
      mostActiveDay: string;
      improvementTrend: 'up' | 'down' | 'stable';
      weeklyMessage: string;
    };
  };
}

export default function WeeklyReportChart({ weekData }: WeeklyReportChartProps) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-chart-2';
      case 'down':
        return 'text-chart-3';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return '改善傾向';
      case 'down':
        return '注意が必要';
      default:
        return '安定';
    }
  };

  return (
    <div className="space-y-6">
      {/* 週次サマリー */}
      <Card data-testid="card-weekly-summary">
        <CardHeader>
          <CardTitle className="text-lg">
            週次レポート ({weekData.weekStart} ～ {weekData.weekEnd})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-card rounded-lg border">
              <div className="text-base font-medium text-chart-2" data-testid="text-mood-description">
                {weekData.summary.moodDescription}
              </div>
              <div className="text-sm text-muted-foreground">今週の心の様子</div>
            </div>
            <div className="text-center p-3 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-chart-1" data-testid="text-tasks-completed">
                {weekData.summary.totalTasksCompleted}
              </div>
              <div className="text-sm text-muted-foreground">完了タスク</div>
              <div className="text-xs text-muted-foreground">（今週）</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">最も活動的だった日:</span>
              <span className="font-medium" data-testid="text-most-active-day">
                {weekData.summary.mostActiveDay}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">全体的な傾向:</span>
              <span className={`font-medium ${getTrendColor(weekData.summary.improvementTrend)}`} data-testid="text-improvement-trend">
                {getTrendText(weekData.summary.improvementTrend)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 心の軌跡 */}
      <Card data-testid="card-mood-chart">
        <CardHeader>
          <CardTitle className="text-base">心の軌跡</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              今週の気持ちの変化を振り返ってみましょう
            </p>
            <div className="space-y-2">
              {weekData.moodData.map((dayData, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-card border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-8">
                      {dayData.day}
                    </span>
                    <span className="text-sm text-card-foreground">
                      {dayData.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chart-2 font-medium">
                      {dayData.mood}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              気持ちに良し悪しはありません。どんな感情も大切です
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 達成の足跡 */}
      <Card data-testid="card-progress-chart">
        <CardHeader>
          <CardTitle className="text-base">達成の足跡</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              毎日のがんばりを振り返ってみましょう
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekData.progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value) => [`${value}つ`, '達成できたこと']}
                />
                <Bar 
                  dataKey="taskCompleted" 
                  fill="hsl(var(--chart-1))" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center">
              0でも大丈夫。休息も大切な選択です
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}