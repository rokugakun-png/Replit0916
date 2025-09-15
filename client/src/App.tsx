import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import CharacterRoomsPage from "@/pages/CharacterRoomsPage";
import IndividualChatPage from "@/pages/IndividualChatPage";
import ReportsPage from "@/pages/ReportsPage";
import MobileBottomNav from "@/components/MobileBottomNav";

function Router() {
  const [location] = useLocation();

  // 現在のパスに基づいてアクティブタブを決定
  const getActiveTab = () => {
    if (location === "/") return "home";
    if (location.startsWith("/chat") || location === "/characters") return "chat";
    if (location === "/reports") return "reports";
    if (location === "/settings") return "settings";
    return "home";
  };

  return (
    <div className="relative">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/characters" component={ChatPage} />
        <Route path="/chat/:characterId/:worryId">
          {(params) => <IndividualChatPage characterId={params.characterId} worryId={params.worryId} />}
        </Route>
        <Route path="/chat/:characterId">
          {(params) => <CharacterRoomsPage characterId={params.characterId} />}
        </Route>
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings">
          <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground mb-4">設定</h1>
              <p className="text-muted-foreground">設定画面は開発中です</p>
            </div>
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <MobileBottomNav activeTab={getActiveTab()} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;