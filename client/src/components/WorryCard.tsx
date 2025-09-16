import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageSquare, Target, CheckSquare, ClipboardList } from "lucide-react";

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
  onManageTasks: (id: string) => void;
}

export default function WorryCard({ worry, onViewDetails, onStartChat, onManageTasks }: WorryCardProps) {
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
        {/* 取り組みの軌跡 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">あなたの歩み</span>
            <span className="font-medium text-chart-2" data-testid={`text-progress-${worry.id}`}>
              よく頑張っています
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-chart-2 to-chart-1 rounded-full transition-all duration-300"
              style={{ width: `${worry.progress}%` }}
              data-testid={`progress-bar-${worry.id}`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            小さな一歩一歩が大切な成長です
          </p>
        </div>

        {/* あなたの取り組み */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-chart-2" />
            <span className="text-muted-foreground">描いた目標</span>
            <span className="font-medium text-chart-2" data-testid={`text-goal-count-${worry.id}`}>
              {worry.goalCount}つ
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-chart-1" />
            <span className="text-muted-foreground">達成できたこと</span>
            <span className="font-medium text-chart-1" data-testid={`text-task-count-${worry.id}`}>
              {worry.completedTasks}つ
            </span>
          </div>
        </div>

        {/* 最後の活動 */}
        {worry.lastActivity && (
          <div className="text-xs text-muted-foreground" data-testid={`text-last-activity-${worry.id}`}>
            {worry.lastActivity}に一緒に向き合いました
          </div>
        )}

        {/* 寄り添いのアクション */}
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails(worry.id)}
              data-testid={`button-view-details-${worry.id}`}
            >
              <Heart className="w-4 h-4 mr-2" />
              振り返る
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onStartChat(worry.id)}
              data-testid={`button-start-chat-${worry.id}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              お話しする
            </Button>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full"
            onClick={() => onManageTasks(worry.id)}
            data-testid={`button-manage-tasks-${worry.id}`}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            タスク管理
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}