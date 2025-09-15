import { Home, MessageSquare, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface MobileBottomNavProps {
  activeTab: string;
}

export default function MobileBottomNav({ activeTab }: MobileBottomNavProps) {
  const [, setLocation] = useLocation();
  const tabs = [
    { id: "home", label: "ホーム", icon: Home, path: "/" },
    { id: "chat", label: "相談", icon: MessageSquare, path: "/characters" },
    { id: "reports", label: "レポート", icon: BarChart3, path: "/reports" },
    { id: "settings", label: "設定", icon: Settings, path: "/settings" }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    setLocation(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => handleTabClick(tab)}
              data-testid={`button-nav-${tab.id}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}