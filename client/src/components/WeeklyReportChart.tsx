import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface WeeklyReportChartProps {
  weekData: {
    weekStart: string;
    weekEnd: string;
    moodData: Array<{ day: string; mood: number; date: string }>;
    progressData: Array<{ day: string; progress: number; taskCompleted: number }>;
    summary: {
      averageMood: number;
      totalTasksCompleted: number;
      mostActiveDay: string;
      improvementTrend: 'up' | 'down' | 'stable';
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
              <div className="text-2xl font-bold text-chart-2" data-testid="text-average-mood">
                {weekData.summary.averageMood.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">平均気分</div>
              <div className="text-xs text-muted-foreground">（10点満点）</div>
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

      {/* 気分の推移グラフ */}
      <Card data-testid="card-mood-chart">
        <CardHeader>
          <CardTitle className="text-base">気分の推移</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData.moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                domain={[1, 10]}
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
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.date}`;
                  }
                  return label;
                }}
                formatter={(value) => [`${value}点`, '気分']}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* タスク完了状況 */}
      <Card data-testid="card-progress-chart">
        <CardHeader>
          <CardTitle className="text-base">日別タスク完了数</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
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
                formatter={(value) => [`${value}個`, '完了タスク']}
              />
              <Bar 
                dataKey="taskCompleted" 
                fill="hsl(var(--chart-1))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}