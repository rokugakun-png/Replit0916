import WeeklyReportChart from '../WeeklyReportChart';

export default function WeeklyReportChartExample() {
  const mockWeekData = {
    weekStart: "12/9",
    weekEnd: "12/15",
    moodData: [
      { day: "月", mood: "少し疲れていた", date: "12/9" },
      { day: "火", mood: "穏やかな気持ち", date: "12/10" },
      { day: "水", mood: "不安を感じていた", date: "12/11" },
      { day: "木", mood: "充実していた", date: "12/12" },
      { day: "金", mood: "ほっとしていた", date: "12/13" },
      { day: "土", mood: "嬉しい気持ち", date: "12/14" },
      { day: "日", mood: "落ち着いていた", date: "12/15" }
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
      moodDescription: "だんだん心が軽やかに",
      totalTasksCompleted: 12,
      mostActiveDay: "木曜日",
      improvementTrend: "up" as const,
      weeklyMessage: "この1週間、いろいろな気持ちを感じながらも、少しずつ前に進んでこられましたね"
    }
  };

  return <WeeklyReportChart weekData={mockWeekData} />;
}