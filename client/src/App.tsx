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
import GoalSettingPage from "@/pages/GoalSettingPage";
import TaskManagementPage from "@/pages/TaskManagementPage";
import SettingsPage from "@/pages/SettingsPage";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CharactersProvider } from "@/contexts/CharactersContext";

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
        <Route path="/goals/:worryId">
          {(params) => <GoalSettingPage worryId={params.worryId} />}
        </Route>
        <Route path="/tasks/:worryId">
          {(params) => <TaskManagementPage worryId={params.worryId} />}
        </Route>
        <Route path="/settings" component={SettingsPage} />
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
        <CharactersProvider>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Router />
          </div>
          <Toaster />
        </CharactersProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;