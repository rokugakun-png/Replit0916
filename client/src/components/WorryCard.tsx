import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageSquare, Target, CheckSquare } from "lucide-react";

interface WorryCardProps {
  worry: {
    id: string;
    title: string;
    description?: string;
    status: string;
    progress: number;
    goalCount: number;
    taskCount: number;
    completedTasks: number;
    lastActivity?: string;
  };
  onViewDetails: (id: string) => void;
  onStartChat: (id: string) => void;
}

export default function WorryCard({ worry, onViewDetails, onStartChat }: WorryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2 text-white";
      case "resolved":
        return "bg-chart-1 text-white";
      case "paused":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "進行中";
      case "resolved":
        return "解決済み";
      case "paused":
        return "休止中";
      default:
        return "不明";
    }
  };

  return (
    <Card className="mb-4 hover-elevate" data-testid={`card-worry-${worry.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base text-card-foreground truncate" data-testid={`text-worry-title-${worry.id}`}>
              {worry.title}
            </h3>
            {worry.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2" data-testid={`text-worry-description-${worry.id}`}>
                {worry.description}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(worry.status)} data-testid={`badge-status-${worry.id}`}>
            {getStatusText(worry.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 進捗表示 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">全体の進捗</span>
            <span className="font-medium text-card-foreground" data-testid={`text-progress-${worry.id}`}>
              {worry.progress}%
            </span>
          </div>
          <Progress value={worry.progress} className="h-2" data-testid={`progress-bar-${worry.id}`} />
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-chart-2" />
            <span className="text-muted-foreground">目標:</span>
            <span className="font-medium text-card-foreground" data-testid={`text-goal-count-${worry.id}`}>
              {worry.goalCount}個
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-chart-1" />
            <span className="text-muted-foreground">タスク:</span>
            <span className="font-medium text-card-foreground" data-testid={`text-task-count-${worry.id}`}>
              {worry.completedTasks}/{worry.taskCount}
            </span>
          </div>
        </div>

        {/* 最後の活動 */}
        {worry.lastActivity && (
          <div className="text-xs text-muted-foreground" data-testid={`text-last-activity-${worry.id}`}>
            最終更新: {worry.lastActivity}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(worry.id)}
            data-testid={`button-view-details-${worry.id}`}
          >
            <Heart className="w-4 h-4 mr-2" />
            詳細を見る
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onStartChat(worry.id)}
            data-testid={`button-start-chat-${worry.id}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            相談する
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}