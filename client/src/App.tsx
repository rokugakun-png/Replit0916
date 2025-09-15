import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";
import ReportsPage from "@/pages/ReportsPage";
import MobileBottomNav from "@/components/MobileBottomNav";

function Router() {
  const [activeTab, setActiveTab] = useState("home");

  // ナビゲーションタブに基づく表示制御
  const renderCurrentPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "chat":
        return <ChatPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return (
          <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground mb-4">設定</h1>
              <p className="text-muted-foreground">設定画面は開発中です</p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="relative">
      {renderCurrentPage()}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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