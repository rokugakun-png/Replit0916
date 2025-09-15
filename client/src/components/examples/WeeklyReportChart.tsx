import WeeklyReportChart from '../WeeklyReportChart';

export default function WeeklyReportChartExample() {
  const mockWeekData = {
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
  };

  return <WeeklyReportChart weekData={mockWeekData} />;
}