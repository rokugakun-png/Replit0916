import WorryCard from '../WorryCard';

export default function WorryCardExample() {
  const mockWorry = {
    id: "1",
    title: "仕事でのコミュニケーション改善",
    description: "チームメンバーとの関係性を向上させ、より効果的なコミュニケーションを取れるようになりたい",
    status: "active",
    progress: 65,
    goalCount: 3,
    taskCount: 8,
    completedTasks: 5,
    lastActivity: "2日前"
  };

  return (
    <WorryCard
      worry={mockWorry}
      onViewDetails={(id) => console.log('View details for worry:', id)}
      onStartChat={(id) => console.log('Start chat for worry:', id)}
    />
  );
}