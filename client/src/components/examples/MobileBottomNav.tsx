import { useState } from 'react';
import MobileBottomNav from '../MobileBottomNav';

export default function MobileBottomNavExample() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="h-64 relative bg-background">
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-2">現在のタブ: {activeTab}</p>
        <p className="text-xs text-muted-foreground">
          下部のナビゲーションバーをクリックしてタブを切り替えてください
        </p>
      </div>
      <MobileBottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          console.log('Tab changed to:', tab);
        }} 
      />
    </div>
  );
}